# Code Style & Conventions

## Language & Framework Standards
- **Language**: TypeScript with strict mode enabled
- **Frontend Framework**: React 18 with functional components and hooks
- **Mobile Framework**: React Native with Expo
- **Build Tool**: Vite for web, Expo CLI for mobile

## TypeScript Configuration
- **Target**: ES2020
- **Module**: ESNext with bundler resolution
- **Strict**: true (strict type checking enabled)
- **No Unused**: noUnusedLocals and noUnusedParameters enabled
- **JSX**: react-jsx

## Styling
- **CSS Framework**: Tailwind CSS
- **Design System**: Avalanche Brand Guidelines
- **Colors**: Avalanche Blue (#3055B3), Secondary Blue (#058AFF), etc.
- **Fonts**: Inter (sans), Aeonik (display), Anonymous Pro (mono)

## File Organization
- Components organized by category: `layout/`, `forms/`, `operations/`, `features/`, `wallet/`
- Utilities in `pkg/` directory
- Type definitions in `types/`
- Configuration in `config/`
- Pages in `pages/`

## Import Style
- React imports: `import React from "react"`
- Component imports: Named exports from index files
- External libraries: Standard npm imports