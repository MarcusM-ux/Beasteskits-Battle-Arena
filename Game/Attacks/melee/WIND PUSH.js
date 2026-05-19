registerAttack('WIND PUSH', {
    
        stats: { dmg: 10, type: 'Air', cooldown: { time: 6000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["WIND PUSH"].stats;
            const pos = (player.facingRight) ? 40 : -40;
            const windZone = { x: player.x + pos, y: player.y, width: 100, height: player.height };
            
            // spawnEffect(windZone.x, windZone.y, windZone.width, windZone.height, 'rgba(200, 230, 255, 0.5)', 400);
            
            stun(player, 700);
            const animation = spawnAnimation(
                './Effects/windpush.png',
                windZone.x,
                windZone.y,
                82,
                82 ,
                128 ,
                128 ,
                15,
                50,
                675,
                !player.facingRight
            );       

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

                //8 - 13 massive push & push
                if (currentFrame >= 8 && currentFrame <= 13 && !hasHit) {
                     if (checkCollision(windZone, target)) {
                        rebukeCollision(windZone, target, 3); // Knockback multiplier
                        attackResults(player, stats, target);
                        playRetreivedAudio('quick-whoosh');
                        playRetreivedAudio('punch');
                        hasHit = true
                    } else {
                        stun(player, 1500);
                    }
                }

                if (currentFrame >= 14 && currentFrame <= 15 && !hasHit) {
                     if (checkCollision(windZone, target)) {
                        rebukeCollision(windZone, target, 3); // Knockback multiplier
                        stats.dmg *= 2
                        attackResults(player, stats, target);
                        playRetreivedAudio('quick-whoosh');
                        playRetreivedAudio('punch');
                        player.indicate(`${player.name} hit the sweep spot and did MORE DAMAGE!`)
                        hasHit = true
                    } else {
                        stun(player, 1500);
                    }
                }


                //sweet spot - if hit no cooldown + extra dmg + knockback
            
                // 4. Stop checking once animation ends
                if (currentFrame >= animation.frameCount) {
                    clearInterval(damageInterval);
                }
            }, 16);
        }
    
})