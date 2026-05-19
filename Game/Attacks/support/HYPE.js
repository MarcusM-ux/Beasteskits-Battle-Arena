registerAttack('HYPE', {
    stats: { type: 'Basic', cooldown: { time: 8000, switch: false } }, action: (player, target) => {
        const attributes = attackFunctions.HYPE.stats
        stun(player, 2500)

        const flares = []
        const flareCount = 6

        const usedYPositions = []
        const minYSpacing = 40

        playRetreivedAudio('explosion')
        for (let i = 0; i < flareCount; i++) {
            let yOffset
            let attempts = 0

            do {
                yOffset =
                    (Math.random() > 0.5 ? 1 : -1) *
                    (Math.random() * 60 + 10)
                attempts++
            } while (
                usedYPositions.some(y => Math.abs(y - yOffset) < minYSpacing) &&
                attempts < 10
            )

            usedYPositions.push(yOffset)

            flares.push({
                x: player.x + player.width / 2,
                y: player.y - 30 + yOffset, // 👈 vertical separation
                width: 20,
                height: 20,
                dmg: attributes.dmg,
                type: attributes.type,
                color: colorFromType(attributes.type),

                // Direction picked ONCE
                vx: Math.random() > 0.5 ? 4 : -4,
                vy: Math.random() * 3 + 4
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
                    `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`,
                    200
                )

                // ❌ Remove on target hit
                if (checkCollision(flare, target)) {
                    rebukeCollision(flare, target, 2)
                    stun(target, 200)
                    // attackResults(player, flare, target)
                    playRetreivedAudio('fireball')
                    flares.splice(i, 1)
                    continue
                }

                // ❌ Optional: remove if off-screen
                if (
                    flare.y > canvas.height ||
                    flare.x < -50 ||
                    flare.x > canvas.width + 50
                ) {
                    flares.splice(i, 1)
                }
            }

            player.indicate(`${player.name} is hyping itself up!`)
            
            // Stop the loop when nothing is left
            if (flares.length === 0 || life >= 2000) {
                const number = Math.ceil(Math.random() * 4)
                switch(number){
                        case 1:
                            player.indicate(`${player.name}'s hype made him stronger!`)
                            player.stats.atk += 3
                        break
                        case 2:
                            player.indicate(`${player.name}'s hype made him faster!`)
                            player.stats.spd += 0.25
                        break
                        case 3:
                            player.indicate(`${player.name}'s hype made him more durable!`)
                            player.stats.def += 4
                        break
                        case 4:
                            player.indicate(`${player.name}'s hype made him healthier!`)
                            player.stats.hp = Math.min(player.baseStats.hp, player.stats.hp + 8)
                        break
                }
                clearInterval(interval)
            }

        }, 100)

        
    }
})