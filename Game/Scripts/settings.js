window.CONFIG = {
    match: {
        type: 'quickmatch',
        
        round: 1,
        maxRounds: 1,
        
        maxWins: 1,
        p1Wins: 0,
        p2Wins: 0,
    },
    obstacles: {
        on: false,
        max: 5,
        randomize: false
    },
    cpu: {
        p1 : {
            active: false,
            diff: 'classic'
        },
        p2: {
            active: false,
            diff: 'classic'
        }
    },

    gameplay: {
        ultcooldown: true
    }
}

const settingsReset = id('settings-reset')
const saveSettings = id('save-settings')
const settingsPage = id('settings-frame')

const DIFFICULTY_MAP = {
    simple:   'novice',
    classic:  'intermediate',
    extreme:  'advanced'
}

saveSettings.addEventListener('click', ()=>{
    SET_MATCH()
    CHECK_OBSTACLES()
    CHECK_CPU()
    CHECK_GAMEPLAY()
    applyCPUSettingsToCore()
})

settingsPage.addEventListener('click', ()=>{
    maxObstacles.value = Math.min(maxObstacles.max, maxObstacles.value)
    maxObstacles.value = Math.max(0, maxObstacles.value)
})
// MATCH
const matchLabel = id('match_type')
const QuickMatch = id('quickmatch')
const FirstTo3 = id('tourney3')
const BestOf3 = id('bestOf3')

function SET_MATCH(){
    [QuickMatch, FirstTo3, BestOf3].forEach(element => {
        if (element.checked) {
            let match = window.CONFIG.match
            switch(element.value) {
                case 'quickmatch':
                    match.type = element.value
                    matchLabel.textContent = "Quick Match"
                    match.maxWins = 1
                    match.maxRounds = 1
                break
                case 'tourney3':
                    match.type = element.value
                    matchLabel.textContent = "First To 3 Wins"
                    match.maxWins = 3
                    match.maxRounds = 0
                break 
                case 'bestOf3':
                    match.type = element.value
                    matchLabel.textContent = "Best Out Of 3"
                    match.maxWins = 3
                    match.maxRounds = 3
                break
            }
        }
    })
}

// OBSTACLES
const obstaclesOn = id('obstacles-on')
const obstaclesOff = id('obstacles-off')
const maxObstacles = id('obstacles-amount-max')
const randomizeObstacles = id('randomize')
const obstaclesLabel = id('obstacles_active')

function CHECK_OBSTACLES(){
    let obstacles = window.CONFIG.obstacles
    if (obstaclesOn.checked) {
        obstacles.on = true
        obstaclesLabel.textContent = 'OBSTACLES ACTIVE'
    }else {
        obstacles.on = false
        obstaclesLabel.textContent = 'NO OBSTACLES ACTIVE'
    }
    
    maxObstacles.value = Math.min(maxObstacles.max, maxObstacles.value)
    maxObstacles.value = Math.max(0, maxObstacles.value)
    
    obstacles.max = maxObstacles.value
    obstacles.randomize = randomizeObstacles.checked
}

// CPU
const cpuLabel =  id('cpu_label')
const p1CPU = id('player1cpu-toggle')
const p2CPU = id('player2cpu-toggle')

function getCPUDifficulty(playerId) {
    let difficulty = 'classic'; // default
    ['simple', 'classic', 'extreme'].forEach(diff => {
        const element = document.querySelector(`#diff-c${playerId}-${diff}`)
        if (element?.checked) difficulty = diff
    })
    return difficulty
}

function CHECK_CPU() {
    let cpu = window.CONFIG.cpu
    
    cpu.p1.active = p1CPU.checked
    if (p1CPU.checked){
        cpu.p1.diff = getCPUDifficulty(1)
    }
    
    cpu.p2.active = p2CPU.checked
    if (p2CPU.checked) {
        cpu.p2.diff = getCPUDifficulty(2)
    }
    if (p1CPU.checked || p2CPU.checked) {
        cpuLabel.textContent = "CPU ACTIVE"
        
    }else if (!p1CPU.checked && !p2CPU.checked) {
        cpuLabel.textContent = "NO CPU ACTIVE"
    }
}

const ultCooldownStart = id('ult-cooldown-start')
function CHECK_GAMEPLAY(){
    let gameplay = window.CONFIG.gameplay
    gameplay.ultcooldown = ultCooldownStart.checked
}

// DEFAULT SETTINGS CONFIGURATION
const DEFAULT_CONFIG = {
    match: {
        type: 'quickmatch',
        round: 1,
        maxRounds: 1,
        maxWins: 1,
        p1Wins: 0,
        p2Wins: 0,
    },
    obstacles: {
        on: false,
        max: 5,
        randomize: false
    },
    cpu: {
        p1: {
            active: false,
            diff: 'classic'
        },
        p2: {
            active: false,
            diff: 'classic'
        }
    },
    gameplay: {
        ultcooldown: true
    }
}

