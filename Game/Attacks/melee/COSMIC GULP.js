registerAttack('COSMIC GULP', {
        stats: { dmg: 18, type: 'Beast', cooldown: { time: 12000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["COSMIC GULP"].stats;

            spawnEffect(player.x, player.y, player.width, player.height, 'maroon', 500)
            stun(player, 500)
            if (checkCollision(player, target)) {
                stun(player, 2000)
                stun(target, 2000)
                const ogImg = target.image.src
                target.image.src = ''
                player.indicate(`${player.name} is GULPPING ${target.name}!`)
                target.indicate(`${target.name} is getting eaten!`);
                
                // Pull target toward the mouth
                let dx = player.x - target.x;
                target.x += dx * 0.5; 
                
                stun(target, 500);
                stun(player, 400); // Self-stun while "chewing"
                
                setTimeout(() => {
                    attackResults(player, stats, target);
                    // Spit them out backwards
                    target.x += (player.facingRight) ? 100 : -100;
                    target.image.src = ogImg
                    playRetreivedAudio('punch');
                }, 1000);
            }else {
                 player.indicate(`${player.name} is too far to use its COSMIC GULP!`)   
            }
        }
})