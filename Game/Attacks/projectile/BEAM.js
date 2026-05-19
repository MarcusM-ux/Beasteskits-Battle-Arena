registerAttack('BEAM', {
    stats: {dmg: 4, type: 'Light', cooldown: {time: 5000, switch: false}}, action: (player, target) => {
        const attributes = attackFunctions.BEAM.stats
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            type: 'Light',
            color: '#a8ad55',
            dmg: attributes.dmg,
            duration: 3000,
            extend: 60
        }

        let hits = 0
        stun(player, box.duration)
        playRetreivedAudio('pulse-sound')
        setTimeout(()=>{
            if (keybinds.movement.w && player.isPlayer1 ||
               keybinds.movement.arrowup && !player.isPlayer1 || 
               cpuIntent.player1.movement.w || cpuIntent.player2.movement.arrowup) {
                // Shoot Beam Upwards
                box.height += box.extend
                box.y -= player.height * 2.65
               } else if (keybinds.movement.a && player.isPlayer1 ||
               keybinds.movement.arrowleft && !player.isPlayer1 || cpuIntent.player1.movement.a || cpuIntent.player2.movement.arrowleft) {
                // Shoot Beam Leftward
                box.width += box.extend
                box.x -= player.width * 2.5
               } else if (keybinds.movement.s && player.isPlayer1 ||
               keybinds.movement.arrowdown && !player.isPlayer1 || cpuIntent.player1.movement.s || cpuIntent.player2.movement.arrowdown) {
                // Shoot Beam Downwards
                box.height += box.extend
                box.y += player.height * 1.5
               } else if (keybinds.movement.d && player.isPlayer1 ||
               keybinds.movement.arrowright && !player.isPlayer1 || cpuIntent.player1.movement.d || cpuIntent.player2.movement.arrowright) {
                
                // Shoot Beam Rightward
                box.width += box.extend
                box.x += player.width * 1.3
                } else {
                    if (player.facingRight) {
                        // Shoot Beam Rightward
                        box.width += box.extend
                        box.x += player.width * 1.3
                    } else {
                         // Shoot Beam Leftward
                        box.width += box.extend
                        box.x -= player.width * 2.65
                    }
            }
    
            // spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
            
            let life = 0
            let x = player.x
            let y = player.y
            
            const beamInterval = setInterval(()=>{
                spawnEffect(box.x, box.y, box.width, box.height, box.color, 100)
                
                if (checkCollision(box, target) && life % 2 === 0) {
                    hits++
                    rebukeCollision(box, target, 1.5)
                    stun(target, 100)
                    attackResults(player, box, target)
                    playRetreivedAudio('static')
                }
                if (life >= box.duration || player.x !== x || player.y !== y || hits >= 5) {
                    clearInterval(beamInterval)
                }
                life += 100
            }, 100)
            

        }, 400)
        
        
    }
})