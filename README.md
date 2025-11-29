# 🐸 Froggy Jump

Un mini-juego estilo Frogger desarrollado con Astro Framework.

## 🎮 Características

- **Componente aislado**: Todo el juego está en `<FroggyGame />` que puedes importar fácilmente
- **Responsive**: Funciona perfectamente en escritorio y móvil
- **Mecánicas completas**:
  - Click/Tap para hacer avanzar la rana
  - Carriles seguros (césped)
  - Carriles peligrosos (carreteras con coches, ríos con troncos)
  - Sistema de puntuación
  - Cámara que sigue a la rana

## 🚀 Instalación

```bash
npm install
```

## 💻 Desarrollo

```bash
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321) en tu navegador.

## 📦 Build

```bash
npm run build
```

## 📁 Estructura

```
src/
├── components/
│   └── FroggyGame.astro  # Componente completo del juego
└── pages/
    └── index.astro       # Página principal
```

## 🎯 Uso

Simplemente importa el componente en cualquier página de Astro:

```astro
---
import FroggyGame from '../components/FroggyGame.astro';
---

<FroggyGame client:load />
```

¡Diviértete jugando! 🐸

# frog-jump
