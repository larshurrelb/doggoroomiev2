# Testing Guide

## 🧪 Complete System Test

Follow these steps to verify everything is working correctly.

## Phase 1: Tablet Server Test

### 1.1 Server Starts Successfully
```bash
cd ~/tablet-server
npm start
```

**Expected Output:**
```
🤖 DoggoRoomie Server v2.0
===========================================
Server running on: http://0.0.0.0:3000
Valetudo: http://192.168.43.2
Arduino: http://192.168.43.5
WebSocket ready for connections
===========================================
```

✅ **Pass if:** Server starts without errors

### 1.2 Health Endpoint Test
```bash
# In a new Termux session
curl http://localhost:3000/health
```

**Expected Output:**
```json
{
  "status": "ok",
  "valetudo": "http://192.168.43.2",
  "arduino": "http://192.168.43.5"
}
```

✅ **Pass if:** JSON response received

### 1.3 Tablet Browser Test
1. Open browser on tablet
2. Navigate to `http://localhost:3000`
3. Check for:
   - Dog animation loads
   - Controls panel visible on left
   - Status indicators at top
   - Canvas displays Rive animation

✅ **Pass if:** All UI elements visible

## Phase 2: Tablet Interface Test

### 2.1 Animation Trigger Test
Press number keys `1-9`:
- Status display should update
- Animation should change
- "Current Trigger" text should update

✅ **Pass if:** Each key triggers corresponding animation

### 2.2 Movement Control Test
1. Press `Space` → Status should change to "Active"
2. Press `W` → Should send FORWARD command (check server logs)
3. Release `W` → Should send STOP command
4. Press `Space` again → Status returns to "Ready"

✅ **Pass if:** Status toggles and commands logged in terminal

### 2.3 Tail Control Test
1. Press `T` → Tail slow speed toggle
2. Press `Z` → Tail normal speed toggle  
3. Press `U` → Tail fast speed toggle

✅ **Pass if:** Commands sent (check server logs)

## Phase 3: Network Connectivity Test

### 3.1 Robot Connection Test
```bash
# From Termux
curl -I http://192.168.43.2
```

✅ **Pass if:** HTTP response received (even if 401 unauthorized)

### 3.2 Arduino Connection Test
```bash
# From Termux
curl http://192.168.43.5/
```

✅ **Pass if:** Response received from Arduino

### 3.3 Laptop Ping Test
```bash
# From laptop terminal
ping 192.168.43.1
```

✅ **Pass if:** Ping replies received

## Phase 4: Laptop Controller Test

### 4.1 Load Controller
1. Open `laptop-controller/index.html` in browser
2. UI should load with controls panel and connection form

✅ **Pass if:** Page loads without errors

### 4.2 Connection Test
1. Enter tablet IP: `192.168.43.1:3000`
2. Click "Connect"
3. Status dot should turn green
4. "Connected" text appears

✅ **Pass if:** Connection established

### 4.3 Remote Control Test
From laptop:
1. Press `Space` → Tablet status should change
2. Press `1` → Tablet animation should change
3. Press `W` → Movement command sent

✅ **Pass if:** Commands control tablet display

### 4.4 WebSocket Sync Test
1. Open tablet browser at `localhost:3000`
2. Open laptop controller connected to tablet
3. Press `2` on laptop
4. Tablet should show "Puppy Eyes" animation
5. Press `3` on tablet  
6. Both should sync

✅ **Pass if:** Both interfaces show same state

## Phase 5: Robot Integration Test

⚠️ **Requires robot to be connected and powered on**

### 5.1 Enable Control Test
1. Ensure robot is in safe location
2. Press `Space` to enable control
3. Check robot response

✅ **Pass if:** Robot enables manual control mode

### 5.2 Movement Test
1. Press `W` → Robot should move forward briefly
2. Release → Robot should stop
3. Press `S` → Robot should move backward
4. Press `A` → Robot should rotate counter-clockwise
5. Press `D` → Robot should rotate clockwise

✅ **Pass if:** Robot responds to all movement commands

### 5.3 Disable Control Test
1. Press `Space` to disable
2. Robot should exit manual control mode

✅ **Pass if:** Robot disables manual control

## Phase 6: Arduino Integration Test

⚠️ **Requires Arduino to be connected and powered on**

