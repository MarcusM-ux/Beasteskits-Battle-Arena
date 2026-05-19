registerAttack('LUNGE', {
stats: { dmg: 15, type: 'Basic', cooldown: { time: 4000, switch: false } },
action: (player, target) => {
        let chargeTime = 0;
        player.indicate(`${player.name} is preparing to LUNGE!`)

        
        const running = setInterval(()=>{
            chargeTime += 100;
            player.stats.spd += 0.15; // Gradually speed up
            // player.x += (player.facingRight ? 1 : -1) * 15 + player.stats.spd 
            slidePlayers(player.stats.spd, 100, false, player, player, false)
            let dir = player.facingRight ? -50 : 50

            const dashHitbox = {
                x: player.x + dir,
                y: player.y,
                width: player.width,
                height: player.height,
                duration: 100
            }
            spawnImage('thrust', dashHitbox, {
                playAudioOnHit: false,
                audioName: '',
                target: target,
                flipX : !player.facingRight,
                flipY: false,
                priority: true
            })

            if (chargeTime > 1000) { // After 1.2s of running
                clearInterval(running)
                const dir = 1
                let jumpTime = 0
                const jump = setInterval(()=>{
                    stun(player, 100)
                    
                    player.y -= dir * 15
                    player.x += (player.facingRight ? 1 : -1) * 15
                    
                    jumpTime += 50

                    if (jumpTime >  1000 || player.x >= target.x) {
                        clearInterval(jump)

                        const slamDown = setInterval(()=>{
                            stun(player, 100)
                            player.y += dir * 40

                            if (checkCollision(player, target)) {
                                clearInterval(slamDown)
                                
                                player.stats.spd = player.baseStats.spd

                                attackResults(player, {dmg: 15, type: 'Basic'}, target)
                                target.vy = 15
                            }
                            
                            if (player.y > target.y){
                                clearInterval(slamDown)
                                player.stats.spd = player.baseStats.spd
                            }
                        }, 100)
                        
                    }
                }, 50)
            }
        }, 100)
        

    }

});