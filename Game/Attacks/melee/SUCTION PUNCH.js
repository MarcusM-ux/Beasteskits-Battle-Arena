registerAttack('SUCTION PUNCH', {
stats: { dmg: 12, type: 'Air', cooldown: { time: 13000, switch: false } },
action: (player, target) => {

    const stats = attackFunctions['SUCTION PUNCH'].stats
    const dir = player.facingRight ? 1 : -1

    player.indicate(`${player.name} is preparing SUCTION PUNCH!`)
    stun(player, 800)

    let time = 0
    let connected = false
    playRetreivedAudio('wind-ambience')
    
    // 🌪️ PULL PHASE
    const pullInterval = setInterval(() => {
        time += 50

        // smooth pull (NOT teleporting)
        const dx = player.x - target.x
        const dy = player.y - target.y

        target.x += dx * 0.15
        target.y += dy * 0.15

        if (obstacles.length > 0){
        obstacles.forEach(obj => {
            const obx = player.x - obj.x
            const oby = player.y - obj.y

            obj.x += obx * 0.15
            obj.y += oby * 0.15
        })
        }

        spawnEffect(
            target.x,
            target.y,
            target.width,
            target.height,
            'rgba(200,200,255,0.2)',
            50
        )

        // if close → punch
        if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
            connected = true
            clearInterval(pullInterval)

            player.indicate(`${player.name} LANDED SUCTION PUNCH!`)
            cancelAudio('wind-ambience')
            playRetreivedAudio('lighting-whip')

            // 👊 PUNCH HITBOX
            const hitbox = {
                x: player.x + (dir * player.width),
                y: player.y,
                width: 40,
                height: player.height,
                dmg: stats.dmg,
                type: stats.type
            }

            spawnEffect(hitbox.x, hitbox.y, hitbox.width, hitbox.height, 'white', 200)

            // stun(target, 1500)
            attackResults(player, hitbox, target)

            // knockback
            stun(target, 1000)
            target.x += dir * 40

            // 🌪️ SCATTER OBSTACLES RANDOMLY
            if (obstacles.length > 0) {
                obstacles.forEach(obj => {
                    const spreadDistance = 60 + Math.random() * 80 // 60-140px spread
                    const spreadAngle = Math.random() * Math.PI * 2 // random direction
                    
                    obj.x += Math.cos(spreadAngle) * spreadDistance
                    obj.y += Math.sin(spreadAngle) * spreadDistance
                })
            }
        }

        // timeout = miss
        if (time > 1000) {
            clearInterval(pullInterval)

            if (!connected) {
                player.indicate(`${player.name} MISSED SUCTION PUNCH!`)
                stun(player, 1200) // punish
            }

            if (obstacles.length > 0){
             obstacles.forEach(obj => {
                obj.x += dir * 40
                obj.y += (Math.random() * 40) - 40
            })
            }
        }

    }, 50)

}

})
