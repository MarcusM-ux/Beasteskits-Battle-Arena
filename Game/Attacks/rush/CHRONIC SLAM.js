registerAttack('CHRONIC SLAM', {
    stats: {dmg: 10, type: 'Basic', cooldown: {time: 6000, switch: false}}, action: (player, target)=>{
        const attributes = attackFunctions["CHRONIC SLAM"].stats

        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            dmg: attributes.dmg,
            color: colorFromType(attributes.type),
            type: attributes.type
        }

        stun(player, 1500)
        let slamCount = 0
        let slamDamageMod = 1.15
        const slamDamageInc = 0.15
        const fr = player.facingRight
        let life = 0
        let hit = false

        const rapidSlam = setInterval(() => {
            slamCount++
            life += 100

            // STOP at 1000ms life
            if (life >= 500) {
                clearInterval(rapidSlam)
                return
            }

            // Scale damage
            let damage = attributes.dmg * slamDamageMod
            slamDamageMod += slamDamageInc

            // Horizontal drive
            player.x += fr ? 12 : -12
            player.y += (slamCount % 2 === 0) ? 12 : -12

            // Sync hitbox
            box.x = player.x
            box.y = player.y
            box.dmg = Math.round(damage)

            // Stop conditions
            if (
                player.x <= 10 ||
                player.x >= canvas.width - player.width ||
                player.stats.hp < player.baseStats.hp * 0.35
            ) {
                clearInterval(rapidSlam)
                return
            }

            // Collision logic
            if (checkCollision(player, target) && !hit) {
                hit = true
                stun(target, 2000)

                // Main damage
                attackResults(player, box, target)

                // Chip damage after every slam
                const chip = Math.max(1, Math.floor(target.baseStats.hp * 0.02))
                target.stats.hp -= chip
                target.updateLabel()

                rebukeCollision(player, target, slamCount)
            }

        }, 100)

    }
})