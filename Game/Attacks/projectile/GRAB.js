registerAttack('GRAB', {
    stats: {dmg: 8, type: 'Basic', cooldown: {time: 5000, switch: false}}, action: (player, target)=>{
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            dmg: attackFunctions.GRAB.stats.dmg,
            color: 'gray',
            type: 'Basic',
            duration: 100
        }
        playRetreivedAudio('whoosh')
        stun(player, 2000)
        
        const fr = player.facingRight
        if (fr) {
            box.x += player.width
        } else {
            box.x -= player.width
        }
        let rate = 12
        let life = 0

        if (keybinds.movement.d && player.isPlayer1 || 
           keybinds.movement.arrowright && !player.isPlayer1 ||
           keybinds.movement.a && player.isPlayer1 || 
           keybinds.movement.arrowleft && !player.isPlayer1) {
                rate *= 2
        }
        
        const interval = setInterval(()=>{
            life += 100
            spawnEffect(box.x, box.y, box.width, box.height, box.color, 100)
            if (fr) {
                box.x += rate
            } else {
                box.x -= rate
            }

            if (checkCollision(box, target)){
                let pos = (player.facingRight) ? 25 : -25
                player.x = target.x + pos
                stun(target, 2000)
                pullCollision(box, target, 1)
                spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
                attackResults(player, box, target)
                clearInterval(interval)
            }
            if (life > box.duration) {
                clearInterval(interval)
            }
        }, 100)
        
    }
})