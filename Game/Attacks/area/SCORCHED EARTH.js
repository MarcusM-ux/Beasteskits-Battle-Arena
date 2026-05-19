registerAttack('SCORCHED EARTH', {
    
        stats: { type: 'Ground', cooldown: { time: 7000, switch: false } },
        action: (player, target) => {
            const pos = (player.facingRight) ? player.width : -player.width;
            let snare = { x: player.x, y: player.y, width: 74, height: 74};
            
            // spawnEffect(snare.x, snare.y, snare.width, snare.height, 'black', 300);
            // playRetreivedAudio('pulse-sound');
            playRetreivedAudio('ash')
            
            const animation = spawnAnimation(
                './Effects/volcano_rise.png',
                snare.x,
                snare.y,
                74,
                74,
                630,
                630,
                9,
                100,
                950,
                !player.facingRight
            )    

            let hasHit = false
            const facing = player.facingRight
            const damageInterval = setInterval(() => {
                // 1. Safety check: if animation is gone or finished
                if (!animation || (animation.isActive && Date.now() > animation.expiry)) {
                    clearInterval(damageInterval);
                    return;
                }
            
                const now = Date.now();
                const timeElapsed = now - animation.startTime;
                const currentFrame = Math.floor(timeElapsed / animation.frameDuration);        
                // 3. The Specific Frame Check
                if (currentFrame > 1 && currentFrame < 9 ) {
                    player.y -= 5
                     if (checkCollision(snare, target) && !hasHit) {
                        hasHit = true
                        // Pull mechanic
                        // target.x = player.x + (facing ? 50 : -50);
                        // "Stun Damage" - Increased stun duration on hit
                        stun(target, 3000); 
                        // playRetreivedAudio('body-thud');
                        slidePlayers(5, 200, false, player, target)
                        playRetreivedAudio('lava-hiss')
                    }
                }
            }, 50)

           
        }
    
})