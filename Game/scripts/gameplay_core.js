const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const csf = document.querySelector('#creature-selection-frame')
const playerTurnSelection = document.querySelector('#player-turn-selection')
const logo = document.querySelector('#logo')

const players = []
const obstacles = []

let challengers = {
    player1: {chosen: false, creature: null},
    player2: {chosen: false, creature: null}
}

let canBattle = false

function setCanvas(){
    canvas.width = 500
    canvas.height = 500
    canvas.style.backgroundColor = 'lightgreen'
}
setCanvas()

function determineHealthBarColor(og, current){
    const value = (current * 100) / og
    
    if (value >= 80){
        return 'lightgreen'
    }
    if (value >= 60){
        return 'yellow'
    }
    
    if (value >= 45){
        return 'orange'
    }
    if (value >= 0){
        return 'red'
    }
}

class Obstacle {
    constructor(image, x, y){
        this.image = new Image()
        this.image.onload = () => {}
        this.image.src = image

        this.x = x
        this.y = y
        this.width = 64
        this.height = 64
    }

    draw(){
        if (this.image.complete) {
            ctx.drawImage(
                this.image, 
                this.x, 
                this.y, 
                this.width, 
                this.height
            )
        }
    }
    
}

class Player{
    constructor(data, value, name){
        this.image = new Image()
        this.opacity = 1
        
        this.rotation = 0
        this.spriteOffset = (data.spriteOffset || 0) * (Math.PI / 180);
        this.isPlayer1 = (value === 1) ? true : false
        

        this.stats = JSON.parse(JSON.stringify(data.stats))
        this.baseStats = JSON.parse(JSON.stringify(data.stats))
        
        this.moveset = data.moveset
        this.type = data.type

        this.y = 200
        this.x = (this.isPlayer1) ? 25 : 400

        this.vx = this.stats.spd
        this.vy = this.stats.spd

        this.maxSpeed = this.stats.spd
        this.originalVelocity = this.stats.spd
        this.stunTimer = null
        
        this.width = 64
        this.height = 64
        this.friction = 0.9  // friction coefficient for glide slowdown
        
        this.image.onload = () => {}
        this.image.src = data.image

        this.facingRight = (value === 1)
        this.blocking = false

        this.name = name

        if (this.isPlayer1){
            this.keysToAttack = {
                q: {name: '', stats: ''},
                e: {name: '', stats: ''},
                z: {name: '', stats: ''},
                x: {name: '', stats: ''}
            }
        }else{
            this.keysToAttack = {
                j: {name: '', stats: ''},
                k: {name: '', stats: ''},
                l: {name: '', stats: ''},
                m: {name: '', stats: ''}
            }
        }

        // Assign each key to a move
        const attackKeys = Object.keys(this.keysToAttack)
        this.moveset.forEach((move, index) => {
            const key = attackKeys[index]
            if (key) {
                this.keysToAttack[key].name = move
                this.keysToAttack[key].stats = JSON.parse(JSON.stringify(attackFunctions[move].stats))}
        })

    }

    draw(){
        ctx.save()
        //// Move "pin" to the center of the player
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Rotate the player locally
        if (this.stunTimer && this.rotation !== 0){
            ctx.rotate(this.rotation - this.spriteOffset)
        }
        if (this.facingRight) {
            ctx.scale(-1, 1)
        }
        ctx.globalAlpha = this.opacity
    
        // Handle horizontal flipping
        // Draw image offset by half width/height to keep it centered
        ctx.drawImage(
             this.image, 
            -this.width / 2, 
            -this.height / 2, 
            this.width, 
            this.height
        )
    
        ctx.restore()
    }


    borders(){
        if (this.x <= 0) this.x = 0
        if (this.x + this.width >= canvas.width) this.x = canvas.width - this.width

        if (this.y <= 0) this.y = 0
        if (this.y + this.height >= canvas.height) this.y = canvas.height - this.height
    }

