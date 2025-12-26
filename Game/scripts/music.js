const menuTHEMES = [
    new Audio('../Music/THEME/Menu/theme1.mp3')
]

const battleTHEMES = [
    new Audio('../Music/THEME/Battle/theme1.mp3')
]

menuTHEMES.forEach(audio => audio.volume = 0.5)
battleTHEMES.forEach(audio => audio.volume = 0.5)

function fadeAudio(audio, targetVolume, duration = 1000) {
    const stepTime = 50
    const steps = duration / stepTime
    const volumeStep = (targetVolume - audio.volume) / steps

    const fadeInterval = setInterval(() => {
        audio.volume = Math.min(1, Math.max(0, audio.volume + volumeStep))

        if (
            (volumeStep > 0 && audio.volume >= targetVolume) ||
            (volumeStep < 0 && audio.volume <= targetVolume)
        ) {
            audio.volume = targetVolume
            clearInterval(fadeInterval)
        }
    }, stepTime)
}

function pauseAllThemes(name){
    switch(name){
        case 'menu':
            menuTHEMES.forEach(audio => {
                audio.pause()
                audio.currentTime = 0
                audio.onended = null
            })
        break
        case 'battle':
            battleTHEMES.forEach(audio => {
                audio.pause()
                audio.currentTime = 0
                audio.onended = null
            })
        break
    }
}

function startTheme(name){
    const themes = (name === 'menu') ? menuTHEMES : battleTHEMES
    if (themes.length === 0) return

    let index = Math.floor(Math.random() * themes.length)

    function playNext(){
        const current = themes[index]
        current.play()

        current.onended = () => {
            current.currentTime = 0
            index = (index + 1) % themes.length
            playNext()
        }
    }

    playNext()
}

function toggleTHEMES(isMenuTheme){
    if (isMenuTheme){
        pauseAllThemes('battle')
        startTheme('menu')
    } else {
        pauseAllThemes('menu')
        startTheme('battle')
    }
}

function startMusic(){
    window.removeEventListener('click', startMusic);
    window.removeEventListener('keydown', startMusic);
    toggleTHEMES(true)
}

window.addEventListener('click', startMusic);
window.addEventListener('keydown', startMusic);