# 🤖 DoggoRoomie v2.0

A refactored robot control system where an Android tablet acts as the central hotspot server, controlling a Valetudo-enabled vacuum robot and Arduino-powered tail servo, while displaying animated dog faces using Rive animations.

## 📁 Project Structure

```
doggoroomiev2/
├── tablet-server/              # Node.js server running on Android tablet via Termux
│   ├── server.js              # Express server with WebSocket support
│   ├── config.js              # Configuration (IP addresses, credentials)
│   ├── package.json           # Node.js dependencies
│   ├── COPY_FILES.md          # Instructions for copying binary files
│   └── public/                # Static files served by tablet
│       ├── index.html         # Main UI for tablet display
│       ├── style.css          # Tablet UI styles
│       ├── dog_animations.riv # Rive animation file (copy manually)
│       └── js/
│           ├── rive.js        # Rive animation initialization
│           ├── control.js     # Robot movement controls
│           └── facetrigger.js # Face animation triggers
│
├── laptop-controller/         # Remote controller webapp for laptop
│   ├── index.html            # Remote control interface
│   ├── style.css             # Remote controller styles
│   └── app.js                # Remote control logic
│
└── dog_animations.riv         # Original Rive animation file
```

## 🌐 Network Architecture

**Old Setup:** Router → Laptop, Robot, Arduino, Tablet
**New Setup:** Tablet Hotspot → Laptop, Robot, Arduino

The tablet now runs a hotspot and serves as the central server, with all devices connecting to it.

## 🔧 Setup Instructions

### Part 1: Tablet Setup (Termux & Node.js)

