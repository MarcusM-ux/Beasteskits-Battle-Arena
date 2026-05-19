registerAttack('SHADOW SNARE', {
    
        stats: { type: 'Dark', cooldown: { time: 9000, switch: false } },
        action: (player, target) => {
            const pos = (player.facingRight) ? player.width : -player.width;
            let snare = { x: player.x + pos, y: player.y, width: player.width, height: player.height * 1.5 };
            
            // spawnEffect(snare.x, snare.y, snare.width, snare.height, 'black', 300);
            // playRetreivedAudio('pulse-sound');
            playRetreivedAudio('ominous-note')
            
            const animation = spawnAnimation(
                './Effects/shadow_snare.png',
                snare.x,
                snare.y,
                snare.width,
                snare.height,
                405,
                570,
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
                if (currentFrame >= 1 && currentFrame <= 9 && !hasHit) {
                     if (checkCollision(snare, target)) {
                        // Pull mechanic
                        // target.x = player.x + (facing ? 50 : -50);
                        // "Stun Damage" - Increased stun duration on hit
                        stun(target, 2500); 
                        // playRetreivedAudio('body-thud');
                        playRetreivedAudio('ominous-breathe')
                    }
                }
            }, 50)

           
        }
    
})