# Froggy Jump - Architecture Documentation

## Overview

This project has been refactored from a monolithic 1176-line component into a well-organized, modular architecture following software engineering best practices.

## Project Structure

```
src/
├── game/                    # Core game logic
│   ├── assets/             # SVG assets
│   │   └── svgs.ts         # SVG string definitions
│   ├── config/             # Configuration
│   │   └── constants.ts    # Game constants and configuration
│   ├── core/               # Core game engine
│   │   └── Game.ts         # Main game class (state management, game loop)
│   ├── entities/           # Game entities (domain models)
│   │   ├── Frog.ts         # Frog entity
│   │   ├── Obstacle.ts     # Obstacle entity
│   │   ├── Lane.ts         # Lane entity
│   │   └── index.ts        # Entity exports
│   ├── renderer/           # Rendering logic
│   │   └── drawFunctions.ts # Drawing functions for all entities
│   ├── types.ts            # Shared type definitions
│   └── utils/              # Utility functions
│       ├── imageLoader.ts  # SVG image loading utilities
│       └── imageManager.ts # Image caching and management
├── components/
│   ├── ui/                 # UI components
│   │   ├── StartScreen.astro
│   │   ├── GameOverScreen.astro
│   │   └── ScoreDisplay.astro
│   └── FroggyGame.astro    # Main game orchestrator (clean, minimal)
├── styles/
│   └── game.css            # Game-specific styles
└── pages/
    └── index.astro         # Main page
```

## Architecture Principles

### 1. Separation of Concerns
- **Game Logic**: Isolated in `game/` directory
- **UI Components**: Separated into reusable components
- **Styling**: Extracted to CSS modules
- **Assets**: Centralized in `game/assets/`

### 2. Dependency Injection
- Entities receive dependencies through constructors
- No global state or variables
- Easy to test and mock

### 3. Single Responsibility Principle
- Each class/module has one clear purpose
- `Frog.ts` - Only handles frog logic
- `Game.ts` - Only handles game state and coordination
- `drawFunctions.ts` - Only handles rendering

### 4. Modularity
- Clear module boundaries
- Easy to add new features
- Easy to modify existing features without affecting others

## Key Components

### Game Core (`game/core/Game.ts`)
- Manages game state (playing, paused, game over)
- Coordinates game loop
- Handles initialization
- Manages camera and score systems

### Entities (`game/entities/`)
- **Frog**: Player character with jump mechanics
- **Obstacle**: Moving obstacles (cars, logs)
- **Lane**: Game lanes with collision detection

### Renderer (`game/renderer/`)
- All drawing functions centralized
- Uses image manager for asset loading
- Canvas rendering logic isolated

### Image Manager (`game/utils/imageManager.ts`)
- Centralized image caching
- Prevents duplicate loading
- Handles SVG to image conversion

## Benefits of This Architecture

1. **Maintainability**: Easy to find and modify code
2. **Testability**: Each module can be tested independently
3. **Scalability**: Easy to add new features (power-ups, levels, etc.)
4. **Readability**: Clear structure, self-documenting
5. **Reusability**: Components can be reused or extracted
6. **Performance**: Better code organization can lead to optimizations

## Adding New Features

### Adding a New Entity
1. Create class in `game/entities/`
2. Add drawing function in `game/renderer/drawFunctions.ts`
3. Integrate into `Game.ts` if needed

### Adding a New UI Component
1. Create component in `components/ui/`
2. Import and use in `FroggyGame.astro`

### Modifying Game Configuration
1. Update `game/config/constants.ts`
2. All game logic automatically uses new values

## Migration Notes

The original monolithic component has been completely refactored:
- **Before**: 1176 lines in one file
- **After**: ~15 focused modules, each < 300 lines
- **Main Component**: Reduced from 1176 to ~70 lines

