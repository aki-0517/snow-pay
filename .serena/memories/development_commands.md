# Development Commands

## Frontend (mvp/)
- **Development**: `npm run dev` - Start development server on localhost:5173
- **Build**: `npm run build` - TypeScript compile + Vite build  
- **Preview**: `npm run preview` - Preview production build
- **Type Check**: `npm run typecheck` - Run TypeScript type checking
- **Lint**: `npm run lint` - Run ESLint

## Mobile (mvp-mobile/)
- **Start**: `npm start` or `expo start` - Start Expo development server
- **Android**: `npm run android` or `expo start --android`
- **iOS**: `npm run ios` or `expo start --ios`  
- **Web**: `npm run web` or `expo start --web`
- **Lint**: `npm run lint` or `expo lint`

## Smart Contracts (eerc-backend-converter/)
- **Compile**: `npx hardhat compile`
- **Test**: `npx hardhat test`
- **Deploy**: Various npm scripts for converter and standalone modes on Fuji network
- **ZK Setup**: `npx hardhat zkit make --force && npx hardhat zkit verifiers`

## System Commands (macOS/Darwin)
- **Git**: `git` - Version control
- **File Operations**: `ls`, `cd`, `find`, `grep` (standard Unix commands)
- **Package Management**: `npm`, `yarn`