    updateLabel(){
        if (this.isPlayer1){
            const healthLabel = document.querySelector('#player1-hp')
            healthLabel.textContent = `${this.name}: HP ${this.stats.hp} / ${creatures[this.name].stats.hp}`
            
            healthLabel.style.color = determineHealthBarColor(creatures[this.name].stats.hp, this.stats.hp)
        }else {
            const healthLabel = document.querySelector('#player2-hp')
            healthLabel.textContent = `${this.name}: HP ${this.stats.hp} / ${creatures[this.name].stats.hp}`
            
            healthLabel.style.color = determineHealthBarColor(creatures[this.name].stats.hp, this.stats.hp)
        }
    }

    indicate(message){
        if (this.isPlayer1){
            const podDisplay = document.querySelector('#player1-label')
            podDisplay.textContent = message
        }else {
            const ptdDisplay = document.querySelector('#player2-label')
            ptdDisplay.textContent = message
        }
    }
}

const catalog = document.querySelector('#attacksCatalog')
for (const [name, data] of Object.entries(attackFunctions)) {
    const li = document.createElement('li')
    li.innerHTML = `<p style='font-size: 4vw;'>${name}</p> <br> ${attackDescriptions[name]}`
    li.children[0].style.color = colorFromType(data.stats.type)
    catalog.appendChild(li)
    li.classList.add('catalog-element')
}

const typeContainer = document.querySelector('#typeChartDisplay')
const contentTypeContainer = document.querySelector('#content-type-container')
for (const type in typeChart) {
    const li = document.createElement('li')
    li.style.color = 'white'
    li.innerHTML = `<p style='color: ${colorFromType(type)}'>${type}:<p> Strong (2x) vs. ${typeChart[type].strong} | Weak (0.5x) vs. ${typeChart[type].weak}`
    li.classList.add('type-element')
    contentTypeContainer.appendChild(li) 
}

const pageContainer = document.querySelector('#creature-selection-holder')
const maxPerPage = 4

const totalCreatures = Object.keys(creatures).length
const maxPages = Math.ceil(totalCreatures / maxPerPage) 

let currentPageIndex = 0
let pageIndex = 1

for (let index = 0; index < maxPages; index++ ){
    const newPage = document.createElement('div')
    newPage.classList.add('page')
    pageContainer.appendChild(newPage)

    newPage.id = `selection-page${pageIndex}`
    if (pageIndex === 1) {
        newPage.style.display = 'flex'
        newPage.classList.add('flex-status')
    }
    pageIndex++
}

function managePage(value) {
    const allPages = document.querySelectorAll('.page')
    let oldIndex = currentPageIndex
    
    // Calculate new index and clamp it between 0 and total pages
    let newIndex = Math.max(0, Math.min(allPages.length - 1, currentPageIndex + value))

    if (oldIndex !== newIndex) {
        currentPageIndex = newIndex // Update the global state

        // Hide the old page
        allPages[oldIndex].style.display = 'none'
        allPages[oldIndex].classList.remove('flex-status')

        // Show the new page
        allPages[newIndex].style.display = 'flex'
        allPages[newIndex].classList.add('flex-status')
    }
}

const lastPageButton = document.querySelector('#last-page')
const nextPageButton = document.querySelector('#next-page')

lastPageButton.addEventListener('click', () => managePage(-1))
nextPageButton.addEventListener('click', () => managePage(1))

let currentFillingPage = 0

