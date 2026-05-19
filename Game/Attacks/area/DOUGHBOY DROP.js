registerAttack('DOUGHBOY DROP', {
    
        stats: { dmg: 15, type: 'Air', cooldown: { time: 10000, switch: false } },
        action: (player, target) => {
            player.vy -= 25; // Leap
            stun(player, 1500);

            setTimeout(() => {
                player.vy = 25; // Leap
                playRetreivedAudio('whoosh')
                const shockwave = { 
                    x: player.x - 50, 
                    y: player.y + player.height, 
                    width: player.width + 100, 
                    height: 30 
                };

                spawnEffect(shockwave.x, shockwave.y, shockwave.width, shockwave.height, 'white', 500);

                if (checkCollision(shockwave, target) || checkCollision(player, target)) {
                    // Impact rebuke: Small damage + knockback from the ground effect
                    rebukeCollision(player, target, 2.0); 
                    stun(target, 1200);
                    attackResults(player, attackFunctions["DOUGHBOY DROP"].stats, target);
                    playRetreivedAudio('body-thud')
                } else {
                    stun(player, 2500); // Miss penalty
                }
            }, 500);
            
        }
})