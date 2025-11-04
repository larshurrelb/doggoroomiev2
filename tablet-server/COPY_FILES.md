# File Setup Instructions

## ✅ Already Included
- `dog_animations.riv` - Already in `public/` directory

## 📁 Audio Files (Optional)
If you have audio files for sound effects:
1. Create audio directory: `mkdir -p public/audio`
2. Copy your audio files: `cp /path/to/1.wav public/audio/1.wav`

## 🔄 When Transferring to Tablet

### Option 1: USB Transfer
1. Connect tablet to computer via USB
2. Copy entire `tablet-server` folder to `/sdcard/` on tablet
3. In Termux: `cd /sdcard/tablet-server`

### Option 2: Git Clone
```bash
cd ~
git clone [your-repo-url]
cd doggoroomiev2/tablet-server
```

### Option 3: Archive Transfer
```bash
# On computer: Create archive
tar -czf tablet-server.tar.gz tablet-server/

# Transfer archive to tablet
# On tablet in Termux:
cd /sdcard/Download
tar -xzf tablet-server.tar.gz
cd tablet-server
```

## 🎵 Audio File Locations
Place audio files in: `public/audio/`
- `1.wav` - Main sound effect (referenced in code)
- Add more as needed

The HTML references: `<audio id="audio1" src="audio/1.wav">`
