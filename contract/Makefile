# Avalanche EERC20 Contract Deployment Makefile

# Load environment variables
include .env
export

# Default network
NETWORK ?= fuji

# Contract paths
CONTRACT_PATH = src/EERC20.sol:EERC20
SCRIPT_PATH = script/DeployEERC20.s.sol

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

.PHONY: help install build test deploy verify clean

help: ## Show this help message
	@echo "$(GREEN)Avalanche EERC20 Contract Deployment$(NC)"
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo "$(GREEN)Installing Foundry dependencies...$(NC)"
	forge install OpenZeppelin/openzeppelin-contracts --no-commit
	forge install foundry-rs/forge-std --no-commit

build: ## Build contracts
	@echo "$(GREEN)Building contracts...$(NC)"
	forge build

test: ## Run tests
	@echo "$(GREEN)Running tests...$(NC)"
	forge test -vv

clean: ## Clean build artifacts
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	forge clean

# Deployment commands
deploy-fuji: ## Deploy to Avalanche Fuji testnet
	@echo "$(GREEN)Deploying EERC20 to Fuji testnet...$(NC)"
	@if [ -z "$(PRIVATE_KEY)" ]; then echo "$(RED)Error: PRIVATE_KEY not set in .env$(NC)"; exit 1; fi
	forge script $(SCRIPT_PATH) \
		--rpc-url fuji \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		-vvv

deploy-mainnet: ## Deploy to Avalanche mainnet
	@echo "$(YELLOW)Warning: Deploying to mainnet!$(NC)"
	@read -p "Are you sure you want to deploy to mainnet? (y/N): " confirm; \
	if [ "$$confirm" != "y" ] && [ "$$confirm" != "Y" ]; then echo "Deployment cancelled."; exit 1; fi
	@if [ -z "$(PRIVATE_KEY)" ]; then echo "$(RED)Error: PRIVATE_KEY not set in .env$(NC)"; exit 1; fi
	forge script $(SCRIPT_PATH) \
		--rpc-url avalanche \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		-vvv

# Verification commands (optional - requires SNOWTRACE_API_KEY)
# verify-fuji: ## Verify contract on Fuji testnet  
#	@echo "$(GREEN)Verifying contract on Fuji...$(NC)"
#	@if [ -z "$(CONTRACT_ADDRESS)" ]; then echo "$(RED)Error: CONTRACT_ADDRESS not set$(NC)"; exit 1; fi
#	@if [ -z "$(SNOWTRACE_API_KEY)" ]; then echo "$(RED)Error: SNOWTRACE_API_KEY not set$(NC)"; exit 1; fi
#	forge verify-contract \
#		--chain fuji \
#		--etherscan-api-key $(SNOWTRACE_API_KEY) \
#		$(CONTRACT_ADDRESS) \
#		$(CONTRACT_PATH)

# verify-mainnet: ## Verify contract on mainnet
#	@echo "$(GREEN)Verifying contract on mainnet...$(NC)"
#	@if [ -z "$(CONTRACT_ADDRESS)" ]; then echo "$(RED)Error: CONTRACT_ADDRESS not set$(NC)"; exit 1; fi  
#	@if [ -z "$(SNOWTRACE_API_KEY)" ]; then echo "$(RED)Error: SNOWTRACE_API_KEY not set$(NC)"; exit 1; fi
#	forge verify-contract \
#		--chain avalanche \
#		--etherscan-api-key $(SNOWTRACE_API_KEY) \
#		$(CONTRACT_ADDRESS) \
#		$(CONTRACT_PATH)

# Utility commands
check-balance: ## Check deployer wallet balance
	@echo "$(GREEN)Checking wallet balance...$(NC)"
	@if [ -z "$(PRIVATE_KEY)" ]; then echo "$(RED)Error: PRIVATE_KEY not set in .env$(NC)"; exit 1; fi
	cast balance --rpc-url fuji $$(cast wallet address --private-key $(PRIVATE_KEY))

get-testnet-tokens: ## Instructions for getting testnet AVAX
	@echo "$(GREEN)To get testnet AVAX tokens:$(NC)"
	@echo "1. Visit: https://faucet.avax.network/"
	@echo "2. Enter your wallet address: $$(cast wallet address --private-key $(PRIVATE_KEY) 2>/dev/null || echo 'Set PRIVATE_KEY in .env first')"
	@echo "3. Request testnet tokens"

# Development commands
simulate-deploy: ## Simulate deployment without broadcasting
	@echo "$(GREEN)Simulating deployment...$(NC)"
	@if [ -z "$(PRIVATE_KEY)" ]; then echo "$(RED)Error: PRIVATE_KEY not set in .env$(NC)"; exit 1; fi
	forge script $(SCRIPT_PATH) \
		--rpc-url fuji \
		--private-key $(PRIVATE_KEY) \
		-vv

gas-estimate: ## Estimate gas costs for deployment
	@echo "$(GREEN)Estimating gas costs...$(NC)"
	@if [ -z "$(PRIVATE_KEY)" ]; then echo "$(RED)Error: PRIVATE_KEY not set in .env$(NC)"; exit 1; fi
	forge script $(SCRIPT_PATH) \
		--rpc-url fuji \
		--private-key $(PRIVATE_KEY) \
		--gas-estimate

format: ## Format Solidity code
	@echo "$(GREEN)Formatting Solidity code...$(NC)"
	forge fmt