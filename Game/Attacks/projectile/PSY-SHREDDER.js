registerAttack('PSY-SHREDDER', {
    stats: { dmg: 5, type: 'Mind', cooldown: { time: 8000, switch: false } },
    action: (player, target) => {
        const attributes = attackFunctions["PSY-SHREDDER"].stats
        const facingRight = player.facingRight
        
        // Base hitbox
        let box = {
            x: player.x, 
            y: player.y, 
            width: player.width, 
            height: player.height, 
            dmg: attributes.dmg, 
            duration: 3000, 
            type: 'Mind', 
            name: 'PSY-SHREDDER', 
            color: 'pink'
        }

        let airSlash = {
            x: player.x, 
            y: player.y, 
            width: player.width, 
            height: player.height, 
            dmg: attributes.dmg, 
            duration: 3000, 
            type: 'Mind', 
            name: 'PSY-SHREDDER', 
            color: 'rgba(245, 39, 223, 0.51)'
        }
        airSlash.duration = 100
        airSlash.x += facingRight ? Math.ceil(Math.random() * 25) + 1 : -Math.ceil(Math.random() * 25) - 1
        
        let life = 0
        let hasHit = false
        let speed = 20
        let maxSpeed = 35
        
        playRetreivedAudio('sword_slash') // Add sound effect

        const key = Object.keys(player.keysToAttack).find(k => player.keysToAttack[k].name === "PSY-SHREDDER")
        
        let airSlashInterval = setInterval(() => {
            // Accelerate the slash
            speed = Math.min(speed + 1, maxSpeed)
            airSlash.x += facingRight ? speed : -speed

            if (keybinds.attacks[key] && airSlash.dmg < 15 && player.stats.hp < player.baseStats.hp * 0.70) {
                // isCharging = true
                airSlash.width += 2
                airSlash.height += 1.5
                airSlash.dmg += 2

                airSlash.color = 'rgba(39, 121, 245, 0.51)'

                player.indicate(`${player.name} is amplifying their psyco slash!`)
            }
            
            // Spawn multiple visual effects for trail effect
            for (let i = 0; i < 2; i++) {
                spawnEffect(
                    airSlash.x + (Math.random() - 0.5) * 20, 
                    airSlash.y + (Math.random() * 15 - 7.5),
                    airSlash.width * 0.8, 
                    airSlash.height * 0.8, 
                    airSlash.color, 
                    100
                )
            }
            
            // Check collision
            if (!hasHit && checkCollision(airSlash, target)) {
                attackResults(player, airSlash, target)
                rebukeCollision(airSlash, target, 2)
                
                // Extra hit on impact
                playRetreivedAudio('horror-impact')
                
                // Stun or knockback effect (optional)
                stun(target, 300)
                
                hasHit = true
                clearInterval(airSlashInterval)
                return
            }
            
            // Remove if off-screen
            if (airSlash.x > canvas.width + 100 || airSlash.x < -100) {
                clearInterval(airSlashInterval)
                return
            }
            
            life += 100
            if (life > box.duration) {
                clearInterval(airSlashInterval)
            }
        }, 100)
    }
})
