registerAttack('VICIOUS BITE', {
    stats: { dmg: 15, type: 'Beast', cooldown: { time: 5500, switch: false }}, action: (player, target) => {
            const attackStats = attackFunctions["VICIOUS BITE"].stats
            let box = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                color: 'brown',
                dmg: attackStats.dmg,
                type: 'Beast', 
                duration: 500
            }
            stun(player, 500)

            if (player.facingRight) {
                box.x = player.x + player.width
            } else {
                box.x = player.x - player.width
            }

            player.indicate(`${player.name} used VICIOUS BITE!`)
            spawnImage('vicious_fangs', box, {
                playAudioOnHit: true,
                audioName: 'bite',
                target: target,
                flipX : !player.facingRight,
                flipY: false,
                priority: true
            })
        
            if (checkCollision(box, target)) {
                stun(target, 600)
                pullCollision(box, target, 1)
                attackResults(player, box, target)
            }
        }
})