function applyCPUSettingsToCore() {
    const cfg = window.CONFIG.cpu;
    
    const p1IsCPU = cfg.p1.active;
    const p2IsCPU = cfg.p2.active;
    const p1Diff  = DIFFICULTY_MAP[cfg.p1.diff] || 'intermediate';
    const p2Diff  = DIFFICULTY_MAP[cfg.p2.diff] || 'intermediate';

    const player1HeadingDs = id('player1-heading-ds')
    const player2HeadingDs = id('player2-heading-ds')

    // Determine GameMode based on who is CPU
    if (p1IsCPU && p2IsCPU) {
        window.GameMode.mode     = 'cvc';
        window.GameMode.cpuLevel = p1Diff; // CvC uses one shared level; p1 wins tie

        player1HeadingDs.innerHTML = `CPU 1: <br> ${(challengers.player1) ? challengers.player1.name : 'NOT SELECTED'}`
        
        player2HeadingDs.innerHTML = `CPU 2: <br> ${(challengers.player2) ? challengers.player2.name : 'NOT SELECTED'}`
        
    } else if (p1IsCPU) {
        window.GameMode.mode     = 'cvp';
        window.GameMode.cpuLevel = p1Diff;
        player1HeadingDs.innerHTML = `CPU 1: <br> ${(challengers.player1) ? challengers.player1.name : 'NOT SELECTED'}`
        
    } else if (p2IsCPU) {
        window.GameMode.mode     = 'pvc';
        window.GameMode.cpuLevel = p2Diff;
        player2HeadingDs.innerHTML = `CPU 2: <br> ${(challengers.player2) ? challengers.player2.name : 'NOT SELECTED'}`
        
    } else {
        window.GameMode.mode     = 'pvp';
        window.GameMode.cpuLevel = null;
        player1HeadingDs.innerHTML = `Player 1: <br> ${(challengers.player1) ? challengers.player1.name : 'NOT SELECTED'}`
        
        player2HeadingDs.innerHTML = `Player 2: <br> ${(challengers.player2) ? challengers.player2.name : 'NOT SELECTED'}`
    }
    
    // If players are already spawned (e.g. mid-lobby), patch their difficulty live
    if (p1IsCPU && challengers.player1?.isCPU) {
    challengers.player1.cpuDifficulty = p1Diff;
    }
    if (p2IsCPU && challengers.player2?.isCPU) {
    challengers.player2.cpuDifficulty = p2Diff;
    }
    
    // In CvC, each CPU can have its own difficulty
    // Override the shared cpuLevel with per-slot values on the spawned players
    if (p1IsCPU && p2IsCPU) {
    if (challengers.player1?.isCPU) challengers.player1.cpuDifficulty = p1Diff;
    if (challengers.player2?.isCPU) challengers.player2.cpuDifficulty = p2Diff;
    }
    
    console.log(`[CPU Bridge] Mode: ${window.GameMode.mode} | P1: ${p1IsCPU ? p1Diff : 'human'} | P2: ${p2IsCPU ? p2Diff : 'human'}`);
}

// RESET FUNCTION
settingsReset.addEventListener('click', () => {
    // Reset CONFIG object to defaults
    window.CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG))
    
    // Reset all UI elements to match default config
    resetMatchTypeUI()
    resetObstaclesUI()
    resetCPUUI()
    resetGAMEPLAY()
    
    // Update display labels
    SET_MATCH()
    CHECK_OBSTACLES()
    CHECK_CPU()
    CHECK_GAMEPLAY()
})


function resetGAMEPLAY(){
    ultCooldownStart.checked = true
}
function resetMatchTypeUI() {
    // Set Quick Match as default
    QuickMatch.checked = true
    FirstTo3.checked = false
    BestOf3.checked = false
}

function resetObstaclesUI() {
    // Set obstacles OFF as default
    obstaclesOn.checked = false
    obstaclesOff.checked = true
    maxObstacles.value = 5
    randomizeObstacles.checked = false
}

function resetCPUUI() {
    // Reset Player 1 CPU
    p1CPU.checked = false
    document.getElementById('diff-c1-simple').checked = false
    document.getElementById('diff-c1-classic').checked = true
    document.getElementById('diff-c1-extreme').checked = false
    
    // Reset Player 2 CPU
    p2CPU.checked = false
    document.getElementById('diff-c2-simple').checked = false
    document.getElementById('diff-c2-classic').checked = true
    document.getElementById('diff-c2-extreme').checked = false
}

const volumeSlider = document.querySelector('.volume-slider');
const volumeHandle = document.querySelector('.volume-handle');
const volumeTrack = document.querySelector('.volume-track');
const volumeValue = document.querySelector('.volume-value');

let isDragging = false;

function updateVolume(clientX) {
    const rect = volumeSlider.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    
    defaultVolume = percentage;
    if (currentPreviewAudio) currentPreviewAudio.volume = defaultVolume
    if (currentActiveAudio) currentActiveAudio.volume = defaultVolume
    
    volumeHandle.style.left = (percentage * 100) + '%';
    volumeTrack.style.width = (percentage * 100) + '%';
    volumeValue.textContent = Math.round(percentage * 100) + '%';
    
    // Update your audio element here
    // audioElement.volume = volume;
    
    console.log('Volume:', volume); // 0 to 1
}

// Mouse events
volumeHandle.addEventListener('mousedown', () => {
    isDragging = true;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        updateVolume(e.clientX);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Click on track to set volume
volumeSlider.addEventListener('click', (e) => {
    updateVolume(e.clientX);
});

// Touch support for mobile
volumeHandle.addEventListener('touchstart', () => {
    isDragging = true;
});

document.addEventListener('touchmove', (e) => {
    if (isDragging) {
        updateVolume(e.touches[0].clientX);
    }
});

document.addEventListener('touchend', () => {
    isDragging = false;
});
