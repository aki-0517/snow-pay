// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/EERCConverter.sol";
import "../src/EERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Test Token", "TEST") {}
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/**
 * @title Integration Test
 * @dev Tests the complete flow of MVP functionality with deployed contracts
 */
contract IntegrationTest is Test {
    EERCConverter public converter;
    MockERC20 public erc20;
    EERC20 public eerc20;
    
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18;
    uint256 public constant TEST_AMOUNT = 1000 * 10**18;
    
    bytes32 public constant USER1_KEY_HASH = bytes32(uint256(11111));
    bytes32 public constant USER2_KEY_HASH = bytes32(uint256(22222));
    bytes32 public constant AUDITOR_KEY = bytes32(uint256(99999));
    
    bytes public sampleProof = "sample_proof_data";
    
    function setUp() public {
        vm.startPrank(owner);
        
        // Deploy all contracts
        erc20 = new MockERC20();
        erc20.mint(owner, INITIAL_SUPPLY);
        converter = new EERCConverter(address(erc20), owner);
        eerc20 = new EERC20("Enhanced ERC20", "EERC", INITIAL_SUPPLY, owner);
        
        // Setup initial state
        converter.setAuditorKey(AUDITOR_KEY);
        erc20.transfer(user1, TEST_AMOUNT * 10);
        erc20.transfer(user2, TEST_AMOUNT * 10);
        
        vm.stopPrank();
    }
    
    function testMVPWorkflow() public {
        // 1. Users register with the converter
        vm.prank(user1);
        converter.register(USER1_KEY_HASH, sampleProof);
        assertTrue(converter.isUserRegistered(user1));
        
        vm.prank(user2);  
        converter.register(USER2_KEY_HASH, sampleProof);
        assertTrue(converter.isUserRegistered(user2));
        
        // 2. User1 deposits ERC20 tokens
        vm.prank(user1);
        erc20.approve(address(converter), TEST_AMOUNT);
        
        bytes32 depositCommitment = bytes32(uint256(12345));
        vm.prank(user1);
        converter.deposit(TEST_AMOUNT, depositCommitment, sampleProof);
        
        assertEq(converter.totalEncryptedBalance(), TEST_AMOUNT);
        assertEq(erc20.balanceOf(address(converter)), TEST_AMOUNT);
        assertTrue(converter.commitments(depositCommitment));
        
        // 3. User1 makes a private transfer to User2
        bytes32 transferNullifier = bytes32(uint256(54321));
        bytes32 transferCommitment = bytes32(uint256(67890));
        
        vm.prank(user1);
        converter.transfer(user2, transferNullifier, transferCommitment, sampleProof);
        
        assertTrue(converter.nullifiers(transferNullifier));
        assertTrue(converter.commitments(transferCommitment));
        
        // 4. User2 withdraws tokens
        bytes32 withdrawNullifier = bytes32(uint256(98765));
        uint256 withdrawAmount = TEST_AMOUNT / 2;
        
        uint256 user2BalanceBefore = erc20.balanceOf(user2);
        vm.prank(user2);
        converter.withdraw(withdrawAmount, withdrawNullifier, sampleProof);
        
        assertEq(erc20.balanceOf(user2), user2BalanceBefore + withdrawAmount);
        assertEq(converter.totalEncryptedBalance(), TEST_AMOUNT - withdrawAmount);
        assertTrue(converter.nullifiers(withdrawNullifier));
        
        // 5. Test EERC20 standalone functionality
        vm.prank(owner);
        eerc20.mint(user1, TEST_AMOUNT);
        assertEq(eerc20.balanceOf(user1), TEST_AMOUNT);
        
        // 6. Test encrypted operations on EERC20
        bytes32 eerc20Commitment = bytes32(uint256(11223));
        vm.prank(owner);
        eerc20.encryptedMint(user2, TEST_AMOUNT, eerc20Commitment);
        
        assertEq(eerc20.balanceOf(user2), TEST_AMOUNT);
        assertTrue(eerc20.commitments(eerc20Commitment));
    }
    
    function testContractInterfaces() public {
        // Test that contracts implement expected interfaces for MVP
        
        // EERCConverter interface
        assertTrue(converter.isAuditorKeySet());
        assertEq(converter.getBalance(), 0);
        assertEq(converter.totalEncryptedBalance(), 0);
        assertEq(converter.version(), "1.0.0");
        
        // MockERC20 interface
        assertEq(erc20.name(), "Test Token");
        assertEq(erc20.symbol(), "TEST");
        assertEq(erc20.decimals(), 18);
        
        // EERC20 interface
        assertEq(eerc20.name(), "Enhanced ERC20");
        assertEq(eerc20.symbol(), "EERC");
        assertEq(eerc20.cap(), INITIAL_SUPPLY);
        assertEq(eerc20.version(), "1.0.0");
    }
    
    function testDeploymentAddresses() public {
        // Verify contracts are deployed at valid addresses
        assertTrue(address(converter) != address(0));
        assertTrue(address(erc20) != address(0));
        assertTrue(address(eerc20) != address(0));
        
        // Verify contract ownership
        assertEq(converter.owner(), owner);
        assertEq(eerc20.owner(), owner);
        
        // Verify converter points to correct ERC20
        assertEq(address(converter.token()), address(erc20));
    }
}