for (const [name, data] of Object.entries(creatures)){

    const creature = data
    
    const container = document.createElement('div')
    const button = document.createElement('button')
    const img = document.createElement('img')
    const p = document.createElement('p')

    // Get all page elements we created earlier
    const allPages = document.querySelectorAll('.page')
    let targetPage = allPages[currentFillingPage]

    if (targetPage.children.length >= maxPerPage) {
        currentFillingPage++
        targetPage = allPages[currentFillingPage]
    }

    targetPage.appendChild(container)

    // holder.appendChild(container)
    container.appendChild(button)
    container.appendChild(img)
    container.appendChild(p)

    img.src = creature.image
    button.innerHTML = `choose <br> <b>${name}</b>`
    p.textContent = `Type: ${creature.type}`
    
    container.classList.add('creature-box')
    button.classList.add('creature-chooseButton')
    p.classList.add('creature-type')

    p.style.color = colorFromType(creature.type)

    
    img.addEventListener('click', () => {
        const nameDisplay = document.querySelector('#name-display')
        const imageDisplay = document.querySelector('#image-display')
        const statusDisplay = document.querySelector('#status-display')
        const attacksDisplay = document.querySelector('#attacks-display')
        const typeDisplay = document.querySelector('#type-display')

        document.querySelector('#beasteskitStatusDisplay').style.backgroundColor = colorFromType(creature.type)
        nameDisplay.textContent = name
        imageDisplay.src = img.src
        typeDisplay.textContent = creature.type
        
        // Clear old data
        statusDisplay.replaceChildren()
        attacksDisplay.replaceChildren()
    
        // Loop through Stats (Object)
        // entry[0] is the name (e.g., 'Health'), entry[1] is the value (e.g., 100)
        for (const [statName, statValue] of Object.entries(creature.stats)) {
            const li = document.createElement('li')
            li.className = 'status-list' // Match your CSS class
            li.textContent = `${statName}: ${statValue}`
            statusDisplay.appendChild(li)
        }
    
        // Loop through Attacks (Assuming it's an Array or Object)
        // If attacks is an array of strings:
        creature.moveset.forEach(attackName => {
            const li = document.createElement('li')
            li.className = 'status-list'
            const attributes = attackFunctions[attackName].stats
        
            // Start with the name and type which every move has
            let displayText = `${attackName} | Type: ${attributes.type}`
        
            // Logic: Only add info if the value is greater than 0
            if (attributes.dmg > 0 && attributes.heal > 0) {
                displayText += ` | Dmg: ${attributes.dmg} | Heal: ${attributes.heal}`
            } else if (attributes.dmg > 0) {
                displayText += ` | Dmg: ${attributes.dmg}`
            } else if (attributes.heal > 0) {
                displayText += ` | Heal: ${attributes.heal}`
            } else {
                // If it has neither damage nor heal, it's a utility/movement move
                displayText += ` | Movement`
            }
        
            li.textContent = displayText
            attacksDisplay.appendChild(li)
        })
    
    })
    
    button.addEventListener('click', () => {
        if (canBattle) return
        if (!challengers.player1.chosen){
            
            const player = new Player(creatures[name], 1, name)
            challengers.player1.chosen = true
            players.push(player)
            challengers.player1.creature = player
            button.style.color = 'blue'
            
            playerTurnSelection.style.color = 'red'
            playerTurnSelection.textContent = 'Player Two, Choose Your Creature!'
            
        }else {
            const player = new Player(creatures[name], 2, name)
            challengers.player2.chosen = true
            players.push(player)
            challengers.player2.creature = player
            
            button.style.color = 'red'
            playerTurnSelection.style.color = 'gray'
            playerTurnSelection.textContent = 'STARTING MATCH...'
            canBattle = true
            
        }

        setTimeout(function(){
            button.style.color = 'lightgray'
            if (canBattle){
                startBattle()
                playerTurnSelection.style.color = 'blue'
                playerTurnSelection.textContent = 'Player One, Choose Your Creature'
            }
            canBattle = false
        }, 1000) 
        // Ensure when playing for real you make this 6000 miliseconds

    })
}
currentPageIndex = 0

