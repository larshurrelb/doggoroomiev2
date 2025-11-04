import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { CONFIG } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = CONFIG.SERVER_PORT;
const VALETUDO_HOST = `http://${CONFIG.VALETUDO_HOST}`;
const ARDUINO_HOST = `http://${CONFIG.ARDUINO_HOST}`;

// Basic auth header
const basicAuth = `Basic ${Buffer.from(`${CONFIG.AUTH_USERNAME}:${CONFIG.AUTH_PASSWORD}`).toString('base64')}`;

// Store WebSocket clients
const wsClients = new Set();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket');
    wsClients.add(ws);

    ws.on('message', (message) => {
        const data = message.toString();
        console.log('Received trigger:', data);
        
        // Broadcast to all other clients
        wsClients.forEach((client) => {
            if (client !== ws && client.readyState === 1) { // 1 = OPEN
                client.send(data);
            }
        });
    });

    ws.on('close', () => {
        wsClients.delete(ws);
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Control endpoint
app.post('/control', async (req, res) => {
    try {
        const { command } = req.body;
        console.log(`Received command: ${command}`);

        const endpoint = "/api/v2/robot/capabilities/ManualControlCapability";
        let payload = {};

        // Handle Arduino servo commands
        if (command === 'TOGGLE_SERVO') {
            // This would need state management, simplified here
            try {
                const response = await fetch(`${ARDUINO_HOST}/start`);
                res.json({ success: true });
            } catch (error) {
                console.error("Error communicating with Arduino:", error);
                res.status(500).json({ error: "Communication error with Arduino" });
            }
            return;
        } else if (command.startsWith('SERVO_')) {
            let arduinoCommand = 'x'; // default stop
            switch (command) {
                case 'SERVO_SPEED1':
                    arduinoCommand = 's';
                    break;
                case 'SERVO_SPEED2':
                    arduinoCommand = 'n';
                    break;
                case 'SERVO_SPEED3':
                    arduinoCommand = 'f';
                    break;
                case 'SERVO_STOP':
                    arduinoCommand = 'x';
                    break;
            }
            
            try {
                const response = await fetch(`${ARDUINO_HOST}/${arduinoCommand}`);
                if (!response.ok) {
                    throw new Error('Arduino command failed');
                }
                res.json({ success: true });
            } catch (error) {
                console.error("Error communicating with Arduino:", error);
                res.status(500).json({ error: "Communication error with Arduino" });
            }
            return;
        }

        // Handle Valetudo commands
        if (command === 'ENABLE' || command === 'DISABLE') {
            payload = {
                action: command === 'ENABLE' ? 'enable' : 'disable',
            };
        } else if (['FORWARD', 'BACKWARD', 'ROTATE_CLOCKWISE', 'ROTATE_COUNTERCLOCKWISE'].includes(command)) {
            payload = {
                action: 'move',
                movementCommand: command.toLowerCase(),
            };
        } else if (command === 'STOP') {
            payload = {
                action: 'move',
            };
        } else {
            res.status(400).json({ error: 'Invalid command' });
            return;
        }

        try {
            const response = await fetch(`${VALETUDO_HOST}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': basicAuth,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error(`Valetudo API error: ${response.statusText}`);
                res.status(500).json({ error: 'Valetudo API error' });
                return;
            }

            console.log(`Command ${command} sent successfully`);
            res.json({ success: true });
        } catch (error) {
            console.error("Error communicating with Valetudo API:", error);
            res.status(500).json({ error: "Communication error with Valetudo API" });
        }
    } catch (error) {
        console.error("Error parsing request body:", error);
        res.status(400).json({ error: "Failed to parse request body" });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        valetudo: VALETUDO_HOST,
        arduino: ARDUINO_HOST
    });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`===========================================`);
    console.log(`🤖 DoggoRoomie Server v2.0`);
    console.log(`===========================================`);
    console.log(`Server running on: http://0.0.0.0:${PORT}`);
    console.log(`Valetudo: ${VALETUDO_HOST}`);
    console.log(`Arduino: ${ARDUINO_HOST}`);
    console.log(`WebSocket ready for connections`);
    console.log(`===========================================`);
});
