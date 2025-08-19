// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {EERC20} from "../src/EERC20.sol";

/**
 * @title Deploy EERC20
 * @dev Deployment script for EERC20 token on Avalanche Fuji testnet
 */
contract DeployEERC20 is Script {
    // Default deployment parameters
    string constant TOKEN_NAME = "Enhanced ERC20";
    string constant TOKEN_SYMBOL = "EERC";
    uint256 constant TOKEN_CAP = 1000000 * 10**18; // 1M tokens with 18 decimals
    
    function setUp() public {}

    function run() public {
        // Get deployment parameters from environment or use defaults
        string memory tokenName = vm.envOr("TOKEN_NAME", TOKEN_NAME);
        string memory tokenSymbol = vm.envOr("TOKEN_SYMBOL", TOKEN_SYMBOL);
        uint256 tokenCap = vm.envOr("TOKEN_CAP", TOKEN_CAP);
        
        // Get deployer address
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        
        console2.log("Deploying EERC20 with the following parameters:");
        console2.log("- Name:", tokenName);
        console2.log("- Symbol:", tokenSymbol);
        console2.log("- Cap:", tokenCap);
        console2.log("- Owner:", deployerAddress);
        console2.log("- Deployer Balance:", deployerAddress.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the EERC20 contract
        EERC20 token = new EERC20(
            tokenName,
            tokenSymbol,
            tokenCap,
            deployerAddress
        );
        
        vm.stopBroadcast();
        
        // Log deployment information
        console2.log("EERC20 deployed to:", address(token));
        console2.log("Transaction hash will be displayed after broadcast");
        console2.log("");
        console2.log("Contract deployed successfully!");
        console2.log("View on Snowtrace:", string(abi.encodePacked("https://testnet.snowtrace.io/address/", _addressToString(address(token)))));
        console2.log("");
        console2.log("Add this address to your frontend config:");
        console2.log("EERC20_TOKEN:", address(token));
    }
    
    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}