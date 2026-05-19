registerAttack('VILE CALAMITY', {
        stats: { dmg: 16, type: 'Dark', cooldown: { time: 9000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["VILE CALAMITY"].stats;
            
            // 1. Initial Wind-up (The Tween Back)
            player.indicate(`${player.name} is winding up!`);
            stun(player, 600); 
            const windUpDir = player.facingRight ? -40 : 40;
            player.x += windUpDir; 

            // 2. The Crash Forward
            setTimeout(() => {
            player.indicate(`${player.name} crashed forward!`);
                const crashDist = player.facingRight ? 120 : -120;
                player.x += crashDist;

                // Burst effect at the point of impact
                spawnEffect(player.x, player.y, player.width, player.height, 'rgba(0,0,0,0.6)', 150);

                if (checkCollision(player, target)) {
                    const result = dealDamage(player, stats, target);
                    
                    if (result.isFatal) {
                        player.x = target.x; // Execution snap
                        spawnEffect(target.x, target.y - 50, 10, 200, 'red', 1000);
                        target.stats.hp = 0;
                        target.updateLabel();
                    } else {
                        target.stats.hp -= result.damage;
                        target.updateLabel();
                        stun(target, 1500); // Crash stun
                        rebukeCollision(player, target, 3.5); // Heavy knockback
                        // playRetreivedAudio('heavy-impact');
                    }
                }else {
                    stun(player, 600)
                }
            }, 400); 
        }
})