const creaturebattleframe = document.querySelector('#creature-battle-frame')
const creatureframe = document.querySelector('#creature-frame')
function startBattle(){
    
    document.querySelector('body').style.backgroundColor = 'white'
    document.querySelectorAll('.home-screen-button').forEach(element => {
        element.style.display = 'none'
    })
    document.querySelectorAll('.creature-frame-button').forEach(element => {
            element.style.display = 'none'
    })
    document.querySelector('#beasteskitStatusDisplay').style.display = 'none'
    document.querySelector('#typeChartDisplay').style.display = 'none'
    document.querySelector('#attacksCatalog').style.display = 'none'

    logo.style.display = 'none'
    typeContainer.style.display = 'none'

    creaturebattleframe.style.display = 'flex'
    creatureframe.style.display = 'none'

    const attackDisplays = document.querySelectorAll('.attack-display')
    attackDisplays.forEach(el => {
        el.style.display = 'flex'
    })

    // csf.style.display = 'none'

    const randomAmount = Math.floor(Math.random() * 3) + 1
    const MIN_DISTANCE = 90   // spacing between obstacles
    const MAX_ATTEMPTS = 50

    for (let i = 0; i < randomAmount; i++) {
        let placed = false

        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            const x = Math.random() * (canvas.width - 64)
            const y = Math.random() * (canvas.height - 64)

            if (isPositionValid(x, y, obstacles, MIN_DISTANCE)) {
                obstacles.push(new Obstacle('../Obstacles/block.png', x, y))
                placed = true
                break
            }
        }

        if (!placed) {
            console.warn('Could not place obstacle without overlap')
        }
    }

    const plrOneList = document.querySelector('#list-attacks-player1')
    const plrTwoList = document.querySelector('#list-attacks-player2')
    if (challengers.player1.creature && challengers.player2.creature){
        
        challengers.player1.creature.updateLabel()
        challengers.player2.creature.updateLabel()
        
        const player1AttackKeys = Object.keys(challengers.player1.creature.keysToAttack)
        player1AttackKeys.forEach((key, index) => {
            const keyStats = challengers.player1.creature.keysToAttack[key]
            if (!keyStats.name || !keyStats.stats) return

            function determineString(){
                if (keyStats.stats.heal && keyStats.stats.dmg){
                    return `Heal: ${keyStats.stats.heal} | Damage: ${keyStats.stats.dmg}`
                }else if (keyStats.stats.heal && !keyStats.stats.dmg){
                    return `Heal: ${keyStats.stats.heal}`
                }else if (keyStats.stats.dmg && !keyStats.stats.heal){
                    return `Damage: ${keyStats.stats.dmg}`
                }else {
                    return 'Movement'
                }
            }
            
            const li = document.createElement('li')
            li.textContent = `Keybind ${key.toUpperCase()} | ${keyStats.name.toUpperCase()} | ${determineString()} | Type ${keyStats.stats.type}`
            plrOneList.appendChild(li)

            li.style.color = colorFromType(keyStats.stats.type)
            li.id = `${key}-attack`
            li.classList.add('attack-list')
        })
        
        const player2AttackKeys = Object.keys(challengers.player2.creature.keysToAttack)
        player2AttackKeys.forEach((key, index) => {
            const keyStats = challengers.player2.creature.keysToAttack[key]
            if (!keyStats.name || !keyStats.stats) return
            
            function determineString(){
                if (keyStats.stats.heal && keyStats.stats.dmg){
                    return `Heal: ${keyStats.stats.heal} | Damage: ${keyStats.stats.dmg}`
                }else if (keyStats.stats.heal && !keyStats.stats.dmg){
                    return `Heal: ${keyStats.stats.heal}`
                }else if (keyStats.stats.dmg && !keyStats.stats.heal){
                    return `Damage: ${keyStats.stats.dmg}`
                }else {
                    return 'Movement'
                }
            }
            
            const li = document.createElement('li')
            li.textContent = `Keybind ${key.toUpperCase()} | ${keyStats.name.toUpperCase()} | ${determineString()} | Type ${keyStats.stats.type}`

            plrTwoList.appendChild(li)
            li.style.color = colorFromType(keyStats.stats.type)
            li.id = `${key}-attack`
            li.classList.add('attack-list')
        })
    }

    challengers.player1.creature.indicate('')
    challengers.player2.creature.indicate('')
    toggleTHEMES(false)
}

