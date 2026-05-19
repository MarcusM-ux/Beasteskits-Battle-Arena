registerAttack('SHADOW STEP', {
    stats: {type: 'Dark', cooldown: {time: 7500, switch: false}}, action: (player, target) => {
                let box = {
                        x: player.x,
                        y: player.y,
                        width: player.width,
                        height: player.height,
                        color: 'rgba(128, 128, 128, 0.5)',
                        duration: 5000
                }
        
                if ((keybinds.movement.w && player.isPlayer1) || (keybinds.movement.arrowup && !player.isPlayer1)) {
                        player.y = 0
                        box.y -= 64
                        box.height += player.height
                    } else if ((keybinds.movement.s && player.isPlayer1) || (keybinds.movement.arrowdown && !player.isPlayer1)) {
                        player.y = canvas.height - player.height
                        box.height += player.height
                    } else {
                        if (Math.random() > 0.5) {
                             player.y = 0
                            box.y -= 64
                            box.height += player.height
                        } else {
                            player.y = canvas.height - player.height
                            box.height += player.height
                        }
                    }
                
                stun(player, 2000)
                spawnImage('shadowtrail', box, {audioName: 'ominous-note',priority: false})
                // spawnEffect(box.x, box.y, box.width, box.height, box.color, 100)

                let stun1Life = 0
                let hit = false
                const stunInterval1 = setInterval(()=>{
                    // spawnEffect(box.x, box.y, box.width, box.height, box.color, 100)
                    if (hit) {
                        spawnImage('shadowtrail', spot, {priority: false})
                    } else {
                        spawnImage('shadowtrail', box, {playAudioOnHit: true, target, audioName: 'ominous-breathe', priority: false})
                    }

                    if (checkCollision(box, target)) {
                        stun(target, box.duration)
                        target.indicate(`${target.name} is stunned by the shadows!`)
                        hit = true
                    }
                    stun1Life += 100
                    if (stun1Life > box.duration || hit){
                        clearInterval(stunInterval1)
                    }
                }, 100)
        
                let spot = {
                    x: player.x,
                    y: player.y,
                    width: player.width,
                    height: player.height + 15,
                    color: 'black',
                    duration: 3500
                }
                // spawnEffect(spot.x, spot.y, spot.width, spot.height, spot.color, 100)
                spawnImage('shadowtrail', spot, {priority: false})

                let stun2Life = 0
                const stunInterval2 = setInterval(()=>{
                    // spawnEffect(spot.x, spot.y, spot.width, spot.height, spot.color, 1000)
                    if (hit) {
                        spawnImage('shadowtrail', box, {priority: false})
                    } else {
                        spawnImage('shadowtrail', box, {playAudioOnHit: true, target, audioName: 'ominous-breathe', priority: false})
                    }
                    if (checkCollision(spot, target)) {
                        stun(target, spot.duration / 2)
                        hit = true
                        target.indicate(`${target.name} is stunned by the shadows!`)
                    }
                    stun2Life += 100
                    if (stun2Life > spot.duration){
                        clearInterval(stunInterval2)
                    }
                }, 100)
                
                player.indicate(`${player.name} dodged!`)
        
    }
})