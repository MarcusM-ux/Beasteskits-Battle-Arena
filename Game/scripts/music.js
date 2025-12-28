// --- CONFIGURATION ---
const maxMenuSongs = 4;    // Number of menu tracks
const maxBattleSongs = 5;  // Number of battle tracks
const defaultVolume = 0.5; // Default volume for all tracks

// --- ARRAYS TO STORE AUDIO OBJECTS ---
const menuTHEMES = [];
const battleTHEMES = [];

// --- POPULATE MENU TRACKS ---
for (let i = 1; i <= maxMenuSongs; i++) {
    const audio = new Audio(`/Music/THEME/Menu/theme${i}menu.mp3`);
    audio.volume = defaultVolume;
    menuTHEMES.push(audio);
}

// --- POPULATE BATTLE TRACKS ---
for (let i = 1; i <= maxBattleSongs; i++) {
    const audio = new Audio(`/Music/THEME/Battle/theme${i}battle.mp3`);
    audio.volume = defaultVolume;
    battleTHEMES.push(audio);
}

// --- FADE FUNCTION ---
function fadeAudio(audio, targetVolume, duration = 1000) {
    const stepTime = 50;
    const steps = duration / stepTime;
    const volumeStep = (targetVolume - audio.volume) / steps;

    const fadeInterval = setInterval(() => {
        audio.volume = Math.min(1, Math.max(0, audio.volume + volumeStep));

        if (
            (volumeStep > 0 && audio.volume >= targetVolume) ||
            (volumeStep < 0 && audio.volume <= targetVolume)
        ) {
            audio.volume = targetVolume;
            clearInterval(fadeInterval);
        }
    }, stepTime);
}

// --- PAUSE ALL TRACKS OF A TYPE ---
function pauseAllThemes(type) {
    const themes = type === 'menu' ? menuTHEMES : battleTHEMES;
    themes.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.onended = null;
    });
}

// --- START RANDOM THEME LOOP ---
function startTheme(type) {
    const themes = type === 'menu' ? menuTHEMES : battleTHEMES;
    if (themes.length === 0) return;

    let index = Math.floor(Math.random() * themes.length);

    function playNext() {
        const current = themes[index];
        current.play();

        current.onended = () => {
            current.currentTime = 0;
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
