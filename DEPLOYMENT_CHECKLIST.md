# 📋 Deployment Checklist

Use this checklist when setting up the DoggoRoomie v2.0 system.

## 🛠️ Pre-Deployment

### Hardware
- [ ] Android tablet (charged)
- [ ] Valetudo robot (charged)
- [ ] Arduino with servo (powered)
- [ ] Laptop
- [ ] All devices functional

### Software Preparation
- [ ] Termux installed on tablet (from F-Droid)
- [ ] Project files ready to transfer
- [ ] dog_animations.riv file available
- [ ] Sound files available (optional)

## 📱 Tablet Setup (30-45 minutes)

### Termux Installation
- [ ] Downloaded Termux from F-Droid
- [ ] Installed and opened Termux
- [ ] Granted storage permissions

### Termux Configuration
- [ ] Run `pkg update && pkg upgrade`
- [ ] Run `pkg install nodejs`
- [ ] Run `termux-setup-storage`
- [ ] Verify Node.js: `node --version`

### File Transfer
- [ ] Created `/sdcard/tablet-server` directory
- [ ] Copied all tablet-server files
- [ ] Verified dog_animations.riv in public/
- [ ] Checked sound files in public/sounds/

### Dependencies
- [ ] Run `cd /sdcard/tablet-server`
- [ ] Run `npm install`
- [ ] Wait for installation to complete
- [ ] No errors reported

### Configuration
- [ ] Opened config.js in editor
- [ ] Updated VALETUDO_HOST IP
- [ ] Updated ARDUINO_HOST IP
- [ ] Saved changes

### Hotspot Setup
- [ ] Enabled WiFi hotspot on tablet
- [ ] Set strong password
- [ ] Set to 2.4GHz band
- [ ] Noted hotspot SSID
- [ ] Noted tablet IP (usually 192.168.43.1)

## 🤖 Robot Configuration (10-15 minutes)

### Network Setup
- [ ] Connected to original network
- [ ] Accessed Valetudo web interface
- [ ] Added tablet hotspot credentials
- [ ] Saved WiFi settings
- [ ] Robot connected to tablet hotspot

### IP Configuration
- [ ] Found robot's new IP address
- [ ] Updated config.js with robot IP
- [ ] Tested connection: `curl http://[robot-ip]`
- [ ] Verified manual control enabled

## 🔧 Arduino Configuration (10-15 minutes)

### Code Update
- [ ] Opened Arduino sketch
- [ ] Updated WiFi SSID to tablet hotspot
- [ ] Updated WiFi password
- [ ] Set static IP (optional but recommended)
- [ ] Uploaded sketch to Arduino

### Verification
- [ ] Arduino connected to tablet hotspot
- [ ] Found Arduino IP address
- [ ] Updated config.js with Arduino IP
- [ ] Tested: `curl http://[arduino-ip]`

## 🚀 First Launch (5-10 minutes)

### Start Server
- [ ] In Termux: `cd /sdcard/tablet-server`
- [ ] Run `npm start`
- [ ] Server starts without errors
- [ ] See startup banner with correct IPs

### Tablet Browser Test
- [ ] Opened browser on tablet
- [ ] Navigated to `http://localhost:3000`
- [ ] Page loads successfully
- [ ] Animation displays
- [ ] Controls panel visible
- [ ] Status indicators present

### Functionality Test
- [ ] Pressed Space → Status changes
- [ ] Pressed 1 → Animation changes
- [ ] Checked server logs for commands
- [ ] All indicators working

## 💻 Laptop Setup (5 minutes)

### Connection
- [ ] Laptop connected to tablet hotspot
- [ ] Can ping tablet: `ping 192.168.43.1`
- [ ] Opened laptop-controller/index.html
- [ ] UI loads correctly

### Remote Control Test
- [ ] Entered tablet IP: `192.168.43.1:3000`
- [ ] Clicked Connect
- [ ] Status shows "Connected"
- [ ] Green dot appears

### Control Verification
- [ ] Pressed Space → Tablet status changes
- [ ] Pressed 1-9 → Tablet animations change
- [ ] Pressed W → Command sent
- [ ] WebSocket sync working

## ✅ Integration Testing (15-20 minutes)

### Robot Integration
- [ ] Space to enable control
- [ ] W → Robot moves forward
- [ ] S → Robot moves backward
- [ ] A → Robot rotates left
- [ ] D → Robot rotates right
- [ ] Release → Robot stops
- [ ] Space to disable control

### Arduino Integration
- [ ] T → Tail slow speed
- [ ] T again → Tail stops
- [ ] Z → Tail normal speed
- [ ] Z again → Tail stops
- [ ] U → Tail fast speed
- [ ] U again → Tail stops

### Animation Testing
- [ ] Test each number key (1-9)
- [ ] Test gaze keys (0, ß)
- [ ] Verify sounds play (if configured)
- [ ] Check animation smoothness

### Multi-Client Testing
- [ ] Tablet UI open
- [ ] Laptop controller connected
- [ ] Command from tablet → Logs show it
- [ ] Command from laptop → Tablet responds
- [ ] Both interfaces sync

## 🎯 Production Readiness (Optional)

### Performance
- [ ] Server runs stable for 30+ minutes
- [ ] No memory leaks observed
- [ ] Response time acceptable
- [ ] Battery consumption acceptable

### Auto-Start (Optional)
- [ ] Created startup script
- [ ] Tested auto-start
- [ ] Verified functionality after reboot

### Documentation
- [ ] Documented custom IP addresses
- [ ] Noted any special configuration
- [ ] Created backup of config.js
- [ ] Saved hotspot credentials

### Backup
- [ ] Exported tablet-server folder
- [ ] Backed up Arduino sketch
- [ ] Saved configuration notes

## 🔍 Final Verification

### All Systems Go
- [ ] Tablet server running smoothly
- [ ] Robot responding to commands
- [ ] Arduino servo functioning
- [ ] Laptop can control remotely
- [ ] Animations displaying correctly
- [ ] WebSocket sync working
- [ ] No errors in logs
- [ ] All features tested

## 📝 Sign-Off

**Date:** _______________  
**Deployed by:** _______________  
**Tablet IP:** _______________  
**Robot IP:** _______________  
**Arduino IP:** _______________  
**Hotspot SSID:** _______________  

**Status:** ☐ Ready for Use  ☐ Issues Found (see notes)

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________

## 🆘 If Something Goes Wrong

Refer to:
1. **QUICKSTART.md** - Fast setup guide
2. **README.md** - Complete documentation
3. **TESTING.md** - Detailed testing procedures
4. **NETWORK_GUIDE.md** - Network troubleshooting
5. **Server logs** - Check Termux output for errors

## 🎉 Success!

If all checkboxes are marked, your DoggoRoomie v2.0 is fully deployed and ready to use!

**Next Steps:**
- Enjoy controlling your robot!
- Create custom animations in Rive
- Extend functionality as needed
- Share your experience

---

**Keep this checklist for future redeployments or troubleshooting.**
