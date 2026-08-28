// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/DisputeArbiter.sol";
import "../src/EscrowManager.sol";
import "../src/TestToken.sol";

contract DisputeArbiterTest is Test {
    DisputeArbiter public arbiter;
    EscrowManager public escrow;
    TestToken public token;

    address public buyer = address(0x2);
    address public regulator = address(0x7);
    
    bytes32 constant ORDER_ID = keccak256("order-1");
    bytes32 constant LOT_ID = keccak256("lot-1");

    function setUp() public {
        token = new TestToken();
        token.mint(buyer, 1000000 * 1e18);

        escrow = new EscrowManager(address(token));
        arbiter = new DisputeArbiter(address(escrow));

        // Grant regulator role to the arbiter contract so it can call setDisputed
        escrow.grantRole(escrow.REGULATOR_ROLE(), address(arbiter));
        arbiter.grantRole(arbiter.REGULATOR_ROLE(), regulator);

        // Setup a dummy order to dispute
        escrow.grantRole(escrow.BUYER_ROLE(), buyer);
        vm.prank(buyer);
        token.approve(address(escrow), 1000000 * 1e18);
        vm.prank(buyer);
        escrow.createOrder(ORDER_ID, LOT_ID, address(0x4), address(0x5), 1000, 500);
    }

    function test_RaiseAndResolveDispute() public {
        vm.prank(buyer);
        arbiter.raiseDispute(ORDER_ID, "Quality mismatch");

        (address raiser, string memory reason, uint8 res, bool resolved) = arbiter.disputes(ORDER_ID);
        assertEq(raiser, buyer);
        assertEq(reason, "Quality mismatch");

        vm.prank(regulator);
        arbiter.resolveDispute(ORDER_ID, 2); // 2 = Refund to Buyer

        (, , res, resolved) = arbiter.disputes(ORDER_ID);
        assertTrue(resolved);
        assertEq(res, 2);
        assertEq(uint256(escrow.getOrderState(ORDER_ID)), uint256(EscrowManager.OrderState.Disputed));
    }
}
