registerAttack('PUDDLE', {
    stats: { dmg: 2, type: 'Water', cooldown: { time: 10000, switch: false } }, action: (player, target) => {
            const baseWidth = player.width * 3
            const baseHeight = player.height * 3

            const centerX = player.x + player.width / 2
            const centerY = player.y + player.height / 2

            let newBox = {
                width: baseWidth,
                height: baseHeight,
                x: centerX - baseWidth / 2,
                y: centerY - baseHeight / 2,
                color: 'lightblue',
                duration: 1500,
                dmg: 2,
                type: 'Water'
            }

            let factor = 0.9
            let totalLife = 0
            // spawnEffect(newBox.x, newBox.y, newBox.width, newBox.height, newBox.color, newBox.duration)
            playRetreivedAudio('water-splash')
            const interval = setInterval(() => {
                totalLife += 1
                spawnEffect(newBox.x, newBox.y, newBox.width, newBox.height, newBox.color, newBox.duration)

                // Self slow
                if (checkCollision(newBox, player)) {
                    player.maxSpeed = player.baseStats.spd * 0.5
                } else if (!player.stunTimer) {
                    player.maxSpeed = player.baseStats.spd
                }

                // Target slow + damage
                if (checkCollision(newBox, target)) {
                    target.maxSpeed = target.baseStats.spd * 0.45

                    if (totalLife % 2 === 0){
                        const { message, damage } = dealDamage(player, newBox, target)
                        target.stats.hp -= damage
                        target.updateLabel()
                        target.indicate(message)
                    }
                } else if (!target.stunTimer) {
                    target.maxSpeed = target.baseStats.spd
                }

                // Shrink
                newBox.width *= factor
                newBox.height *= factor

                // 🔑 Re-center after shrinking
                newBox.x = centerX - newBox.width / 2
                newBox.y = centerY - newBox.height / 2

                if (newBox.width <= 30) {
                    clearInterval(interval)
                    if (!player.stunTimer) player.maxSpeed = player.baseStats.spd
                    if (!target.stunTimer) target.maxSpeed = target.baseStats.spd
                }

            }, 500)
        }
})