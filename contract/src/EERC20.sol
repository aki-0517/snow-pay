// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EERC20 Token
 * @dev Enhanced ERC20 token with encryption-ready features for Avalanche Fuji testnet
 * This contract provides standard ERC20 functionality with additional features for privacy-preserving operations
 */
contract EERC20 is ERC20, ERC20Capped, Ownable {
    // Events for encryption operations
    event EncryptedMint(address indexed to, bytes32 indexed commitment);
    event EncryptedTransfer(address indexed from, address indexed to, bytes32 indexed nullifierHash, bytes32 commitment);
    event EncryptedBurn(address indexed from, bytes32 indexed nullifierHash);
    
    // Registry for encrypted commitments
    mapping(bytes32 => bool) public commitments;
    mapping(bytes32 => bool) public nullifiers;
    
    // Circuit verification settings
    bool public verificationEnabled;
    address public verifier;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 cap,
        address initialOwner
    ) ERC20(name, symbol) ERC20Capped(cap) Ownable(initialOwner) {
        verificationEnabled = false;
    }
    
    /**
     * @dev Mint tokens to specified address
     * Only owner can mint tokens
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Encrypted mint operation with commitment
     * Records commitment for zero-knowledge proofs
     */
    function encryptedMint(address to, uint256 amount, bytes32 commitment) external onlyOwner {
        require(!commitments[commitment], "Commitment already exists");
        
        commitments[commitment] = true;
        _mint(to, amount);
        
        emit EncryptedMint(to, commitment);
    }
    
    /**
     * @dev Encrypted transfer operation
     * Uses nullifiers and commitments for privacy
     */
    function encryptedTransfer(
        address from,
        address to,
        uint256 amount,
        bytes32 nullifierHash,
        bytes32 commitment,
        bytes calldata proof
    ) external {
        require(!nullifiers[nullifierHash], "Nullifier already used");
        require(!commitments[commitment], "Commitment already exists");
        
        if (verificationEnabled && verifier != address(0)) {
            require(_verifyProof(proof, nullifierHash, commitment), "Invalid proof");
        }
        
        nullifiers[nullifierHash] = true;
        commitments[commitment] = true;
        
        _transfer(from, to, amount);
        
        emit EncryptedTransfer(from, to, nullifierHash, commitment);
    }
    
    /**
     * @dev Encrypted burn operation
     * Uses nullifiers for privacy-preserving burns
     */
    function encryptedBurn(
        address from,
        uint256 amount,
        bytes32 nullifierHash,
        bytes calldata proof
    ) external {
        require(!nullifiers[nullifierHash], "Nullifier already used");
        
        if (verificationEnabled && verifier != address(0)) {
            require(_verifyProof(proof, nullifierHash, bytes32(0)), "Invalid proof");
        }
        
        nullifiers[nullifierHash] = true;
        _burn(from, amount);
        
        emit EncryptedBurn(from, nullifierHash);
    }
    
    /**
     * @dev Set verifier contract address
     * Only owner can set verifier
     */
    function setVerifier(address _verifier) external onlyOwner {
        verifier = _verifier;
    }
    
    /**
     * @dev Enable/disable verification
     * Only owner can toggle verification
     */
    function setVerificationEnabled(bool _enabled) external onlyOwner {
        verificationEnabled = _enabled;
    }
    
    /**
     * @dev Internal proof verification (placeholder)
     * Should be implemented with actual zk-SNARK verification
     */
    function _verifyProof(
        bytes calldata proof,
        bytes32 nullifierHash,
        bytes32 commitment
    ) internal pure returns (bool) {
        // Placeholder implementation
        // In production, this should call a zk-SNARK verifier contract
        return proof.length > 0 && nullifierHash != bytes32(0);
    }
    
    /**
     * @dev Override _update to handle capped token logic
     */
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }
    
    /**
     * @dev Get contract version for upgrades
     */
    function version() external pure returns (string memory) {
        return "1.0.0";
    }
}