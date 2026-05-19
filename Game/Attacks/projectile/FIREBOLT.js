registerAttack('FIREBOLT', {
    stats : {dmg: 3, type: 'Fire', cooldown : {time: 7000, switch: false}}, action: (player, target) => {
            const attributes = attackFunctions.FIREBOLT.stats

            const baseBox = {
                x: player.x,
                y: player.y,
                width: 64,
                height: 64,
                dmg: attributes.dmg,
                duration: 200,
                type: 'Fire',
                color: 'red'
            }

            const fireBalls = Math.floor(Math.random() * 3) + 1
            const minYSpacing = 30
            const spawnDelay = 180 // ms between fireballs
            const usedYPositions = []

            let facingRight = player.facingRight
            let hits = 0

            const flipX = !facingRight
        
            for (let i = 0; i < fireBalls; i++) {
            setTimeout(() => {

                let newFireball = JSON.parse(JSON.stringify(baseBox))

                // --- Y SPACING ---
                let yOffset
                let attempts = 0
                do {
                yOffset = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 60 + 10)
                attempts++
                } while (
                usedYPositions.some(y => Math.abs(y - yOffset) < minYSpacing) &&
                attempts < 10
                )

                usedYPositions.push(yOffset)
                newFireball.y += yOffset

                // --- X OFFSET ---
                newFireball.x += facingRight
                ? player.width + i * 8
                : -player.width - i * 8

                let life = 0
                playRetreivedAudio('fireball')

                const fireBallInterval = setInterval(() => {
                newFireball.x += facingRight ? 15 : -15
                // spawnEffect(
                //     newFireball.x,
                //     newFireball.y,
                //     newFireball.width,
                //     newFireball.height,
                //     'red',
                //     200,
                //     true
                // )
                // imageName,
                //     box,
                //     {
                //         playAudioOnHit = false,
                //         audioName = null,
                //         target = null,
                //         flipX = false,
                //         flipY = false,
                //         priority = true,
                //         // tint = '',
                //         rotation = 90
                //     } = {}
                
                spawnImage('fireball', newFireball, {playAudioOnHit: true, audioName: 'fireball', flipX, priority: true})

                if (checkCollision(newFireball, target) && hits < 3) {
                    hits++
                    playRetreivedAudio("fireball")
                    attackResults(player, newFireball, target)
                    clearInterval(fireBallInterval)
                }

                life += 200
                if (life > 5000) {
                    clearInterval(fireBallInterval)
                }
                }, 200)

            }, i * spawnDelay)
            }
        }
})