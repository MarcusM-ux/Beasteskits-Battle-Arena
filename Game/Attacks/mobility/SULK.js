registerAttack('SULK', {
    stats: { type: 'Dark', cooldown: { time: 8000, switch: false } },
    action: (player, target) => {
        const originalSpeed = player.stats.spd;
        const startHP = player.stats.hp
        // player.stats.spd += 4.5; // Move super fast
        player.stats.spd += 4.5; // Move super fast
        player.opacity = 0.3;      // Visual "puddle" transparency

        const checkMovement = setInterval(() => {
            // If player stops (vx and vy are near 0) or takes damage
            if ((Math.abs(player.vx) < 0.1 && Math.abs(player.vy) < 0.1) || player.stats.hp < startHP) {
                player.stats.spd = originalSpeed;
                player.opacity = 1.0;
                
                stun(player, 2000); // Penalty for stopping
                player.indicate("UNCOVERED!");
                clearInterval(checkMovement);
            }
            
            // Spawn dark particles at feet
            spawnEffect(player.x, player.y, player.width, player.height, '#222', 100);
        }, 100);
    }
});