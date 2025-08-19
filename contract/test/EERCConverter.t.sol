// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/EERCConverter.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Test Token", "TEST") {}
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract EERCConverterTest is Test {
    EERCConverter public converter;
    MockERC20 public token;
    
    // Event declarations for testing
    event Deposit(address indexed user, uint256 amount, bytes32 indexed commitment);
    event Withdraw(address indexed user, uint256 amount, bytes32 indexed nullifierHash);
    event AuditorKeySet(bytes32 indexed publicKeyHash);
    
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    address public user3 = address(0x4);
    
    bytes32 public constant SAMPLE_COMMITMENT = bytes32(uint256(12345));
    bytes32 public constant SAMPLE_NULLIFIER = bytes32(uint256(54321));
    bytes32 public constant SAMPLE_KEY_HASH = bytes32(uint256(98765));
    bytes32 public constant SAMPLE_AUDITOR_KEY = bytes32(uint256(11111));
    
    bytes public sampleProof = "sample_proof_data";
    
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18;
    uint256 public constant TEST_AMOUNT = 100 * 10**18;
    
    function setUp() public {
        vm.startPrank(owner);
        
        // Deploy token
        token = new MockERC20();
        token.mint(owner, INITIAL_SUPPLY);
        
        // Deploy converter
        converter = new EERCConverter(address(token), owner);
        
        // Give tokens to test users
        token.transfer(user1, TEST_AMOUNT * 10);
        token.transfer(user2, TEST_AMOUNT * 10);
        token.transfer(user3, TEST_AMOUNT * 10);
        
        vm.stopPrank();
    }
    
    function testInitialState() public {
        assertEq(address(converter.token()), address(token));
        assertEq(converter.totalEncryptedBalance(), 0);
        assertFalse(converter.verificationEnabled());
        assertEq(converter.verifier(), address(0));
        assertEq(converter.auditorPublicKey(), bytes32(0));
        assertFalse(converter.isAuditorKeySet());
    }
    
    function testUserRegistration() public {
        // Test successful registration
        vm.prank(user1);
        converter.register(SAMPLE_KEY_HASH, sampleProof);
        
        assertTrue(converter.isUserRegistered(user1));
        assertEq(converter.getUserDecryptionKey(user1), SAMPLE_KEY_HASH);
        
        // Test double registration should fail
        vm.prank(user1);
        vm.expectRevert("User already registered");
        converter.register(SAMPLE_KEY_HASH, sampleProof);
    }
    
    function testDeposit() public {
        // Register user first
        vm.prank(user1);
        converter.register(SAMPLE_KEY_HASH, sampleProof);
        
        // Approve tokens
        vm.prank(user1);
        token.approve(address(converter), TEST_AMOUNT);
        
        uint256 balanceBefore = token.balanceOf(user1);
        uint256 contractBalanceBefore = token.balanceOf(address(converter));
        
        // Deposit
        vm.prank(user1);
        converter.deposit(TEST_AMOUNT, SAMPLE_COMMITMENT, sampleProof);
        
        // Check balances
        assertEq(token.balanceOf(user1), balanceBefore - TEST_AMOUNT);
        assertEq(token.balanceOf(address(converter)), contractBalanceBefore + TEST_AMOUNT);
        assertEq(converter.totalEncryptedBalance(), TEST_AMOUNT);
        assertTrue(converter.commitments(SAMPLE_COMMITMENT));
    }
    
    function testDepositFailures() public {
        // Test deposit without registration
        vm.prank(user1);
        token.approve(address(converter), TEST_AMOUNT);
        
        vm.prank(user1);
        vm.expectRevert("User not registered");
        converter.deposit(TEST_AMOUNT, SAMPLE_COMMITMENT, sampleProof);
        
        // Register user
        vm.prank(user1);
        converter.register(SAMPLE_KEY_HASH, sampleProof);
        
        // Test zero amount
        vm.prank(user1);
        vm.expectRevert("Amount must be positive");
        converter.deposit(0, SAMPLE_COMMITMENT, sampleProof);
        
        // Test duplicate commitment
        vm.prank(user1);
        converter.deposit(TEST_AMOUNT, SAMPLE_COMMITMENT, sampleProof);
        
        vm.prank(user1);
        token.approve(address(converter), TEST_AMOUNT);
        vm.expectRevert("Commitment already exists");
        converter.deposit(TEST_AMOUNT, SAMPLE_COMMITMENT, sampleProof);
    }
    
    function testWithdraw() public {
        // Setup: Register and deposit
        vm.prank(user1);
        converter.register(SAMPLE_KEY_HASH, sampleProof);
        
        vm.prank(user1);
        token.approve(address(converter), TEST_AMOUNT);
        
        vm.prank(user1);
        converter.deposit(TEST_AMOUNT, SAMPLE_COMMITMENT, sampleProof);
        
        uint256 balanceBefore = token.balanceOf(user1);
        uint256 contractBalanceBefore = token.balanceOf(address(converter));
        
        // Withdraw
        vm.prank(user1);
        converter.withdraw(TEST_AMOUNT, SAMPLE_NULLIFIER, sampleProof);
        
        // Check balances
        assertEq(token.balanceOf(user1), balanceBefore + TEST_AMOUNT);
        assertEq(token.balanceOf(address(converter)), contractBalanceBefore - TEST_AMOUNT);
        assertEq(converter.totalEncryptedBalance(), 0);
        assertTrue(converter.nullifiers(SAMPLE_NULLIFIER));
    }
    
    function testWithdrawFailures() public {
        // Test withdraw without registration
        vm.prank(user1);
        vm.expectRevert("User not registered");
        converter.withdraw(TEST_AMOUNT, SAMPLE_NULLIFIER, sampleProof);
        
        // Register user
        vm.prank(user1);
        converter.register(SAMPLE_KEY_HASH, sampleProof);
        
        // Test zero amount
        vm.prank(user1);
        vm.expectRevert("Amount must be positive");
        converter.withdraw(0, SAMPLE_NULLIFIER, sampleProof);
        
        // Test insufficient balance
        vm.prank(user1);
        vm.expectRevert("Insufficient encrypted balance");
        converter.withdraw(TEST_AMOUNT, SAMPLE_NULLIFIER, sampleProof);
        
        // Setup deposit for double nullifier test
        vm.prank(user1);
        token.approve(address(converter), TEST_AMOUNT);
        vm.prank(user1);
        converter.deposit(TEST_AMOUNT, SAMPLE_COMMITMENT, sampleProof);
        
        // First withdrawal
        vm.prank(user1);
        converter.withdraw(TEST_AMOUNT, SAMPLE_NULLIFIER, sampleProof);
        
        // Second deposit for double nullifier test
        vm.prank(user1);
        token.approve(address(converter), TEST_AMOUNT);
        vm.prank(user1);
        converter.deposit(TEST_AMOUNT, bytes32(uint256(SAMPLE_COMMITMENT) + 1), sampleProof);
        
        // Test double nullifier
        vm.prank(user1);
        vm.expectRevert("Nullifier already used");
        converter.withdraw(TEST_AMOUNT, SAMPLE_NULLIFIER, sampleProof);
    }
    
    function testTransfer() public {
        // Register both users
        vm.prank(user1);
        converter.register(SAMPLE_KEY_HASH, sampleProof);
        
        vm.prank(user2);
        converter.register(bytes32(uint256(SAMPLE_KEY_HASH) + 1), sampleProof);
        
        // Perform transfer
        vm.prank(user1);
        converter.transfer(user2, SAMPLE_NULLIFIER, SAMPLE_COMMITMENT, sampleProof);
        
        assertTrue(converter.nullifiers(SAMPLE_NULLIFIER));
        assertTrue(converter.commitments(SAMPLE_COMMITMENT));
    }
    
    function testTransferFailures() public {
        // Test transfer without sender registration
        vm.prank(user1);
        vm.expectRevert("Sender not registered");
        converter.transfer(user2, SAMPLE_NULLIFIER, SAMPLE_COMMITMENT, sampleProof);
        
        // Register sender
        vm.prank(user1);
        converter.register(SAMPLE_KEY_HASH, sampleProof);
        
        // Test transfer without recipient registration
        vm.prank(user1);
        vm.expectRevert("Recipient not registered");
        converter.transfer(user2, SAMPLE_NULLIFIER, SAMPLE_COMMITMENT, sampleProof);
        
        // Register recipient
        vm.prank(user2);
        converter.register(bytes32(uint256(SAMPLE_KEY_HASH) + 1), sampleProof);
        
        // Test invalid recipient
        vm.prank(user1);
        vm.expectRevert("Invalid recipient");
        converter.transfer(address(0), SAMPLE_NULLIFIER, SAMPLE_COMMITMENT, sampleProof);
        
        // First transfer
        vm.prank(user1);
        converter.transfer(user2, SAMPLE_NULLIFIER, SAMPLE_COMMITMENT, sampleProof);
        
        // Test double nullifier
        vm.prank(user1);
        vm.expectRevert("Nullifier already used");
        converter.transfer(user2, SAMPLE_NULLIFIER, bytes32(uint256(SAMPLE_COMMITMENT) + 1), sampleProof);
        
        // Test double commitment
        vm.prank(user1);
        vm.expectRevert("Commitment already exists");
        converter.transfer(user2, bytes32(uint256(SAMPLE_NULLIFIER) + 1), SAMPLE_COMMITMENT, sampleProof);
    }
    
    function testOwnerFunctions() public {
        // Test set auditor key
        vm.prank(owner);
        converter.setAuditorKey(SAMPLE_AUDITOR_KEY);
        assertEq(converter.auditorPublicKey(), SAMPLE_AUDITOR_KEY);
        assertTrue(converter.isAuditorKeySet());
        
        // Test set verifier
        address mockVerifier = address(0x999);
        vm.prank(owner);
        converter.setVerifier(mockVerifier);
        assertEq(converter.verifier(), mockVerifier);
        
        // Test set verification enabled
        vm.prank(owner);
        converter.setVerificationEnabled(true);
        assertTrue(converter.verificationEnabled());
        
        // Test emergency withdraw
        vm.prank(user1);
        converter.register(SAMPLE_KEY_HASH, sampleProof);
        vm.prank(user1);
        token.approve(address(converter), TEST_AMOUNT);
        vm.prank(user1);
        converter.deposit(TEST_AMOUNT, SAMPLE_COMMITMENT, sampleProof);
        
        uint256 ownerBalanceBefore = token.balanceOf(owner);
        vm.prank(owner);
        converter.emergencyWithdraw(TEST_AMOUNT);
        assertEq(token.balanceOf(owner), ownerBalanceBefore + TEST_AMOUNT);
    }
    
    function testOwnerOnlyFunctions() public {
        // Test non-owner cannot set auditor key
        vm.prank(user1);
        vm.expectRevert();
        converter.setAuditorKey(SAMPLE_AUDITOR_KEY);
        
        // Test non-owner cannot set verifier
        vm.prank(user1);
        vm.expectRevert();
        converter.setVerifier(address(0x999));
        
        // Test non-owner cannot enable verification
        vm.prank(user1);
        vm.expectRevert();
        converter.setVerificationEnabled(true);
        
        // Test non-owner cannot emergency withdraw
        vm.prank(user1);
        vm.expectRevert();
        converter.emergencyWithdraw(1000);
    }
    
    function testGetterFunctions() public {
        assertEq(converter.getBalance(), 0);
        assertEq(converter.version(), "1.0.0");
        
        // Test unregistered user key access
        vm.expectRevert("User not registered");
        converter.getUserDecryptionKey(user1);
    }
    
    function testEventEmissions() public {
        vm.prank(user1);
        converter.register(SAMPLE_KEY_HASH, sampleProof);
        
        vm.prank(user1);
        token.approve(address(converter), TEST_AMOUNT);
        
        // Test deposit event
        vm.expectEmit(true, true, true, true);
        emit Deposit(user1, TEST_AMOUNT, SAMPLE_COMMITMENT);
        vm.prank(user1);
        converter.deposit(TEST_AMOUNT, SAMPLE_COMMITMENT, sampleProof);
        
        // Test withdraw event
        vm.expectEmit(true, true, true, true);
        emit Withdraw(user1, TEST_AMOUNT, SAMPLE_NULLIFIER);
        vm.prank(user1);
        converter.withdraw(TEST_AMOUNT, SAMPLE_NULLIFIER, sampleProof);
        
        // Test auditor key event
        vm.expectEmit(true, true, false, false);
        emit AuditorKeySet(SAMPLE_AUDITOR_KEY);
        vm.prank(owner);
        converter.setAuditorKey(SAMPLE_AUDITOR_KEY);
    }
}