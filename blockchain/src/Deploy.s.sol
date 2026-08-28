// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TestToken.sol";
import "../src/Roles.sol";
import "../src/GradeRegistry.sol";
import "../src/EscrowManager.sol";
import "../src/DisputeArbiter.sol";

contract Deploy is Script {
    function run() external {
        // Load the private key from .env file
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy mock stablecoin
        TestToken token = new TestToken();

        // 2. Deploy core infrastructure
        Roles roles = new Roles();
        GradeRegistry gradeRegistry = new GradeRegistry();
        EscrowManager escrow = new EscrowManager(address(token));
        DisputeArbiter arbiter = new DisputeArbiter(address(escrow));

        // 3. Grant cross-contract permissions
        // Allows the Arbiter to update the Escrow state to 'Disputed'
        escrow.grantRole(escrow.REGULATOR_ROLE(), address(arbiter));

        vm.stopBroadcast();
    }
}
