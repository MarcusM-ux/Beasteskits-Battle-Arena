const CLASH_TIME = 32000
let CLASH_WINDOW = null
let CLASH_TIME_WINDOW = 3000
let clashing = false

window.CLASH_CONFIG = {
    player1: null,
    player2: null,
    player1Action: null,
    player2Action: null,
}

const ultimateDisplay = document.querySelector('#ultimate-display')

function displayUltimate(image, BGC, TC, TXT) {
    const visuals = document.createElement('div')
    visuals.classList.add('ult-visual')

    const img = document.createElement('img')
    img.classList.add('ult-img')

    const text = document.createElement('h2')
    text.classList.add('ult-text')

    ultimateDisplay.appendChild(visuals)
    visuals.appendChild(img)
    visuals.appendChild(text)

    img.src = image.src

    visuals.style.background = BGC
    
    text.style.color = TC
    text.innerHTML = TXT

    playRetreivedAudio('sparkle')
}

// function playClashTheme() {
//     if (currentActiveAudio) {
//         currentActiveAudio.pause()
//     }

//     const theme = otherThemes.Clash
//     theme.loop = false
//     theme.volume = 0
//     theme.play()
//     fadeAudio(theme, 0.7, 3000)
//     currentActiveAudio = theme
// }

const ultimateTimeDisplay = document.querySelector('#ult-battle-timer')

