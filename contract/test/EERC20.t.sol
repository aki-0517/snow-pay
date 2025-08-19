// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {EERC20} from "../src/EERC20.sol";

contract EERC20Test is Test {
    EERC20 public token;
    address public owner;
    address public user1;
    address public user2;
    
    uint256 constant INITIAL_CAP = 1000000 * 10**18; // 1M tokens
    string constant TOKEN_NAME = "Enhanced ERC20";
    string constant TOKEN_SYMBOL = "EERC";
    
    function setUp() public {
        owner = makeAddr("owner");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        vm.prank(owner);
        token = new EERC20(TOKEN_NAME, TOKEN_SYMBOL, INITIAL_CAP, owner);
    }
    
    function test_InitialSetup() public view {
        assertEq(token.name(), TOKEN_NAME);
        assertEq(token.symbol(), TOKEN_SYMBOL);
        assertEq(token.cap(), INITIAL_CAP);
        assertEq(token.owner(), owner);
        assertEq(token.totalSupply(), 0);
        assertFalse(token.verificationEnabled());
        assertEq(token.version(), "1.0.0");
    }
    
    function test_Mint() public {
        uint256 mintAmount = 1000 * 10**18;
        
        vm.prank(owner);
        token.mint(user1, mintAmount);
        
        assertEq(token.balanceOf(user1), mintAmount);
        assertEq(token.totalSupply(), mintAmount);
    }
    
    function test_MintFailsIfNotOwner() public {
        uint256 mintAmount = 1000 * 10**18;
        
        vm.prank(user1);
        vm.expectRevert();
        token.mint(user1, mintAmount);
    }
    
    function test_MintFailsIfExceedsCap() public {
        vm.prank(owner);
        vm.expectRevert();
        token.mint(user1, INITIAL_CAP + 1);
    }
    
    function test_Transfer() public {
        uint256 mintAmount = 1000 * 10**18;
        uint256 transferAmount = 500 * 10**18;
        
        // Mint tokens to user1
        vm.prank(owner);
        token.mint(user1, mintAmount);
        
        // Transfer from user1 to user2
        vm.prank(user1);
        token.transfer(user2, transferAmount);
        
        assertEq(token.balanceOf(user1), mintAmount - transferAmount);
        assertEq(token.balanceOf(user2), transferAmount);
    }
    
    function test_EncryptedMint() public {
        uint256 mintAmount = 1000 * 10**18;
        bytes32 commitment = keccak256("test_commitment");
        
        vm.prank(owner);
        token.encryptedMint(user1, mintAmount, commitment);
        
        assertEq(token.balanceOf(user1), mintAmount);
        assertTrue(token.commitments(commitment));
    }
    
    function test_EncryptedMintFailsWithDuplicateCommitment() public {
        uint256 mintAmount = 1000 * 10**18;
        bytes32 commitment = keccak256("test_commitment");
        
        vm.prank(owner);
        token.encryptedMint(user1, mintAmount, commitment);
        
        vm.prank(owner);
        vm.expectRevert("Commitment already exists");
        token.encryptedMint(user2, mintAmount, commitment);
    }
    
    function test_EncryptedTransfer() public {
        uint256 mintAmount = 1000 * 10**18;
        uint256 transferAmount = 500 * 10**18;
        bytes32 nullifierHash = keccak256("test_nullifier");
        bytes32 commitment = keccak256("test_commitment");
        bytes memory proof = "dummy_proof";
        
        // Setup: mint tokens to user1
        vm.prank(owner);
        token.mint(user1, mintAmount);
        
        // Encrypted transfer
        token.encryptedTransfer(user1, user2, transferAmount, nullifierHash, commitment, proof);
        
        assertEq(token.balanceOf(user1), mintAmount - transferAmount);
        assertEq(token.balanceOf(user2), transferAmount);
        assertTrue(token.nullifiers(nullifierHash));
        assertTrue(token.commitments(commitment));
    }
    
    function test_EncryptedTransferFailsWithDuplicateNullifier() public {
        uint256 mintAmount = 1000 * 10**18;
        uint256 transferAmount = 500 * 10**18;
        bytes32 nullifierHash = keccak256("test_nullifier");
        bytes32 commitment1 = keccak256("test_commitment1");
        bytes32 commitment2 = keccak256("test_commitment2");
        bytes memory proof = "dummy_proof";
        
        // Setup: mint tokens to user1
        vm.prank(owner);
        token.mint(user1, mintAmount);
        
        // First encrypted transfer
        token.encryptedTransfer(user1, user2, transferAmount, nullifierHash, commitment1, proof);
        
        // Second transfer with same nullifier should fail
        vm.expectRevert("Nullifier already used");
        token.encryptedTransfer(user1, user2, transferAmount, nullifierHash, commitment2, proof);
    }
    
    function test_EncryptedBurn() public {
        uint256 mintAmount = 1000 * 10**18;
        uint256 burnAmount = 500 * 10**18;
        bytes32 nullifierHash = keccak256("burn_nullifier");
        bytes memory proof = "dummy_proof";
        
        // Setup: mint tokens to user1
        vm.prank(owner);
        token.mint(user1, mintAmount);
        
        // Encrypted burn
        token.encryptedBurn(user1, burnAmount, nullifierHash, proof);
        
        assertEq(token.balanceOf(user1), mintAmount - burnAmount);
        assertEq(token.totalSupply(), mintAmount - burnAmount);
        assertTrue(token.nullifiers(nullifierHash));
    }
    
    function test_SetVerifier() public {
        address verifierAddress = makeAddr("verifier");
        
        vm.prank(owner);
        token.setVerifier(verifierAddress);
        
        assertEq(token.verifier(), verifierAddress);
    }
    
    function test_SetVerifierFailsIfNotOwner() public {
        address verifierAddress = makeAddr("verifier");
        
        vm.prank(user1);
        vm.expectRevert();
        token.setVerifier(verifierAddress);
    }
    
    function test_SetVerificationEnabled() public {
        vm.prank(owner);
        token.setVerificationEnabled(true);
        
        assertTrue(token.verificationEnabled());
        
        vm.prank(owner);
        token.setVerificationEnabled(false);
        
        assertFalse(token.verificationEnabled());
    }
    
    function test_SetVerificationEnabledFailsIfNotOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        token.setVerificationEnabled(true);
    }
    
    // Fuzz tests
    function testFuzz_Mint(uint256 amount) public {
        vm.assume(amount <= INITIAL_CAP && amount > 0);
        
        vm.prank(owner);
        token.mint(user1, amount);
        
        assertEq(token.balanceOf(user1), amount);
        assertEq(token.totalSupply(), amount);
    }
    
    function testFuzz_Transfer(uint256 mintAmount, uint256 transferAmount) public {
        vm.assume(mintAmount <= INITIAL_CAP && mintAmount > 0);
        vm.assume(transferAmount <= mintAmount);
        
        // Mint tokens
        vm.prank(owner);
        token.mint(user1, mintAmount);
        
        // Transfer tokens
        vm.prank(user1);
        token.transfer(user2, transferAmount);
        
        assertEq(token.balanceOf(user1), mintAmount - transferAmount);
        assertEq(token.balanceOf(user2), transferAmount);
    }
}