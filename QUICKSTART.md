# Quick Start Guide

## 🚀 Fast Setup

### On Tablet (Termux)
```bash
# 1. Install Termux from F-Droid

# 2. In Termux:
pkg update && pkg upgrade
pkg install nodejs
termux-setup-storage

# 3. Copy files to tablet and navigate
cd /sdcard/tablet-server

# 4. Install dependencies
npm install

# 5. Copy the Rive animation
cp /sdcard/Download/dog_animations.riv public/dog_animations.riv

# 6. Enable hotspot on tablet (Settings → Hotspot)

# 7. Update config.js with correct IPs

# 8. Start server
npm start

# 9. Open http://localhost:3000 in tablet browser
```

### On Laptop
```bash
# 1. Connect to tablet's hotspot

# 2. Open laptop-controller/index.html in browser

# 3. Enter tablet IP (usually 192.168.43.1:3000)

# 4. Click Connect

# 5. Start controlling!
```

## ✅ Checklist

### Tablet Setup
- [ ] Termux installed from F-Droid
- [ ] Node.js installed in Termux
- [ ] Project files transferred to tablet
- [ ] dog_animations.riv copied to public/
- [ ] npm install completed
- [ ] config.js updated with correct IPs
- [ ] Hotspot enabled
- [ ] Robot connected to hotspot
- [ ] Arduino connected to hotspot
- [ ] Server running (npm start)
- [ ] Browser showing animation at localhost:3000

### Laptop Setup
- [ ] Connected to tablet hotspot
- [ ] laptop-controller opened in browser
- [ ] Connected to tablet server
- [ ] Controls working

### Device Network
- [ ] Tablet hotspot: `192.168.43.1` (or similar)
- [ ] Robot IP configured in config.js
- [ ] Arduino IP configured in config.js
- [ ] All devices on same network

## 🔧 Common Issues

**Server won't start:** Check Node.js version with `node --version`

**Can't connect from laptop:** Verify tablet IP with `ifconfig` in Termux

**Animations not showing:** Make sure dog_animations.riv is in public/ folder

**Robot not responding:** Check IP addresses in config.js and test with `curl http://ROBOT_IP`
