registerAttack('AQUA SHOT', {
stats: { type: 'Water', dmg: 0, heal: 2, cooldown: { time: 3000, switch: false } },
action: (player, target) => {

    // ── WATER LEVEL INIT (once per player) ──────────────────────────
    if (player.waterLevel === undefined) {
        player.waterLevel = 0
        player.lastWaterUpdate = 0

        // Passive water gain: +1 every 5 seconds, cap 15
        player.waterInterval = setInterval(() => {
            if (player.waterLevel < 15) {
                player.waterLevel += 1
            }
        }, 3000)
    }

    // Gain 1 water per use
    player.waterLevel -= 1
    if (player.waterLevel < 0) player.waterLevel = 0  

    // ── HOSE SPRAY SETUP ────────────────────────────────────────────
    const direction  = player.facingRight ? 1 : -1
    const muzzleX    = player.facingRight
        ? player.x + player.width          // front when facing right
        : player.x                         // front when facing left
    const muzzleY    = player.y + player.height / 2

    const flareCount  = 8
    const flares      = []

    for (let i = 0; i < flareCount; i++) {
        // Spread angle: small cone forward (like a hose)
        // Cone is ±20 degrees around the forward direction
        const spreadAngle = (Math.random() * 40 - 20) * (Math.PI / 180)
        const speed       = Math.random() * 2 + 5

        // Base direction is purely horizontal (0 radians), spread from there
        const vx = Math.cos(spreadAngle) * speed * direction
        const vy = Math.sin(spreadAngle) * speed

        flares.push({
            x:      muzzleX,
            y:      muzzleY,
            width:  14,
            height: 14,
            vx,
            vy,
        })
    }

    playRetreivedAudio('explosion')

    // ── PROJECTILE LOOP ─────────────────────────────────────────────
    let life = 0
    const interval = setInterval(() => {
        life += 100

        for (let i = flares.length - 1; i >= 0; i--) {
            const flare = flares[i]
            flare.x += flare.vx
            flare.y += flare.vy

            spawnEffect(flare.x, flare.y, flare.width, flare.height, 'blue', 200)

            // Hit target
            if (checkCollision(flare, target)) {
                const damageMultiplier = player.waterLevel >= 15 ? 1.5 : 1
                rebukeCollision(flare, target, 2 * damageMultiplier)
                playRetreivedAudio('water-splash')
                flares.splice(i, 1)
                continue
            }

            // Off screen
            if (
                flare.x < -50 || flare.x > canvas.width  + 50 ||
                flare.y < -50 || flare.y > canvas.height + 50
            ) {
                flares.splice(i, 1)
            }
        }

        if (flares.length === 0 || life >= 600) {
            // ── HEAL & SPEED BONUS ───────────────────────────────────
            let healAmount = 2
            let speedIncrease = 0.25
            if (player.waterLevel >= 10){ healAmount += 1; speedIncrease += 0.25; player.waterLevel -= 2  }
            if (player.waterLevel >= 15){ healAmount += 3; speedIncrease += 1; player.waterLevel -= 4 }
            if (player.waterLevel === 15){ healAmount += 6; speedIncrease += 1.5; player.waterLevel = 0 }
            
            
            handleHealth(player, healAmount)

            player.stats.spd += speedIncrease
            player.indicate(`${player.name} healed ${healAmount} HP and is temporarily faster!`)

            setTimeout(() => {
                player.stats.spd = player.baseStats.spd
            }, 3000)

            clearInterval(interval)
        }
    }, 100)
}

})