let stopAnimation = false
let animationId
function endBattle(isPlayer1){
    obstacles.length = 0
    const winnerHeading = document.querySelector('#winner-heading')
    winnerHeading.classList.add('bounceIn')
    winnerHeading.style.display = 'block'
    if (isPlayer1) {
        winnerHeading.textContent = `Player Two's ${challengers.player2.creature.name} Wins!`
    } else {
        winnerHeading.textContent = `Player One's ${challengers.player1.creature.name} Wins!`
    }
    toggleTHEMES(true)

    const darkTransition = document.querySelector('#dark-transition')
    darkTransition.classList.add('slideUp')
    darkTransition.style.display = 'block'
   
    const pause = setTimeout(()=>{

        stopAnimation = true
        cancelAnimationFrame(animationId)
        logo.style.display = 'block'
       
        challengers.player1.creature = null
        challengers.player2.creature = null
   
        challengers.player1.chosen = false
        challengers.player2.chosen = false
        players.length = 0
       
        const plrOneList = document.querySelector('#list-attacks-player1')
        const plrTwoList = document.querySelector('#list-attacks-player2')
   
        plrOneList.replaceChildren()
        plrTwoList.replaceChildren()
   
        document.querySelector('#subcreature-frame').style.display = 'flex'
        creaturebattleframe.style.display = 'none'
        // csf.style.display = 'flex'
        creatureframe.style.display = 'flex'
       
        const attackDisplays = document.querySelectorAll('.attack-display')
        attackDisplays.forEach(el => {
            el.style.display = 'none'
        })
       
        winnerHeading.classList.remove('bounceIn')
        winnerHeading.style.display = 'none'
       
        document.querySelectorAll('.home-screen-button').forEach(element => {
            element.style.display = 'block'
        })
        document.querySelectorAll('.creature-frame-button').forEach(element => {
            element.style.display = 'block'
        })
       
        document.querySelector('body').style.backgroundColor = '#9e55bd'
        
        window.dispatchEvent(new Event('restartGame'))
        clearTimeout(pause)
       
    }, 4050)


    const pause2 = setInterval(()=>{
        darkTransition.classList.remove('slideUp')
        darkTransition.style.display = 'none'
        clearTimeout(pause2)
    }, 7000)
}

function player1Checks(playerOne, target){
   
    const movement = keybinds.movement
    const acceleration = 1
    const maxSpeed = playerOne.maxSpeed
   
    if (movement.w) {
        playerOne.vy = -maxSpeed // Move up
    } else if (movement.s) {
        playerOne.vy = maxSpeed  // Move down
    } else {
        // Apply friction to vertical velocity only when NO key is pressed
        playerOne.vy *= playerOne.friction
    }
   
    // Horizontal Input
    if (movement.d) {
        playerOne.vx = maxSpeed // Move right
        if (!playerOne.stunTimer) {
            playerOne.facingRight = true
        }
    } else if (movement.a) {
        playerOne.vx = -maxSpeed // Move left
        if (!playerOne.stunTimer) {
            playerOne.facingRight = false
        }
    } else {
        playerOne.vx *= playerOne.friction
    }
   
    if (Math.abs(playerOne.vx) < 0.1) playerOne.vx = 0
    if (Math.abs(playerOne.vy) < 0.1) playerOne.vy = 0
   
    const attacks = keybinds.attacks
    for (const attackKey of Object.keys(playerOne.keysToAttack)){
        if (attacks[attackKey] === true && playerOne){
            if (attackFunctions[playerOne.keysToAttack[attackKey].name] &&
                playerOne.keysToAttack[attackKey].stats.cooldown.switch == false){
                                             
                attackFunctions[playerOne.keysToAttack[attackKey].name].action(playerOne, target)
               
                playerOne.keysToAttack[attackKey].stats.cooldown.switch = true


                const desiredElement = document.querySelector(`#${attackKey}-attack`)
                const originalText = desiredElement.textContent


                desiredElement.innerHTML = `${playerOne.keysToAttack[attackKey].name} | Cooldown <br>(${playerOne.keysToAttack[attackKey].stats.cooldown.time * 0.001} seconds)`
               
                const timeOut = setTimeout(() => {
                    playerOne.keysToAttack[attackKey].stats.cooldown.switch = false
                    desiredElement.textContent = originalText
                    clearTimeout(timeOut)
                }, playerOne.keysToAttack[attackKey].stats.cooldown.time)
               
            }
        }
    }


    if (playerOne.stunTimer) return
    playerOne.x += playerOne.vx
    playerOne.y += playerOne.vy  
   
}

