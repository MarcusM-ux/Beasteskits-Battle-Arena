registerAttack('CLAMP', {
    stats: {dmg: 13, type: 'Metal', cooldown: {time: 8000, switch: false}}, action: (player, target)=>{
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            dmg: attackFunctions.CLAMP.stats.dmg,
            color: '#586363',
            type: 'Metal',
            duration: 3000
        }
        
        playRetreivedAudio('clamp')
        stun(player, 3000)
        // spawnEffect(box.x, box.y, box.width, box.height, box.color, 101)
        
        const fr = player.facingRight
        if (fr) {
            box.x += player.width
        } else {
            box.x -= player.width
        }
        let rate = 5
        let life = 0

        if (keybinds.movement.d && player.isPlayer1 || 
           keybinds.movement.arrowright && !player.isPlayer1 ||
           keybinds.movement.a && player.isPlayer1 || 
           keybinds.movement.arrowleft && !player.isPlayer1) {
                rate *= 2
        }
        
        const interval = setInterval(()=>{
            life += 100
            if (fr) {
                box.x += rate
            } else {
                box.x -= rate
            }

            // spawnEffect(box.x, box.y, box.width, box.height, box.color, 100)
            spawnImage('clamp', {x:box.x, y:box.y, width:box.width, height:box.height,duration:100}, {
                playAudioOnHit: false,
                audioName: '',
                target: target,
                flipX : player.facingRight,
                flipY: false,
                priority: true,
            })

            if (checkCollision(box, target)){
                stun(target, 3000)
                stun(player, 500)
                pullCollision(box, target, 0.3)
                // spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
                spawnImage('clamp_closed', {x:box.x, y:box.y, width:box.width, height:box.height,duration:3000}, {
                    playAudioOnHit: false,
                    audioName: '',
                    target: target,
                    flipX : player.facingRight,
                    flipY: false,
                    priority: true,
                })
                attackResults(player, box, target)
                clearInterval(interval)
            }
            if (life > box.duration) {
                clearInterval(interval)
            }
        }, 100)
        
    }
})