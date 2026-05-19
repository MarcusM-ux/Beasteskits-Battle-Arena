registerAttack('STATIC', {
    stats: { dmg: 1, type: 'Electric', cooldown: { time: 2000, switch: false } }, action: (player, target) => {
            const attributes = attackFunctions.STATIC.stats
            let box = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                color: 'yellow',
                dmg: attributes.dmg,
                type: 'Electric',
                duration: 1000
            }

            if (player.facingRight) {
                box.x += player.width
            } else {
                box.x -= player.width
            }

            spawnImage('static', box, {
                playAudioOnHit: true,
                audioName: 'static',
                target: target,
                flipX : !player.facingRight,
                flipY: false,
                priority: true
            })
            stun(player, 500)
        
            if (checkCollision(box, target)) {
                stun(target, box.duration)
                
                let { message, damage } = dealDamage(player, box, target)
                target.stats.hp -= damage
                target.updateLabel()
                target.indicate(message)
            }
        
        }
})