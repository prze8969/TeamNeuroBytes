// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/EscrowManager.sol";
import "../src/TestToken.sol";

contract EscrowManagerTest is Test {
    EscrowManager public escrow;
    TestToken public token;
    address public buyer = address(0x2);
    address public producer = address(0x3);
    address public farmer = address(0x4);
    address public logistics = address(0x5);
    address public warehouse = address(0x6);
    address public regulator = address(0x7);
    address public unauthorized = address(0x8);

    bytes32 constant ORDER_ID = keccak256("order-1");
    bytes32 constant LOT_ID = keccak256("lot-1");
    uint256 constant CROP_VALUE = 10000 * 1e18;
    uint256 constant FREIGHT_VALUE = 500 * 1e18;
    uint256 constant CESS = CROP_VALUE * 150 / 10000;
    uint256 constant TOTAL = CROP_VALUE + FREIGHT_VALUE + CESS;
    uint256 constant ADVANCE = FREIGHT_VALUE * 3000 / 10000;
    uint256 constant REMAINING_FREIGHT = FREIGHT_VALUE * 7000 / 10000;

    function setUp() public {
        token = new TestToken();
        token.mint(buyer, 1000000 * 1e18);

        escrow = new EscrowManager(address(token));

        escrow.grantRole(escrow.BUYER_ROLE(), buyer);
        escrow.grantRole(escrow.LOGISTICS_ROLE(), logistics);
        escrow.grantRole(escrow.WAREHOUSE_ROLE(), warehouse);
        escrow.grantRole(escrow.REGULATOR_ROLE(), regulator);
        escrow.grantRole(escrow.PRODUCER_ROLE(), producer);
    }

    function test_CreateOrder() public {
        vm.prank(buyer);
        token.approve(address(escrow), TOTAL);

        uint256 buyerBalanceBefore = token.balanceOf(buyer);
        uint256 escrowBalanceBefore = token.balanceOf(address(escrow));

        vm.prank(buyer);
        escrow.createOrder(ORDER_ID, LOT_ID, farmer, logistics, CROP_VALUE, FREIGHT_VALUE);

        assertEq(token.balanceOf(buyer), buyerBalanceBefore - TOTAL);
        assertEq(token.balanceOf(address(escrow)), escrowBalanceBefore + TOTAL);

        EscrowManager.Order memory order = escrow.getOrder(ORDER_ID);
        assertEq(order.lotId, LOT_ID);
        assertEq(order.farmer, farmer);
        assertEq(order.buyer, buyer);
        assertEq(order.logistics, logistics);
        assertEq(order.cropValue, CROP_VALUE);
        assertEq(order.freightValue, FREIGHT_VALUE);
        assertEq(order.cess, CESS);
        assertEq(order.totalLocked, TOTAL);
        assertEq(uint256(order.state), uint256(EscrowManager.OrderState.Created));
        assertTrue(order.exists);
    }

    function test_MarkPickedUp() public {
        vm.prank(buyer);
        token.approve(address(escrow), TOTAL);
        vm.prank(buyer);
        escrow.createOrder(ORDER_ID, LOT_ID, farmer, logistics, CROP_VALUE, FREIGHT_VALUE);

        uint256 logisticsBalanceBefore = token.balanceOf(logistics);
        uint256 escrowBalanceBefore = token.balanceOf(address(escrow));

        vm.prank(logistics);
        escrow.markPickedUp(ORDER_ID);

        assertEq(token.balanceOf(logistics), logisticsBalanceBefore + ADVANCE);
        assertEq(token.balanceOf(address(escrow)), escrowBalanceBefore - ADVANCE);

        EscrowManager.Order memory order = escrow.getOrder(ORDER_ID);
        assertEq(uint256(order.state), uint256(EscrowManager.OrderState.PickedUp));
    }

    function test_ConfirmDelivery() public {
        vm.prank(buyer);
        token.approve(address(escrow), TOTAL);
        vm.prank(buyer);
        escrow.createOrder(ORDER_ID, LOT_ID, farmer, logistics, CROP_VALUE, FREIGHT_VALUE);

        vm.prank(logistics);
        escrow.markPickedUp(ORDER_ID);

        uint256 farmerBalanceBefore = token.balanceOf(farmer);
        uint256 logisticsBalanceBefore = token.balanceOf(logistics);
        uint256 escrowBalanceBefore = token.balanceOf(address(escrow));

        vm.prank(warehouse);
        escrow.confirmDelivery(ORDER_ID, 1000);

        assertEq(token.balanceOf(farmer), farmerBalanceBefore + CROP_VALUE);
        assertEq(token.balanceOf(logistics), logisticsBalanceBefore + REMAINING_FREIGHT);
        // Escrow should hold only the cess (since it's not released yet)
        assertEq(token.balanceOf(address(escrow)), CESS);

        EscrowManager.Order memory order = escrow.getOrder(ORDER_ID);
        assertEq(uint256(order.state), uint256(EscrowManager.OrderState.Settled));
        assertEq(order.deliveryTimestamp, block.timestamp);
    }

    function test_RevertCreateOrder_NotBuyer() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        escrow.createOrder(ORDER_ID, LOT_ID, farmer, logistics, CROP_VALUE, FREIGHT_VALUE);
    }

    function test_RevertPickup_WrongState() public {
        vm.prank(buyer);
        token.approve(address(escrow), TOTAL);
        vm.prank(buyer);
        escrow.createOrder(ORDER_ID, LOT_ID, farmer, logistics, CROP_VALUE, FREIGHT_VALUE);

        vm.prank(warehouse);
        vm.expectRevert("Order must be PickedUp");
        escrow.confirmDelivery(ORDER_ID, 1000);
    }

    function test_RevertDoublePickup() public {
        vm.prank(buyer);
        token.approve(address(escrow), TOTAL);
        vm.prank(buyer);
        escrow.createOrder(ORDER_ID, LOT_ID, farmer, logistics, CROP_VALUE, FREIGHT_VALUE);

        vm.prank(logistics);
        escrow.markPickedUp(ORDER_ID);

        vm.prank(logistics);
        vm.expectRevert("Order must be Created");
        escrow.markPickedUp(ORDER_ID);
    }

    function test_RevertConfirmDelivery_NotWarehouse() public {
        vm.prank(buyer);
        token.approve(address(escrow), TOTAL);
        vm.prank(buyer);
        escrow.createOrder(ORDER_ID, LOT_ID, farmer, logistics, CROP_VALUE, FREIGHT_VALUE);
        vm.prank(logistics);
        escrow.markPickedUp(ORDER_ID);

        vm.prank(unauthorized);
        vm.expectRevert();
        escrow.confirmDelivery(ORDER_ID, 1000);
    }

    function test_EventEmissions() public {
        vm.prank(buyer);
        token.approve(address(escrow), TOTAL);
        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit EscrowManager.OrderCreated(ORDER_ID, LOT_ID, buyer, farmer, CROP_VALUE, FREIGHT_VALUE, CESS, TOTAL);
        escrow.createOrder(ORDER_ID, LOT_ID, farmer, logistics, CROP_VALUE, FREIGHT_VALUE);

        vm.prank(logistics);
        vm.expectEmit(true, true, false, true);
        emit EscrowManager.AdvanceReleased(ORDER_ID, ADVANCE, logistics);
        escrow.markPickedUp(ORDER_ID);

        vm.prank(warehouse);
        vm.expectEmit(true, false, false, true);
        emit EscrowManager.DeliveryConfirmed(ORDER_ID, 1000, block.timestamp);
        vm.expectEmit(true, true, false, true);
        emit EscrowManager.DBTReleased(ORDER_ID, farmer, CROP_VALUE);
        vm.expectEmit(true, true, false, true);
        emit EscrowManager.FreightBalanceReleased(ORDER_ID, logistics, REMAINING_FREIGHT);
        vm.expectEmit(true, false, false, true);
        emit EscrowManager.OrderSettled(ORDER_ID);
        escrow.confirmDelivery(ORDER_ID, 1000);
    }
}
