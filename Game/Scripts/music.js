// --- CONFIGURATION ---
const maxMenuSongs = 10    // Number of menu tracks
const maxBattleSongs = 10  // Number of battle tracks
let defaultVolume = 1; // Default volume for all tracks

let playlistActive = false
// --- ARRAYS TO STORE AUDIO OBJECTS ---
const menuTHEMES = [];
const battleTHEMES = [];

const otherThemes = {
    Peekaboo : new Audio("./Music/THEME/Other/despair_track.mp3"),
    Clash: new Audio("./Music/THEME/Other/clash_track.mp3")
}

const menuAudioNames = []
const battleAudioNames = []

// --- GLOBAL TRACKER FOR PREVIEW AUDIO ---
let currentPreviewAudio = null;

// --- POPULATE MENU TRACKS ---
for (let i = 1; i <= maxMenuSongs; i++) {
    const audio = new Audio(`./Music/THEME/Menu/theme${i}menu.mp3`);
    audio.volume = defaultVolume;
    menuTHEMES.push(audio);
    menuAudioNames.push(`theme${i}menu`)
}

// --- POPULATE BATTLE TRACKS ---
for (let i = 1; i <= maxBattleSongs; i++) {
    const audio = new Audio(`./Music/THEME/Battle/theme${i}battle.mp3`);
    audio.volume = defaultVolume;
    battleTHEMES.push(audio);
    battleAudioNames.push(`theme${i}battle`)
}

let currentActiveAudio = null;
let currentActivePlayButton = null;
let currentActivePauseButton = null;

// --- PAUSE ALL TRACKS OF A TYPE ---
function pauseAllThemes(type) {
    if (playlistActive) return
    const themes = type === 'menu' ? menuTHEMES : battleTHEMES;
    themes.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.onended = null;
    });
}

function pauseAll(){
    pauseAllThemes('menu')
    pauseAllThemes('battle')    

    // Pause all other themes
    for (const name of Object.keys(otherThemes)) {
        otherThemes[name].pause()
        otherThemes[name].currentTime = 0
        otherThemes[name].onended = null
    }
    
    // ✅ ADD THIS: Pause preview audio
    if (currentPreviewAudio) {
        currentPreviewAudio.pause()
        currentPreviewAudio.currentTime = 0
    }
    
    // ✅ ADD THIS: Pause all playlist audio objects
    playlistAudioObjects.forEach(audio => {
        audio.pause()
        audio.currentTime = 0
        audio.onended = null
    })
    
    // ✅ ADD THIS: Stop any active fades immediately
    if (currentActiveAudio) {
        currentActiveAudio.volume = 0
        currentActiveAudio.pause()
        currentActiveAudio.currentTime = 0
    }
}

// --- FADE FUNCTION ---
function fadeAudio(audio, targetVolume, duration = 1000) {
    if (!audio) return;
    const stepTime = 50;
    const steps = duration / stepTime;
    const volumeStep = (targetVolume - audio.volume) / steps;

    const fadeInterval = setInterval(() => {
        // Apply the volume step
        let newVolume = audio.volume + volumeStep;
        audio.volume = Math.min(1, Math.max(0, newVolume));

        // Check if we reached the target
        if (
            (volumeStep > 0 && audio.volume >= targetVolume) ||
            (volumeStep < 0 && audio.volume <= targetVolume)
        ) {
            audio.volume = targetVolume;
            if (targetVolume === 0) {
                audio.pause(); // Stop it once it's silent
                audio.currentTime = 0;
            }
            clearInterval(fadeInterval);
        }
    }, stepTime);
}

// --- START RANDOM THEME LOOP ---
function startTheme(type) {
    if (playlistActive) return
    const themes = type === 'menu' ? menuTHEMES : battleTHEMES;
    if (themes.length === 0) return;

    // Pick a random index
    let index = Math.floor(Math.random() * themes.length);

    function playNext() {
        // If something else is playing, fade it out first!
        if (currentActiveAudio) {
            fadeAudio(currentActiveAudio, 0, 1000); 
        }

        const nextTrack = themes[index];
        nextTrack.volume = 0; // Start at 0 for fade in
        nextTrack.play();
        fadeAudio(nextTrack, defaultVolume, 1000); // Fade in to default
        
        currentActiveAudio = nextTrack; // Track this as the current song

        nextTrack.onended = () => {
            index = (index + 1) % themes.length;
            playNext();
        };
    }

    playNext();
}

// --- TOGGLE BETWEEN MENU AND BATTLE ---
function toggleTHEMES(isMenuTheme) {
    if (isMenuTheme) {
        pauseAllThemes('battle');
        startTheme('menu');
    } else {
        pauseAllThemes('menu');
        startTheme('battle');
    }
    for (const [name, data] of Object.entries(otherThemes)) {
        data.pause()
        data.currentTime = 0
    }
}

// --- START MUSIC ON FIRST INTERACTION ---
function startMusic() {
    window.removeEventListener('click', startMusic);
    window.removeEventListener('keydown', startMusic);
    toggleTHEMES(true);
}

// --- LISTEN FOR FIRST CLICK OR KEYPRESS ---
window.addEventListener('click', startMusic);
window.addEventListener('keydown', startMusic);

// PLAYLIST NAVIGATION
const menuSwitch = document.querySelector('#menu-switch')
const battleSwitch = document.querySelector('#battle-switch')

const songsContainer = document.querySelector('#songsContainer')
const soundList = document.querySelector('#soundList')

let playlist = []
let playlistAudioObjects = [] // Store audio objects for playlist songs

