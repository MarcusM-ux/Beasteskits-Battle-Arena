registerAttack('WRAP', {
    stats: { dmg: 1, type: 'Basic', cooldown: { time: 8000, switch: false }}, 
    action: (player, target) => {
        const attackStats = attackFunctions.WRAP.stats;
        const originalSpeed = player.stats.spd;

        // Start with no initial stun on player to allow "hunting"
        // Only stun the target once caught
        let life = 0;
        let choked = false;

        const interval = setInterval(() => {
            // End condition
            if (life > 4000 || isGameOver) {
                target.indicate('');
                player.stats.spd = originalSpeed; // Reset speed
                clearInterval(interval);
                return;
            }

            life += 100;

            // 1. DETECTION PHASE
            if (!choked && checkCollision(player, target)) {
                choked = true;
                player.indicate(`${player.name} is dragging ${target.name}!`);
                // Slow the player down because they are carrying weight
                // player.stats.spd = originalSpeed * 0.6; 
            }

            // 2. SLITHER PHASE (The user is moving, target is dragged)
            if (choked) {
                // Keep target stunned and locked to player
                stun(target, 200);
                
                // Dragging logic: Target follows player with a slight offset
                target.x = player.x + (player.width / 4);
                target.y = player.y;

                target.indicate(`${player.name} is being DRAGGED!!`);
                
                // Visual "trail" effect
                // spawnEffect(player.x, player.y, player.width, player.height, 'rgba(128, 128, 128, 0.3)', 150);

                // Damage Ticks
                if (life % 500 === 0) {
                    target.stats.hp -= 1;
                    target.updateLabel();
                }
            } else {
                // Aura while hunting
                spawnEffect(player.x, player.y, player.width, player.height, 'gray', 100);
            }
        }, 100);
    }
});