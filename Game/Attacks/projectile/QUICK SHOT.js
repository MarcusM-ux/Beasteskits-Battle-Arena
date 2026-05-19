registerAttack('QUICK SHOT', {
    stats: { dmg: 1, type: 'Light', cooldown: { time: 500, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["QUICK SHOT"].stats;
            let orb = {
                x: player.x,
                y: player.y,
                width: 30,
                height: 30,
                color: colorFromType(player.type)
            };

            if (player.quickShot) return
            player.quickShot = true
    
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
                    attackResults(player, { dmg: stats.dmg, type: player.type }, target);
                    spawnEffect(target.x, target.y, target.width, target.height, orb.color, 300);
                    // playRetreivedAudio('impact');
                    setTimeout(()=>{
                        player.quickShot = false
                    }, 500)
                }
    
                // Remove if it goes off screen or too far
                if (distanceTravelled > 800 || orb.x > canvas.width || orb.x < 0) {
                    clearInterval(flyInterval);
                    player.quickShot = false
                }
            }, 20);
        }

})