registerAttack('CHOMP',{
    stats: { dmg: 5, type: 'Dark', cooldown: { time: 5000, switch: false }}, action: (player, target) => {
            const attackStats = attackFunctions.CHOMP.stats

            let box = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                color: 'black',
                dmg: attackStats.dmg,
                type: 'Dark', 
                duration: 500,
            }

            stun(player, box.duration)

            if (player.facingRight) {
                box.x = player.x + player.width
            } else {
                box.x = player.x - player.width
            }

            spawnImage('fangs', box, {
                playAudioOnHit: true,
                audioName: 'bite',
                target: target,
                flipX : !player.facingRight,
                flipY: false,
                priority: true
            })

            if (checkCollision(box, target)) {
                stun(target, box.duration / 2)
                attackResults(player, box, target)
            }

        }
})