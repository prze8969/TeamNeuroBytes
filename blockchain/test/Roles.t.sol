
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Roles.sol";

contract RolesTest is Test {
    Roles public roles;
    address public producer = address(0x2);
    address public buyer = address(0x3);
    address public warehouse = address(0x4);
    address public logistics = address(0x5);
    address public regulator = address(0x6);
    address public unauthorized = address(0x7);

    function setUp() public {
        roles = new Roles();
    }

    function test_GrantProducerRole() public {
        roles.grantRole(roles.PRODUCER_ROLE(), producer);
        assertTrue(roles.hasRole(roles.PRODUCER_ROLE(), producer));
    }

    function test_GrantAllRoles() public {
        roles.grantRole(roles.PRODUCER_ROLE(), producer);
        roles.grantRole(roles.BUYER_ROLE(), buyer);
        roles.grantRole(roles.WAREHOUSE_ROLE(), warehouse);
        roles.grantRole(roles.LOGISTICS_ROLE(), logistics);
        roles.grantRole(roles.REGULATOR_ROLE(), regulator);

        assertTrue(roles.hasRole(roles.PRODUCER_ROLE(), producer));
        assertTrue(roles.hasRole(roles.BUYER_ROLE(), buyer));
        assertTrue(roles.hasRole(roles.WAREHOUSE_ROLE(), warehouse));
        assertTrue(roles.hasRole(roles.LOGISTICS_ROLE(), logistics));
        assertTrue(roles.hasRole(roles.REGULATOR_ROLE(), regulator));
    }

    function test_UnauthorizedCannotGrantRole() public {
        // Store the role hash first to avoid consuming the prank
        bytes32 producerRole = roles.PRODUCER_ROLE();
        
        vm.prank(unauthorized);
        vm.expectRevert();
        roles.grantRole(producerRole, producer);
    }
}
