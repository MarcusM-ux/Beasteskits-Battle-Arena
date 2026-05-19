registerAttack('ORBITAL STRIKE', {
    stats: { dmg: 12, type: 'Light', cooldown: { time: 6000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["ORBITAL STRIKE"].stats;
            let orb = {
                x: player.x,
                y: player.y,
                width: 30,
                height: 30,
                color: 'cyan'
            };
    
            const direction = player.facingRight ? 12 : -12;
            let distanceTravelled = 0;
            playRetreivedAudio('pulse-sound');
            const flyInterval = setInterval(() => {
                orb.x += direction;
                distanceTravelled += Math.abs(direction);
    
                // Visual for the orb
                spawnEffect(orb.x, orb.y, orb.width, orb.height, orb.color, 50);
    
                if (checkCollision(orb, target)) {
                    clearInterval(flyInterval);
                    attackResults(player, { dmg: stats.dmg, type: stats.type }, target);
                    spawnEffect(target.x, target.y, target.width, target.height, 'cyan', 300);
                    // playRetreivedAudio('impact');
                }
    
                // Remove if it goes off screen or too far
                if (distanceTravelled > 800 || orb.x > canvas.width || orb.x < 0) {
                    clearInterval(flyInterval);
                }
            }, 20);
        }

})