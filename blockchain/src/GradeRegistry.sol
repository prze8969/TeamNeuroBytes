
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Roles.sol";

/**
 * @title GradeRegistry
 * @dev Stores cryptographic hashes of AI-generated crop grades on-chain
 * DPDP Compliance: Only stores SHA-256 hashes, no PII or raw images
 */
contract GradeRegistry is Roles {
    enum Grade { A, B, C }
    
    struct GradeRecord {
        uint8 grade;
        bytes32 hash;
        address submitter;
        uint256 timestamp;
        bool exists;
    }
    
    mapping(bytes32 => GradeRecord) public grades;
    
    event GradeAnchored(
        bytes32 indexed lotId,
        uint8 grade,
        bytes32 hash,
        address indexed submitter,
        uint256 timestamp
    );
    
    function submitGrade(
        bytes32 lotId,
        uint8 grade,
        bytes32 sha256Hash
    ) external onlyRole(PRODUCER_ROLE) {
        require(grade <= 2, "GradeRegistry: Invalid grade (0-2)");
        require(!grades[lotId].exists, "GradeRegistry: Lot already graded");
        require(sha256Hash != bytes32(0), "GradeRegistry: Hash cannot be empty");
        
        grades[lotId] = GradeRecord({
            grade: grade,
            hash: sha256Hash,
            submitter: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
        
        emit GradeAnchored(lotId, grade, sha256Hash, msg.sender, block.timestamp);
    }
    
    function verifyGrade(bytes32 lotId, bytes32 hashToCheck) external view returns (bool) {
        require(grades[lotId].exists, "GradeRegistry: Lot not found");
        return grades[lotId].hash == hashToCheck;
    }
    
    function getGrade(bytes32 lotId) external view returns (GradeRecord memory) {
        require(grades[lotId].exists, "GradeRegistry: Lot not found");
        return grades[lotId];
    }
}
