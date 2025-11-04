# Network Information Feature

## Overview
Added an invisible button in the top-right corner of the tablet face display that shows comprehensive network information when pressed.

## How to Use

1. **Tap the invisible button** in the top-right corner (60x60px area)
2. A fullscreen overlay will appear showing:
   - Tablet's hostname and IP address
   - Platform and uptime information
   - All network interfaces with their IPs and MAC addresses
   - Connected devices (if available)
   - Active WebSocket connections
   - Configured device addresses (Valetudo robot, Arduino servo)

3. **Close the overlay** by:
   - Clicking the "Close" button in the top-right
   - Tapping anywhere outside the info panel

## What Information is Displayed

### 📱 Tablet Information
- **Hostname**: Device name
- **IP Address**: Primary non-internal IPv4 address
- **Platform**: Operating system (e.g., android, linux, darwin)
- **Uptime**: How long the server has been running

### 🌐 Network Interfaces
Lists all network interfaces with:
- Interface name (e.g., wlan0, eth0, ap0)
- IP address
- IPv4/IPv6 designation
- MAC address
- Internal/External status

### 📡 Connected Devices
Shows devices connected to the tablet's hotspot (if detectable):
- IP address of each device
- MAC address (when available)
- Hostname (when available)

**Note**: On Android/Termux without root access, connected device detection is limited. The feature attempts to read the ARP table (`/proc/net/arp`) which may require elevated permissions.

### 🔌 WebSocket Connections
- Number of active WebSocket clients connected to the server
- Useful for verifying laptop controller connection

### ⚙️ Configured Devices
Shows the configured IP addresses from `config.js`:
- Valetudo Robot IP
- Arduino Servo IP

## Technical Implementation

### Frontend (`public/js/network-info.js`)
- Invisible 60x60px button in top-right corner
- Fullscreen dark overlay with formatted network information
- Fetches data from `/network-info` endpoint
- Formats uptime in human-readable format (days, hours, minutes, seconds)

### Backend (`server.js`)
- New `/network-info` endpoint
- Uses Node.js `os` module to gather system information
- Attempts to read ARP table for connected devices
- Returns JSON with comprehensive network data

### HTML (`public/index.html`)
- Added invisible button element
- Added overlay div for displaying information
- Styled inline for z-index control

## Permissions

### Standard (No Root)
- ✅ Tablet's own network information
- ✅ Interface details
- ✅ WebSocket client count
- ✅ Configured device addresses
- ⚠️ Limited connected device detection

### With Root Access (Android/Termux)
- ✅ Full ARP table access
- ✅ Complete connected device list with MAC addresses
- ✅ More accurate device detection

## Troubleshooting

### "Note: Connected device detection requires root access"
This message appears when the ARP table cannot be read. This is normal on non-rooted Android devices. The feature will still show all other network information.

### Empty Connected Devices List
If no devices are shown even though you have devices connected:
1. Ensure you're running on the hotspot device
2. Check if `/proc/net/arp` is accessible
3. Try using `arp -a` command manually in Termux
4. Root access may be required for full functionality

### IP Address Shows "Unknown"
If the primary IP shows as "Unknown":
- Check that WiFi hotspot is enabled
- Verify network interfaces are active
- The server should still function normally

## File Changes

### New Files
- `public/js/network-info.js` - Network info display logic

### Modified Files
- `public/index.html` - Added invisible button and overlay
- `public/main-entry.js` - Import network-info module
- `server.js` - Added `/network-info` endpoint

## Bundle Size Impact
- Before: 145.15 KB
- After: 149.24 KB
- Increase: ~4 KB (network info feature)

## Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 TABLET INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hostname:    android-tablet
IP Address:  192.168.43.1
Platform:    linux
Uptime:      2d 5h 32m 15s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 NETWORK INTERFACES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Interface:   wlan0
Type:        IPv4
IP Address:  192.168.43.1
MAC Address: aa:bb:cc:dd:ee:ff
Internal:    No

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 CONNECTED DEVICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Device #1
IP Address:  192.168.43.2
MAC Address: 11:22:33:44:55:66

Device #2
IP Address:  192.168.43.5
MAC Address: aa:11:bb:22:cc:33

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔌 ACTIVE WEBSOCKET CONNECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Connected Clients: 1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️  CONFIGURED DEVICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Valetudo Robot: 192.168.43.2
Arduino Servo:  192.168.43.5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Last Updated: 11/4/2025, 10:45:23 AM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Use Cases

1. **Network Debugging**: Quickly check if all devices are connected to hotspot
2. **IP Verification**: Confirm device IP addresses match config.js
3. **Connection Monitoring**: See how many WebSocket clients are connected
4. **System Status**: Check tablet uptime and network health
5. **Troubleshooting**: Identify network configuration issues

## Privacy & Security

- Network information is only accessible on the local network
- No external data transmission
- Information is fetched in real-time when button is pressed
- Overlay can be quickly closed if needed
