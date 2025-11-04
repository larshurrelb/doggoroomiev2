# 🚀 Offline Deployment Guide - Critical Steps

## The Problem
The tablet won't load Rive animations offline because it's trying to load from a CDN. This guide ensures you deploy correctly for **100% offline operation**.

## Quick Fix Checklist

### ✅ On Your Mac (BEFORE transferring to tablet):

1. **Navigate to tablet-server:**
   ```bash
   cd /Users/larshurrelbrink/Documents/doggoroomiev2/tablet-server
   ```

2. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

3. **Build the production bundle:**
   ```bash
   npm run build
   ```
   
   This creates the `dist/` folder with:
   - Bundled Rive library (~145KB)
   - All audio files
   - dog_animations.riv
   - Optimized HTML/CSS/JS

4. **Verify dist/ folder exists:**
   ```bash
   ls -la dist/
   ```
   
   You should see:
   ```
   dist/
   ├── assets/
   ├── dog_animations.riv
   └── index.html
   ```

### ✅ Transfer to Tablet:

Choose one method:

**Method A - USB Cable:**
```bash
# Connect tablet via USB
# Copy ENTIRE tablet-server folder to tablet
# Make sure dist/ folder is included!
```

**Method B - Git:**
```bash
# Push to git (make sure dist/ is NOT in .gitignore)
git add tablet-server/dist/
git commit -m "Add production build"
git push

# On tablet in Termux:
cd ~
git clone [your-repo-url]
cd doggoroomiev2/tablet-server
```

### ✅ On Tablet (Termux):

1. **Navigate to tablet-server:**
   ```bash
   cd /sdcard/tablet-server
   # OR if using git:
   cd ~/doggoroomiev2/tablet-server
   ```

2. **Verify dist/ folder exists:**
   ```bash
   ls -la dist/
   ```
   
   **If dist/ is missing, you need to build on Mac and transfer again!**

3. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

4. **Start server in PRODUCTION mode:**
   ```bash
   NODE_ENV=production node server.js
   ```
   
   **DO NOT use `npm start`** - that's development mode!

5. **Verify the output says:**
   ```
   Mode: Production          ← Must say Production
   Serving from: dist        ← Must say dist (not public)
   ```

### ✅ Test Offline:

1. **Turn OFF tablet WiFi/mobile data** (or disconnect from internet)
2. **Turn ON tablet hotspot**
3. **Open browser on tablet:** `http://localhost:3000`
4. **Verify:**
   - Animation loads and displays
   - No errors in browser console (F12)
   - "Tap to Start" button appears

## Common Mistakes

### ❌ Mistake 1: No dist/ folder
**Symptom:** Rive won't load offline  
**Fix:** Build on Mac first, then transfer

### ❌ Mistake 2: Running npm start on tablet
**Symptom:** Works with internet, fails without  
**Fix:** Use `NODE_ENV=production node server.js`

### ❌ Mistake 3: dist/ not transferred
**Symptom:** Server says "Serving from: public"  
**Fix:** Copy dist/ folder from Mac to tablet

### ❌ Mistake 4: Building on tablet
**Symptom:** npm run build fails or is slow  
**Fix:** Always build on Mac/PC, not on tablet

## Verification Commands

### On Mac (before transfer):
```bash
cd tablet-server
ls -la dist/                          # Should exist
ls -la dist/assets/*.js               # Should see bundled JS
du -sh dist/                          # Should be ~850KB
```

### On Tablet (after transfer):
```bash
cd /sdcard/tablet-server
ls -la dist/                          # Should exist
NODE_ENV=production node server.js    # Check output
```

### Expected Server Output:
```
===========================================
🤖 DoggoRoomie Server v2.0
===========================================
Mode: Production                    ← CRITICAL
Serving from: dist                  ← CRITICAL
Server running on: http://0.0.0.0:3000
Valetudo: http://192.168.43.2
Arduino: http://192.168.43.5
WebSocket ready for connections
===========================================
```

## File Size Reference

If your `dist/` folder is tiny (like 10KB), the build didn't work correctly:

```bash
# Correct sizes (approximate):
dist/                           ~850 KB total
dist/assets/main-[hash].js      ~145 KB (includes Rive)
dist/assets/*.mp3               ~600 KB (all sounds)
dist/dog_animations.riv         ~100 KB
```

## Emergency Rebuild

If you're on the tablet and need to rebuild (requires internet):

```bash
cd /sdcard/tablet-server

# Make sure you have internet connection
npm run build

# Then start in production mode
NODE_ENV=production node server.js
```

## Environment Variable Explanation

```bash
# Development mode - loads Rive from CDN (NEEDS INTERNET)
npm start
# Equivalent to: node server.js (no NODE_ENV set)

# Production mode - serves from dist/ (OFFLINE)
NODE_ENV=production node server.js
```

The `server.js` checks `process.env.NODE_ENV`:
- If `NODE_ENV === 'production'` → serves from `dist/`
- Otherwise → serves from `public/` (loads Rive from CDN)

## Quick Troubleshooting

### Problem: "Cannot find module '@rive-app/canvas'"
**Cause:** Running in development mode without internet  
**Fix:** Use `NODE_ENV=production node server.js`

### Problem: Animation loads then disappears
**Cause:** Rive library failed to load from CDN  
**Fix:** Ensure production mode and dist/ exists

### Problem: Black screen, no animation
**Cause:** dog_animations.riv not in dist/  
**Fix:** Rebuild on Mac: `npm run build`

## Success Criteria

Your deployment is successful when:
- ✅ Tablet has NO internet connection
- ✅ Server starts with "Mode: Production, Serving from: dist"
- ✅ Browser loads animation at localhost:3000
- ✅ "Tap to Start" button appears
- ✅ Animation plays smoothly after tapping
- ✅ No console errors about missing modules

---

**Remember:** The key to offline operation is:
1. Build on Mac → 2. Transfer dist/ → 3. Run with NODE_ENV=production
