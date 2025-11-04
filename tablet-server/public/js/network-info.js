// Network information display functionality

const networkInfoButton = document.getElementById('networkInfoButton');
const networkInfoOverlay = document.getElementById('networkInfoOverlay');
const closeNetworkInfo = document.getElementById('closeNetworkInfo');
const networkInfoContent = document.getElementById('networkInfoContent');

// Show network info when invisible button is clicked
networkInfoButton.addEventListener('click', async () => {
    networkInfoOverlay.style.display = 'block';
    await loadNetworkInfo();
});

// Close network info overlay
closeNetworkInfo.addEventListener('click', () => {
    networkInfoOverlay.style.display = 'none';
});

// Close on overlay click (outside content area)
networkInfoOverlay.addEventListener('click', (e) => {
    if (e.target === networkInfoOverlay) {
        networkInfoOverlay.style.display = 'none';
    }
});

// Load network information from server
async function loadNetworkInfo() {
    try {
        networkInfoContent.textContent = 'Loading network information...';
        
        const response = await fetch('/network-info');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format the network information nicely
        let output = '';
        
        // Tablet's own information
        output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        output += '📱 TABLET INFORMATION\n';
        output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        output += `Hostname:    ${data.tablet.hostname}\n`;
        output += `IP Address:  ${data.tablet.ip}\n`;
        output += `Platform:    ${data.tablet.platform}\n`;
        output += `Uptime:      ${formatUptime(data.tablet.uptime)}\n`;
        output += '\n';
        
        // Network interfaces
        if (data.tablet.interfaces && data.tablet.interfaces.length > 0) {
            output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            output += '🌐 NETWORK INTERFACES\n';
            output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            data.tablet.interfaces.forEach(iface => {
                output += `\nInterface:   ${iface.name}\n`;
                output += `Type:        ${iface.family}\n`;
                output += `IP Address:  ${iface.address}\n`;
                output += `MAC Address: ${iface.mac}\n`;
                output += `Internal:    ${iface.internal ? 'Yes' : 'No'}\n`;
            });
            output += '\n';
        }
        
        // Connected devices (if available)
        if (data.connectedDevices && data.connectedDevices.length > 0) {
            output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            output += '📡 CONNECTED DEVICES\n';
            output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            data.connectedDevices.forEach((device, index) => {
                output += `\nDevice #${index + 1}\n`;
                output += `IP Address:  ${device.ip}\n`;
                if (device.hostname) {
                    output += `Hostname:    ${device.hostname}\n`;
                }
                if (device.mac) {
                    output += `MAC Address: ${device.mac}\n`;
                }
            });
            output += '\n';
        } else {
            output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            output += '📡 CONNECTED DEVICES\n';
            output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            output += '\nNote: Connected device detection requires root access\n';
            output += 'on Android/Termux. Only basic network info is available.\n\n';
        }
        
        // WebSocket connections
        if (data.websocketClients !== undefined) {
            output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            output += '🔌 ACTIVE WEBSOCKET CONNECTIONS\n';
            output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            output += `Connected Clients: ${data.websocketClients}\n\n`;
        }
        
        // Configuration (from config.js)
        if (data.config) {
            output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            output += '⚙️  CONFIGURED DEVICES\n';
            output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            if (data.config.valetudoHost) {
                output += `Valetudo Robot: ${data.config.valetudoHost}\n`;
            }
            if (data.config.arduinoHost) {
                output += `Arduino Servo:  ${data.config.arduinoHost}\n`;
            }
            output += '\n';
        }
        
        output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        output += `Last Updated: ${new Date().toLocaleString()}\n`;
        output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        
        networkInfoContent.textContent = output;
    } catch (error) {
        console.error('Error loading network info:', error);
        networkInfoContent.textContent = `Error loading network information:\n${error.message}\n\nPlease check the server logs for details.`;
    }
}

// Format uptime in human-readable format
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    let parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    
    return parts.join(' ');
}
