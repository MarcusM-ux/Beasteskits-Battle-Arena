registerAttack('SHOOTING STAR', {
    stats: {dmg: 15, type: 'Light', cooldown: {time: 10000, switch: false}}, action: (player, target)=>{

        function shootingStars(missed){
                    const attributes = attackFunctions.HYPE.stats
                    const flares = []
                    const flareCount = 6
                    
                    playRetreivedAudio('explosion')
                    
                    for (let i = 0; i < flareCount; i++) {
                        // 1. Calculate a circular or radial spread
                        // We use an angle so they expand in a starburst pattern
                        const angle = (i / flareCount) * Math.PI * 2; 
                        const speed = 6; // Adjust this for how fast they expand
                    
                        flares.push({
                            // Start exactly in the middle of the player
                            x: player.x + player.width / 2,
                            y: player.y + player.height / 2, 
                            width: 20,
                            height: 20,
                            dmg: attributes.dmg,
                            type: attributes.type,
                            color: colorFromType(attributes.type),
                    
                            // 2. Velocity based on the angle (Expanding outward)
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed
                        })
                    }
                    
                    let life = 0
                    const interval = setInterval(() => {
                        life += 100
                    
                        for (let i = flares.length - 1; i >= 0; i--) {
                            const flare = flares[i]
                            flare.x += flare.vx
                            flare.y += flare.vy
                    
                            spawnEffect(
                                flare.x,
                                flare.y,
                                flare.width,
                                flare.height,
                                `#539de3`,
                                200
                            )
                    
                            if (checkCollision(flare, target)) {
                                rebukeCollision(flare, target, 2)
                                // stun(target, 1000)
                                playRetreivedAudio('fireball')
                                flares.splice(i, 1)
                                continue
                            }
                    
                            // Remove if off-screen
                            if (
                                flare.y > canvas.height || flare.y < 0 ||
                                flare.x < -50 || flare.x > canvas.width + 50
                            ) {
                                flares.splice(i, 1)
                            }
                        }
                    
                        if (flares.length === 0 || life >= 2000) {
                            const number = Math.ceil(Math.random() * 3)
                            switch(number){
                                case 1:
                                    if (missed < 2){
                                        player.indicate(`${player.name} became slightly weaker!`)
                                    }else {
                                        player.indicate(`${player.name} missed their attack and became very weak!`)
                                    }
                                    player.stats.atk -= 5 * missed
                                    break
                                case 2:
                                    if (missed < 2){
                                        player.indicate(`${player.name} became slightly slower!`)
                                    }else {
                                        player.indicate(`${player.name} missed their attack and became much slower!`)
                                    }
                                    player.stats.spd -= 0.25 * missed
                                    break
                                case 3:
                                    if (missed < 2){
                                        player.indicate(`${player.name} became slightly less durable!`)
                                    }else {
                                        player.indicate(`${player.name} missed their attack and became much less durable!`)
                                    }
                                    player.stats.def -= 4 * missed
                                    break
                            }
                            clearInterval(interval)
                        }
                    }, 100)
        }

        const attributes = attackFunctions.FIREWORK.stats
        let box = {
            dmg: attributes.dmg,
            type: 'Light'
        }

        player.indicate(`${player.name} used SHOOTING STAR!`)
        let life = 0
        playRetreivedAudio('charging')
        const flamingStartupInterval = setInterval(()=>{
            life += 1000
            spawnEffect(player.x, player.y + player.height / 3, player.width, player.height / 2, '#001021', 250)
            spawnEffect(player.x, player.y, player.width, player.height / 3, '#BF6900', 300)
            spawnEffect(player.x, player.y - player.height / 3, player.width, player.height / 4,'#F0F2A6', 500)

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
        let interrupted = false
        const startHP = player.stats.hp
        // 2. The Spinning Phase (Charging)
        const spinInterval = setInterval(() => {
            // Logic fixed: Player 1 uses A/D, Player 2 uses Arrows
            if (player.isPlayer1) {
                if (keybinds.movement.a || cpuIntent.player1.movement.a) player.rotation -= 0.05 // Increased speed slightly for feel
                if (keybinds.movement.d || cpuIntent.player1.movement.d) player.rotation += 0.05
            } else {
                if (keybinds.movement.arrowleft || cpuIntent.player2.movement.arrowleft) player.rotation -= 0.05
                if (keybinds.movement.arrowright || cpuIntent.player2.movement.arrowright) player.rotation += 0.05
            }
            let degrees = (player.rotation * 180 / Math.PI) % 360
            if (degrees < 0) degrees += 360
            
            if ((degrees >= 60 && degrees <= 120) || (degrees >= 240 && degrees <= 300)) {
                yChange = false 
            } else {
                yChange = true
            }

            if (player.stats.hp < startHP * 0.5) {
                interrupted = true
                player.indicate(`${player.name} took too much damage! Their attack was canceled!`)
                wait(3000)
                player.indicate('')
                clearInterval(spinInterval)
            }
        }, 16)

        // 3. The Launch Phase
        setTimeout(() => {
            if (interrupted) {
                return
            }
            clearInterval(spinInterval)

            const speed = 15
            const moveAngle = player.rotation - Math.PI / 2
            
            const vx = Math.cos(moveAngle) * speed
            const vy = Math.sin(moveAngle) * speed
            
            const dashDuration = 2000 
            const startTime = Date.now()
            let hasHit = false
            playRetreivedAudio('thunder')

            const directionalShoot = setInterval(() => {
                const elapsed = Date.now() - startTime
            
                if (!player.isCPU) {
                    if (elapsed < dashDuration) {
                        player.x += vx
                        if (yChange) player.y += vy
            
                        player.borders()
            
                        const dist = Math.hypot(
                            (player.x + player.width  / 2) - (target.x + target.width  / 2),
                            (player.y + player.height / 2) - (target.y + target.height / 2)
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
            
                } else {
                    if (elapsed < dashDuration) {
                        player.x += vx
                        player.y += vy
                        player.borders()
            
                        const dist = Math.hypot(
                            (player.x + player.width  / 2) - (target.x + target.width  / 2),
                            (player.y + player.height / 2) - (target.y + target.height / 2)
                        )
            
                        if (dist < 45 && !hasHit) {
                            attackResults(player, box, target)
                            rebukeCollision(player, target, 2)
                            hasHit = true
                            stun(player, 4000)
                            clearInterval(directionalShoot)
                            shootingStars(1)
                        }
                    } else {
                        clearInterval(directionalShoot)
                        player.rotation = 0
                        player.indicate("")
                    }
                }
            }, 16)
            
        }, 2000)

    }
})