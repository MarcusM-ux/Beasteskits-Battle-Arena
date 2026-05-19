registerAttack('CLAW STRIKE', {
    stats: {dmg: 7, type: 'Fighting', cooldown: {time: 5000, switch: false}}, action: (player, target)=>{
            const stats = attackFunctions["CLAW STRIKE"].stats;
            let counterBox = {
                x: player.x,
                y: player.y - (player.height + 20), // Start above the player
                width: player.width * 1.25,
                height: player.height,
                color: 'orange',
                duration: 4000,
                dmg: 7,
                type: 'Fighting'
            };

            if (player.name == 'Hankclaw') {
                if (!player.clawHits){
                    player.clawHits = 0
                }else if (player.clawHits > 1) {
                    updateKeys(player, 'CLAW STRIKE', 'CLAW SWIPE TITAN')
                    const key = Object.keys(player.keysToAttack).find(k => player.keysToAttack[k].name === 'CLAW SWIPE TITAN')
                    player.keysToAttack[key].stats.cooldown.time = 12000
                    setTimeout(()=>{
                        updateKeys(player, 'DASH', 'DECONSTRUCT')
                    }, 12000)
                    player.clawHits = 0
                }
            }
            
            // Offset horizontally based on where the player is looking
            counterBox.x += (player.facingRight) ? player.width + 15 : -player.width - 15;
            
            let life = 0;
            let speedIncrement = 1.05;

            stun(player, 500)
            const animation = spawnAnimation(
                './Effects/clawstrike.png',
                counterBox.x,
                counterBox.y,
                126,
                126 ,
                64 ,
                64 ,
                13,
                50,
                650,
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
                // spawnEffect(counterBox.x,counterBox.y, counterBox.width, counterBox.height, 'orange' 16)
                
                // 3. The Specific Frame Check
                if (currentFrame >= 2 && currentFrame <= 12 && !hasHit) {
                    if (checkCollision(counterBox, target)) {

                        if (player.name == 'Hankclaw') {
                            player.clawHits += 1
                            counterBox.dmg -= (player.clawHits)
                            player.indicate(`${player.name} is preparing for something...`)
                        }
                        
                        hasHit = true; 
                        playRetreivedAudio('quick-whoosh');
                        playRetreivedAudio('body-thud');
                        
                        stun(target, 1000);
                        attackResults(player, counterBox, target); // Apply the 15 damage
                        
                        target.x += (player.facingRight) ? 65 : -65
                        
                        spawnEffect(target.x, target.y, target.width, target.height, 'black', 500);

                    }
                }
                
                counterBox.y += 0.9 * speedIncrement;
                animation.y = counterBox.y
                speedIncrement += 0.18;

                // 4. Stop checking once animation ends
                if (currentFrame >= animation.frameCount) {
                    clearInterval(damageInterval);
                }
            }, 16);

    }
})