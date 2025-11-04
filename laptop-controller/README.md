# DoggoRoomie Laptop Controller

This is the remote control interface for operating the robot from your laptop.

## 🚀 Quick Start

### Method 1: Direct File Open (Easiest)
1. Simply open `index.html` in your browser
2. Enter tablet IP address (e.g., `192.168.43.1:3000`)
3. Click Connect

### Method 2: Using Python
```bash
cd laptop-controller
python3 -m http.server 8080
# Open http://localhost:8080 in browser
```

### Method 3: Using Node.js
```bash
cd laptop-controller
npx serve -p 8080
# Open http://localhost:8080 in browser
```

### Method 4: Using PHP
```bash
cd laptop-controller
php -S localhost:8080
# Open http://localhost:8080 in browser
```

## 📋 Prerequisites
- Connect your laptop to the tablet's WiFi hotspot
- Tablet server must be running
- Know the tablet's IP address (usually `192.168.43.1`)

## 🎮 Features
- Full robot control (movement, tail speed)
- Face animation triggers
- Real-time WebSocket connection
- Visual connection status
- Same controls as tablet interface

## 🔧 Configuration
No configuration needed! Just enter the tablet's IP address when you open the app.

The app will remember your last server address.

## 💡 Tips
- The status dot turns green when connected
- All animations display on the tablet, not the laptop
- Keyboard controls work the same as on the tablet
- If connection drops, it will not auto-reconnect (click Connect again)

## 🐛 Troubleshooting

**Can't connect:**
- Verify laptop is on tablet's hotspot
- Check tablet server is running (`npm start`)
- Try pinging tablet: `ping 192.168.43.1`
- Check firewall settings

**Controls not working:**
- Make sure connection status shows "Connected"
- Check browser console for errors (F12)
- Verify tablet server logs show your connection

**Wrong server address:**
- Clear browser local storage
- Or manually edit in browser: `localStorage.removeItem('serverAddress')`
