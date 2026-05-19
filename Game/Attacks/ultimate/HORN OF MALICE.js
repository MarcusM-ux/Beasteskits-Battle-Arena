registerAttack('HORN OF MALICE', {
          stats: { dmg: 30, type: 'Dark', cooldown: { time: 30000, switch: false } },
        action: (player, target) => {
            player.indicate("MALICE");
            stun(player, 1500); // Longer wind-up for the big move

            setTimeout(() => {
                let distance = 0;
                let hornLife = 0;
                const maxDistance = 500;
                const speed = 15;
                const direction = player.facingRight ? 1 : -1;

                // Create an interval to tween the "Horn" forward
                const hornInterval = setInterval(() => {
                    distance += speed;
                    hornLife += 16; // Approx time per frame

                    // Keep the horn size relative to the player
                    const horn = {
                        x: player.x + (distance * direction),
                        y: player.y - (player.height * 0.2), // Slightly above feet
                        width: player.width * 1.2,
                        height: player.height * 1.2
                    };

                    // Visual shadow trail
                    spawnEffect(horn.x, horn.y, horn.width, horn.height, 'black', 100);

                    // Check collision during the tween
                    if (checkCollision(horn, target)) {
                        clearInterval(hornInterval);
                        const result = dealDamage(player, attackFunctions["HORN OF MALICE"].stats, target);
                        
                        // Finisher / Fatal Logic
                        if (result.isFatal) {
                            stun(target, 6000);
                            // Screen flash and cinematic slow-down
                            spawnEffect(0, 0, canvas.width, canvas.height, 'rgba(40, 0, 0, 0.6)', 1000); 
                            
                            setTimeout(() => {
                                spawnEffect(target.x - 50, target.y - 50, 200, 200, 'red', 800);
                                playRetreivedAudio('explosion');
                                target.stats.hp -= result.damage;
                                target.updateLabel();
                            }, 3000);
                        } else {
                            // Normal hit
                            target.stats.hp -= result.damage;
                            target.updateLabel();
                            rebukeCollision(player, target, 4.0); // Massive knockback
                            stun(target, 1000);
                        }
                    }

                    // Remove if it goes off screen or max distance
                    if (distance > maxDistance) {
                        clearInterval(hornInterval);
                    }
                }, 16);

            }, 1000);
        }  
})