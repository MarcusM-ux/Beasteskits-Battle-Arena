registerAttack('NOXIOUS EXPOSURE', {
    stats: { dmg: 4, type: 'Toxic', cooldown: { time: 8000, switch: false } }, 
    action: (player, target) => {
        const elements = [];
        let hit = false;
        let elapsed = 0;
        const maxDuration = 3000;
        const spawnRate = 2; // Spawn faster for continuous chain
        const segmentSpacing = 15; // Distance between chain segments
        const wrapDistance = 200;

        let startBlob = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            dmg: 2, 
            type: 'Toxic',
            color: '#79e06c',
            life: 0,
            isStart: true
        }
        
        elements.push(startBlob);

        const interval = setInterval(() => {
            elapsed += 100;

            // Spawn new blob in chain
            if (elapsed % (spawnRate * 100) === 0 && elements.length < 30) {
                // Get the last blob in the chain
                const lastBlob = elements[elements.length - 1];
                
                // Calculate direction toward target
                const targetCenterX = target.x + target.width / 2;
                const targetCenterY = target.y + target.height / 2;
                const lastCenterX = lastBlob.x + lastBlob.width / 2;
                const lastCenterY = lastBlob.y + lastBlob.height / 2;

                const distX = targetCenterX - lastCenterX;
                const distY = targetCenterY - lastCenterY;
                const distance = Math.hypot(distX, distY);

                // Normalize and calculate next position
                let nextX, nextY;
                
                if (distance > 0) {
                    const dirX = distX / distance;
                    const dirY = distY / distance;
                    nextX = lastCenterX + dirX * segmentSpacing - lastBlob.width / 2;
                    nextY = lastCenterY + dirY * segmentSpacing - lastBlob.height / 2;
                } else {
                    nextX = lastCenterX;
                    nextY = lastCenterY;
                }

                const newBlob = {
                    x: nextX,
                    y: nextY,
                    width: Math.random() * 8 + player.width * 0.6,
                    height: Math.random() * 8 + player.height * 0.6,
                    dmg: 2, 
                    type: 'Toxic',
                    color: '#79e06c',
                    life: 0,
                    isStart: false
                }
                
                elements.push(newBlob);
            }

            // Update all blobs in chain
            for (let i = 1; i < elements.length; i++) {
                const e = elements[i];
                const prevBlob = elements[i - 1];
                e.life += 100;

                // Calculate target for this blob
                const targetCenterX = target.x + target.width / 2;
                const targetCenterY = target.y + target.height / 2;
                const eCenterX = e.x + e.width / 2;
                const eCenterY = e.y + e.height / 2;

                const distX = targetCenterX - eCenterX;
                const distY = targetCenterY - eCenterY;
                const distance = Math.hypot(distX, distY);

                // Pull toward target, but also stay connected to previous blob
                const pullTowardTarget = 0.3;
                const stayConnected = 0.7;

                let moveX = 0;
                let moveY = 0;

                if (distance > 0) {
                    const dirX = distX / distance;
                    const dirY = distY / distance;
                    moveX += dirX * pullTowardTarget;
                    moveY += dirY * pullTowardTarget;
                }

                // Stay close to previous blob
                const prevCenterX = prevBlob.x + prevBlob.width / 2;
                const prevCenterY = prevBlob.y + prevBlob.height / 2;
                const toPrevX = prevCenterX - eCenterX;
                const toPrevY = prevCenterY - eCenterY;
                const prevDist = Math.hypot(toPrevX, toPrevY);

                if (prevDist > segmentSpacing * 1.5) {
                    const prevDirX = toPrevX / prevDist;
                    const prevDirY = toPrevY / prevDist;
                    moveX += prevDirX * stayConnected;
                    moveY += prevDirY * stayConnected;
                }

                e.x += moveX;
                e.y += moveY;

                spawnEffect(e.x, e.y, e.width, e.height, e.color, 100);

                // Hit detection
                if (checkCollision(e, target) && !hit) {
                    hit = true;
                    attackResults(player, e, target);
                    stun(target, 2000)

                        if (Math.random() > 0.50) {
                        if (target.type == 'Toxic' || target.type == 'Metal'){
                            target.indicate(`${target.name} cannot be POISONED! Its ${target.type} Type!`)
                            target.stats.hp -= box.dmg
                            target.updateLabel()
                            return
                        }
                        
                        target.indicate(`${target.name} has been POISONED by ${player.name} temporarily!`)
            
                        let life = 0
                        const poisonInterval = setInterval(()=>{
                            const particle = spawnAnimation(
                                './Effects/Status/poison_effect.png',
                                target.x,
                                target.y,
                                72, //size width
                                72, //size height
                                128,
                                128,
                                6,
                                50,
                                300,
                                !player.facingRight
                            );
                                        
                            
                            life += 300
                            if (life > 1600) {
                                clearInterval(poisonInterval)
                            }
                            target.stats.hp -= 1
                            target.updateLabel()
                            target.indicate(`${target.name} is taking damage from being POISONED!`)
                        }, 300)
                        
                    }
                    
                }

                // Remove expired blobs
                if (e.life > 1500) {
                    elements.splice(i, 1);
                    i--;
                }
            }

            if (elapsed >= maxDuration) {
                clearInterval(interval);
            }
        }, 100);
    }
});
