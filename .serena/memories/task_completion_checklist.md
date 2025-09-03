# Task Completion Checklist

## Frontend Development (mvp/)
When completing a task involving the React frontend:

1. **Type Checking**: Run `npm run typecheck` to ensure no TypeScript errors
2. **Linting**: Run `npm run lint` to check code style and catch issues
3. **Build**: Run `npm run build` to ensure production build works
4. **Testing**: Currently no automated tests configured - manual testing required
5. **Development**: Test changes with `npm run dev`

## Mobile Development (mvp-mobile/)
When completing mobile development tasks:

1. **Linting**: Run `npm run lint` or `expo lint`
2. **Build**: Ensure expo build works on target platforms
3. **Testing**: Manual testing on simulator/device

## Smart Contract Development (eerc-backend-converter/)
When completing smart contract tasks:

1. **Compile**: Run `npx hardhat compile`
2. **Test**: Run `npx hardhat test` if tests exist
3. **ZK Circuits**: Run `npx hardhat zkit make --force && npx hardhat zkit verifiers` if circuits changed
4. **Deployment**: Test deployment scripts on testnet

## General Practices
- Always test on Avalanche Fuji testnet before mainnet
- Verify wallet integrations work correctly
- Check that privacy features function as expected
- Ensure responsive design works on different screen sizes