# Suggested Commands

## Most Common Development Commands

### Frontend Development (mvp/)
```bash
cd mvp
npm install              # Install dependencies
npm run dev             # Start development server
npm run typecheck       # Check TypeScript types
npm run lint           # Run ESLint
npm run build          # Build for production
```

### Mobile Development (mvp-mobile/)
```bash
cd mvp-mobile  
npm install            # Install dependencies
npm start              # Start Expo development server
npm run lint          # Run ESLint
```

### Smart Contract Development (eerc-backend-converter/)
```bash
cd eerc-backend-converter
npm install                                    # Install dependencies
npx hardhat compile                           # Compile contracts
npx hardhat test                             # Run tests
npx hardhat zkit make --force && npx hardhat zkit verifiers  # Setup ZK circuits
```

### Git Operations
```bash
git status             # Check repository status
git add .              # Stage changes
git commit -m "message"  # Commit changes
git push               # Push to remote
```

## Testing & Quality Commands
- **Type Check**: `npm run typecheck` (in mvp/)
- **Lint**: `npm run lint` (in mvp/ or mvp-mobile/)
- **Build**: `npm run build` (in mvp/)
- **Smart Contract Test**: `npx hardhat test` (in eerc-backend-converter/)