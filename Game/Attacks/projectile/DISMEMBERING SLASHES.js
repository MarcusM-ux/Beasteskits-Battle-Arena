registerAttack('DISMEMBERING SLASHES', {
    stats: {dmg: 12, type: 'Basic', cooldown: {time: 9000, switch: false}}, action: (player, target)=>{

            const stats = attackFunctions["DISMEMBERING SLASHES"].stats;
            let indicator = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                color: '#f04010',
                duration: 100,
                dmg: 12,
                type: 'Basic'
            }

            const huntDuration = 3000
            const starterHP = player.stats.hp
            const slashDistance = 100
            let life = 0

            function commitAnimation(collide){
                    const animation = spawnAnimation(
                        './Effects/dismemberingslashes.png',
                        indicator.x,
                        indicator.y,
                        target.width,
                        target.height,
                        210,
                        210,
                        16,
                        50,
                        800,
                        !player.facingRight
                    )    
                    
                    let hasHit = false
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
                        if (currentFrame >= 2 && currentFrame <= 12 && !hasHit && collide) {
                            
                                hasHit = true; 
                                playRetreivedAudio('quick-whoosh');
                                playRetreivedAudio('body-thud');
                                
                                stun(target, 1000);
                                attackResults(player, stats, target); // Apply the 15 damage
                                target.updateLabel()
                                
                                // target.x += (player.facingRight) ? 65 : -65
                        }
                    }, 100)
            }

            const hunt = setInterval(()=>{
                life += 100
                
                if (player.isPlayer1) {
                    if (keybinds.movement.d) {
                        indicator.x = player.x + slashDistance
                        indicator.y = player.y
                    }
                    else if (keybinds.movement.a){
                        indicator.x = player.x - slashDistance
                        indicator.y = player.y
                    }
                    if (keybinds.movement.w){
                        indicator.y = player.y - slashDistance 
                        indicator.x = player.x
                    }
                    else if (keybinds.movement.s){
                        indicator.y = player.y + slashDistance
                        indicator.x = player.x
                    }
                    
                }else if (!player.isPlayer1){
                    if (keybinds.movement.arrowright) {
                        indicator.x = player.x + slashDistance
                        indicator.y = player.y
                    }
                    else if (keybinds.movement.arrowleft) {
                        indicator.x = player.x - slashDistance
                        indicator.y = player.y
                    }
                    if (keybinds.movement.arrowup) {
                        indicator.y = player.y - slashDistance 
                        indicator.x = player.x
                    }
                    else if (keybinds.movement.arrowdown) {
                        indicator.y = player.y + slashDistance
                        indicator.x = player.x
                    }
                }

                spawnEffect(indicator.x, indicator.y, indicator.width, indicator.height, indicator.color, indicator.duration)
        
                if (checkCollision(indicator, target)) {
                    stun(target, 3000)
                    clearInterval(hunt)

                    indicator.x = target.x
                    indicator.y = target.y
                    stun(player, 500)
                    commitAnimation(true)   
                }
                
                if (life > huntDuration) {
                    clearInterval(hunt)
                    stun(player, 800)
                    commitAnimation(false)
                }
            }, 100)
            
    }
})