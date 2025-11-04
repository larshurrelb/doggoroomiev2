# 📱 Tablet Face Display - Features

## ✨ What's Included

The tablet's localhost:3000 display now includes:

### 🖥️ **Fullscreen Display**
- Automatically enters fullscreen on first touch
- No UI elements - just the dog face animation
- Black background for immersive display
- Responsive to device orientation changes

### 🔒 **Screen Wake Lock**
- Keeps the screen on while app is running
- Uses Wake Lock API
- Automatically reacquires if released
- Prevents screen timeout during operation

### 🔊 **Sound Integration**
All animations have synchronized sounds from `/sounds/` directory:

| Animation | Sound File | Loop |
|-----------|-----------|------|
| 1 - Idle | `idle/slow_breathing.mp3` | Yes |
| 2 - Puppy Eyes | `puppyEyes/low_whimpering_dog.mp3` | Yes |
| 3 - Staring | `intenseStaring/low_growling_dog.mp3` | Yes |
| 4 - Happy | `happy/panting_high-pitched.mp3` | Yes |
| 5 - Panting | `panting/slow_panting_dog_sou.mp3` | Yes |
| 6 - Sighing | `sigh/dog_sigh.mp3` | No |
| 7 - Barking | `barking/barking_dog.mp3` | No |
| 8 - Woofing | `woofing/woof.mp3` | No |
| 9 - Bumping | `bumping/impatient_dog_growli.mp3` | Yes |
| 0 - Gaze Right | `gazeToTheRight/548465__dienamyte__small-dog-sneezing.wav` | No |
| ß - Gaze Left | `gazeToTheLeft/548465__dienamyte__small-dog-sneezing.wav` | No |

### 🎵 **Sound Behavior**
- Only one sound plays at a time
- Switching animations automatically stops previous sound
- Press **i** to stop all sounds manually
- Full volume (1.0) for all audio
- Audio initialized on first "Tap to Start" button press

## 🚀 Usage

### First Time Setup
1. Open `http://localhost:3000` on tablet
2. Tap the "Tap to Start" button
3. This initializes audio and enters fullscreen
4. Animation is now ready to receive triggers

### Controlling from Tablet
- Use keyboard keys 1-9, 0, ß, i (if connected)
- Or control from laptop remote controller

### Controlling from Laptop
- Connect laptop controller to tablet server
- Press animation keys (1-9, 0, ß)
- Animations and sounds play on tablet
- Press **i** to stop all sounds

## 🔧 Technical Details

### Files Used
- **HTML:** `/public/index.html` - Minimal fullscreen layout
- **CSS:** `/public/style.css` - Fullscreen black background
- **JS:** `/public/js/main.js` - Complete face logic with Wake Lock
- **Rive:** `/public/dog_animations.riv` - Animation file
- **Sounds:** `/public/sounds/*` - All audio files

### Features Implemented
✅ Wake Lock API for screen-on
✅ Fullscreen API for immersive display
✅ WebSocket for remote triggers
✅ Audio synchronization with animations
✅ Automatic audio stopping on switch
✅ Responsive canvas sizing
✅ Orientation change handling
✅ Notification blocking in fullscreen
✅ Auto-reconnect on WebSocket disconnect

### Browser Requirements
- **Recommended:** Chrome on Android
- **Required:** Support for Wake Lock API
- **Required:** Support for Fullscreen API
- **Required:** WebSocket support
- **Required:** HTML5 Audio support

## 🐛 Troubleshooting

### Screen Won't Stay On
- Check if Wake Lock API is supported: Open browser console
- Look for "Wake Lock is active" message
- Some browsers may not support Wake Lock API
- Try Chrome for Android (best support)

### No Fullscreen
- Tap anywhere on screen to trigger fullscreen
- Check browser permissions for fullscreen
- Try manual fullscreen: Browser menu → Fullscreen

### No Sound
- Make sure you tapped "Tap to Start" button
- Check volume on tablet
- Verify sound files exist in `/public/sounds/`
- Check browser console for audio errors
- Try reloading the page

### Animation Not Loading
- Check browser console for errors
- Verify `dog_animations.riv` exists in `/public/`
- Check WebSocket connection status
- Reload the page

### WebSocket Disconnected
- Check if server is running in Termux
- Verify tablet's IP address
- Look for auto-reconnect in console
- Wait 5 seconds for automatic reconnection

## 📝 Notes

- The tablet display is designed to be distraction-free
- No UI controls are shown - all control via keyboard/remote
- Wake Lock prevents battery optimization from sleeping the screen
- Consider keeping tablet plugged in for extended use
- Fullscreen hides notification bar automatically

## 🎨 Customization

To change sounds:
1. Replace files in `/public/sounds/` directories
2. Keep same filenames or update `main.js`
3. Supported formats: MP3, WAV
4. Restart server to reload

To adjust volume:
- Edit `main.js` line: `audio.volume = 1.0;`
- Range: 0.0 (mute) to 1.0 (full)

## 🔗 Related Files

- Original logic reference: `.github/face.md`
- Robot controls: `/public/js/control.js`
- Server setup: `server.js`
- Complete docs: `README.md`
