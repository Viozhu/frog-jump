# 🐸 Froggy Jump

A modern, mobile-first Frogger-style game built with Astro Framework and TypeScript. Features a modular architecture, internationalization support, and dynamic gameplay mechanics.

## ✨ Features

### 🎮 Gameplay
- **Classic Frogger Mechanics**: Navigate your frog across roads and rivers to reach the goal
- **Dynamic Lane Generation**: Procedurally generated lanes with balanced road/river/grass distribution
- **Biome System**: Different visual themes (desert, snow, etc.) that change after each level
- **Varied Obstacles**: Multiple car types with random colors, logs that move across rivers
- **Score System**: Track your progress as you advance through levels
- **Camera Follow**: Smooth camera that follows the frog's movement

### 📱 Mobile-First Design
- **Responsive Canvas**: Automatically scales to fill the screen on all devices
- **Touch Controls**: Optimized for mobile with touch event handling
- **Full Viewport**: Uses 100vh/dvh for true full-screen experience
- **Mobile Optimizations**: Prevents text selection, zoom, and pull-to-refresh

### 🌍 Internationalization (i18n)
- **Multi-Language Support**: English, Spanish (Español), and Korean (한국어)
- **Language Selector**: Easy-to-use dropdown in the top-right corner
- **Persistent Preferences**: Remembers your language choice across sessions
- **Real-time Updates**: UI text updates instantly when language changes

### 🏗️ Architecture
- **Modular Design**: Clean separation of concerns with focused modules
- **TypeScript**: Full type safety throughout the codebase
- **Dependency Injection**: Entities receive dependencies through constructors
- **Maintainable**: Easy to extend and modify

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, pnpm, or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                      # UI Components
│   │   ├── StartScreen.astro    # Start screen overlay
│   │   ├── GameOverScreen.astro # Game over screen
│   │   ├── ScoreDisplay.astro   # Score display
│   │   └── LanguageSelector.astro # Language selector
│   └── FroggyGame.astro         # Main game orchestrator
├── game/                        # Core game logic
│   ├── assets/
│   │   └── svgs.ts              # SVG asset definitions
│   ├── config/
│   │   ├── constants.ts         # Game constants
│   │   └── biomes.ts            # Biome definitions
│   ├── core/
│   │   └── Game.ts              # Main game engine
│   ├── entities/                # Game entities
│   │   ├── Frog.ts              # Frog entity
│   │   ├── Obstacle.ts          # Obstacle entity (cars, logs)
│   │   ├── Lane.ts              # Lane entity
│   │   └── index.ts             # Entity exports
│   ├── renderer/
│   │   └── drawFunctions.ts     # Canvas drawing functions
│   ├── types.ts                 # Shared TypeScript types
│   └── utils/                   # Utility functions
│       ├── i18n.ts              # Internationalization system
│       ├── imageLoader.ts       # SVG image loading
│       ├── imageManager.ts      # Image caching
│       └── laneGenerator.ts     # Dynamic lane generation
├── pages/
│   └── index.astro              # Main page
└── styles/
    └── game.css                 # Game styles
```

## 🎯 Usage

### Basic Usage

Simply import the component in any Astro page:

```astro
---
import FroggyGame from '../components/FroggyGame.astro';
---

<FroggyGame client:load />
```

### Game Controls

- **Desktop**: Click on the canvas to make the frog jump forward
- **Mobile**: Tap on the canvas to make the frog jump forward
- **Goal**: Reach the top of the screen by avoiding cars and staying on logs

## 🎨 Customization

### Changing Game Constants

Edit `src/game/config/constants.ts` to modify:
- Game speed
- Lane dimensions
- Obstacle spawn rates
- Car speeds and sizes
- Score values

### Adding New Biomes

Edit `src/game/config/biomes.ts` to add new visual themes:

```typescript
{
  name: "desert",
  colors: {
    grass: "#D4A574",
    road: "#8B7355",
    river: "#87CEEB"
  }
}
```

### Adding New Languages

Edit `src/game/utils/i18n.ts` to add new language support:

```typescript
translations: {
  en: { ... },
  es: { ... },
  ko: { ... },
  // Add your language here
  fr: {
    start: "Commencer",
    retry: "Réessayer",
    // ...
  }
}
```

## 🛠️ Technologies

- **Astro** - Web framework for building fast, content-focused websites
- **TypeScript** - Type-safe JavaScript
- **Canvas API** - 2D rendering for game graphics
- **SVG** - Vector graphics for game assets

## 📝 Architecture Notes

This project follows clean architecture principles:

- **Separation of Concerns**: Game logic, UI, and rendering are separated
- **Dependency Injection**: Entities receive dependencies through constructors
- **Single Responsibility**: Each module has one clear purpose
- **Modularity**: Easy to extend and maintain

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🐛 Known Issues

None at the moment! If you find any issues, please report them.

## 📄 License

This project is open source and available for personal and educational use.

## 🙏 Acknowledgments

Inspired by the classic Frogger arcade game. Built with modern web technologies for a responsive, accessible gaming experience.

---

**Enjoy the game! 🐸**
