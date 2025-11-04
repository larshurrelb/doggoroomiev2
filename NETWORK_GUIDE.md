# Network Configuration Guide

## 🌐 Network Overview

```
Tablet Hotspot (192.168.43.1)
    ├── Laptop (192.168.43.x)
    ├── Valetudo Robot (192.168.43.2) - Configure in config.js
    └── Arduino (192.168.43.5) - Configure in config.js
```

## 📱 Tablet Hotspot Setup

### Android Settings
1. Go to **Settings** → **Network & Internet**
2. Select **Hotspot & Tethering**
3. Tap **Wi-Fi hotspot**
4. Configure:
   - **Network name:** DoggoRoomie (or your choice)
   - **Security:** WPA2-PSK (recommended)
   - **Password:** Strong password
   - **AP Band:** 2.4 GHz (better compatibility)

5. Enable hotspot
6. Note the tablet's IP (usually `192.168.43.1` or check in Termux)

### Find Tablet IP in Termux
```bash
# Install net-tools if needed
pkg install net-tools

# Check IP address
ifconfig wlan0

# Look for inet addr (e.g., 192.168.43.1)
```

## 🤖 Robot (Valetudo) Configuration

### Connect Robot to Hotspot
1. Access Valetudo web interface (while on original network)
2. Go to **Settings** → **Connectivity** → **Wi-Fi**
3. Add new network:
   - SSID: Your tablet hotspot name
   - Password: Your hotspot password
   - Save

4. Robot will connect to tablet hotspot
5. Find robot's new IP:
   ```bash
   # On tablet in Termux
   pkg install nmap
   nmap -sn 192.168.43.0/24
   ```

6. Update `config.js`:
   ```javascript
   VALETUDO_HOST: "192.168.43.2"  // Use actual IP found
   ```

## 🔧 Arduino Configuration

### Update Arduino WiFi Credentials
In your Arduino code, update WiFi settings:
```cpp
const char* ssid = "DoggoRoomie";        // Tablet hotspot name
const char* password = "your_password";   // Tablet hotspot password
```

### Find Arduino IP
After Arduino connects to hotspot:
```bash
# On tablet in Termux
nmap -sn 192.168.43.0/24
# Look for Arduino MAC address or test IPs
```

Update `config.js`:
```javascript
ARDUINO_HOST: "192.168.43.5"  // Use actual IP found
```

## 💻 Laptop Connection
Simply connect to tablet's WiFi hotspot using:
- SSID: Your hotspot name
- Password: Your hotspot password

## 🔍 Verifying Connections

### From Tablet (Termux)
```bash
# Check tablet IP
ifconfig wlan0

# Scan network for all devices
pkg install nmap
nmap -sn 192.168.43.0/24

# Test robot connection
curl http://192.168.43.2

# Test Arduino connection
curl http://192.168.43.5
```

### From Laptop
```bash
# Ping tablet
ping 192.168.43.1

# Test server
curl http://192.168.43.1:3000/health

# Open WebSocket connection (browser console)
ws = new WebSocket('ws://192.168.43.1:3000')
```

## 🎯 Static IP Assignment (Recommended)

### On Router/Hotspot (if supported)
Some Android devices allow MAC-based IP reservation in hotspot settings.

### On Robot
Configure static IP in Valetudo:
1. Go to **Connectivity** → **Wi-Fi Settings**
2. Set static IP: `192.168.43.2`
3. Gateway: `192.168.43.1` (tablet)
4. DNS: `8.8.8.8`

### On Arduino
```cpp
// In setup()
IPAddress local_IP(192, 168, 43, 5);
IPAddress gateway(192, 168, 43, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(8, 8, 8, 8);

if (!WiFi.config(local_IP, gateway, subnet, primaryDNS)) {
  Serial.println("STA Failed to configure");
}
```

## 🚨 Troubleshooting

### Devices Not Connecting
- Check hotspot password
- Ensure 2.4GHz band is enabled (not 5GHz only)
- Check maximum device limit in hotspot settings
- Restart hotspot

### IP Address Conflicts
- Use `nmap` to scan and verify IPs
- Assign static IPs outside DHCP range
- Typical DHCP range: 192.168.43.2 - 192.168.43.254

### Connection Drops
- Keep tablet charging (hotspot drains battery)
- Use Termux wake lock: `termux-wake-lock`
- Disable battery optimization for Termux
- Keep screen on or use stay-awake developer option

## 📊 Port Usage

| Service | Port | Protocol |
|---------|------|----------|
| Tablet Web Server | 3000 | HTTP |
| WebSocket | 3000 | WS |
| Valetudo | 80 | HTTP |
| Arduino | 80 | HTTP |

## 🔐 Security Tips

1. **Use strong hotspot password** (16+ characters)
2. **Change Valetudo default credentials** in config.js
3. **Hide SSID** if hotspot settings allow
4. **Limit connected devices** in hotspot settings
5. **Disable hotspot** when not in use

## 📱 Alternative: USB Tethering

If WiFi hotspot has issues, use USB tethering:
1. Connect tablet to laptop via USB
2. Enable USB tethering in tablet settings
3. Laptop will get IP in tablet's network
4. Robot and Arduino still on WiFi hotspot
5. Proceed as normal

## 🌍 Internet Sharing (Optional)

To give robot internet access through tablet:
1. Ensure tablet has mobile data connection
2. Enable hotspot
3. Devices will route through tablet's data connection
4. Useful for Valetudo updates or Arduino OTA
