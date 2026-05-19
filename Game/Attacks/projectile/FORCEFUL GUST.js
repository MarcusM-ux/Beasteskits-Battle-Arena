registerAttack('FORCEFUL GUST', {
stats: { dmg: 12, type: 'Air', cooldown: { time: 13000, switch: false } },
action: (player, target) => {
    const stats = attackFunctions['FORCEFUL GUST'].stats
    stun(player, 400)

    const dir = player.facingRight ? 1 : -1
    const airParts = []

    const spacing = 18
    const length = 5
    const baseX = player.x + (dir * (player.width + 10)) // 👈 IN FRONT
    const baseY = player.y + player.height / 2

    let hit = false

    // 🔺 BUILD SIDEWAYS "<" SHAPE
    for (let i = 0; i < length; i++) {

        const offsetY = i * spacing
        const offsetX = i * spacing * 0.8 // controls angle

        // upper arm
        airParts.push({
            x: baseX - (dir * offsetX),
            y: baseY - offsetY,
            vx: dir * 7,
            vy: -1.5,
            width: 20,
            height: 20,
            dmg: stats.dmg,
            type: stats.type,
            color: 'white'
        })

        // lower arm
        airParts.push({
            x: baseX - (dir * offsetX),
            y: baseY + offsetY,
            vx: dir * 7,
            vy: 1.5,
            width: 20,
            height: 20,
            dmg: stats.dmg,
            type: stats.type,
            color: 'white'
        })
    }

    // 🔥 SMALL HOLD → THEN FIRE
    setTimeout(() => {

        let life = 0
        playRetreivedAudio('gust')
        const interval = setInterval(() => {
            life += 16

            for (let i = airParts.length - 1; i >= 0; i--) {
                const p = airParts[i]

                // movement (straight outward)
                p.x += p.vx
                // p.y += p.vy

                spawnEffect(p.x, p.y, p.width, p.height, p.color, 60)

                if (checkCollision(p, target)) {
                    if (!hit){
                        attackResults(player, p, target)
                        hit = true
                        rebukeCollision(p, target, 2)
                    }else {
                        // rebukeCollision(player, p, 2)
                        rebukeCollision(p, target, 2)
                    }
                    stun(target, 1000)
                    airParts.splice(i, 1)
                    continue
                }

                if (
                    p.x < -50 || p.x > canvas.width + 50 ||
                    p.y < -50 || p.y > canvas.height + 50
                ) {
                    airParts.splice(i, 1)
                }
            }

            if (life > 1400 || airParts.length === 0) {
                clearInterval(interval)
            }

        }, 16)

    }, 500) // brief charge feel
}

})