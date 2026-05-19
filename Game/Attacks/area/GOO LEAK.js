registerAttack('GOO LEAK', {
    stats: { dmg: 2, type: 'Bug', cooldown: { time: 8000, switch: false } }, 
    action: (player, target) => {
        const ATTACK_DURATION = 3000;  // Total duration of attack
        const TICK_RATE = 150;         // Check collision every 150ms instead of 100ms
        const DAMAGE_PER_HIT = 2;
        const SPEED_REDUCTION = 0.15;  // Reduced from 0.25
        const PLAYER_PENALTY = 0.5;    // Player speed reduction per tick
        
        let attackLife = 0;
        let hits = 0
        const attackInterval = setInterval(() => {
            // End attack after duration
            if (attackLife > ATTACK_DURATION) {
                clearInterval(attackInterval);
                player.stats.spd = player.baseStats.spd
                return;
            }
            
            // Create goo effect
            const gooBox = {
                x: player.x,
                y: player.y + player.height / 2,
                width: player.width,
                height: player.height / 2,
                color: 'lightgreen',
                dmg: DAMAGE_PER_HIT,
                type: 'Bug'
            };
            
            // Visual effect
            spawnEffect(gooBox.x, gooBox.y, gooBox.width, gooBox.height, gooBox.color, TICK_RATE * 2);
            gooBox.x -= player.width
            // Player self-penalty (they're leaking goo, so they slow down)
            player.stats.spd = Math.max(0.5, player.stats.spd - PLAYER_PENALTY);
            player.indicate(`${player.name} is leaking GOO!`);
            
            // Check collision with target
            if (checkCollision(gooBox, target) && hits < 4) {
                attackResults(player, { dmg: DAMAGE_PER_HIT, type: 'Bug' }, target);
                target.stats.spd = Math.max(0.85, target.stats.spd - SPEED_REDUCTION);
                rebukeCollision(target, gooBox, 1.5);  // Reduced knockback from 2 to 1.5
                hits += 1
                // Short stun on hit (not full duration)
                stun(target, 200);
            }
            
            attackLife += TICK_RATE;
        }, TICK_RATE);
    }
});
