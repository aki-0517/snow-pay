// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
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
 * @title DeployContracts
 * @dev Deployment script for EERC system contracts
 */
contract DeployContracts is Script {
    // Deployment configuration
    uint256 constant ERC20_INITIAL_SUPPLY = 1000000 * 10**18; // 1M tokens
    
    string constant EERC20_NAME = "Enhanced ERC20";
    string constant EERC20_SYMBOL = "EERC";
    uint256 constant EERC20_CAP = 10000000 * 10**18; // 10M tokens cap
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with deployer:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy MockERC20 (underlying token for converter)
        MockERC20 erc20 = new MockERC20();
        console.log("MockERC20 deployed at:", address(erc20));
        
        // Deploy EERCConverter
        EERCConverter converter = new EERCConverter(
            address(erc20),
            deployer
        );
        console.log("EERCConverter deployed at:", address(converter));
        
        // Deploy EERC20 (standalone encrypted token)
        EERC20 eerc20 = new EERC20(
            EERC20_NAME,
            EERC20_SYMBOL,
            EERC20_CAP,
            deployer
        );
        console.log("EERC20 deployed at:", address(eerc20));
        
        // Mint some test tokens to deployer
        erc20.mint(deployer, 100000 * 10**18); // 100k tokens
        console.log("Minted 100,000 TEST tokens to deployer");
        
        // Mint some EERC20 tokens to deployer
        eerc20.mint(deployer, 50000 * 10**18); // 50k tokens
        console.log("Minted 50,000 EERC tokens to deployer");
        
        vm.stopBroadcast();
        
        // Log deployment summary
        console.log("\n=== Deployment Summary ===");
        console.log("MockERC20 (TEST):", address(erc20));
        console.log("EERCConverter:", address(converter));
        console.log("EERC20 (EERC):", address(eerc20));
        console.log("Deployer:", deployer);
        
        // Save deployment addresses to file
        string memory deploymentInfo = string.concat(
            "{\n",
            '  "MockERC20": "', vm.toString(address(erc20)), '",\n',
            '  "EERCConverter": "', vm.toString(address(converter)), '",\n',
            '  "EERC20": "', vm.toString(address(eerc20)), '",\n',
            '  "deployer": "', vm.toString(deployer), '"\n',
            "}"
        );
        
        vm.writeFile("deployment-addresses.json", deploymentInfo);
        console.log("Deployment addresses saved to deployment-addresses.json");
    }
}