### 6.1 Tail Speed Test
1. Press `T` → Tail should move at slow speed
2. Press `T` again → Tail should stop
3. Press `Z` → Tail should move at normal speed
4. Press `Z` again → Tail should stop
5. Press `U` → Tail should move at fast speed
6. Press `U` again → Tail should stop

✅ **Pass if:** Tail responds to all speed commands

## Phase 7: WebSocket Persistence Test

### 7.1 Reconnection Test
1. Stop server (`Ctrl+C` in Termux)
2. Laptop controller should show "Disconnected"
3. Restart server (`npm start`)
4. Wait 5 seconds
5. Check if laptop reconnects automatically

⚠️ **Note:** Laptop won't auto-reconnect, must click "Connect" again

### 7.2 Multiple Client Test
1. Open tablet browser → Connect
2. Open laptop controller → Connect
3. Press `4` on tablet → Laptop should receive trigger
4. Press `5` on laptop → Tablet should receive trigger

✅ **Pass if:** Both clients send/receive triggers

## Phase 8: Stress Test

### 8.1 Rapid Command Test
Rapidly press various keys for 30 seconds:
- Movement keys (W, A, S, D)
- Animation keys (1-9)
- Tail controls (T, Z, U)

✅ **Pass if:** Server handles all commands without crashing

### 8.2 Long Session Test
1. Leave server running for 30 minutes
2. Periodically send commands
3. Check for memory leaks or disconnections

✅ **Pass if:** Server remains stable

## 🐛 Debug Checklist

If any test fails, check:

### Server Issues
- [ ] Node.js version (`node --version` >= 14)
- [ ] Dependencies installed (`npm install`)
- [ ] Port 3000 not in use (`netstat -tuln | grep 3000`)
- [ ] Correct IPs in `config.js`
- [ ] File permissions in Termux
- [ ] Tablet has storage access (`termux-setup-storage`)

### Network Issues
- [ ] All devices on same network
- [ ] Hotspot enabled and stable
- [ ] Firewall not blocking connections
- [ ] IP addresses are correct
- [ ] DNS resolution working

### UI Issues
- [ ] Browser console shows no errors (F12)
- [ ] JavaScript files loaded correctly
- [ ] Rive library loaded from CDN
- [ ] dog_animations.riv file exists in public/
- [ ] WebSocket connection established

### Robot Issues
- [ ] Robot powered on and connected
- [ ] Valetudo accessible at configured IP
- [ ] Credentials correct in config.js
- [ ] Robot in safe operating mode
- [ ] Battery level sufficient

### Arduino Issues
- [ ] Arduino powered on and connected
- [ ] Sketch uploaded and running
- [ ] WiFi credentials correct
- [ ] Arduino IP address correct
- [ ] Servo connected properly

## 📊 Test Results Template

```
=== DoggoRoomie v2.0 Test Results ===
Date: _______________
Tester: _______________

Phase 1: Tablet Server
[ ] 1.1 Server starts
[ ] 1.2 Health endpoint
[ ] 1.3 Browser loads UI

Phase 2: Tablet Interface  
[ ] 2.1 Animations trigger
[ ] 2.2 Movement controls
[ ] 2.3 Tail controls

Phase 3: Network
[ ] 3.1 Robot reachable
[ ] 3.2 Arduino reachable
[ ] 3.3 Laptop can ping

Phase 4: Laptop Controller
[ ] 4.1 UI loads
[ ] 4.2 Connects to tablet
[ ] 4.3 Remote control works
[ ] 4.4 WebSocket syncs

Phase 5: Robot Integration
[ ] 5.1 Enable control
[ ] 5.2 Movement commands
[ ] 5.3 Disable control

Phase 6: Arduino Integration
[ ] 6.1 Tail speed control

Phase 7: WebSocket
[ ] 7.1 Reconnection (manual)
[ ] 7.2 Multiple clients

Phase 8: Stress Test
[ ] 8.1 Rapid commands
[ ] 8.2 Long session

Overall Result: PASS / FAIL

Notes:
____________________________________
____________________________________
____________________________________
```

## 🎯 Success Criteria

All tests should pass for production readiness:
- ✅ Server stable for 30+ minutes
- ✅ All controls responsive
- ✅ WebSocket maintains connection
- ✅ Robot responds correctly
- ✅ Arduino responds correctly  
- ✅ Multiple clients work simultaneously
- ✅ No memory leaks or crashes
