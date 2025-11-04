# Offline Rive Setup Guide

## Overview
The DoggoRoomie tablet display now works completely offline by bundling the @rive-app/canvas package instead of loading it from a CDN.

## Changes Made

### 1. Package Installation
- Installed `@rive-app/canvas` as a production dependency
- Installed `vite` as a development dependency for bundling

### 2. Code Updates

#### `public/js/main.js`
```javascript
// Changed from:
// (global rive object from CDN)
const r = new rive.Rive({...});

// To:
import { Rive, Fit, Alignment } from '@rive-app/canvas';
const r = new Rive({...});
```

#### `public/index.html`
```html
<!-- Removed CDN script: -->
<!-- <script src="https://unpkg.com/@rive-app/canvas@2.20.0"></script> -->

<!-- Now uses bundled entry point: -->
<script type="module" src="/main-entry.js"></script>
```

#### `public/main-entry.js` (new file)
```javascript
// Main entry point for Vite bundling
import './js/main.js';
import './js/control.js';
```

### 3. Build Configuration

#### `vite.config.js`
```javascript
import { defineConfig } from 'vite';
import { copyFileSync } from 'fs';

export default defineConfig({
  root: 'public',
  publicDir: false, // Don't copy public dir as static assets
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [
    {
      name: 'copy-rive-file',
      closeBundle() {
        // Copy .riv animation file to dist
        copyFileSync('public/dog_animations.riv', 'dist/dog_animations.riv');
      }
    }
  ]
});
```

#### `package.json` scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "vite build",
    "dev": "vite"
  }
}
```

### 4. Server Updates

#### `server.js`
```javascript
// Determine which directory to serve based on environment
const isDevelopment = process.env.NODE_ENV !== 'production';
const staticDir = isDevelopment ? 'public' : 'dist';

app.use(express.static(join(__dirname, staticDir)));
```

## Build Process

### Development Mode
```bash
# Serves directly from public/ without bundling
npm start
```

### Production Mode
```bash
# 1. Build the bundled version
npm run build

# 2. Start server in production mode
NODE_ENV=production npm start
```

## Build Output

The `npm run build` command creates a `dist/` folder with:

- **index.html** - Main HTML file with bundled script references
- **dog_animations.riv** - Rive animation file (copied from public/)
- **assets/** folder containing:
  - `main-[hash].js` (145 KB) - Bundled JavaScript including:
    - @rive-app/canvas library
    - main.js (Rive setup, Wake Lock, sound sync)
    - control.js (WebSocket client)
  - `main-[hash].css` - Bundled CSS
  - Audio files (*.mp3, *.wav) - All sound effects

## Benefits

✅ **Works Offline** - No internet connection required  
✅ **Faster Loading** - No CDN latency  
✅ **Version Locked** - Consistent Rive version  
✅ **Single Bundle** - All dependencies included  
✅ **Asset Optimization** - Vite handles hashing and minification

## File Size Comparison

- **Before (CDN)**: ~0.7 KB (excluding CDN download)
- **After (Bundled)**: 145 KB (includes full Rive library)
- **Total with assets**: ~850 KB (including all audio files)

## Deployment

### For Termux on Android Tablet

1. Transfer the entire `tablet-server/` folder to the tablet
2. Install dependencies:
   ```bash
   cd tablet-server
   npm install
   ```

3. Build the production bundle:
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   NODE_ENV=production npm start
   ```

5. Open browser on tablet:
   ```
   http://localhost:3000
   ```

## Troubleshooting

### Build Issues

**Problem**: Vite build only outputs 0.7 KB  
**Solution**: Ensure `publicDir: false` in vite.config.js

**Problem**: .riv file missing from dist/  
**Solution**: Check that the copy plugin is running in `closeBundle` hook

### Runtime Issues

**Problem**: Cannot find module '@rive-app/canvas'  
**Solution**: Make sure to build first with `npm run build` before running in production mode

**Problem**: Audio files not loading  
**Solution**: Vite should bundle all imported assets. Check that audio files are referenced in the HTML.

## Development Workflow

1. **Make code changes** in `public/js/main.js` or other source files
2. **Test in development** with `npm start` (serves from public/)
3. **Build for production** with `npm run build`
4. **Test production build** with `NODE_ENV=production npm start`
5. **Deploy** the `dist/` folder (or entire project) to tablet

## Notes

- The development server (`npm start`) serves from `public/` directory
- In development, ES modules work directly without bundling (assuming modern browser)
- Production mode (`NODE_ENV=production npm start`) serves from `dist/`
- Vite handles all module resolution and bundling automatically
- The .riv file is copied as-is (not transformed by Vite)
- All audio assets are automatically bundled with hash names for cache busting
