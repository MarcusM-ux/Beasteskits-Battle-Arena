registerAttack('ELECTRO WAVE', {
    stats: { dmg: 5, type: 'Electric', cooldown: { time: 5000, switch: false } },action: (player, target) => {

        const attributes = attackFunctions["ELECTRO WAVE"].stats
        stun(player, 600)

        const BOLTS = 3
        const X_SPACING = 40
        const BASE_SPEED = 8
        const SPEED_INC = 4
        const BASE_DMG = attributes.dmg
        const DMG_INC = 3
        const MAX_HEIGHT = player.height

        playRetreivedAudio('thunder')
        for (let i = 0; i < BOLTS; i++) {
            
            const speed = BASE_SPEED + SPEED_INC * i
            const damage = BASE_DMG + DMG_INC * i

            let bolt = {
                x: player.x + (player.facingRight
                    ? player.width + i * X_SPACING
                    : -i * X_SPACING),

                y: player.y, // START FROM TOP
                width: player.width / 2,
                height: 0,
                dmg: damage,
                type: attributes.type,
                color: colorFromType(attributes.type)
            }

            const interval = setInterval(() => {
                bolt.height += speed   // grows downward faster each bolt

                spawnEffect(
                    bolt.x,
                    bolt.y,
                    bolt.width,
                    bolt.height,
                    bolt.color,
                    100
                )

                if (checkCollision(bolt, target)) {
                    playRetreivedAudio('pulse-sound')
                    attackResults(player, bolt, target)
                    stun(target, 500)
                    clearInterval(interval)
                }

                if (bolt.height >= MAX_HEIGHT) {
                    clearInterval(interval)
                }

            }, 50)
        }
    }
})