function addSound (theme, type) {
    const btn = document.createElement('button')
    
    btn.classList.add('added-song')
    btn.textContent = 'ADD SONG: ' + theme
    songsContainer.appendChild(btn)

    let preplayAudio 

    if (type === 'menu') preplayAudio = new Audio(`./Music/THEME/Menu/${theme}.mp3`)
    else if (type === 'battle') preplayAudio = new Audio(`./Music/THEME/Battle/${theme}.mp3`)

    // Create play/pause button container
    const audioControls = document.createElement('div')
    audioControls.classList.add('audio-controls')
    
    const playBtn = document.createElement('button')
    playBtn.textContent = '▶ Play'
    playBtn.classList.add('play-btn')
    
    const pauseBtn = document.createElement('button')
    pauseBtn.textContent = '⏸ Pause'
    pauseBtn.classList.add('pause-btn')
    pauseBtn.disabled = true
    
    // Play button logic
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        
        // Pause the previously playing preview audio
        if (currentPreviewAudio && currentPreviewAudio !== preplayAudio && currentActivePlayButton && currentActivePauseButton) {
            currentPreviewAudio.pause()
            currentPreviewAudio.currentTime = 0
            
            currentActivePlayButton.disabled = false
            currentActivePauseButton.disabled = true
        }
        
        // Pause background themes
        pauseAll()
        
        // Play this audio
        preplayAudio.play()
        currentPreviewAudio = preplayAudio
        currentActivePlayButton = playBtn
        currentActivePauseButton = pauseBtn
        playBtn.disabled = true
        pauseBtn.disabled = false
    })
    
    // Pause button logic
    pauseBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        preplayAudio.pause()
        currentPreviewAudio = null
        playBtn.disabled = false
        pauseBtn.disabled = true
        startTheme('menu')
    })
    
    // Auto-disable pause button when audio ends
    preplayAudio.addEventListener('ended', () => {
        playBtn.disabled = false
        pauseBtn.disabled = true
        currentPreviewAudio = null
        startTheme('menu')
    })
    
    audioControls.appendChild(playBtn)
    audioControls.appendChild(pauseBtn)
    btn.appendChild(audioControls)

    btn.addEventListener('click', ()=>{
        // 1. ADD TO ARRAY
        playlist.push(theme)
        
        // 2. CREATE AUDIO OBJECT FOR PLAYLIST
        let playlistAudio
        if (type === 'menu') playlistAudio = new Audio(`./Music/THEME/Menu/${theme}.mp3`)
        else if (type === 'battle') playlistAudio = new Audio(`./Music/THEME/Battle/${theme}.mp3`)
        playlistAudio.volume = defaultVolume
        playlistAudioObjects.push(playlistAudio)
        
        // 3. CREATE ELEMENT IN LIST
        const listItem = document.createElement('button')
        listItem.textContent = 'REMOVE: ' + theme
        listItem.classList.add('remove-song')
        
        // 4. REMOVE FROM DOM AND ARRAY
        listItem.addEventListener('click', ()=>{
            listItem.remove()
            const index = playlist.indexOf(theme)
            playlist = playlist.filter(song => song !== theme)
            playlistAudioObjects.splice(index, 1)
            preplayAudio.pause() // Stop audio when removed
            if (currentPreviewAudio === preplayAudio) {
                currentPreviewAudio = null
            }
        })
        
        soundList.appendChild(listItem)
    })
}

function setUpSongs(theme) {
    songsContainer.replaceChildren()

    if (theme === 'menu') {
        menuAudioNames.forEach(theme => {
           addSound(theme, 'menu')
        })
    } else if (theme === 'battle') {
        battleAudioNames.forEach(theme => {
           addSound(theme, 'battle')
        })
    }
}

menuSwitch.addEventListener('click', ()=>{
    setUpSongs('menu')
})

battleSwitch.addEventListener('click', ()=>{
    setUpSongs('battle')
})
setUpSongs('menu')

// --- PLAYLIST PLAYBACK ---
let playlistIndex = 0
const startPlaylistBtn = document.querySelector('#start-playlist')

function playPlaylist() {
    if (playlistAudioObjects.length === 0) {
        // console.warn('Playlist is empty!')
        return
    }

    // if (currentActiveAudio) currentActiveAudio.paused()
    // if (currentActivePauseButton) currentActivePauseButton.disabled = false
    // if (currentActivePlayButton) currentActivePlayButton.disabled = true

    pauseAll()
    playlistIndex = 0

    function playNext() {
        // If something else is playing, fade it out first
        if (currentActiveAudio && currentActiveAudio !== playlistAudioObjects[playlistIndex]) {
            fadeAudio(currentActiveAudio, 0, 1000)
        }

        const nextTrack = playlistAudioObjects[playlistIndex]
        nextTrack.currentTime = 0 // Reset to start
        nextTrack.volume = 0 // Start at 0 for fade in
        nextTrack.play()
        fadeAudio(nextTrack, defaultVolume, 1000) // Fade in to default
        
        currentActiveAudio = nextTrack

        nextTrack.onended = () => {
            playlistIndex = (playlistIndex + 1) % playlistAudioObjects.length
            playNext()
        }
    }

    playNext()
    playlistActive = true
    startPlaylistBtn.textContent = '⏸ Stop Playlist'
}

function stopPlaylist() {
    pauseAll()
    currentActiveAudio.pause()
    currentActiveAudio = null
    playlistActive = false
    startPlaylistBtn.textContent = '▶ Start Playlist'
    startTheme('menu')
}

startPlaylistBtn.addEventListener('click', () => {
    if (!playlistActive) {
    
        playPlaylist()
    } else {
        stopPlaylist()
    }
})
