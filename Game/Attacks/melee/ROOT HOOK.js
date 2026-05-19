registerAttack('ROOT HOOK', {    
        stats: { dmg: 15, type: 'Ground', cooldown: { time: 8000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["ROOT HOOK"].stats;
            
            // Create a long root hitbox forward
            let root = {
                x: player.facingRight ? player.x + 50 : player.x - 50,
                y: player.y,
                width: player.width,
                height: player.height,
                color: 'brown',
                dmg: 15
            };

            const animation = spawnAnimation(
                './Effects/roothook.png',
                root.x,
                root.y,
                80,
                80 ,
                128 ,
                128 ,
                27,
                50,
                1375,
                player.facingRight
            );       
            stun(player, 1000)

            // spawnEffect(root.x, root.y, root.width, root.height, root.color, 500);
            let soundEffects = {
                wind: ()=>{playRetreivedAudio('whoosh')},
                punch: ()=>{playRetreivedAudio('punch')}
            }
            let hasHit = false;
            const damageInterval = setInterval(() => {
                // 1. Safety check: if animation is gone or finished
                if (!animation || (animation.isActive && Date.now() > animation.expiry)) {
                    clearInterval(damageInterval);
                    return;
                }
            
                // 2. Sync the frame calculation exactly like the draw loop does
                const now = Date.now();
                const timeElapsed = now - animation.startTime;
                const currentFrame = Math.floor(timeElapsed / animation.frameDuration);
            
                if (currentFrame >= 21 && currentFrame <= 27 ) {
                    soundEffects.wind()
                    if (checkCollision(root, target) && !hasHit) {
                        // Pull target toward the player
                        stun(target, 500);
                        attackResults(player, stats, target);
                        rebukeCollision(root, target, 1.2);
                        hasHit = true; 
                        soundEffects.punch()
                    }
                }
            
                // 4. Stop checking once animation ends
                if (currentFrame >= animation.frameCount) {
                    clearInterval(damageInterval);
                }
            }, 16);

        }
    
})