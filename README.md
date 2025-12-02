# Modern UI Experience

A fully responsive React UI page combining multiple advanced components and effects into a clean, modern, and smooth user interface.

## Features

- **Animated Floating Background Paths**: Smooth animated floating SVG paths with Framer Motion
- **Scroll-based Zoom Parallax**: Interactive image gallery with scroll-triggered scaling effects
- **3D Shader Background**: Advanced Three.js shader animation with aurora effects
- **Gradient Buttons**: Reusable button components with beautiful gradient styling
- **Fully Responsive**: Built with Tailwind CSS for perfect display on all devices
- **Smooth Animations**: Powered by Framer Motion for fluid, performant transitions

## Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Framer Motion** - Animation library
- **Three.js** - 3D graphics and shaders
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool
- **Radix UI** - Accessible component primitives
- **Class Variance Authority** - Component variants

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
test/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx           # Radix UI button component
│   │   │   └── gradient-button.tsx   # Gradient styled button
│   │   ├── background-paths.tsx      # Floating SVG paths animation
│   │   ├── zoom-parallax.tsx         # Scroll-based parallax effect
│   │   └── ano-ai.tsx               # Three.js shader background
│   ├── lib/
│   │   └── utils.ts                 # Utility functions
│   ├── App.tsx                      # Main application component
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles and Tailwind
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── tailwind.config.js              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite configuration
```

## Component Overview

### BackgroundPaths
Full-screen animated floating SVG paths that create a dynamic, living background. Features letter-by-letter text animation and a glassmorphic CTA button.

### ZoomParallax
Interactive image gallery with scroll-based zoom and parallax effects. Supports up to 7 images with layered positioning.

### AnoAI
Full-screen Three.js shader background with animated aurora-like effects using fractional Brownian motion and color blending.

### GradientButton
Reusable button component with gradient styling, hover effects, and variant support using Class Variance Authority.

## Customization

### Colors
Modify the color scheme in `tailwind.config.js` and `src/index.css` (CSS variables).

### Images
Update the `parallaxImages` array in `src/App.tsx` with your own image URLs.

### Animations
Adjust animation durations and easing in the component files:
- `background-paths.tsx` - Path animations
- `zoom-parallax.tsx` - Parallax scaling
- `ano-ai.tsx` - Shader animation speed

### Text Content
Edit the text content in `src/App.tsx` to match your needs.

## Performance Notes

- The shader animation runs at 60fps but can be adjusted via the `iTime` increment in `ano-ai.tsx`
- Images are lazy-loaded for optimal performance
- Framer Motion animations are GPU-accelerated
- Use production build for best performance

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

Built with modern web technologies:
- [React](https://react.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Three.js](https://threejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

Enjoy building amazing user interfaces! 🚀