function player2Checks(playerTwo, target){
   
    const movement = keybinds.movement
    const acceleration = 1
    const maxSpeed = playerTwo.maxSpeed
   
    if (movement.arrowup) {
        playerTwo.vy = -maxSpeed // Move up
    } else if (movement.arrowdown) {
        playerTwo.vy = maxSpeed  // Move down
    } else {
        // Apply friction to vertical velocity only when NO key is pressed
        playerTwo.vy *= playerTwo.friction
    }
   
    // Horizontal Input
    if (movement.arrowright) {
        playerTwo.vx = maxSpeed // Move right
        if (!playerTwo.stunTimer) {
            playerTwo.facingRight = true
        }
    } else if (movement.arrowleft) {
        playerTwo.vx = -maxSpeed // Move left
        if (!playerTwo.stunTimer) {
            playerTwo.facingRight = false
        }
    } else {
        playerTwo.vx *= playerTwo.friction
    }
   
    if (Math.abs(playerTwo.vx) < 0.1) playerTwo.vx = 0
    if (Math.abs(playerTwo.vy) < 0.1) playerTwo.vy = 0


    const attacks = keybinds.attacks
    for (const attackKey of Object.keys(playerTwo.keysToAttack)){
        if (attacks[attackKey] === true){
            if (attackFunctions[playerTwo.keysToAttack[attackKey].name] &&
                playerTwo.keysToAttack[attackKey].stats.cooldown.switch == false){
                                       
                attackFunctions[playerTwo.keysToAttack[attackKey].name].action(playerTwo, target)
                playerTwo.keysToAttack[attackKey].stats.cooldown.switch = true


                const desiredElement = document.querySelector(`#${attackKey}-attack`)
                const originalText = desiredElement.textContent


                desiredElement.innerHTML = `${playerTwo.keysToAttack[attackKey].name} | Cooldown <br>(${playerTwo.keysToAttack[attackKey].stats.cooldown.time * 0.001} seconds)`
               
                const timeOut = setTimeout(() => {
                    playerTwo.keysToAttack[attackKey].stats.cooldown.switch = false
                    desiredElement.textContent = originalText
                    clearTimeout(timeOut)
                }, playerTwo.keysToAttack[attackKey].stats.cooldown.time)
               
            }
        }
    }


    if (playerTwo.stunTimer) return
    playerTwo.x += playerTwo.vx
    playerTwo.y += playerTwo.vy  
   
}


function animation(){
    if (stopAnimation){
        stopAnimation = false
        cancelAnimationFrame(animationId)
        return
    }
    
    animationId = requestAnimationFrame(animation)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const now = Date.now()
    for (let i = activeEffects.length - 1; i >= 0; i--) {
        const effect = activeEffects[i]

        if (now > effect.expiry) {
            activeEffects.splice(i, 1)
        } else {
            ctx.fillStyle = effect.color
            ctx.fillRect(effect.x, effect.y, effect.width, effect.height)
        }
    }

    players.forEach(player => {
        player.draw()
        player.borders()
        if (player.stats.hp <= 0){
            endBattle(player.isPlayer1)
            stopAnimation = true
        }
    })
    obstacles.forEach(object => {
        object.draw()
        players.forEach(player => {
            noCollision(player, object)
        })
        
    })
    
    const playerOne = challengers.player1.creature
    const playerTwo = challengers.player2.creature
    if (playerOne && playerTwo){
        
        player1Checks(playerOne, playerTwo)
        player2Checks(playerTwo, playerOne)
    }

}
animation()

addEventListener('restartGame', () => {
    stopAnimation = false
    animation()
})
    
addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase()
    const playerOne = challengers.player1.creature
    const playerTwo = challengers.player2.creature

    if (playerOne && playerTwo){
        if (key in keybinds.movement){
            keybinds.movement[key] = true
            
        }else if (key in keybinds.attacks){
            keybinds.attacks[key] = true
        }
    }    
})

addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase()  
    const playerOne = challengers.player1.creature
    const playerTwo = challengers.player2.creature
    
    if (playerOne && playerTwo){
        if (key in keybinds.movement){
            keybinds.movement[key] = false
            
        }else if (key in keybinds.attacks){
            keybinds.attacks[key] = false
        }
    }    
})