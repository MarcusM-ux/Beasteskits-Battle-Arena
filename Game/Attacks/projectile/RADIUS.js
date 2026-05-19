registerAttack('RADIUS', {
            stats: { dmg: 20, type: 'Dark', cooldown: { time: 18000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["RADIUS"].stats;
            let life = 0;
            const maxLife = 5000;
            let isMarked = false;
            if (!target.isMarked) target.isMarked = false
            let hit = false;
    
            const radiusInterval = setInterval(() => {
                life += 50;
                let angle = life * 0.01; 
                let radiusDist = 120;
                let blockX = player.x + Math.cos(angle) * radiusDist;
                let blockY = player.y + Math.sin(angle) * radiusDist;
    
                spawnEffect(blockX, blockY, 30, 30, 'rgba(40, 0, 80, 0.8)', 60);
    
                let distToTarget = Math.sqrt(Math.pow(target.x - player.x, 2) + Math.pow(target.y - player.y, 2));
    
                if (distToTarget < radiusDist + 50 && !isMarked && !hit) {
                    isMarked = true;
                    target.isMarked = true
                    player.indicate("MARKED!");
                    playRetreivedAudio('teleport-sound'); 
    
                    const markTimer = setInterval(() => {
                        // spawnEffect(target.x - 10, target.y - 10, target.width + 20, target.height + 20, 'rgba(255, 0, 0, 0.3)', 100);

                        spawnImage('cross_target', {
                            x: target.x, y: target.y, width: target.width, height: target.height, duration: 100
                        }, {
                            playAudioOnHit: false,
                            audioName: '',
                            target: target,
                            flipX : !player.facingRight,
                            flipY: false,
                            priority: true,
                        })
                        
                    }, 100);
    
                    setTimeout(() => {
                        clearInterval(markTimer);
                        hit = true;
    
                        // Calculate Damage outcome before applying visuals
                        const result = dealDamage(player, stats, target);
    
                        // --- CRITICAL HIT: BLACK FLASH VISUALS ---
                        // if (result.isCrit) {
                        //     for(let i=0; i<8; i++) {
                        //         spawnEffect(target.x + Math.random()*50, target.y + Math.random()*50, 5, 20, 'black', 400);
                        //         spawnEffect(target.x + Math.random()*50, target.y + Math.random()*50, 5, 20, 'red', 400);
                        //     }
                        //     playRetreivedAudio('heavy-impact'); // Assuming you have a louder sound
                        // }
    
                        // --- FINISHER LOGIC ---
                        if (result.isFatal) {
                            player.indicate("FINISH HIM!");
                            // Visual: Screen turns dark
                            spawnEffect(0, 0, canvas.width, canvas.height, 'rgba(0,0,0,0.7)', 1200);
                            
                            // Zoom/Snap player to target for the execution
                            player.x = target.x - (player.facingRight ? -40 : 40);
                            pauseAll()
                            playRetreivedAudio('explosion');
                            stun(target, 5000)
                            
                            setTimeout(() => {
                                spawnEffect(target.x - 100, target.y - 100, 300, 300, 'red', 1000);
                                target.image.src = "./Effects/dust.png"
                                target.updateLabel();
                                
                                setTimeout(()=>{
                                    target.stats.hp -= result.damage;
                                    target.updateLabel();
                                    
                                }, 4000)
                            }, 500);
                        } else {
                            // Normal hit behavior
                            spawnEffect(target.x - 50, target.y - 50, 150, 150, 'red', 500);
                            playRetreivedAudio('explosion');
                            target.stats.hp -= result.damage;
                            target.updateLabel();
                            stun(target, 2000);
                        }
    
                        isMarked = false;
                        target.isMarked = false
                        
                    }, 3000);
                }
    
                if (life >= maxLife) clearInterval(radiusInterval);
            }, 50);
        }   
})