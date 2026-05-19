registerAttack('ACID SPIT', {
    stats: { dmg: 10, type: 'Toxic', cooldown: { time: 6000, switch: false } },
    action: (player, target) => {
        const dir = player.facingRight ? 1 : -1;
        player.indicate("SPIT!");

        // Create a projectile object
        const projectile = {
            x: player.x + (dir * 20),
            y: player.y + 20,
            vx: dir * 12,
            width: 20,
            height: 20
        };

        const projLoop = setInterval(() => {
            projectile.x += projectile.vx;
            spawnEffect(projectile.x, projectile.y, 15, 15, 'greenyellow', 50);

            if (checkCollision(projectile, target)) {
                attackResults(player, { dmg: 7, type: 'Toxic' }, target);
                // Harasser trait: Slow the target
                target.spd *= 0.5; 
                setTimeout(() => { target.spd = target.baseSpd; }, 2000); 
                
                clearInterval(projLoop);
            }
            
            // Clean up if it misses
            if (projectile.x > canvas.width || projectile.x < 0) clearInterval(projLoop);
        }, 16);
    }
});