registerAttack('RUSH DRILL', {
    stats: {dmg: 13, type: 'Metal', cooldown: {time: 10000, switch: false}}, action: (player, target)=> {
        const attributes = attackFunctions["RUSH DRILL"].stats
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            type: attributes.type,
            dmg: attributes.dmg,
            duration: 5000,
            color: 'gray'
        }

        stun(player, box.duration)
        let slamConnected = false
        function playRush(){
            const stats = attackFunctions["RUSH DRILL"].stats;
            let box = { dmg: stats.dmg, type: 'Metal' };
            let life = 0;
            const fr = player.facingRight;
            let hit = false;
            
            function startSlamDown() {
                const slamDown = setInterval(() => {
                    player.y -= 15; // Move DOWN quickly
                    
                    // Add forward momentum during the fall too
                    player.x += (fr) ? 2 : -2;
    
                    if (checkCollision(player, target) && !hit) {
                        // applySlamDamage(player, target, box);
                        // hit = true;
                        clearInterval(slamDown);
                        playRetreivedAudio('body-thud')
                    }
    
                    // Stop if they hit the ground or a certain limit
                    if (player.y > canvas.height - player.height || hit || player.y < player.height) { 
                        clearInterval(slamDown);
                        playRetreivedAudio('body-thud')
                    }
                }, 20);
            }
    
            const running = setInterval(() => {
                life += 100;
                player.x += (fr) ? 8 : -8; // Move forward
                player.y += 10;            // Move up
    
                if (checkCollision(player, target) && !hit) {
                    applySlamDamage(player, target, box);
                    hit = true;
                    slamConnected = true 
                    clearInterval(running);
                }
    
                // Once we reach the peak of the jump (1 second)
                if (life >= 1000) {
                    clearInterval(running);
                    if (!hit) startSlamDown(); // Only slam down if we haven't hit yet
                }
            }, 20); // Faster interval (20ms) for smoother animation
        }
        playRush()
        
        // Rush Directionally
        let rushLife = 0
        let incrementOverTime = 1.15
        let bonusDamage = 1
        playRetreivedAudio('running-sounds')

        const rush = setInterval(()=>{
            rushLife += 100
            player.x += (player.facingRight) ? 10 * incrementOverTime : -10 * incrementOverTime 
            
            incrementOverTime += 0.15
            if (checkCollision(player, target)) {
                bonusDamage = incrementOverTime
                incrementOverTime = 1.15
                clearInterval(rush)

                cancelAudio('running-sounds') 
                stun(target, box.duration)
                stun(player, box.duration / 2)
                spawnEffect(target.x, target.y, target.width, target.height, box.color, box.duration)
                attackResults(player, box, target)

                playRetreivedAudio('punch')

                
                // let time = 0
                // const playtime = setInterval(()=>{

                //     time += 100
                //     if (time < 1000) {
                //         target.y -= 5 * incrementOverTime
                //     } else {
                //         target.y += 5 * incrementOverTime
                //     }

                //     incrementOverTime += 0.15

                //     spawnEffect(target.x, target.y, target.width, target.height, box.color, 100)
                    
                //     if (time > 2000) {
                //         // box.dmg *= bonusDamage
                //         attackResults(player, box, target)
                //         playRetreivedAudio('punch')
                //         clearInterval(playtime)
                //     }
                    
                // }, 100)
            }
            
            if (rushLife > 500 || player.x >= canvas.width - player.width || player.x <= 0 + player.width || slamConnected){
                clearInterval(rush)
                cancelAudio('running-sounds') 
            }
        }, 100)
        
        // If catch player then slam them up (damage), slam them down (damage + stun)

        // They can escape but rapid pressing their keys with an base 30% chance to escape, +25% if they resist the type / escape by pressing keys that fill up a meter that represents when you can escape
    }
})