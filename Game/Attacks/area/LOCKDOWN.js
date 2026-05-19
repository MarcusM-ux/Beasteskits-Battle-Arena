// prevent the player from moving
// mark them as locked
registerAttack('LOCKDOWN', {
        stats: { dmg: 2, type: 'Metal', cooldown: { time: 10000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["LOCKDOWN"].stats;
            
            // 1. Initial Wind-up (The Tween Back)
            player.indicate(`${player.name} is winding up!`);
            stun(player, 600); 
            const windUpDir = player.facingRight ? -40 : 40;
            player.x += windUpDir; 

            // 2. The Crash Forward
            setTimeout(() => {
            player.indicate(`${player.name} crashed forward!`);
                const crashDist = player.facingRight ? 120 : -120;
                player.x += crashDist;

                // Burst effect at the point of impact
                spawnEffect(player.x, player.y, player.width, player.height, 'rgba(0,0,0,0.6)', 150);
                if (checkCollision(player, target)) {
                    target.indicate(`${player.name} is LOCKED in place!`);
                    stun(player, 100)
                    spawnImage('lock', {x: target.x, y: target.y, width: target.width, height: target.height, duration: 2400}, {
                        playAudioOnHit: true,
                        audioName: 'gear_lock',
                        target: target,
                        flipX : !player.facingRight,
                        flipY: false,
                        priority: true
                    })
                    target.lockedDown = true
                    stun(target, 2400)
                    attackResults(player, stats, target)

                    setTimeout(()=>{
                        target.lockedDown = false
                    }, 2400)
                    // const result = dealDamage(player, stats, target);
                    
                    // if (result.isFatal) {
                    //     player.x = target.x; // Execution snap
                    //     spawnEffect(target.x, target.y - 50, 10, 200, 'red', 1000);
                    //     target.stats.hp = 0;
                    //     target.updateLabel();
                    // } else {
                    //     target.stats.hp -= result.damage;
                    //     target.updateLabel();
                    //     stun(target, 1500); // Crash stun
                    //     rebukeCollision(player, target, 3.5); // Heavy knockback
                    //     // playRetreivedAudio('heavy-impact');
                    // }
                }else {
                    target.indicate(`${player.name} missed and LOCKED itself place!`);
                    stun(player, 100)
                    spawnImage('lock', {x: player.x, y: player.y, width: player.width, height: player.height, duration: 2400}, {
                        playAudioOnHit: true,
                        audioName: 'gear_lock',
                        target: target,
                        flipX : !player.facingRight,
                        flipY: false,
                        priority: true
                    })
                    player.lockedDown = true
                    stun(player, 2400)
                    attackResults(player, stats, player)

                    setTimeout(()=>{
                        target.lockedDown = false
                    }, 2400)                
                }
            }, 400)
        }
})