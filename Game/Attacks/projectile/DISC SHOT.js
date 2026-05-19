registerAttack('DISC SHOT', {
    stats: { dmg: 2, type: 'Basic', cooldown: { time: 500, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["DISC SHOT"].stats;
            let orb = {
                x: player.x,
                y: player.y,
                width: 100,
                height: 30,
                color: colorFromType(player.type),
                duration: 20
            };

            if (player.quickShot) return
            player.quickShot = true
    
            const direction = player.facingRight ? 12 : -12;
            let distanceTravelled = 0;
            playRetreivedAudio('pulse-sound');
            const flyInterval = setInterval(() => {
                spawnImage("disc", orb, {
                     playAudioOnHit: false,
                    audioName: '',
                    target: target,
                    flipX : !player.facingRight,
                    flipY: false,
                    priority: true,
                })
                
                orb.x += direction * 0.9;
                distanceTravelled += Math.abs(direction);
    
                // Visual for the orb
                spawnEffect(orb.x, orb.y, orb.width, orb.height, orb.color, 50);
    
                if (checkCollision(orb, target)) {
                    clearInterval(flyInterval);
                    attackResults(player, { dmg: stats.dmg, type: player.type }, target);
                    spawnEffect(target.x, target.y, target.width, target.height, orb.color, 300);
                    slidePlayers(8, 500, false, player, target)
                    stun(target, 500)
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