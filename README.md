# 🤖 DoggoRoomie v2.0

Robot control system where an Android tablet runs as a WiFi hotspot server, controlling a Valetudo vacuum robot and Arduino-powered tail servo while displaying animated dog faces using Rive.

---

## ⚡️ Quick Setup

### On Mac/PC (Build First)
```bash
cd tablet-server
npm install
npm run build    # Creates dist/ folder for offline use
```

### On Tablet (Termux)
```bash
# Install Termux from F-Droid, then:
pkg update && pkg upgrade
pkg install nodejs
termux-setup-storage

# Transfer tablet-server/ folder to /sdcard/, then:
cd /sdcard/tablet-server
npm install

# Enable hotspot in tablet Settings → Network → Hotspot
# Connect robot & Arduino to hotspot
# Update config.js with their IPs

# Start server (production mode for offline)
NODE_ENV=production node server.js

# Open tablet browser: http://localhost:3000
# Tap "Tap to Start" button
```

### On Laptop
```bash
# Connect to tablet's hotspot
# Open laptop-controller/index.html in browser
# Enter tablet IP (usually 192.168.43.1:3000)
# Click Connect
```

---

## 📋 What's What

**tablet-server/** - Node.js server running on Android tablet via Termux
- `server.js` - Express + WebSocket server  
- `config.js` - IP addresses & credentials (edit this!)
- `public/` - Web UI with Rive animations
- `dist/` - Production build (created by `npm run build`)

**laptop-controller/** - Remote control interface for laptop
- Open `index.html` directly in browser
- No build or dependencies needed

---

## 🌐 Network Setup

```
Tablet Hotspot (192.168.43.1)
    ├── Laptop → Remote controller
    ├── Robot (192.168.43.2) → Valetudo API
    └── Arduino (192.168.43.5) → Tail servo
```

**Configure IPs in `tablet-server/config.js`:**
```javascript
VALETUDO_HOST: "192.168.43.2",  // Robot IP
ARDUINO_HOST: "192.168.43.5",   // Arduino IP
```

Find device IPs on tablet:
```bash
pkg install nmap
nmap -sn 192.168.43.0/24
```

---

## 🎮 Controls

**Robot Movement**
- `Space` - Toggle enable/disable
- `W/↑` - Forward | `S/↓` - Backward  
- `A/←` - Left | `D/→` - Right

**Tail Servo**
- `T` - Slow | `Z` - Normal | `U` - Fast

**Animations** (displayed on tablet)
- `1` Idle | `2` Puppy Eyes | `3` Staring | `4` Happy
- `5` Panting | `6` Sighing | `7` Barking | `8` Woofing
- `9` Bumping | `0` Gaze Right | `ß` Gaze Left
- `i` Stop all sounds

---

## 🔧 Troubleshooting

**Server won't start**
- Check Node.js: `node --version` (need v14+)
- Port conflict: `netstat -tuln | grep 3000`
- Wrong directory: Must be in `tablet-server/`

**Rive won't load offline**
- Did you run `npm run build` on Mac first?
- Check server output says "Serving from: **dist**" (not public)
- Missing dist/ folder? Build on Mac and transfer again

**WebSocket won't connect**
- All devices on same hotspot?
- Check tablet IP: In Termux run `ifconfig wlan0`
- Use `ws://` not `wss://`
- Firewall blocking port 3000?

**Robot not responding**
- Ping test: `curl http://192.168.43.2`
- Check credentials in `config.js`
- Press `Space` to enable control first

**Screen goes to sleep**
- Wake Lock should activate after "Tap to Start"
- Keep tablet plugged in during use
- Use Chrome browser on Android (best Wake Lock support)

---

## 🎯 Key Features

✅ **Fully offline** - Rive bundled, no internet needed  
✅ **Fullscreen face** - Clean display on tablet, no UI clutter  
✅ **Screen stays on** - Wake Lock API prevents sleep  
✅ **Synchronized audio** - Sounds play with animations  
✅ **Dual control** - Operate from tablet or laptop  
✅ **Multi-client** - Multiple controllers work simultaneously  

---

## 📂 Project Structure

```
doggoroomiev2/
├── tablet-server/
│   ├── server.js              # Express + WebSocket
│   ├── config.js              # ⚠️ Edit IPs here
│   ├── package.json
│   ├── vite.config.js         # Bundler config
│   ├── public/                # Source files
│   │   ├── index.html
│   │   ├── dog_animations.riv
│   │   ├── sounds/            # Audio files
│   │   └── js/
│   │       ├── main.js        # Rive + Wake Lock + sounds
│   │       └── control.js     # Robot controls
│   └── dist/                  # Built files (offline)
│
├── laptop-controller/
│   ├── index.html             # Just open in browser
│   ├── app.js
│   └── style.css
│
└── dog_animations.riv         # Original file
```

---

## 🔑 Important Files

**config.js** - IP addresses and credentials (MUST edit before use)  
**dist/** - Production bundle (created by `npm run build` on Mac)  
**public/sounds/** - Audio files for each animation  

---

## 🚨 Critical Notes

1. **ALWAYS build on Mac/PC first** - Tablet can't build efficiently
   ```bash
   cd tablet-server
   npm run build
   ```

2. **ALWAYS use production mode on tablet** - Required for offline operation
   ```bash
   NODE_ENV=production node server.js
   ```
   NOT `npm start` (that's dev mode, needs internet)

3. **dist/ folder MUST exist** - Without it, Rive loads from CDN (requires internet)

4. **Transfer complete folder** - Include dist/, public/, node_modules/, everything

---

## � API Endpoints

- `POST /control` - Robot/servo commands
- `GET /health` - Server status
- `WS /` - WebSocket for animation sync
- `GET /network-info` - Network debugging (tap top-right corner on tablet)

---

## 🧪 Testing

**Tablet server working?**
```bash
cd /sdcard/tablet-server
NODE_ENV=production node server.js
# Look for "Mode: Production, Serving from: dist"
```

**Offline test:**
1. Turn off tablet WiFi/data
2. Enable hotspot only
3. Open localhost:3000
4. Should load without internet ✅

**WebSocket test:**
1. Open tablet browser
2. Open laptop controller
3. Press `1` on laptop → Tablet shows Idle animation

---

## 🔐 Security

- Change Valetudo password in `config.js`
- Use strong hotspot password
- Local network only (not exposed to internet)

---

## 📦 Dependencies

**Tablet:**
- Node.js 14+
- express, cors, ws
- @rive-app/canvas (bundled offline)

**Laptop:**
- Modern browser only (no dependencies)

---

## 🎨 Sound Files

Animations play synchronized audio from `public/sounds/`:
- Looping: Idle, Puppy Eyes, Staring, Happy, Panting, Bumping
- One-shot: Sighing, Barking, Woofing, Gaze sounds

---

## 💡 Tips

- Keep tablet plugged in (hotspot drains battery)
- Use Chrome on Android for best compatibility
- Tap top-right corner on tablet to view network info
- Laptop controller remembers last server address
- Press `i` to stop all sounds instantly

---

## 🆘 Getting Help

1. Check server logs in Termux
2. Check browser console (F12)
3. Verify all IPs in `config.js`
4. Test network: `ping` robot/Arduino from Termux
5. Ensure `dist/` folder exists and is up to date

---

## 📄 License

MIT