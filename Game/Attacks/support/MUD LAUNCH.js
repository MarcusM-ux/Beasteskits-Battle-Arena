registerAttack('MUD LAUNCH', {
    stats: { type: 'Ground', cooldown: { time: 12000, switch: false } },
        action: (player, target) => {
            const attributes = attackFunctions["MUD LAUNCH"].stats;
            let duration = 2000; // How long the move lasts/how long they are stunned
            
            let box = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                type: attributes.type,
                dmg: attributes.dmg,
                color: 'brown'
            };
    
            stun(player, duration);
            playRetreivedAudio('running-sounds');
    
            let life = 0;
            const moveInterval = setInterval(() => {
                life += 20;
    
                // 1. Visuals: Spawn a brown box effect exactly where the player is
                spawnEffect(player.x, player.y, player.width, player.height, 'brown', 40);
    
                // 2. Logic: Move player toward target's current position
                // Calculate direction
                let dx = target.x - player.x;
                let dy = target.y - player.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                let speed = 12; // Adjust speed as needed
    
                if (distance > 5) {
                    player.x += (dx / distance) * speed;
                    player.y += (dy / distance) * speed;
                }
    
                // 3. Collision Check
                if (checkCollision(player, target)) {
                    clearInterval(moveInterval);
                    cancelAudio('running-sounds');
                    playRetreivedAudio('punch');
                    playRetreivedAudio('body-thud');
    
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
})