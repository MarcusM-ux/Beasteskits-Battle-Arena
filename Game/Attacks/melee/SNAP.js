registerAttack('SNAP', {
  stats: {dmg: 2, type: 'Basic', color: 'gray', cooldown: {time: 1000, switch: false}}, action: (player, target) => {
            let box = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                dmg: attackFunctions.SNAP.stats.dmg,
                color: 'gray',
                type: 'Basic',
                duration: 500
            }
              const animation = spawnAnimation(
                './Effects/snap.png',
                box.x,
                box.y,
                82,
                82 ,
                128 ,
                128 ,
                12,
                100,
                600,
                !player.facingRight
            );       
            stun(player, 600)
            // spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
            if (checkCollision(box, target)) {
                rebukeCollision(box, target, 3)
                stun(target, 600)
                attackResults(player, box, target)
                playRetreivedAudio('finger-snap')        
            }
      
        }
})