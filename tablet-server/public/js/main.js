// Wake Lock to keep screen on
let wakeLock = null;

const requestWakeLock = async () => {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock is active');

        wakeLock.addEventListener('release', () => {
            console.log('Wake Lock was released');
            requestWakeLock();
        });
    } catch (err) {
        console.error('Failed to acquire Wake Lock:', err);
    }
};

// Initialize wake lock
if ('wakeLock' in navigator) {
    requestWakeLock();
} else {
    console.warn('Wake Lock API not supported');
}

document.addEventListener('visibilitychange', () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
    }
});

// Canvas and Rive setup
const canvas = document.getElementById('canvas');
const message = document.getElementById('message');

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
resizeCanvas();

let currentInputs = null;
let ws = null;

const triggerMap = {
    '1': 'Idle',
    '2': 'PuppyEyes',
    '3': 'Staring',
    '4': 'Happy',
    '5': 'Panting',
    '6': 'Sighing',
    '7': 'Barking',
    '8': 'Woofing',
    '9': 'Bumping',
    '0': 'Gaze to the right',
    'ß': 'Gaze to the left',
    'i': 'StopAllSounds'
};

// Audio elements
let audioIdle, audioPuppyEyes, audioIntenseStare, audioHappy, audioPanting;
let audioSigh, audioBarking, audioWoofing, audioBumping, audioGazeRight, audioGazeLeft;