#### 1. Install Termux on Android Tablet
- Download Termux from F-Droid (recommended) or GitHub releases
- Do NOT use the Google Play version (it's outdated)

#### 2. Setup Termux Environment
```bash
# Update packages
pkg update && pkg upgrade

# Install Node.js
pkg install nodejs

# Install git (optional, for cloning)
pkg install git

# Allow storage access
termux-setup-storage
```

#### 3. Transfer Project Files to Tablet
**IMPORTANT:** You must build the project on your Mac/PC FIRST, then transfer to tablet!

```bash
# ON YOUR MAC/PC: Build the production bundle first
cd tablet-server
npm install
npm run build    # This creates the dist/ folder needed for offline use
```

Option A - Using USB cable:
- Connect tablet to computer
- Copy the **entire** `tablet-server` folder to tablet storage (including `dist/` folder!)
- In Termux: `cd /sdcard/tablet-server`

Option B - Using git:
```bash
cd ~
git clone [your-repo-url]
cd doggoroomiev2/tablet-server
# Build must be done on Mac before pushing to git, OR run npm run build here (needs internet)
```

**⚠️ CRITICAL:** The `dist/` folder contains the bundled Rive library for offline use. Without it, the tablet will need internet to load animations!

#### 4. Copy Binary Files
```bash
# Copy the Rive animation file
cp /sdcard/Download/dog_animations.riv public/dog_animations.riv

# If you have audio files:
mkdir -p public/audio
cp /sdcard/Download/1.wav public/audio/1.wav
```

#### 5. Install Dependencies
```bash
cd ~/tablet-server  # or wherever you placed the files
npm install

# NOTE: Do NOT run "npm run build" on the tablet - it should already have
# the dist/ folder from when you built it on your Mac/PC
```

#### 6. Build for Offline Use
**⚠️ SKIP THIS STEP ON TABLET** - You should have already built on your Mac/PC!

The `dist/` folder should already exist from when you built the project before transferring.

If for some reason you need to rebuild (and have internet on tablet):
```bash
# Only if absolutely necessary (requires internet)
npm run build
```

**Note:** The app works completely offline by bundling the `@rive-app/canvas` package. The build MUST be done on Mac/PC before transferring to tablet. See `OFFLINE_SETUP.md` for details.

#### 7. Configure Network Settings
Edit `config.js` to match your hotspot network:
```javascript
export const CONFIG = {
    // Update these IPs based on your hotspot network
    VALETUDO_HOST: "192.168.43.2",  // Robot's IP on hotspot
    ARDUINO_HOST: "192.168.43.5",   // Arduino's IP on hotspot
    SERVER_PORT: 3000,
    // ... credentials
};
```

#### 7. Enable Tablet Hotspot
- Go to Settings → Network & Internet → Hotspot & Tethering
- Enable Wi-Fi Hotspot
- Note the network name and password
- The tablet's IP is typically `192.168.43.1` or `192.168.4x.1`

#### 8. Connect Robot and Arduino to Hotspot
- Configure Valetudo robot to connect to tablet's hotspot
- Configure Arduino's WiFi to connect to tablet's hotspot
- Note their assigned IP addresses (update `config.js` if needed)

#### 9. Start the Server
```bash
cd ~/tablet-server

# Production mode (serves bundled files from dist/)
NODE_ENV=production npm start

# OR development mode (serves from public/)
npm start
```

You should see:
```
🤖 DoggoRoomie Server v2.0
Mode: Production
Serving from: dist
Server running on: http://0.0.0.0:3000
Valetudo: http://192.168.43.2
Arduino: http://192.168.43.5
WebSocket ready for connections
```

#### 10. Access Tablet UI
- Open browser on tablet (Chrome recommended for best compatibility)
- Navigate to `http://localhost:3000`
- You should see a "Tap to Start" button
- **Tap the button** to initialize audio and enter fullscreen
- The dog animation will display in fullscreen
- Screen will stay on automatically (Wake Lock API)
- Touch anywhere to trigger fullscreen if needed

### Part 2: Laptop Remote Controller Setup

#### 1. Connect Laptop to Tablet Hotspot
- Connect your laptop to the tablet's WiFi hotspot

#### 2. Open Remote Controller
- Navigate to the `laptop-controller` folder
- Open `index.html` in your web browser
- Or use a simple HTTP server:
  ```bash
  # Using Python
  python3 -m http.server 8080
  
  # Using Node.js
  npx serve
  ```

#### 3. Connect to Tablet Server
- In the remote controller, enter the tablet's IP: `192.168.43.1:3000`
- Click "Connect"
- Status should change to "Connected"

#### 4. Start Controlling
- Use keyboard controls to operate the robot and animations
- Animations display on the tablet, controls work from laptop

## 🎮 Controls

### Robot Movement
- **Space** - Toggle control mode (Enable/Disable)
- **W** or **↑** - Move forward
- **S** or **↓** - Move backward
- **A** or **←** - Rotate left
- **D** or **→** - Rotate right

### Tail Controls
- **T** - Slow speed (toggle)
- **Z** - Normal speed (toggle)
- **U** - Fast speed (toggle)

### Face Animations
- **1** - Idle
- **2** - Puppy eyes
- **3** - Staring
- **4** - Happy
- **5** - Panting
- **6** - Sighing
- **7** - Barking
- **8** - Woofing
- **9** - Bumping
- **0** - Gaze right
- **ß** - Gaze left
- **i** - Stop all sounds

**Note:** Face animations display on the tablet in fullscreen with synchronized sounds.

## 🔍 Troubleshooting

### Termux Issues
- If npm install fails, try: `pkg reinstall nodejs`
- For permission errors: `termux-setup-storage` and allow storage access
- Wake lock to prevent sleep: Install Termux:Boot or use `termux-wake-lock`

### Connection Issues
- Verify all devices are on the same hotspot
- Check firewall settings on tablet
- Confirm IP addresses in `config.js`
- Test connectivity: `ping 192.168.43.2` from Termux

### Server Won't Start
- Check if port 3000 is available: `netstat -tuln | grep 3000`
- Try a different port in `config.js`
- Check Node.js version: `node --version` (should be v14+)

### WebSocket Issues
- Make sure to use `ws://` not `wss://` for local connections
- Check browser console for errors
- Verify WebSocket isn't blocked by browser

## 🚀 Auto-Start on Boot (Optional)

To make the server start automatically when Termux opens:

1. Create a startup script:
```bash
echo "cd ~/tablet-server && npm start" > ~/.bashrc
```

2. Or use Termux:Boot widget:
   - Install Termux:Boot from F-Droid
   - Create `~/.termux/boot/start-server.sh`:
   ```bash
   #!/data/data/com.termux/files/usr/bin/sh
   cd ~/tablet-server
   npm start
   ```
   - Make it executable: `chmod +x ~/.termux/boot/start-server.sh`

## 📝 API Endpoints

### POST `/control`
Send robot and servo commands
```json
{
  "command": "FORWARD" | "BACKWARD" | "ROTATE_CLOCKWISE" | "ROTATE_COUNTERCLOCKWISE" | "STOP" | "ENABLE" | "DISABLE" | "SERVO_SPEED1" | "SERVO_SPEED2" | "SERVO_SPEED3" | "SERVO_STOP"
}
```

### WebSocket `/`
- Bidirectional communication for face animation triggers
- Send/receive animation trigger keys (1-9, 0, ß, i)

### GET `/health`
Health check endpoint

## 🔐 Security Notes

- Change default Valetudo credentials in `config.js`
- The hotspot should have a strong password
- Consider using HTTPS/WSS for production (requires certificates)

## 📦 Dependencies

### Tablet Server
- express: ^4.18.2
- cors: ^2.8.5
- ws: ^8.14.2
- @rive-app/canvas: ^2.32.0 (bundled for offline use)
- vite: ^7.1.12 (dev dependency for bundling)

### Laptop Controller
- Vanilla JavaScript (no dependencies)
- Works in any modern browser

## 📖 Additional Documentation

- **OFFLINE_SETUP.md** - Detailed guide on the offline Rive bundling setup
- **COPY_FILES.md** - Instructions for copying binary files

## 🎨 Original Project

This is a refactored version of the original Deno-based controller. Key changes:
- Switched from Deno to Node.js for Termux compatibility
- Tablet as hotspot server instead of router-based setup
- Separate laptop remote controller webapp
- Same functionality and UI as original

## 📄 License

MIT