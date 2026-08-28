// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./EscrowManager.sol";
import "./Roles.sol";

/**
 * @title DisputeArbiter
 * @dev Node 5 (APMC Regulator) layer. Allows parties to raise issues and the regulator to post final verdicts based on event history.
 */
contract DisputeArbiter is Roles {
    EscrowManager public escrow;

    struct Dispute {
        address raiser;
        string reason;
        uint8 resolution; // 0 = Pending, 1 = Release to Farmer, 2 = Refund to Buyer
        bool resolved;
    }

    mapping(bytes32 => Dispute) public disputes;

    event DisputeRaised(bytes32 indexed orderId, address indexed raiser, string reason);
    event DisputeResolved(bytes32 indexed orderId, uint8 resolution);

    constructor(address _escrow) {
        require(_escrow != address(0), "Escrow address cannot be zero");
        escrow = EscrowManager(_escrow);
    }

    /**
     * @dev Raise a dispute for an active order
     */
    function raiseDispute(bytes32 orderId, string calldata reason) external {
        require(escrow.getOrderState(orderId) != EscrowManager.OrderState.Settled, "Order already settled");
        require(bytes(reason).length > 0, "Reason required");
        require(disputes[orderId].raiser == address(0), "Dispute already exists");

        disputes[orderId] = Dispute({
            raiser: msg.sender,
            reason: reason,
            resolution: 0,
            resolved: false
        });

        emit DisputeRaised(orderId, msg.sender, reason);
    }

    /**
     * @dev APMC Regulator resolves the dispute.
     * resolution: 1 = Release to Farmer, 2 = Refund to Buyer[cite: 3].
     */
    function resolveDispute(bytes32 orderId, uint8 resolution) external onlyRole(REGULATOR_ROLE) {
        require(resolution == 1 || resolution == 2, "Invalid resolution");
        require(disputes[orderId].raiser != address(0), "No dispute raised");
        require(!disputes[orderId].resolved, "Already resolved");

        disputes[orderId].resolution = resolution;
        disputes[orderId].resolved = true;

        // Calls EscrowManager to halt standard state transitions[cite: 3]
        escrow.setDisputed(orderId);

        emit DisputeResolved(orderId, resolution);
    }
}
