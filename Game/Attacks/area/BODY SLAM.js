registerAttack('BODY SLAM', {
    stats: {dmg: 13, type: 'Basic', cooldown: {time: 6000, switch: false}}, action: (player, target) => {
        
        const stats = attackFunctions["BODY SLAM"].stats;
        let box = { dmg: stats.dmg, type: 'Basic' };
        let life = 0;
        const fr = player.facingRight;
        let hit = false;

        stun(player, 2000); // Shorter stun, adjusted for movement

        // Helper function to calculate the "Heavy" damage
        function applySlamDamage(p, t, b) {
            // Damage scales with Width (Size) and Defense (Weight)
            let finalDmg = b.dmg * ((p.width / 100) * (p.stats.def / 100) + 1);
            if (finalDmg > 20) finalDmg = 20
            rebukeCollision(player, target, 3)
            attackResults(p, { ...b, dmg: finalDmg }, t);
        }

        // PHASE 2: Slam Downward
        function startSlamDown() {
            const slamDown = setInterval(() => {
                player.y += 15; // Move DOWN quickly
                
                // Add forward momentum during the fall too
                player.x += (fr) ? 2 : -2;

                // 4. Check collision AND distance
                if (checkCollision(player, target) && !hit) {
                    // Player is far enough away to deal damage
                    applySlamDamage(player, target, box);
                    rebukeCollision(player, target, 2.5)
                    hit = true;
                    clearInterval(slamDown);
                    playRetreivedAudio('body-thud');
                }
                
                // Stop if they hit the ground or a certain limit
                if (player.y > canvas.height - player.height || hit) { 
                    stun(player, 2000)
                    clearInterval(slamDown);
                    playRetreivedAudio('body-thud')
                }
            }, 20);
        }

        // PHASE 1: Leap Up and Forward
        const running = setInterval(() => {
            life += 100;
            player.x += (fr) ? 8 : -8; // Move forward
            player.y -= 10;            // Move up

            if (checkCollision(player, target) && !hit) {
                // applySlamDamage(player, target, box);
                rebukeCollision(player, target, 2.5)
                hit = true;
                player.indicate(`${player.name}'s BODY SLAM was interrupted!`)
                player.stats.hp -= 2
                target.stats.hp -= 2

                player.updateLabel()
                target.updateLabel()
                
                clearInterval(running);
            }

            // Once we reach the peak of the jump (1 second)
            if (life >= 1000) {
                clearInterval(running);
                if (!hit) startSlamDown(); // Only slam down if we haven't hit yet
            }
        }, 20); // Faster interval (20ms) for smoother animation

    }
})