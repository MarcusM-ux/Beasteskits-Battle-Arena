registerAttack('FLASH BEAM', {
    stats: { dmg: 2, type: 'Light', cooldown: { time: 4000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["FLASH BEAM"].stats;
            let orb = {
                x: player.x,
                y: player.y,
                width: 30,
                height: 30,
                color: 'yellow'
            };

            if (player.quickShot) return
            player.quickShot = true
    
            const direction = player.facingRight ? 12 : -12;
            let distanceTravelled = 0;
            let beam = 1
            
            playRetreivedAudio('pulse-sound');
            const flyInterval = setInterval(() => {
                orb.x += direction;
                distanceTravelled += Math.abs(direction);
    
                // Visual for the orb
                spawnEffect(orb.x, orb.y, orb.width, orb.height, orb.color, 50);
    
                if (checkCollision(orb, target)) {
                    if (beam === 1){
                        beam++
                        stun(target, 1000)
                        slidePlayers(8, 200, false, player, target)
                        spawnEffect(target.x, target.y, target.width, target.height, orb.color, 300);

                        orb.x = player.x
                        orb.y = player.y
                        distanceTravelled = 0
                    }else{
                        attackResults(player, { dmg: 2, type: 'Light' }, target);
                        spawnEffect(target.x, target.y, target.width, target.height, orb.color, 300);
                        
                        player.quickShot = false
                        clearInterval(flyInterval)
                    }
                }
    
                // Remove if it goes off screen or too far
                if (distanceTravelled > 800 || orb.x > canvas.width || orb.x < 0) {
                    player.quickShot = false
                    clearInterval(flyInterval)
                }
            }, 20);


            
        }

})