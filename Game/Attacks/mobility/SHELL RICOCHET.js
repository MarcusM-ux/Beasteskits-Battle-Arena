registerAttack('SHELL RICOCHET', {
    
        stats: {type: 'Basic', cooldown: { time: 15000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["SHELL RICOCHET"].stats;
            let life = 0;
            const maxLife = 8000; // 8 seconds
            const startHP = player.stats.hp; // Track HP at start
            const hpThreshold = 15; // Cancel if player loses more than 15 HP
            
            // Initial Velocity
            let velX = player.facingRight ? 12 : -12;
            let velY = 10; // Start with a diagonal bounce
            
            stun(player, maxLife); // Player can't use other moves while bouncing
            player.indicate("RICOCHET!");
    
            const bounceInterval = setInterval(() => {
                life += 20;
    
                // 1. Move Player
                player.x += velX;
                player.y += velY;
    
                // 2. Wall Bounce Logic (X-axis)
                if (player.x <= 0 || player.x >= canvas.width - player.width) {
                    velX *= -1; // Flip horizontal direction
                    playRetreivedAudio('body-thud'); // Feedback for bounce
                    // spawnEffect(player.x, player.y, player.width, player.height, 'white', 100);
                }
    
                // 3. Wall Bounce Logic (Y-axis)
                if (player.y <= 0 || player.y >= canvas.height - player.height) {
                    velY *= -1; // Flip vertical direction
                    playRetreivedAudio('body-thud');
                }
    
                // 4. Visuals (Trail effect)
                spawnEffect(player.x, player.y, player.width, player.height, 'rgba(0, 255, 0, 0.3)', 60);
    
                // 5. Collision with Opponent
                if (checkCollision(player, target)) {
                    stun(target, 3000); // Knockback stun
                    rebukeCollision(player,target, 2)
                    stopRicochet();
                    playRetreivedAudio('punch');
                }
    
                // 6. Damage Threshold Check (Cancel if player is being punished)
                if (startHP - player.stats.hp > hpThreshold) {
                    player.indicate("CRACKED!");
                    stopRicochet();
                }
    
                // 7. Time Limit Check
                if (life >= maxLife) {
                    stopRicochet();
                }
    
            }, 20);
    
            function stopRicochet() {
                clearInterval(bounceInterval);
                stun(player, 0); // Remove stun
                player.indicate("");
            }
        }
})