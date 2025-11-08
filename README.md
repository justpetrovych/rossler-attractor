# Rössler Attractor - Interactive Landing Page

An interactive landing page showcasing the beautiful chaos of the Rössler attractor, built with React, Three.js, and mathematical formula rendering.

## Features

- **Interactive 3D Visualization**: Rotate, zoom, and explore the Rössler attractor in real-time using Three.js
- **Mathematical Formulas**: Beautiful rendering of the differential equations using KaTeX
- **Educational Content**: Comprehensive explanation of the Rössler attractor, its properties, and applications
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Animated Colors**: Watch as the attractor's colors shift over time

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **KaTeX & react-katex** - Mathematical formula rendering

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/justpetrovych/rossler-attractor.git
cd rossler-attractor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## About the Rössler Attractor

The Rössler attractor is a system of three non-linear ordinary differential equations that exhibits chaotic behavior. It was discovered by Otto Rössler in 1976 while studying chemical reactions.

### The Equations

```
dx/dt = -y - z
dy/dt = x + ay
dz/dt = b + z(x - c)
```

With typical parameters: a = 0.2, b = 0.2, c = 5.7

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Otto Rössler for discovering this fascinating chaotic system
- The Three.js and React communities for their excellent tools
