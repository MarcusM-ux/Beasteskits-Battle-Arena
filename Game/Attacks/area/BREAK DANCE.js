registerAttack('BREAK DANCE', {
     stats: {dmg: 3, type: 'Air', cooldown: { time: 10000, switch: false } }, action: (player, target) => {
            let factor = 1.9
            const baseWidth = player.width * 2   // Store the original size
            const baseHeight = player.height * 2
    
            const windmillBox = {
                width: baseWidth,
                height: baseHeight,
                color: 'white',
                type: 'Air',
                rate: 0.2,
                lifeRemaining: 5000,
                dmg: 3
            }
    
            stun(player, 1000)
            let hit = 0
            const windmillInterval = setInterval(() => {
                // 1. Calculate new size based on the changing factor
                windmillBox.width = baseWidth * factor
                windmillBox.height = baseHeight * factor
    
                // 2. Center the box on the player
                windmillBox.x = player.x - (windmillBox.width / 4)
                windmillBox.y = player.y - (windmillBox.height / 4)
    
                spawnEffect(windmillBox.x, windmillBox.y, windmillBox.width, windmillBox.height, `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`,100)
    
                windmillBox.lifeRemaining -= 100
    
                if (checkCollision(windmillBox, target)) {
                    stun(target, 150)
                    rebukeCollision(windmillBox, target, windmillBox.rate)
                    if (hit < 4) {
                        hit++
                        attackResults(player, windmillBox, target)
                    }
                }
    
                // 3. Exit conditions
                if (windmillBox.lifeRemaining <= 0 || factor <= 0.1) {
                    rebukeCollision(player, target) // Use player/target for final push
                    clearInterval(windmillInterval)
                } else {
                    factor -= 0.05 // Smaller decrement for a smoother shrink
                }
            }, 100);
        
    }
})