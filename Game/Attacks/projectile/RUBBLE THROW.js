registerAttack('RUBBLE THROW', {
    stats: { dmg: 12, type: 'Ground', cooldown: { time: 9000, switch: false } },
        action: (player, target) => {
            const attributes = attackFunctions["RUBBLE THROW"].stats;
            let duration = 2000; 
            
            let box = {
                x: player.x,
                y: player.y,
                width: 5,
                height: 5,
                type: attributes.type,
                dmg: attributes.dmg,
                color: 'brown',
                duration: 100,
                vx: 12,
                vy: 12,
            };

            const dir = player.facingRight ? 1 : -1
            const key = Object.keys(player.keysToAttack).find(k => player.keysToAttack[k].name === "RUBBLE THROW")
            let rico = false
            
            stun(player, duration);
            playRetreivedAudio('running-sounds');
    
            let life = 0;
            const targetPosition = {
                x: target.x,
                y: target.y
            }

            box.x += dir * 15
            const appear = setInterval(()=>{
                const oldWidth = box.width;
                const oldHeight = box.height;

                box.width += 5
                box.height += 5

                // Offset position to keep box centered
                box.x -= (box.width - oldWidth) / 2
                box.y -= (box.height - oldHeight) / 2

                // spawnEffect(box.x, box.y, box.width, box.height, 'brown', 100);
                spawnImage("rubble", box, {
                    playAudioOnHit : false,
                    audioName : null,
                    target : target,
                    flipX : player.facingRight,
                    flipY : false,
                    priority : false,
                })

                if (box.width >= player.width) {
                    startMoving()
                    clearInterval(appear)
                }

            }, 100)
            
            function startMoving(){
                box.duration = 40
                const moveInterval = setInterval(() => {
                    life += 20;
        
                    // 1. Visuals: Spawn a brown box effect exactly where the player is
                    // spawnEffect(box.x, box.y, box.width, box.height, 'brown', 40);
                    spawnImage("rubble", box, {
                        playAudioOnHit : false,
                        audioName : null,
                        target : target,
                        flipX : player.facingRight,
                        flipY : false,
                        priority : false,
                    })
        
                    // 2. Logic: Move player toward target's current position
                    // Calculate direction
                    let dx = targetPosition.x - player.x;
                    let dy = targetPosition.y - player.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    let speed = 12; // Adjust speed as needed
        
                    if (distance > 5) {
                        box.x += (dx / distance) * speed;
                        box.y += (dy / distance) * speed;
                    }

                    // 3. Collision Check
                    if (checkCollision(box, target)) {
                        clearInterval(moveInterval);
                        cancelAudio('running-sounds');
                        playRetreivedAudio('punch');
                        playRetreivedAudio('body-thud');
    
                        attackResults(player, box, target)
        
                        // Apply damage and secondary stun
                        // attackResults(player, box, target);
                        stun(target, 1000);
                        stun(player, 500);
                        
                        // Final impact effect
                        spawnEffect(target.x, target.y, target.width, target.height, 'brown', 500);
                    }
        
                    // 4. Timeout/Fail safe
                    if (life >= duration) {
                        clearInterval(moveInterval);
                        cancelAudio('running-sounds');
                    }
                }, 20); // 20ms for smooth tracking
            }
        }
        
})
