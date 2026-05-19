registerAttack('FIREWORK', {
    stats: {dmg: 15, type: 'Fire', cooldown: {time: 10000, switch: false}}, action: (player, target)=>{

        const attributes = attackFunctions.FIREWORK.stats
        let box = {
            dmg: attributes.dmg,
            type: 'Fire'
        }

        let life = 0
        playRetreivedAudio('charging')
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

            if (player.stats.hp < startHP * 0.90) {
                interrupted = true
                player.indicate(`${player.name} took too much damage! Their attack was canceled!`)
                wait(3000)
                player.indicate('')
                clearInterval(spinInterval)
            }
        }, 16)

        // 3. The Launch Phase
        setTimeout(() => {
            if (interrupted) return
            clearInterval(spinInterval)
            
            const speed = 10
            
            let vx, vy, moveAngle
            
            if (player.isCPU) {
                // Point directly at where the target is RIGHT NOW
                const dx = (target.x + target.width  / 2) - (player.x + player.width  / 2)
                const dy = (target.y + target.height / 2) - (player.y + player.height / 2)
                moveAngle = Math.atan2(dy, dx)
                vx = Math.cos(moveAngle) * speed
                vy = Math.sin(moveAngle) * speed
            } else {
                moveAngle = player.rotation - Math.PI / 2
                vx = Math.cos(moveAngle) * speed
                vy = Math.sin(moveAngle) * speed
            }
            
            const dashDuration = 1000
            const startTime = Date.now()
            let hasHit = false
            playRetreivedAudio('fireworks')
            
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
                        }
                    } else {
                        clearInterval(directionalShoot)
                        player.rotation = 0
                        player.indicate("")
                    }
                }
            }, 16)
            
            }, 3000)
    }
})