const stopAllAudio = () => {
    [audioIdle, audioPuppyEyes, audioIntenseStare, audioHappy, audioPanting,
     audioSigh, audioBarking, audioWoofing, audioBumping, audioGazeRight, audioGazeLeft].forEach(audio => {
        if (audio && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
};

const playSound = (targetAudio) => {
    if (!targetAudio) {
        console.error('Audio element not found');
        return;
    }
    
    // Stop all other sounds first
    stopAllAudio();
    
    // Play the target sound
    targetAudio.currentTime = 0;
    targetAudio.play().catch(err => console.error('Error playing audio:', err));
};

const init = async () => {
    try {
        // Get audio elements
        audioIdle = document.getElementById('soundSlowBreathing');
        audioPuppyEyes = document.getElementById('soundWhimpering');
        audioIntenseStare = document.getElementById('soundLowGrowling');
        audioHappy = document.getElementById('soundExcitedPanting');
        audioPanting = document.getElementById('soundPanting');
        audioSigh = document.getElementById('soundSigh');
        audioBarking = document.getElementById('soundBarking');
        audioWoofing = document.getElementById('soundWoofing');
        audioBumping = document.getElementById('soundImpatientGrowling');
        audioGazeRight = document.getElementById('soundSneezeRight');
        audioGazeLeft = document.getElementById('soundSneezeLeft');

        // Set all audio to full volume
        document.querySelectorAll('audio').forEach(audio => {
            audio.volume = 1.0;
        });

        // Fullscreen on touch
        const enterFullscreen = () => {
            const element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        };

        document.addEventListener('touchend', function onFirstTouch() {
            enterFullscreen();
            document.removeEventListener('touchend', onFirstTouch);
        }, false);

        // Initialize Rive animation
        const r = new rive.Rive({
            src: '/dog_animations.riv',
            canvas: canvas,
            autoplay: true,
            stateMachines: "State Machine",
            onLoad: () => {
                message.style.display = 'none';
                currentInputs = r.stateMachineInputs('State Machine');
                r.resizeDrawingSurfaceToCanvas();
                console.log('Rive animation loaded successfully');
            },
            onError: (err) => {
                message.textContent = 'Failed to load animation';
                console.error(err);
            }
        });

        // WebSocket connection
        ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`);

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            const msg = event.data;
            console.log('Received WebSocket message:', msg);

            // Handle sound commands
            if (msg === 'play-idle-sound' || msg === '1') {
                playSound(audioIdle);
            } else if (msg === 'play-puppyeyes-sound' || msg === '2') {
                playSound(audioPuppyEyes);
            } else if (msg === 'play-intensestare-sound' || msg === '3') {
                playSound(audioIntenseStare);
            } else if (msg === 'play-happy-sound' || msg === '4') {
                playSound(audioHappy);
            } else if (msg === 'play-panting-sound' || msg === '5') {
                playSound(audioPanting);
            } else if (msg === 'play-sigh-sound' || msg === '6') {
                playSound(audioSigh);
            } else if (msg === 'play-barking-sound' || msg === '7') {
                playSound(audioBarking);
            } else if (msg === 'play-woofing-sound' || msg === '8') {
                playSound(audioWoofing);
            } else if (msg === 'play-bumping-sound' || msg === '9') {
                playSound(audioBumping);
            } else if (msg === 'play-gazetotheright-sound' || msg === '0') {
                playSound(audioGazeRight);
            } else if (msg === 'play-gazetotheleft-sound' || msg === 'ß') {
                playSound(audioGazeLeft);
            } else if (msg === 'stop-all-audio' || msg === 'i') {
                stopAllAudio();
            }

            // Fire animation trigger
            const trigger = msg;
            if (triggerMap[trigger] && currentInputs) {
                const triggerInput = currentInputs.find(input => input.name === triggerMap[trigger]);
                if (triggerInput) {
                    triggerInput.fire();
                }
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected, attempting to reconnect...');
            setTimeout(init, 5000);
        };

        // Audio initialization button
        document.getElementById('audioInitButton').addEventListener('click', () => {
            const audioTest = document.getElementById('soundSlowBreathing');
            audioTest.volume = 0;
            audioTest.play().then(() => {
                audioTest.pause();
                audioTest.volume = 1;
                console.log('Audio initialized');
                document.getElementById('audioInitButton').style.display = 'none';
            }).catch(err => console.error('Audio init failed:', err));
        });

        // Window resize handling
        window.addEventListener('resize', () => {
            resizeCanvas();
            r.resizeDrawingSurfaceToCanvas();
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                resizeCanvas();
                r.resizeDrawingSurfaceToCanvas();
            }, 100);
        });

        window.addEventListener('unload', () => {
            stopAllAudio();
            r.cleanup();
        });

    } catch (error) {
        message.textContent = 'Animation system failed to initialize';
        console.error(error);
    }
};

// Keyboard controls for local testing
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (triggerMap[key] && currentInputs) {
        const trigger = currentInputs.find(input => input.name === triggerMap[key]);
        if (trigger) {
            trigger.fire();
        }
        
        // Send to WebSocket and play sound
        if (ws && ws.readyState === WebSocket.OPEN) {
            switch (key) {
                case '1':
                    ws.send('play-idle-sound');
                    playSound(audioIdle);
                    break;
                case '2':
                    ws.send('play-puppyeyes-sound');
                    playSound(audioPuppyEyes);
                    break;
                case '3':
                    ws.send('play-intensestare-sound');
                    playSound(audioIntenseStare);
                    break;
                case '4':
                    ws.send('play-happy-sound');
                    playSound(audioHappy);
                    break;
                case '5':
                    ws.send('play-panting-sound');
                    playSound(audioPanting);
                    break;
                case '6':
                    ws.send('play-sigh-sound');
                    playSound(audioSigh);
                    break;
                case '7':
                    ws.send('play-barking-sound');
                    playSound(audioBarking);
                    break;
                case '8':
                    ws.send('play-woofing-sound');
                    playSound(audioWoofing);
                    break;
                case '9':
                    ws.send('play-bumping-sound');
                    playSound(audioBumping);
                    break;
                case '0':
                    ws.send('play-gazetotheright-sound');
                    playSound(audioGazeRight);
                    break;
                case 'ß':
                    ws.send('play-gazetotheleft-sound');
                    playSound(audioGazeLeft);
                    break;
                case 'i':
                    ws.send('stop-all-audio');
                    stopAllAudio();
                    break;
            }
        }
    }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);

// Disable notifications in fullscreen
const disableNotifications = () => {
    if (document.fullscreenElement) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                Notification.prototype._originalShow = Notification.prototype.show;
                Notification.prototype.show = function() {};
            }
        });
    } else {
        if (Notification.prototype._originalShow) {
            Notification.prototype.show = Notification.prototype._originalShow;
            delete Notification.prototype._originalShow;
        }
    }
};

document.addEventListener('fullscreenchange', disableNotifications);
document.addEventListener('webkitfullscreenchange', disableNotifications);
document.addEventListener('mozfullscreenchange', disableNotifications);
document.addEventListener('msfullscreenchange', disableNotifications);
