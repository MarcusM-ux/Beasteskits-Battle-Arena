registerAttack('HAYMAKER',{
    
        stats: { dmg: 12, type: 'Fighting', cooldown: { time: 10000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["HAYMAKER"].stats;
            
            // Create a long root hitbox forward
            let root = {
                x: player.facingRight ? player.x + 50 : player.x - 50,
                y: player.y,
                width: player.width,
                height: player.height,
                color: 'orange',
                dmg: 12
            };

            player.indicate(`${player.name} is winding up its HAYMAKER.`);
            stun(player, 3000)

            const animation = spawnAnimation(
                './Effects/force_punch.png',
                root.x,
                root.y,
                80,
                80 ,
                128 ,
                128 ,
                9,
                100,
                900,
                !player.facingRight
            );       
            stun(player, 1000)

            // spawnEffect(root.x, root.y, root.width, root.height, root.color, 500);
            let soundEffects = {
                wind: ()=>{playRetreivedAudio('whoosh')},
                punch: ()=>{playRetreivedAudio('punch')}
            }

            setTimeout(()=>{
                player.x += (player.facingRight) ? 60 : -60;
                
                let hasHit = false;
                const damageInterval = setInterval(() => {
                    // 1. Safety check: if animation is gone or finished
                    if (!animation || (animation.isActive && Date.now() > animation.expiry)) {
                        clearInterval(damageInterval);
                        return;
                    }
                    spawnEffect(root.x, root.y, root.width, root.height, 'orange', 16);
                    
                
                    // 2. Sync the frame calculation exactly like the draw loop does
                    const now = Date.now();
                    const timeElapsed = now - animation.startTime;
                    const currentFrame = Math.floor(timeElapsed / animation.frameDuration);
                
                    if (currentFrame >= 1 && currentFrame <= 9 ) {
                        soundEffects.wind()
                        if (checkCollision(root, target) && !hasHit) {
                            // Pull target toward the player
                            stun(target, 500);
                            attackResults(player, stats, target);
                            rebukeCollision(root, target, 1.2);
                            hasHit = true; 
                            soundEffects.punch()
                            stun(target, 800); // Heavy impact stun
                            playRetreivedAudio('punch');
                            player.indicate(`${player.name} used HAYMAKER and it hit!`);
                            slidePlayers(10, 200, false, player, target)
                            
                        }else player.indicate(`${player.name} used HAYMAKER and missed?!`);
                    }
                
                    // 4. Stop checking once animation ends
                    if (currentFrame >= animation.frameCount) {
                        clearInterval(damageInterval);
                    } 
                }, 16);
            
            }, 400)

            

            // const stats = attackFunctions["HAYMAKER"].stats;
            
            // // Wind-up: Player turns red briefly before the punch
            // player.indicate(`${player.name} is winding up its HAYMAKER.`);
            // stun(player, 3000)
            
            // setTimeout(() => {
            //     // Forward lunge for the punch
            //     player.x += (player.facingRight) ? 60 : -60;
            //     spawnEffect(player.x, player.y, player.width + 20, player.height, 'orange', 200);
            //     if (checkCollision(player, target)) {
            //         attackResults(player, stats, target);
            //         stun(target, 800); // Heavy impact stun
            //         playRetreivedAudio('punch');
            //         player.indicate(`${player.name} used HAYMAKER and it hit!`);
                    
            //     }else player.indicate(`${player.name} used HAYMAKER and missed?!`);
                
            // }, 400); // 0.4s delay makes the move feel "heavy"
        }
})