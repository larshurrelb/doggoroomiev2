class RemoteController {
    constructor() {
        this.serverUrl = '';
        this.ws = null;
        this.isConnected = false;
        this.isControlActive = false;
        this.servoStates = {
            't': false,
            'z': false,
            'u': false
        };
        this.moveCommands = {
            'w': 'FORWARD',
            'arrowup': 'FORWARD',
            's': 'BACKWARD',
            'arrowdown': 'BACKWARD',
            'a': 'ROTATE_COUNTERCLOCKWISE',
            'arrowleft': 'ROTATE_COUNTERCLOCKWISE',
            'd': 'ROTATE_CLOCKWISE',
            'arrowright': 'ROTATE_CLOCKWISE',
            't': 'SERVO_SPEED1',
            'z': 'SERVO_SPEED2',
            'u': 'SERVO_SPEED3'
        };
        this.triggerMap = {
            '1': 'Idle',
            '2': 'PuppyEyes',
            '3': 'Staring',
            '4': 'Happy',
            '5': 'Panting',
            '6': 'Sighing',
            '7': 'Barking',
            '8': 'Woofing',
            '9': 'Bumping',
            'ß': 'Gaze to the right',
            '0': 'Gaze to the left',
            'i': 'StopAllSounds'
        };
    }

    initialize() {
        this.setupEventListeners();
        this.loadSavedServer();
    }

    loadSavedServer() {
        const saved = localStorage.getItem('serverAddress');
        if (saved) {
            document.getElementById('serverAddress').value = saved;
        }
    }

    setupEventListeners() {
        const connectBtn = document.getElementById('connectBtn');
        const serverInput = document.getElementById('serverAddress');

        connectBtn.addEventListener('click', () => {
            const address = serverInput.value.trim();
            if (address) {
                this.connect(address);
            }
        });

        serverInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const address = serverInput.value.trim();
                if (address) {
                    this.connect(address);
                }
            }
        });

        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    connect(address) {
        // Save server address
        localStorage.setItem('serverAddress', address);
        
        // Close existing connection
        if (this.ws) {
            this.ws.close();
        }

        // Construct URLs
        const httpUrl = address.startsWith('http') ? address : `http://${address}`;
        const wsUrl = httpUrl.replace('http://', 'ws://').replace('https://', 'wss://');
        
        this.serverUrl = httpUrl;

        // Connect WebSocket
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('Connected to tablet server');
            this.isConnected = true;
            this.updateConnectionStatus(true);
        };

        this.ws.onmessage = (event) => {
            console.log('Received from tablet:', event.data);
            // Could display remote triggers here
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.updateConnectionStatus(false);
        };

        this.ws.onclose = () => {
            console.log('Disconnected from tablet');
            this.isConnected = false;
            this.updateConnectionStatus(false);
        };
    }

    updateConnectionStatus(connected) {
        const statusDot = document.getElementById('connection-status');
        const statusText = document.getElementById('connection-text');
        
        if (connected) {
            statusDot.classList.add('connected');
            statusText.textContent = 'Connected';
        } else {
            statusDot.classList.remove('connected');
            statusText.textContent = 'Disconnected';
        }
    }

    async sendCommand(command) {
        if (!this.isConnected) {
            console.warn('Not connected to server');
            return;
        }

        try {
            const response = await fetch(`${this.serverUrl}/control`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ command })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            console.log(`Command ${command} sent successfully`);
        } catch (error) {
            console.error('Error sending command:', error);
        }
    }

    sendTrigger(key) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            // Send the sound command based on the key
            let soundCommand = key;
            switch(key) {
                case '1': soundCommand = 'play-idle-sound'; break;
                case '2': soundCommand = 'play-puppyeyes-sound'; break;
                case '3': soundCommand = 'play-intensestare-sound'; break;
                case '4': soundCommand = 'play-happy-sound'; break;
                case '5': soundCommand = 'play-panting-sound'; break;
                case '6': soundCommand = 'play-sigh-sound'; break;
                case '7': soundCommand = 'play-barking-sound'; break;
                case '8': soundCommand = 'play-woofing-sound'; break;
                case '9': soundCommand = 'play-bumping-sound'; break;
                case '0': soundCommand = 'play-gazetotheright-sound'; break;
                case 'ß': soundCommand = 'play-gazetotheleft-sound'; break;
                case 'i': soundCommand = 'stop-all-audio'; break;
            }
            
            this.ws.send(soundCommand);
            console.log(`Sent trigger: ${soundCommand}`);
            
            const triggerName = this.triggerMap[key];
            if (triggerName) {
                document.getElementById('triggerStatus').textContent = `Current Trigger: ${triggerName}`;
            }
        }
    }

    async handleKeyDown(event) {
        const key = event.key.toLowerCase();
        const keyDisplay = document.getElementById('keyPressed');

        // Toggle control
        if (key === ' ') {
            event.preventDefault();
            this.isControlActive = !this.isControlActive;
            const statusElement = document.getElementById('status');
            statusElement.textContent = `Status: ${this.isControlActive ? 'Active' : 'Ready'}`;
            statusElement.className = this.isControlActive ? 'active' : 'inactive';
            await this.sendCommand(this.isControlActive ? 'ENABLE' : 'DISABLE');
            return;
        }

        // Face triggers
        if ((key >= '1' && key <= '9') || key === 'i' || key === '0' || key === 'ß') {
            const triggerName = this.triggerMap[key];
            console.log(`Key ${key} pressed, triggering: ${triggerName}`);
            this.sendTrigger(key);
            keyDisplay.textContent = `Key: ${key} (${triggerName})`;
            keyDisplay.classList.add('active');
            return;
        }

        // Servo controls
        if (['t', 'z', 'u'].includes(key)) {
            this.servoStates[key] = !this.servoStates[key];
            await this.sendCommand(this.servoStates[key] ? this.moveCommands[key] : 'SERVO_STOP');
            keyDisplay.textContent = `Tail: ${this.servoStates[key] ? this.moveCommands[key] : 'STOPPED'}`;
            keyDisplay.classList.add('active');
            return;
        }

        // Movement controls
        if (this.isControlActive && this.moveCommands[key]) {
            await this.sendCommand(this.moveCommands[key]);
            keyDisplay.textContent = `Moving: ${this.moveCommands[key]}`;
            keyDisplay.classList.add('active');
        }
    }

    async handleKeyUp(event) {
        const key = event.key.toLowerCase();
        const keyDisplay = document.getElementById('keyPressed');

        // Clear face trigger display
        if ((key >= '1' && key <= '9') || key === 'i' || key === '0' || key === 'ß') {
            keyDisplay.textContent = 'No key pressed';
            keyDisplay.classList.remove('active');
            return;
        }

        // Stop movement (but not servo)
        if (this.isControlActive && this.moveCommands[key] && !['t', 'z', 'u'].includes(key)) {
            await this.sendCommand('STOP');
            keyDisplay.textContent = 'No key pressed';
            keyDisplay.classList.remove('active');
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const controller = new RemoteController();
    controller.initialize();
    window.remoteController = controller;
});
