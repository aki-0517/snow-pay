// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title EERCConverter
 * @dev Converter contract that enables privacy-preserving operations for existing ERC20 tokens
 * Users can deposit ERC20 tokens and receive encrypted balance commitments
 * Then perform private transfers and withdrawals using zero-knowledge proofs
 */
contract EERCConverter is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Events for tracking encrypted operations
    event Deposit(address indexed user, uint256 amount, bytes32 indexed commitment);
    event Withdraw(address indexed user, uint256 amount, bytes32 indexed nullifierHash);
    event EncryptedTransfer(address indexed from, address indexed to, bytes32 indexed nullifierHash, bytes32 commitment);
    event AuditorKeySet(bytes32 indexed publicKeyHash);
    event DecryptionKeySet(address indexed user, bytes32 indexed keyHash);

    // The underlying ERC20 token being wrapped
    IERC20 public immutable token;
    
    // Registry for encrypted commitments and nullifiers
    mapping(bytes32 => bool) public commitments;
    mapping(bytes32 => bool) public nullifiers;
    mapping(address => bytes32) public decryptionKeys;
    mapping(address => bool) public registeredUsers;
    
    // Circuit verification settings
    bool public verificationEnabled;
    address public verifier;
    bytes32 public auditorPublicKey;
    
    // Total encrypted balance in the contract
    uint256 public totalEncryptedBalance;
    
    constructor(
        address _token,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
        verificationEnabled = false;
    }
    
    /**
     * @dev Register user with decryption key
     */
    function register(bytes32 decryptionKeyHash, bytes calldata proof) external {
        require(!registeredUsers[msg.sender], "User already registered");
        
        if (verificationEnabled && verifier != address(0)) {
            require(_verifyRegistrationProof(proof, decryptionKeyHash), "Invalid registration proof");
        }
        
        registeredUsers[msg.sender] = true;
        decryptionKeys[msg.sender] = decryptionKeyHash;
        
        emit DecryptionKeySet(msg.sender, decryptionKeyHash);
    }
    
    /**
     * @dev Deposit ERC20 tokens and receive encrypted balance
     */
    function deposit(
        uint256 amount,
        bytes32 commitment,
        bytes calldata proof
    ) external nonReentrant {
        require(amount > 0, "Amount must be positive");
        require(!commitments[commitment], "Commitment already exists");
        require(registeredUsers[msg.sender], "User not registered");
        
        if (verificationEnabled && verifier != address(0)) {
            require(_verifyDepositProof(proof, amount, commitment), "Invalid deposit proof");
        }
        
        commitments[commitment] = true;
        totalEncryptedBalance += amount;
        
        token.safeTransferFrom(msg.sender, address(this), amount);
        
        emit Deposit(msg.sender, amount, commitment);
    }
    
    /**
     * @dev Withdraw ERC20 tokens using zero-knowledge proof
     */
    function withdraw(
        uint256 amount,
        bytes32 nullifierHash,
        bytes calldata proof
    ) external nonReentrant {
        require(amount > 0, "Amount must be positive");
        require(!nullifiers[nullifierHash], "Nullifier already used");
        require(registeredUsers[msg.sender], "User not registered");
        require(totalEncryptedBalance >= amount, "Insufficient encrypted balance");
        
        if (verificationEnabled && verifier != address(0)) {
            require(_verifyWithdrawProof(proof, amount, nullifierHash), "Invalid withdraw proof");
        }
        
        nullifiers[nullifierHash] = true;
        totalEncryptedBalance -= amount;
        
        token.safeTransfer(msg.sender, amount);
        
        emit Withdraw(msg.sender, amount, nullifierHash);
    }
    
    /**
     * @dev Private transfer between registered users
     */
    function transfer(
        address to,
        bytes32 nullifierHash,
        bytes32 commitment,
        bytes calldata proof
    ) external nonReentrant {
        require(to != address(0), "Invalid recipient");
        require(!nullifiers[nullifierHash], "Nullifier already used");
        require(!commitments[commitment], "Commitment already exists");
        require(registeredUsers[msg.sender], "Sender not registered");
        require(registeredUsers[to], "Recipient not registered");
        
        if (verificationEnabled && verifier != address(0)) {
            require(_verifyTransferProof(proof, nullifierHash, commitment), "Invalid transfer proof");
        }
        
        nullifiers[nullifierHash] = true;
        commitments[commitment] = true;
        
        emit EncryptedTransfer(msg.sender, to, nullifierHash, commitment);
    }
    
    /**
     * @dev Set auditor public key (for compliance)
     */
    function setAuditorKey(bytes32 _auditorPublicKey) external onlyOwner {
        auditorPublicKey = _auditorPublicKey;
        emit AuditorKeySet(_auditorPublicKey);
    }
    
    /**
     * @dev Set verifier contract address
     */
    function setVerifier(address _verifier) external onlyOwner {
        verifier = _verifier;
    }
    
    /**
     * @dev Enable/disable verification
     */
    function setVerificationEnabled(bool _enabled) external onlyOwner {
        verificationEnabled = _enabled;
    }
    
    /**
     * @dev Check if user is registered
     */
    function isUserRegistered(address user) external view returns (bool) {
        return registeredUsers[user];
    }
    
    /**
     * @dev Get user's decryption key hash
     */
    function getUserDecryptionKey(address user) external view returns (bytes32) {
        require(registeredUsers[user], "User not registered");
        return decryptionKeys[user];
    }
    
    /**
     * @dev Check if auditor key is set
     */
    function isAuditorKeySet() external view returns (bool) {
        return auditorPublicKey != bytes32(0);
    }
    
    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
    
    /**
     * @dev Emergency withdrawal (owner only)
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= token.balanceOf(address(this)), "Insufficient balance");
        token.safeTransfer(owner(), amount);
    }
    
    // Internal proof verification functions (placeholders)
    // In production, these should call actual zk-SNARK verifier contracts
    
    function _verifyRegistrationProof(
        bytes calldata proof,
        bytes32 decryptionKeyHash
    ) internal pure returns (bool) {
        return proof.length > 0 && decryptionKeyHash != bytes32(0);
    }
    
    function _verifyDepositProof(
        bytes calldata proof,
        uint256 amount,
        bytes32 commitment
    ) internal pure returns (bool) {
        return proof.length > 0 && amount > 0 && commitment != bytes32(0);
    }
    
    function _verifyWithdrawProof(
        bytes calldata proof,
        uint256 amount,
        bytes32 nullifierHash
    ) internal pure returns (bool) {
        return proof.length > 0 && amount > 0 && nullifierHash != bytes32(0);
    }
    
    function _verifyTransferProof(
        bytes calldata proof,
        bytes32 nullifierHash,
        bytes32 commitment
    ) internal pure returns (bool) {
        return proof.length > 0 && nullifierHash != bytes32(0) && commitment != bytes32(0);
    }
    
    /**
     * @dev Get contract version
     */
    function version() external pure returns (string memory) {
        return "1.0.0";
    }
}