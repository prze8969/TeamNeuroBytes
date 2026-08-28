// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Roles.sol";

/**
 * @title EscrowManager
 * @dev Zero‑trust smart escrow for agricultural supply chain.
 * Funds are locked by buyer and automatically released based on state transitions.
 */
contract EscrowManager is Roles, ReentrancyGuard {
    // Order states
    enum OrderState { Created, PickedUp, Delivered, Settled, Disputed }

    // Order struct
    struct Order {
        bytes32 lotId;             // reference to the crop lot
        address farmer;            // recipient of crop value
        address buyer;             // who locked funds
        address logistics;         // who gets freight
        uint256 cropValue;         // value of crop (in token wei)
        uint256 freightValue;      // freight cost (in token wei)
        uint256 cess;              // 1.5% cess on crop value
        uint256 totalLocked;       // cropValue + freightValue + cess
        uint256 deliveryTimestamp; // set on delivery
        OrderState state;
        bool exists;
    }

    // The token used for all transfers (stablecoin mock)
    IERC20 public immutable token;

    // Mapping from orderId (bytes32) to Order
    mapping(bytes32 => Order) public orders;

    // Events
    event OrderCreated(
        bytes32 indexed orderId,
        bytes32 indexed lotId,
        address indexed buyer,
        address farmer,
        uint256 cropValue,
        uint256 freightValue,
        uint256 cess,
        uint256 totalLocked
    );

    event AdvanceReleased(
        bytes32 indexed orderId,
        uint256 amount,
        address indexed logistics
    );

    event DeliveryConfirmed(
        bytes32 indexed orderId,
        uint256 weighbridgeReading,
        uint256 timestamp
    );

    event DBTReleased(
        bytes32 indexed orderId,
        address indexed farmer,
        uint256 amount
    );

    event FreightBalanceReleased(
        bytes32 indexed orderId,
        address indexed logistics,
        uint256 amount
    );

    event OrderSettled(bytes32 indexed orderId);

    constructor(address _token) {
        require(_token != address(0), "Token address cannot be zero");
        token = IERC20(_token);
    }

    /**
     * @dev Buyer creates an order, locking cropValue + freightValue + 1.5% cess.
     * @param orderId Unique identifier for the order (e.g., keccak256(abi.encode(...)))
     * @param lotId Reference to the crop lot (must exist in GradeRegistry)
     * @param farmer Address of the farmer (recipient of crop value)
     * @param logistics Address of the logistics provider (recipient of freight)
     * @param cropValue Amount of crop value in token wei
     * @param freightValue Amount of freight cost in token wei
     */
    function createOrder(
        bytes32 orderId,
        bytes32 lotId,
        address farmer,
        address logistics,
        uint256 cropValue,
        uint256 freightValue
    ) external onlyRole(BUYER_ROLE) nonReentrant {
        require(!orders[orderId].exists, "Order already exists");
        require(farmer != address(0), "Farmer cannot be zero");
        require(logistics != address(0), "Logistics cannot be zero");
        require(cropValue > 0, "Crop value must be > 0");
        require(freightValue > 0, "Freight value must be > 0");

        // Calculate 1.5% cess (150 bps)
        uint256 cess = cropValue * 150 / 10000;
        uint256 total = cropValue + freightValue + cess;

        // Transfer tokens from buyer to this contract
        require(token.transferFrom(msg.sender, address(this), total), "Token transfer failed");

        // Store order
        orders[orderId] = Order({
            lotId: lotId,
            farmer: farmer,
            buyer: msg.sender,
            logistics: logistics,
            cropValue: cropValue,
            freightValue: freightValue,
            cess: cess,
            totalLocked: total,
            deliveryTimestamp: 0,
            state: OrderState.Created,
            exists: true
        });

        emit OrderCreated(orderId, lotId, msg.sender, farmer, cropValue, freightValue, cess, total);
    }

    /**
     * @dev Logistics confirms pickup, releases 30% freight advance.
     * @param orderId Order identifier
     */
    function markPickedUp(bytes32 orderId) external onlyRole(LOGISTICS_ROLE) nonReentrant {
        Order storage order = orders[orderId];
        require(order.exists, "Order does not exist");
        require(order.state == OrderState.Created, "Order must be Created");

        // Calculate 30% advance
        uint256 advance = order.freightValue * 3000 / 10000;

        // Update state first (effects)
        order.state = OrderState.PickedUp;

        // Transfer advance to logistics (interaction)
        require(token.transfer(order.logistics, advance), "Transfer advance failed");

        emit AdvanceReleased(orderId, advance, order.logistics);
    }

    /**
     * @dev Warehouse confirms delivery with weighbridge reading.
     * Releases full crop value to farmer and remaining 70% freight to logistics.
     * @param orderId Order identifier
     * @param weighbridgeReading Simulated sensor reading (for audit)
     */
    function confirmDelivery(
        bytes32 orderId,
        uint256 weighbridgeReading
    ) external onlyRole(WAREHOUSE_ROLE) nonReentrant {
        Order storage order = orders[orderId];
        require(order.exists, "Order does not exist");
        require(order.state == OrderState.PickedUp, "Order must be PickedUp");

        // Update state & timestamp (effects)
        order.state = OrderState.Delivered;
        order.deliveryTimestamp = block.timestamp;

        // Calculate remaining freight (70%)
        uint256 remainingFreight = order.freightValue * 7000 / 10000;

        // Transfer crop value to farmer
        require(token.transfer(order.farmer, order.cropValue), "Crop transfer failed");

        // Transfer remaining freight to logistics
        if (remainingFreight > 0) {
            require(token.transfer(order.logistics, remainingFreight), "Freight transfer failed");
        }

        // Emit events
        emit DeliveryConfirmed(orderId, weighbridgeReading, block.timestamp);
        emit DBTReleased(orderId, order.farmer, order.cropValue);
        emit FreightBalanceReleased(orderId, order.logistics, remainingFreight);

        // Mark as settled (final state)
        order.state = OrderState.Settled;
        emit OrderSettled(orderId);
    }

    /**
     * @dev Get order details (view)
     */
    function getOrder(bytes32 orderId) external view returns (Order memory) {
        require(orders[orderId].exists, "Order does not exist");
        return orders[orderId];
    }

    /**
     * @dev Get order state (view)
     */
    function getOrderState(bytes32 orderId) external view returns (OrderState) {
        require(orders[orderId].exists, "Order does not exist");
        return orders[orderId].state;
    }

    /**
     * @dev Set order to disputed (to be called by DisputeArbiter)
     */
    function setDisputed(bytes32 orderId) external {
        // Only the DisputeArbiter contract can call this
        // We'll enforce access by checking msg.sender is a known address
        // For now, we'll restrict to REGULATOR_ROLE (temporary)
        require(hasRole(REGULATOR_ROLE, msg.sender), "Only regulator can dispute");
        Order storage order = orders[orderId];
        require(order.exists, "Order does not exist");
        require(order.state != OrderState.Settled, "Already settled");
        order.state = OrderState.Disputed;
    }
}
