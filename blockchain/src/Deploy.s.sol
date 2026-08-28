// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "./TestToken.sol";
import "./Roles.sol";
import "./GradeRegistry.sol";
import "./EscrowManager.sol";
import "./DisputeArbiter.sol";

contract Deploy is Script {
    function run() external {
        // Try to read from .env, fallback to Anvil default Account #0 if Git Bash blocks it
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));
        
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy mock stablecoin
        TestToken token = new TestToken();

        // 2. Deploy core infrastructure
        Roles roles = new Roles();
        GradeRegistry gradeRegistry = new GradeRegistry();
        EscrowManager escrow = new EscrowManager(address(token));
        DisputeArbiter arbiter = new DisputeArbiter(address(escrow));

        // 3. Grant cross-contract permissions
        escrow.grantRole(escrow.REGULATOR_ROLE(), address(arbiter));

        vm.stopBroadcast();
    }
}
