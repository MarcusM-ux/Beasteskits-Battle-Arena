registerAttack('SPARKLE RUSH', {
    stats: {dmg: 10, type: 'Light', cooldown: {time: 15000, switch: false}}, action: (player, target)=> {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: 'red',
            duration: 2000,
            dmg: 5,
            type: "Light"
        }

        let life = 0
        let hit = 0
        
        // --- FIX: Store inner intervals to clear them later ---
        let activeDamageBoxes = [];

        const fadedInterval = setInterval(() => {
            let fireBox = JSON.parse(JSON.stringify(box))
            
            // Effect
            spawnEffect(player.x, player.y, player.width, player.height, `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`, 3000)

            let boxLife = 0
            const lifeInt = setInterval(() => {
                if (boxLife > fireBox.duration) {
                    clearInterval(lifeInt)
                }
                boxLife += 100
                if (checkCollision(fireBox, target) && hit < 4) {
                    hit++
                    stun(target, 1500)
                    // attackResults(player, fireBox, target)
                    rebukeCollision(target, fireBox, 2)
                }
            }, 100)
            
            // Add inner interval to tracker
            activeDamageBoxes.push(lifeInt);

            if (life > 3000) {
                // --- FIX: Clear all inner intervals when parent ends ---
                activeDamageBoxes.forEach(id => clearInterval(id));
                clearInterval(fadedInterval)
                stun(player, 1500)
            }
            life += 100
        }, 100)

        const attributes = attackFunctions["SPARKLE RUSH"].stats
        box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            type: attributes.type,
            dmg: attributes.dmg,
            duration: 3000,
            color: 'white'
        }

        stun(player, box.duration)
        // Rush Directionally
        let rushLife = 0
        let incrementOverTime = 1.15
        let bonusDamage = 1
        let escapeChance = 0.15
        
        playRetreivedAudio('running-sounds')

        const rush = setInterval(()=>{
            rushLife += 100
            player.x += (player.facingRight) ? 10 * incrementOverTime : -10 * incrementOverTime 
            
            incrementOverTime += 0.15
            
            if (checkCollision(player, target)) 
            {
                bonusDamage = incrementOverTime
                clearInterval(rush)

                cancelAudio('running-sounds') 
                stun(target, box.duration)
                stun(player, box.duration)

                target.x -= 30

                playRetreivedAudio('punch')

                let time = 0
                let hasMoved = false
                const chanceToEscape = Math.random()
                const playtime = setInterval(()=>{

                    time += 100
                    if (time < 1000) {
                        target.y -= 5 * incrementOverTime
                    } else {
                        target.y += 5 * incrementOverTime
                    }

                    if (target.isPlayer1) {
                        if (keybinds.movement.w || 
                        keybinds.movement.s || 
                        keybinds.movement.a || 
                        keybinds.movement.d) {
                            hasMoved = true
                        }
                        
                    }else {
                        if (keybinds.movement.arrowup || 
                        keybinds.movement.arrowdown || 
                        keybinds.movement.arrowleft || 
                        keybinds.movement.arrowright) {
                            hasMoved = true
                        }
                        
                    }

                    if (hasMoved) {
                        escapeChance += 0.05
                        hasMoved = false
                    }

                    if (escapeChance > chanceToEscape && time > 1000) {
                        player.indicate(`${target.name} escaped from the sparkle rush!`)
                        stun(player, 1200)
                        target.x += (player.facingRight) ? -50 : 50
                        target.stats.hp -= 8
                        player.updateLabel()
                        target.updateLabel()
                        clearInterval(playtime)
                    }

                    spawnEffect(target.x, target.y, target.width, target.height, `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`, 100)
                    
                    if (time > 2000) {
                        let baseDMG = box.dmg
                        if (bonusDamage > 1.8) bonusDamage = 1.8
                        box.dmg *= bonusDamage

                        attackResults(player, box, target)
                        playRetreivedAudio('punch')
                        incrementOverTime = 1.15
                        clearInterval(playtime)
                    }
                    
                }, 100)
            }
            
            if (rushLife > 5000 || player.x >= canvas.width - player.width || player.x <= 0 + 10){
                incrementOverTime = 1.15
                clearInterval(rush)
                cancelAudio('running-sounds') 
            }
        }, 100)
        // If catch player then slam them up (damage), slam them down (damage + stun)

        // They can escape but rapid pressing their keys with an base 30% chance to escape, +25% if they resist the type / escape by pressing keys that fill up a meter that represents when you can escape
    }
})