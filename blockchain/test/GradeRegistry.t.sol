
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/GradeRegistry.sol";

contract GradeRegistryTest is Test {
    GradeRegistry public registry;
    address public admin = address(0x1);
    address public producer = address(0x2);
    address public unauthorized = address(0x3);
    
    bytes32 constant LOT_ID = keccak256("FPO-2026-001");
    bytes32 constant HASH = keccak256("grading-report-hash-123");
    bytes32 constant DIFFERENT_HASH = keccak256("different-hash");
    
    function setUp() public {
        vm.startPrank(admin);
        registry = new GradeRegistry();
        registry.grantRole(registry.PRODUCER_ROLE(), producer);
        vm.stopPrank();
    }

    function test_SubmitGrade() public {
        vm.prank(producer);
        registry.submitGrade(LOT_ID, 0, HASH);
        
        GradeRegistry.GradeRecord memory record = registry.getGrade(LOT_ID);
        assertEq(uint256(record.grade), 0);
        assertEq(record.hash, HASH);
        assertEq(record.submitter, producer);
        assertTrue(record.exists);
    }

    function test_VerifyGrade() public {
        vm.prank(producer);
        registry.submitGrade(LOT_ID, 0, HASH);
        
        bool isValid = registry.verifyGrade(LOT_ID, HASH);
        assertTrue(isValid);
        
        bool isInvalid = registry.verifyGrade(LOT_ID, DIFFERENT_HASH);
        assertFalse(isInvalid);
    }

    function test_UnauthorizedCannotSubmit() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        registry.submitGrade(LOT_ID, 0, HASH);
    }
}
