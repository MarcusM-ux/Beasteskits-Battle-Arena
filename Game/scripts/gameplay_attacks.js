const attackFunctions = {
    CHOMP: {stats: { dmg: 5, type: 'Dark', cooldown: { time: 5000, switch: false }}, action: (player, target) => {
            const attackStats = attackFunctions.CHOMP.stats
            let box = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                color: 'black',
                dmg: attackStats.dmg,
                type: 'Dark', 
                duration: 500
            }
            stun(player, box.duration)

            if (player.facingRight) {
                box.x = player.x + player.width
            } else {
                box.x = player.x - player.width
            }

            spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)

            if (checkCollision(box, target)) {
                stun(target, box.duration / 2)
                attackResults(player, box, target)
            }
        }
    },

    DODGE: {stats: { type: 'Basic', cooldown: { time: 5000, switch: false }}, action: (player) => {
            let box = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                color: 'white',
                duration: 1000
            }

            if ((keybinds.movement.w && player.isPlayer1) || (keybinds.movement.arrowup && !player.isPlayer1)) {
                player.y -= 64
                box.y -= 64
                box.height += player.height
            } else if ((keybinds.movement.s && player.isPlayer1) || (keybinds.movement.arrowdown && !player.isPlayer1)) {
                player.y += 64
                box.height += player.height
            } else {
                if (Math.random() > 0.5) {
                    player.y -= 64
                    box.y -= 64
                    box.height += player.height
                } else {
                    player.y += 64
                    box.height += player.height
                }
            }
            spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
            stun(player, box.duration / 2)
            player.indicate(`${player.name} dodged!`)
        }
    },
    
    BLOAT: { stats: { heal: 10, type: 'Basic', cooldown: { time: 8000, switch: false }}, action: (player) => {
            let box = {
                x: player.x, 
                y: player.y, 
                width: player.width, 
                height: player.height, 
                color: 'lime', 
                duration: 2000 
            }
            spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
            stun(player, box.duration)

            const healAmount = attackFunctions.BLOAT.stats.heal
            player.stats.hp += healAmount
            const maxHp = creatures[player.name].stats.hp
            player.stats.hp = Math.min(player.stats.hp, maxHp)

            player.updateLabel()
            player.indicate(`${player.name} healed itself!`)
        }
    },

    PUDDLE: {stats: { dmg: 2, type: 'Water', cooldown: { time: 10000, switch: false } }, action: (player, target) => {
            let box = {
                x: player.x,
                y: player.y,
                width: player.width * 3,
                height: player.height * 3,
                color: 'lightblue',
                duration: 2000,
                dmg: 2,
                type: 'Water'
            }

            let factor = 0.90
            let newBox = JSON.parse(JSON.stringify(box))
            spawnEffect(newBox.x, newBox.y, newBox.width, newBox.height, newBox.color, newBox.duration)
                if (checkCollision(newBox, player)) {
                    player.maxSpeed = player.baseStats.spd * 0.1
                } else if (!player.stunTimer) {
                    player.maxSpeed = player.baseStats.spd
                }

                // Target Damage and Slow
                if (checkCollision(newBox, target)) {
                    target.maxSpeed = target.baseStats.spd * 0.1
                    
                    let { message, damage } = dealDamage(player, newBox, target)
                    target.stats.hp -= damage
                    target.updateLabel()
                    target.indicate(message)
                    
                } else if (!target.stunTimer) {
                    target.maxSpeed = target.baseStats.spd
                }
            
            const interval = setInterval(() => {
                spawnEffect(newBox.x, newBox.y, newBox.width, newBox.height, newBox.color, newBox.duration)

                // Self Slow
                if (checkCollision(newBox, player)) {
                    player.maxSpeed = player.baseStats.spd * 0.1
                } else if (!player.stunTimer) {
                    player.maxSpeed = player.baseStats.spd
                }

                // Target Damage and Slow
                if (checkCollision(newBox, target)) {
                    target.maxSpeed = target.baseStats.spd * 0.1
                    
                    let { message, damage } = dealDamage(player, newBox, target)
                    target.stats.hp -= damage
                    target.updateLabel()
                    target.indicate(message)
                    
                } else if (!target.stunTimer) {
                    target.maxSpeed = target.baseStats.spd
                }

                if (newBox.width <= 30) {
                    clearInterval(interval)
                    if (!player.stunTimer) player.maxSpeed = player.baseStats.spd
                    if (!target.stunTimer) target.maxSpeed = target.baseStats.spd
                } else {
                    factor -= 0.1
                }
                newBox.width *= factor
                newBox.height *= factor
                
            }, 2000)
        }
    },

    STATIC: {stats: { dmg: 1, type: 'Electric', cooldown: { time: 2000, switch: false } }, action: (player, target) => {
            const attributes = attackFunctions.STATIC.stats
            let box = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                color: 'yellow',
                dmg: attributes.dmg,
                type: 'Electric',
                duration: 1000
            }
            stun(player, box.duration * 2)

            if (player.facingRight) {
                box.x += player.width
            } else {
                box.x -= player.width
            }
            spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)

            if (checkCollision(box, target)) {
                stun(target, box.duration)
                
                let { message, damage } = dealDamage(player, box, target)
                target.stats.hp -= damage
                target.updateLabel()
                target.indicate(message)
            }
        }
    },
    FIREBOLT : {stats : {dmg: 8, type: 'Fire', cooldown : {time: 7000, switch: false}}, action: (player, target) => {
            const attributes = attackFunctions.FIREBOLT.stats
            let box = {
                x: player.x, 
                y: player.y, 
                width: 20, 
                height: 20, 
                dmg: attributes.dmg,
                duration: 5000, 
                type: 'Fire', 
                color: 'red'
            }

            let fireBalls = Math.floor(Math.random() * 5) + 1

            for (let index = fireBalls; index > 0; index--){
                let newFireball = JSON.parse(JSON.stringify(box))

                if (Math.random() > 0.5) {
                    newFireball.y -= Math.ceil(Math.random() * 50) + 1
                }else {
                    newFireball.y += Math.ceil(Math.random() * 50) + 1
                }
                
                let facingRight = player.facingRight
                if (facingRight) {
                    newFireball.x += player.width
                } else {
                    newFireball.x -= player.width
                }
                
                let life = 0
                let fireBallInterval = setInterval(() => {
                    newFireball.x += facingRight ? 15 : -15
                    spawnEffect(newFireball.x, newFireball.y, newFireball.width, newFireball.height, 'red', 200)

                    if (checkCollision(newFireball, target)) {
                        attackResults(player, newFireball, target)
                        clearInterval(fireBallInterval)
                    }
                    
                    life += 200 // Increment by the interval time
                    if (life > newFireball.duration) {
                        clearInterval(fireBallInterval)
                    }
                }, 200)

            }
        }
    },
    ["SHADOW STEP"] : {stats: {type: 'Dark', cooldown: {time: 7500, switch: false}}, action: (player, target) => {
                let box = {
                        x: player.x,
                        y: player.y,
                        width: player.width,
                        height: player.height,
                        color: 'rgba(128, 128, 128, 0.5)',
                        duration: 5000
                }
        
                if ((keybinds.movement.w && player.isPlayer1) || (keybinds.movement.arrowup && !player.isPlayer1)) {
                        player.y = 0
                        box.y -= 64
                        box.height += player.height
                    } else if ((keybinds.movement.s && player.isPlayer1) || (keybinds.movement.arrowdown && !player.isPlayer1)) {
                        player.y = canvas.height - player.height
                        box.height += player.height
                    } else {
                        if (Math.random() > 0.5) {
                             player.y = 0
                            box.y -= 64
                            box.height += player.height
                        } else {
                            player.y = canvas.height - player.height
                            box.height += player.height
                        }
                    }
                
                stun(player, box.duration)
                spawnEffect(box.x, box.y, box.width, box.height, box.color, 100)
                let stun1Life = 0
                const stunInterval1 = setInterval(()=>{
                    spawnEffect(box.x, box.y, box.width, box.height, box.color, 100)
                    if (checkCollision(box, target)) {
                        stun(target, box.duration / 2)
                        target.indicate(`${target.name} is stunned by the shadows!`)
                    }
                    stun1Life += 100
                    if (stun1Life > box.duration){
                        clearInterval(stunInterval1)
                    }
                }, 100)
        
                let spot = {
                    x: player.x,
                    y: player.y,
                    width: player.width,
                    height: player.height,
                    color: 'black',
                    duration: 3500
                }
                spawnEffect(spot.x, spot.y, spot.width, spot.height, spot.color, 100)
                let stun2Life = 0
                const stunInterval2 = setInterval(()=>{
                    spawnEffect(spot.x, spot.y, spot.width, spot.height, spot.color, 1000)
                    if (checkCollision(spot, target)) {
                        stun(target, spot.duration / 2)
                        target.indicate(`${target.name} is stunned by the shadows!`)
                    }
                    stun2Life += 100
                    if (stun2Life > spot.duration){
                        clearInterval(stunInterval2)
                    }
                }, 100)
                
                player.indicate(`${player.name} dodged!`)
        
    }},
    
    BITE : {stats :{dmg: 5, type: 'Basic', cooldown : {time: 2000, switch: false}}, action: (player, target) => {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            dmg: attackFunctions.BITE.stats.dmg,
            color: 'gray',
            type: 'Basic',
            duration: 1000
        }

        let isFacingRight = player.facingRight

        if (isFacingRight){
            player.x += 15
            box.x = player.x + player.width
        }else {
            player.x -= 15
            box.x = player.x - player.width
        }
        stun(player, 1500)

        spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
        if (checkCollision(box, target)){
            stun(target, 1900)
            attackResults(player, box, target)
        }
        
    }},
    HARDEN : {stats: {heal: 5, type: 'Plant', cooldown: {time: 8000, switch: false}}, action: (player) => {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            dmg: attackFunctions.BITE.stats.dmg,
            color: 'green',
            type: 'Plant',
            duration: 5500
        }
        stun(player, box.duration)
        spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
        player.stats.def += 5
        player.stats.hp = Math.min(player.baseStats.hp, player.stats.hp + 5)

        player.indicate(`${player.name} healed itself! And gained extra defense!`)
        
        
    }},
    SNAP : {stats: {dmg: 2, type: 'Basic', color: 'gray', cooldown: {time: 1000, switch: false}}, action: (player, target) => {
            let box = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                dmg: attackFunctions.SNAP.stats.dmg,
                color: 'gray',
                type: 'Basic',
                duration: 500
            }
            stun(player, 150)
            spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
            if (checkCollision(box, target)) {
                rebukeCollision(box, target, 0.5)
                attackResults(player, box, target)            
            }
            if (checkCollision(box, player)) {
                rebukeCollision(box, player, 0.5)
                box.dmg = 1
                attackResults(player, box, player)            
            }
        }
    },
    ["WIND MILL"]: { stats: {type: 'Air', cooldown: { time: 10000, switch: false } }, action: (player, target) => {
            let factor = 1.9
            const baseWidth = player.width * 2   // Store the original size
            const baseHeight = player.height * 2
    
            const windmillBox = {
                width: baseWidth,
                height: baseHeight,
                color: 'white',
                type: 'Air',
                rate: 0.2,
                lifeRemaining: 5000
            }
    
            stun(player, 1000)
    
            const windmillInterval = setInterval(() => {
                // 1. Calculate new size based on the changing factor
                windmillBox.width = baseWidth * factor
                windmillBox.height = baseHeight * factor
    
                // 2. Center the box on the player
                windmillBox.x = player.x - (windmillBox.width / 4)
                windmillBox.y = player.y - (windmillBox.height / 4)
    
                spawnEffect(windmillBox.x, windmillBox.y, windmillBox.width, windmillBox.height, windmillBox.color, 100)
    
                windmillBox.lifeRemaining -= 100
    
                if (checkCollision(windmillBox, target)) {
                    stun(target, 150)
                    pullCollision(windmillBox, target, windmillBox.rate)
                }
    
                // 3. Exit conditions
                if (windmillBox.lifeRemaining <= 0 || factor <= 0.1) {
                    rebukeCollision(player, target) // Use player/target for final push
                    clearInterval(windmillInterval)
                } else {
                    factor -= 0.05 // Smaller decrement for a smoother shrink
                }
            }, 100);
    }},
    ["WIND SLASH"] : {stats: {dmg: 10, type: 'Air', cooldown: {time: 6000, switch: false}}, action : (player, target) => {
        
            const attributes = attackFunctions["WIND SLASH"].stats
            let box = {x: player.x, y: player.y, width: 20, height: player.height + 30, dmg: attributes.dmg, duration: 3000, type: 'Air', name: 'WIND SLASH', color: 'white'}

            let airSlash = JSON.parse(JSON.stringify(box))

            airSlash.x += Math.ceil(Math.random() * 25) + 1
            
            let facingRight = player.facingRight
            
            let life = 0
            let airSlashInterval = setInterval(() => {
                airSlash.x += facingRight ? 15 : -15
                spawnEffect(airSlash.x, airSlash.y, airSlash.width, airSlash.height, airSlash.color, 100)

                if (checkCollision(airSlash, target)) {
                    attackResults(player, airSlash, target)
                    clearInterval(airSlashInterval)
                }
                
                life += 100 // Increment by the interval time
                if (life > airSlash.duration) {
                    clearInterval(airSlashInterval)
                }
            }, 100)

    }},
    BEAM : {stats: {dmg: 8, type: 'Light', cooldown: {time: 6000, switch: false}}, action: (player, target) => {
        const attributes = attackFunctions.BEAM.stats
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            type: 'Light',
            color: '#a8ad55',
            dmg: attributes.dmg,
            duration: 6000,
            extend: 100
        }
        
        stun(player, box.duration)
        if (keybinds.movement.w && player.isPlayer1 ||
           keybinds.movement.arrowup && !player.isPlayer1) {
            // Shoot Beam Upwards
            box.height += box.extend
            box.y -= player.height * 2.65
           } else if (keybinds.movement.a && player.isPlayer1 ||
           keybinds.movement.arrowleft && !player.isPlayer1) {
            // Shoot Beam Leftward
            box.width += box.extend
            box.x -= player.width * 2.5
           } else if (keybinds.movement.s && player.isPlayer1 ||
           keybinds.movement.arrowdown && !player.isPlayer1) {
            // Shoot Beam Downwards
            box.height += box.extend
            box.y += player.height * 1.5
           } else if (keybinds.movement.d && player.isPlayer1 ||
           keybinds.movement.arrowright && !player.isPlayer1) {
            
            // Shoot Beam Rightward
            box.width += box.extend
            box.x += player.width * 1.3
            } else {
                if (player.facingRight) {
                    // Shoot Beam Rightward
                    box.width += box.extend
                    box.x += player.width * 1.3
                } else {
                     // Shoot Beam Leftward
                    box.width += box.extend
                    box.x -= player.width * 2.65
                }
            }

        spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
        
        let life = 0
        const beamInterval = setInterval(()=>{
            if (checkCollision(box, target)) {
                rebukeCollision(box, target, 2)
                stun(target, 100)
                attackResults(player, box, target)
            }
            if (life >= box.duration) {
                clearInterval(beamInterval)
                
            }
            life += 100
        }, 100)

        
    }},
    DECONSTRUCT : {stats: {type: 'Metal', heal: 3, cooldown: {time: 15000, switch: false}}, action: (player)=> {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: '#586363',
            duration: 6000
        }
        
        stun(player, 2600)
        let life = 0
        const interval = setInterval(()=>{
            life += 2600
            stun(player, 2600)
            spawnEffect(player.x, player.y - player.height / 2, player.width, player.height * 0.25, '#4c8f8f', 1300)
            spawnEffect(player.x, player.y - player.height / 4.5, player.width, box.height * 0.65, '#517373', 1500)
            spawnEffect(player.x, player.y + player.height / 2, player.width, player.height * 0.80, '#586363', 2300)

            player.stats.hp = Math.min(player.baseStats.hp, player.stats.hp + 3)
            player.stats.spd += 0.5
            player.stats.maxSpeed = player.stats.spd
            player.stats.originalVelocity = player.stats.spd
            player.stats.atk += 2
            
            player.stats.def = Math.max(0, player.stats.def - 10)
            
            player.updateLabel()
            player.indicate(`${player.name} boosted health, speed, and attack, significantly lowering defense!`)
            if (life > box.duration) {
                clearInterval(interval)
            }
        }, 2600)
    }},
    PECK : {stats : {dmg: 3, type: 'Air', cooldown: {time: 2000, switch: false}}, action: (player, target)=> {
        let box = {
            x: player.x,
            y: player.y * 1.1,
            width: player.width,
            height: player.height / 2,
            dmg: attackFunctions.PECK.stats.dmg,
            color: 'white',
            type: 'Air',
            duration: 1000
        }

        let isFacingRight = player.facingRight

        if (isFacingRight){
            player.x += 15
            box.x = player.x + player.width
        }else {
            player.x -= 15
            box.x = player.x - player.width
        }
        stun(player, box.duration)

        spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
        if (checkCollision(box, target)){
            stun(target, 500)
            attackResults(player, box, target)
        }

    }},
    CLAMP : {stats: {dmg: 13, type: 'Metal', cooldown: {time: 8000, switch: false}}, action: (player, target)=>{
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            dmg: attackFunctions.CLAMP.stats.dmg,
            color: '#586363',
            type: 'Metal',
            duration: 5000
        }
        stun(player, 4000)
        spawnEffect(box.x, box.y, box.width, box.height, box.color, 101)
        
        const fr = player.facingRight
        if (fr) {
            box.x += player.width
        } else {
            box.x -= player.width
        }
        let rate = 5
        let life = 0

        if (keybinds.movement.d && player.isPlayer1 || 
           keybinds.movement.arrowright && !player.isPlayer1 ||
           keybinds.movement.a && player.isPlayer1 || 
           keybinds.movement.arrowleft && !player.isPlayer1) {
                rate *= 2
        }
        
        const interval = setInterval(()=>{
            life += 100
            if (fr) {
                box.x += rate
            } else {
                box.x -= rate
            }

            spawnEffect(box.x, box.y, box.width, box.height, box.color, 100)
            
            if (checkCollision(box, target)){
                stun(target, box.duration)
                pullCollision(box, target, 0.5)
                spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
                attackResults(player, box, target)
                clearInterval(interval)
            }
            if (life > box.duration) {
                clearInterval(interval)
            }
        }, 100)
        
    }},
    ["FLASH BANG"] : {stats: {dmg: 2, type: 'Light', cooldown: {time: 7000, switch: false}}, action: (player, target) => {
        let factor = 1.1
        let box = {
            x: player.x,
            y: player.y * 1.1,
            width: 5,
            height: 5,
            dmg: attackFunctions['FLASH BANG'].stats.dmg,
            color: '#a8ad55',
            type: 'Light',
            duration: 3500
        }
        
        stun(player, 1000)
        // spawnEffect(box.x, box.y, box.width, box.height, box.color, 101)
        const fr = player.facingRight
        if (fr) {
            box.x += player.width
        } else {
            box.x -= player.width
        }
        let rate = 10
        let life = 0

        const moving = (keybinds.movement.d && player.isPlayer1 || 
           keybinds.movement.arrowright && !player.isPlayer1 ||
           keybinds.movement.a && player.isPlayer1 || 
           keybinds.movement.arrowleft && !player.isPlayer1) ? true : false

        if (!moving) {
            rate *= 1.5
        } 
        
        const interval = setInterval(()=>{
            life += 100
            if (fr) {
                box.x += rate
            } else {
                box.x -= rate
            }

            if (!moving) {
                box.width *= factor
                box.height *= factor
                spawnEffect(box.x, box.y, box.width, box.height, box.color, 100)

                if (checkCollision(box, target)){
                    attackResults(player, box, target)
                }
                
                if (box.width >= 40|| life >= box.duration) {
                    spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
                    clearInterval(interval)
                }
                else {
                    factor += 0.02
                } 
            } else {
                box.width = player.width * 1.2
                box.height = player.height * 1.2
                
                spawnEffect(player.x, player.y, player.width, player.height, box.color, box.duration / 2)
                if (checkCollision(box, target)){
                    stun(target, 4000)
                    rebukeCollision(box, target, 3.5)
                    attackResults(player, box, target)
                    target.indicate(`${target.name} was flashed banged!`)
                }
                clearInterval(interval)
            }

        }, 100)
    }},
    FIREWORK: {stats: {dmg: 15, type: 'Fire', cooldown: {time: 10000, switch: false}}, action: (player, target)=>{

        const attributes = attackFunctions.FIREWORK.stats
        let box = {
            dmg: attributes.dmg,
            type: 'Fire'
        }

        let life = 0
        const flamingStartupInterval = setInterval(()=>{
            life += 1000
            spawnEffect(player.x, player.y + player.height / 3, player.width, player.height / 2, 'red', 250)
            spawnEffect(player.x, player.y, player.width, player.height / 3, 'orange', 300)
            spawnEffect(player.x, player.y - player.height / 3, player.width, player.height / 4, 'yellow', 500)

            if (life > 2000) {
                clearInterval(flamingStartupInterval)
            }
        }, 1000)
        
        stun(player, 3500) 
        if (!player.isPlayer1){
            player.facingRight = true
        }
        player.rotation = (player.rotation - player.spriteOffset)
        let yChange = true

        // 2. The Spinning Phase (Charging)
        const spinInterval = setInterval(() => {
            // Logic fixed: Player 1 uses A/D, Player 2 uses Arrows
            if (player.isPlayer1) {
                if (keybinds.movement.a) player.rotation -= 0.05 // Increased speed slightly for feel
                if (keybinds.movement.d) player.rotation += 0.05
            } else {
                if (keybinds.movement.arrowleft) player.rotation -= 0.05
                if (keybinds.movement.arrowright) player.rotation += 0.05
            }
            let degrees = (player.rotation * 180 / Math.PI) % 360
            if (degrees < 0) degrees += 360
            
            if ((degrees >= 60 && degrees <= 120) || (degrees >= 240 && degrees <= 300)) {
                yChange = false 
            } else {
                yChange = true
            }
        }, 16)

        // 3. The Launch Phase
        setTimeout(() => {
            clearInterval(spinInterval)

            const speed = 14
            const moveAngle = player.rotation - Math.PI / 2
            
            const vx = Math.cos(moveAngle) * speed
            const vy = Math.sin(moveAngle) * speed
            
            const dashDuration = 1000 
            const startTime = Date.now()
            let hasHit = false

            const directionalShoot = setInterval(() => {
                const elapsed = Date.now() - startTime

                if (elapsed < dashDuration) {
                    player.x += vx 
                    if (yChange) {
                        player.y += vy
                    }
                    
                    player.borders()

                    const dist = Math.hypot(
                        (player.x + player.width/2) - (target.x + target.width/2),
                        (player.y + player.height/2) - (target.y + target.height/2)
                    )

                    if (dist < 45 && !hasHit) {
                        attackResults(player, box, target)
                        rebukeCollision(player, target, 2)
                        hasHit = true
                    }
                } else {
                    clearInterval(directionalShoot)
                    player.rotation = 0 
                    player.indicate("")
                }
            }, 16)
        }, 3000)

    }},
    ["BEATDOWN"]: {stats: {dmg: 13, type: 'Basic', cooldown: {time: 10000, switch: false}}, action: (player, target)=> {
        const attributes = attackFunctions["BEATDOWN"].stats
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            type: attributes.type,
            dmg: attributes.dmg,
            duration: 5000,
            color: 'white'
        }

        stun(player, box.duration)
        // Rush Directionally
        let rushLife = 0
        let incrementOverTime = 1.15
        let bonusDamage = 1
        
        const rush = setInterval(()=>{
            rushLife += 100
            player.x += (player.facingRight) ? 10 * incrementOverTime : -10 * incrementOverTime 
            
            incrementOverTime += 0.15
            if (checkCollision(player, target)) 
            {
                bonusDamage = incrementOverTime
                incrementOverTime = 1.15
                
                clearInterval(rush)
                stun(target, box.duration)
                stun(player, box.duration)

                target.x -= 30

                let time = 0
                const playtime = setInterval(()=>{
                    time += 100
                    if (time < 1000) {
                        target.y -= 5 * incrementOverTime
                    } else {
                        target.y += 5 * incrementOverTime
                    }

                    incrementOverTime += 0.15

                    spawnEffect(target.x, target.y, target.width, target.height, box.color, 100)
                    
                    if (time > 2000) {
                        box.dmg *= bonusDamage
                        attackResults(player, box, target)
                        clearInterval(playtime)
                        clearInterval(rush)
                    }
                    
                }, 100)
            }
            
            if (rushLife > 5000 || player.x >= canvas.width - player.width){
                clearInterval(rush)
            }
        }, 100)
        // If catch player then slam them up (damage), slam them down (damage + stun)

        // They can escape but rapid pressing their keys with an base 30% chance to escape, +25% if they resist the type / escape by pressing keys that fill up a meter that represents when you can escape
    }},
    SNORT: {stats: {type: 'Basic', cooldown: {time: 5000, switch: false}}, action: (player, target)=>{
        player.stats.atk += 5
        player.indicate(`${player.name} increased it's attack!`)

        target.indicate(`${target.name} is furious! Its speed increased temporarily!`)
        target.maxSpeed *= 1.9
        
        setTimeout(()=>{
            target.maxSpeed = target.baseStats.spd
            target.indicate(`${target.name} calmed down...`)
        }, 6000)
        
    }},
    CHARGE: { stats: {dmg: 2, type: 'Electric', cooldown: {time: 15000, switch: false}}, action: (player, target) => {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: 'yellow',
            duration: 6000
        }
        
        stun(player, 3000)
        
        let life = 0
        let attackMod = 1
        
        const charge = setInterval(()=>{
            let isPressingUp = (keybinds.movement.w && player.isPlayer1 || 
            keybinds.movement.arrowup && !player.isPlayer1)
            life += 1000
            if (isPressingUp) {
                // stun(player, 1000)
                spawnEffect(player.x, player.y - player.height / 2, player.width, player.height * 0.25, 'yellow', 500)
                spawnEffect(player.x, player.y - player.height / 4.5, player.width, box.height * 0.65, 'orange', 600)
                spawnEffect(player.x, player.y + player.height / 2, player.width, player.height * 0.80, 'red', 700)
                
                player.stats.atk *= attackMod
                attackMod += 0.25
                player.indicate(`${player.name} increased its attack for its next attacks!`)
            }
            
            if (life > 3000) {
                clearInterval(charge)
            }
        }, 1000)

        
        player.indicate(`${player.name} is charged for its next attacks!`)
        setTimeout(()=>{
            player.indicate(`${player.name}'s charge fizzed out...`)
            player.stats.atk = player.baseStats.atk
        }, 12000)
    }}, 
    ["FADE AWAY"]: {stats: {type: 'Dark', cooldown: {time: 9000, switch: false}}, action: (player, target) => {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: '#13273a',
            duration: 2000
        }

        spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
        if (checkCollision(box, target)){
            stun(target, box.duration * 2)
        }
        player.maxSpeed *= 2
        player.stats.def = 999
        stun(target, box.duration)
        player.opacity = 0.25

        setTimeout(()=>{
            player.maxSpeed = player.stats.spd
            player.stats.def = player.baseStats.def
            player.opacity = 1
            spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
            
            if (checkCollision(box, target)){
                stun(target, box.duration * 2)
            }
        }, 3000)
        

    }},
    ["BODY SLAM"]: {stats: {dmg: 13, type: 'Basic', cooldown: {time: 7500, switch: false}}, action: (player, target) => {
        
        const stats = attackFunctions["BODY SLAM"].stats;
        let box = { dmg: stats.dmg, type: 'Basic' };
        let life = 0;
        const fr = player.facingRight;
        let hit = false;

        stun(player, 2000); // Shorter stun, adjusted for movement

        // Helper function to calculate the "Heavy" damage
        function applySlamDamage(p, t, b) {
            // Damage scales with Width (Size) and Defense (Weight)
            let finalDmg = b.dmg * ((p.width / 100) * (p.stats.def / 100) + 1);
            rebukeCollision(player, target, 8)
            attackResults(p, { ...b, dmg: finalDmg }, t);
        }

        // PHASE 2: Slam Downward
        function startSlamDown() {
            const slamDown = setInterval(() => {
                player.y += 15; // Move DOWN quickly
                
                // Add forward momentum during the fall too
                player.x += (fr) ? 2 : -2;

                if (checkCollision(player, target) && !hit) {
                    applySlamDamage(player, target, box);
                    hit = true;
                    clearInterval(slamDown);
                }

                // Stop if they hit the ground or a certain limit
                if (player.y > canvas.height - player.height || hit) { 
                    clearInterval(slamDown);
                }
            }, 20);
        }

        // PHASE 1: Leap Up and Forward
        const running = setInterval(() => {
            life += 100;
            player.x += (fr) ? 8 : -8; // Move forward
            player.y -= 10;            // Move up

            if (checkCollision(player, target) && !hit) {
                applySlamDamage(player, target, box);
                hit = true;
                clearInterval(running);
            }

            // Once we reach the peak of the jump (1 second)
            if (life >= 1000) {
                clearInterval(running);
                if (!hit) startSlamDown(); // Only slam down if we haven't hit yet
            }
        }, 20); // Faster interval (20ms) for smoother animation

    }},
    SHED: {stats: {heal: 12, type: 'Basic', cooldown: {time: 5000, switch: false}}, action: (player)=>{
        const attributes = attackFunctions.SHED.stats
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: '#586363',
            duration: 6000
        }
        
        stun(player, 2600)
        
        spawnEffect(player.x, player.y - player.height / 2, player.width, player.height * 0.25, '#173a5a', 1300)
        spawnEffect(player.x, player.y - player.height / 4.5, player.width, box.height * 0.65, '#173a5a', 1500)
        spawnEffect(player.x, player.y + player.height / 2, player.width, player.height * 0.80, '#59656f', 2300)
        
        let life = 0
        const interval = setInterval(()=>{
            life += 2600
            stun(player, 2600)
            spawnEffect(player.x, player.y - player.height / 2, player.width, player.height * 0.25, '#173a5a', 1300)
            spawnEffect(player.x, player.y - player.height / 4.5, player.width, box.height * 0.65, '#173a5a', 1500)
            spawnEffect(player.x, player.y + player.height / 2, player.width, player.height * 0.80, '#59656f', 2300)
            
            player.indicate(`${player.name} boosted health, speed, and attack, significantly lowering defense!`)

            if (life > box.duration) {
                player.stats.hp = Math.min(player.baseStats.hp, player.stats.hp + attributes.heal)
                player.stats.spd += 1
                player.stats.atk += 5
                player.stats.maxSpeed = player.stats.spd
                player.stats.originalVelocity = player.stats.spd
            
                player.stats.def = Math.max(0, player.stats.def - 10)
                player.updateLabel()
                clearInterval(interval)
            }
        }, 2600)
    }},
    SNATCH: {stats: {dmg: 10, type: 'Dark', cooldown: {time: 6000, switch: false}}, action: (player, target)=>{
        
        const attributes = attackFunctions.SNATCH.stats
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: '#302933',
            duration: 6000,
            dmg: attributes.dmg
        }
        
        stun(player, 1350)
        box.y -= player.height + 10
        box.x += (player.facingRight) ? player.width + 10 : -player.width - 10
        spawnEffect(box.x, box.y, box.width, box.height, box.color, 101)
        
        let life = 0
        let speedIncrement = 1.15
        const interval = setInterval(()=>{
            life += 100
            box.y += 20 * speedIncrement
            speedIncrement += 0.15
            spawnEffect(box.x, box.y, box.width, box.height, box.color, 101)
            if (checkCollision(box, target)){
                stun(target, box.duration)
            }

            if (life > 500) {
                clearInterval(interval)
            }
        }, 100)
    }},
    ["VICIOUS BITE"]: {stats: { dmg: 10, type: 'Beast', cooldown: { time: 5500, switch: false }}, action: (player, target) => {
            const attackStats = attackFunctions["VICIOUS BITE"].stats
            let box = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                color: 'brown',
                dmg: attackStats.dmg,
                type: 'Beast', 
                duration: 500
            }
            stun(player, box.duration)

            if (player.facingRight) {
                box.x = player.x + player.width
            } else {
                box.x = player.x - player.width
            }

            spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)

            if (checkCollision(box, target)) {
                stun(target, box.duration)
                pullCollision(box, target, 1)
                attackResults(player, box, target)
            }
        }
    },
    //CHRONIC SLAM
}