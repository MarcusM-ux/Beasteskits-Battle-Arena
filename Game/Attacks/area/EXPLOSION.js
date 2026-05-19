registerAttack('EXPLOSION', {
    stats: {dmg: 15, type: 'Fire', cooldown: {time: 20000, switch: false}}, 
    action: (player, target)=>{
        // Calculate health scaling (0 to 1, where 1 is full health)
        const maxHealth = player.baseStats.hp || 100
        const currentHealth = player.stats.hp
        const healthRatio = Math.max(0, currentHealth / maxHealth)
        
        // Inverse scaling: lower health = stronger effect
        const damageMultiplier = 2 - healthRatio // 1 to 2x damage
        const speedMultiplier = 8 - healthRatio  // 1 to 2x speed
        const particleCount = Math.floor((2 - healthRatio) * 5) // 5 to 10 particles
        
        const explosionBox = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            type: 'Fire',
            dmg: Math.floor(15 * damageMultiplier),
            duration: 6000
        } 
        stun(player, 5000)

        const img = explosionBox
        img.duration = 3000
        spawnImage('explosion', img, {
            playAudioOnHit: false,
            audioName: 'explosion',
            target: target,
            flipX : !player.facingRight,
            flipY: false,
            priority: true
        })

        player.stats.hp -= 10
        player.updateLabel()
        let hasHit = false
        
        if (checkCollision(img, target)){
            attackResults(player, img, target)
            hasHit = true
            stun(target, 2000)
        }
                
        const MAX_LIFE = 3000
        let particles = []
        let intervalLife = 0
        
        // Spawn particles based on health scaling
        for (let i = 0; i < particleCount; i++){
            const angle = (Math.PI * 2 * i) / particleCount // Spread particles evenly
            const speed = 3 * speedMultiplier

            const size = 15 + (Math.random() * 12 + 1)
            const particle = {
                x: player.x,
                y: player.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                width: size,
                height: size,
                dmg: Math.floor(8 * damageMultiplier),
                type: 'Fire',
                color: 'gray',
                life: 0,
                hit: false
            }
            particles.push(particle)
        }

        const shootInterval = setInterval(()=>{
            for (let index = particles.length - 1; index >= 0; index--) {
                const particle = particles[index]
                
                if (particle.life < MAX_LIFE && !particle.hit){
                    // Update particle position
                    particle.x += particle.vx
                    particle.y += particle.vy
                    
                    spawnEffect(particle.x, particle.y, particle.width, particle.height,
                    particle.color, 100)

                    if (particle.x <= 0 || particle.x >= canvas.width - particle.width) {
                        particle.vx *= -1; // Flip horizontal direction
                        playRetreivedAudio('body-thud'); // Feedback for bounce
                    }
        
                    if (particle.y <= 0 || particle.y >= canvas.height - particle.height) {
                        particle.vy *= -1; // Flip vertical direction
                        playRetreivedAudio('body-thud');
                    }
    

                    if (checkCollision(particle, target) && !hasHit){
                        particle.hit = true
                        attackResults(player, particle, target)
                        rebukeCollision(target, particle, 6)
                        particles.splice(index, 1)
                    }
                    particle.life += 100
                    // partciel.width *= 0.95
                    // partciel.height *= 0.95
                    
                } else {
                    particles.splice(index, 1)
                }
            }    

            intervalLife += 100
            if (intervalLife > MAX_LIFE) {
                particles = []
                clearInterval(shootInterval)
                
                // Instant kill if health below 15
                if (currentHealth < 15) {
                    player.stats.hp = 0
                    // Trigger death/respawn logic
                }
            }
        }, 100)
    }
})
