registerAttack('TALON SWEEP', { 
    stats: {dmg: 12, type: 'Air', cooldown: {time: 8000, switch: false}}, 
    action: (player, target) => {
        stun(player, 5000)
        
        const MAX_WINDPARTS = 5
        const SIZE_INCREMENT = 20
        const RISE_SPEED = 3
        const ROTATION_SPEED = 10
        const DURATION = 2000
        
        const COLORS = ['#6a8dae', '#244767', '#84bdf2']
        
        const windParts = []
        let elapsedTime = 0
        let hasHit = false

        // Create wind parts stacked like a tornado (smallest on top)
        for (let part = 1; part < MAX_WINDPARTS; part++) {
            windParts.push({
                x: player.x + player.width / 2,
                y: player.y + player.height,
                width: SIZE_INCREMENT * part + 15,
                height: SIZE_INCREMENT,
                color: COLORS[part % COLORS.length],
                rotation: 0,
                verticalOffset: -part * 15, // Stack upward (overlapping)
                dmg: 12,
                type: 'Air'
            })
        }

        playRetreivedAudio('whoosh')
        const tornadoRun = setInterval(() => {
            elapsedTime += 50

            // Update and render each wind part (draw largest first, so smallest is on top)
            for (let i = windParts.length - 1; i >= 0; i--) {
                const part = windParts[i]
                
                // Rise upward
                // part.y -= RISE_SPEED
                
                // Rotate for tornado effect
                part.rotation += ROTATION_SPEED
                
                // Slight horizontal drift for swirl effect
                part.x = player.x + player.width / 2 + Math.sin(elapsedTime / 100 + i) * 2

                // Calculate display position (centered)
                const displayX = part.x - part.width / 2
                const displayY = part.y + part.verticalOffset

                // Draw the wind effect
                spawnEffect(displayX, displayY, part.width, part.height, part.color, 50)

                // Check collision with target (only once per attack)
                if (!hasHit && checkCollision({x: displayX, y: displayY, width: part.width, height: part.height}, target)) {
                    hasHit = true
                    attackResults(player, part, target)
                    playRetreivedAudio('woosh')
                    rebukeCollision(part, target, 6)
                    // endTornado()
                }
            }

            // End tornado after duration
            if (elapsedTime >= DURATION) {
                endTornado()
            }
        }, 50)

        function endTornado() {
            stun(player, 500)
            clearInterval(tornadoRun)
        }
    }
})