function FillUltimate(player, backgroundCOLOR, textCOLOR, TEXT, TYP, actionCallBack) {
    const config = window.CLASH_CONFIG

    ultimateDisplay.style.display = 'flex'
    displayUltimate(player.image, backgroundCOLOR, textCOLOR, TEXT)

    if (!config.player1 || !config.player1Action) {
        config.player1 = player
        config.player1Action = actionCallBack
    } else if (!config.player2 || !config.player2Action) {
        config.player2 = player
        config.player2Action = actionCallBack
    }

    if (CLASH_WINDOW) return

    CLASH_WINDOW = setTimeout(() => {
        if (config.player1 && !config.player2) {
            // Solo ultimate — no clash, just fire it
            ultimateDisplay.replaceChildren()
            ultimateDisplay.style.display = 'none'
            config.player1Action()

             challengers.player1.damageTaken = 0
            challengers.player2.damageTaken = 0
            
            CLASH_WINDOW = null
            config.player1       = null
            config.player2       = null
            config.player1Action = null
            config.player2Action = null

            // challengers.player1.damageTaken = 0
            // challengers.player2.damageTaken = 0
    

        } else if (config.player1 && config.player2) {
            creaturebattleframe.style.backgroundColor = 'white'
            clashing = true

            config.player1.stats.hp = config.player1.baseStats.hp
            config.player2.stats.hp = config.player2.baseStats.hp

            config.player1.updateLabel()
            config.player2.updateLabel()

             setTimeout(() => {
                ultimateDisplay.replaceChildren()
                ultimateDisplay.style.display = 'none'
            }, 2000)

            stun(config.player1, 1000)
            stun(config.player2, 1000)

            // Save original dimensions
            challengers.player1.base.width  = challengers.player1.width
            challengers.player1.base.height = challengers.player1.height
            challengers.player2.base.width  = challengers.player2.width
            challengers.player2.base.height = challengers.player2.height

            config.player1.indicate('CLASH!')
            config.player2.indicate('CLASH!')

            challengers.player1.width  *= 1.2
            challengers.player1.height *= 1.2
            challengers.player2.width  *= 1.2
            challengers.player2.height *= 1.2

            challengers.player1.stats.spd = 3.5
            challengers.player2.stats.spd = 3.5

            if (currentActiveAudio) {
                fadeAudio(currentActiveAudio, 0, 500)
            }

            const theme = otherThemes.Clash
            theme.loop = false
            theme.volume = 0
            theme.play()

            roundInfo.style.display = 'none'
            ultimateTimeDisplay.style.display = 'block'

            let elapsedTime = 0
            const timeInterval = setInterval(() => {
                elapsedTime += 1000
                if (elapsedTime > CLASH_TIME) {
                    ultimateTimeDisplay.textContent = "0 SECONDS LEFT!"
                } else {
                    ultimateTimeDisplay.textContent = ((CLASH_TIME - elapsedTime) / 1000).toString() + " SECONDS LEFT!"
                }

                if (challengers.player1.stats.hp < challengers.player1.baseStats.hp){
                    const amount = challengers.player1.baseStats.hp - challengers.player1.stats.hp
                    challengers.player1.damageTaken += amount

                    challengers.player1.stats.hp += amount
                    challengers.player1.updateLabel()
                }
                if (challengers.player2.stats.hp < challengers.player2.baseStats.hp){
                    const amount = challengers.player2.baseStats.hp - challengers.player2.stats.hp
                    challengers.player2.damageTaken += amount

                    challengers.player2.stats.hp += amount
                    challengers.player2.updateLabel()
                }
                
                if (challengers.player1.damageTaken < challengers.player2.damageTaken) {
                    challengers.player1.indicate(`${challengers.player1.name} is about to use their ULTIMATE! ${challengers.player1.damageTaken}%`)
                    
                } else if (challengers.player1.damageTaken > challengers.player2.damageTaken) {
                    challengers.player2.indicate(`${challengers.player2.name} is about to use their ULTIMATE! ${challengers.player2.damageTaken}%`)
                    
                } else {
                    challengers.player1.indicate(`ITS A STAND OFF!`)
                    challengers.player2.indicate(`ITS A STAND OFF!`)
                }
                
            }, 1000)

            fadeAudio(theme, 0.7, 3000)
            currentActiveAudio = theme

            // ── Helper: restore movesets and reset clash state ───────────────
            function endClash() {
                clashing = false

                // Restore original dimensions
                challengers.player1.width  = challengers.player1.base.width
                challengers.player1.height = challengers.player1.base.height
                challengers.player2.width  = challengers.player2.base.width
                challengers.player2.height = challengers.player2.base.height

                clearInterval(timeInterval)
                creaturebattleframe.style.background = 'transparent'

                if (window.CONFIG.match.type !== 'quickmatch') roundInfo.style.display = 'flex'
                ultimateTimeDisplay.style.display = 'none'

                if (challengers.player1.damageTaken < challengers.player2.damageTaken) {
                    config.player1Action()
                    challengers.player1.indicate(`${challengers.player1.name}'s ULTIMATE WENT THROUGH!`)
                    
                } else if (challengers.player2.damageTaken < challengers.player1.damageTaken) {
                    config.player2Action()
                    challengers.player2.indicate(`${challengers.player2.name}'s ULTIMATE WENT THROUGH!`)
                } else {
                    // True tie — random winner
                    if (Math.random() > 0.5) {
                        config.player1Action()
                        challengers.player1.indicate(`${challengers.player1.name}'s ULTIMATE WENT THROUGH!`)
                    } else {
                        config.player2Action()
                        challengers.player2.indicate(`${challengers.player2.name}'s ULTIMATE WENT THROUGH!`)
                    }
                }

                challengers.player1.stats.spd = challengers.player1.baseStats.spd
                challengers.player2.stats.spd = challengers.player2.baseStats.spd

                challengers.player1.ultimateActive = false
                challengers.player2.ultimateActive = false

                CLASH_WINDOW = null
                config.player1       = null
                config.player2       = null
                config.player1Action = null
                config.player2Action = null

                playRetreivedAudio('glass-break')
            }

            theme.onended = () => {
                endClash()    
                startTheme('battle')
            }

        }


    }, CLASH_TIME_WINDOW)
}


// function test(){
//     const baseMoves = ["PUNCH", "BLOCK", "LUNGE", "RUSH"]

//     if (challengers.player1) {
//         const attackKeys = ['q', 'e', 'z', 'x']
//         attackKeys.forEach((key, index) => {
//             const attackName = baseMoves[index]
//             challengers.player1.keysToAttack[key].name = null
//             challengers.player1.keysToAttack[key].stats = null
            
//             challengers.player1.keysToAttack[key].name = attackName
//             challengers.player1.keysToAttack[key].stats = JSON.parse(JSON.stringify(attackFunctions[attackName].stats))
            
//             updatePlayerList(challengers.player1, false)
//             challengers.player1.updateLabel()  
//         })
        
//     }
    
//     if (challengers.player2){
//         const attackKeys = ['o', 'p', 'l', 'k']
//         attackKeys.forEach((key, index) l=> {
//             const attackName = baseMoves[index]
//             challengers.player2.keysToAttack[key].name = null
//             challengers.player2.keysToAttack[key].stats = null
            
//             challengers.player2.keysToAttack[key].name = attackName
//             challengers.player2.keysToAttack[key].stats = JSON.parse(JSON.stringify(attackFunctions[attackName].stats))
            
//             updatePlayerList(challengers.player2, false)
//             challengers.player2.updateLabel()  
//         })
//     }    
// }