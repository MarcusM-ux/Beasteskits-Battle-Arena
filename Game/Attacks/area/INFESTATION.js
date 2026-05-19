registerAttack('INFESTATION', {
    stats: { dmg: 5, type: 'Bug', cooldown: { time: 15000, switch: false } },
    action: (player, target) => {
        player.indicate("SWARM!");
        const swarmX = target.x;
        const swarmY = target.y;

        // Visual cloud
        for(let i=0; i<5; i++) {
            spawnEffect(swarmX + (Math.random()*40), swarmY + (Math.random()*40), 10, 10, 'black', 1000);
        }

        // Tick damage loop (3 hits over 1.5 seconds)
        let ticks = 0;
        const swarmInterval = setInterval(() => {
            if (checkCollision({x: swarmX, y: swarmY, width: 100, height: 100}, target)) {
                attackResults(player, { dmg: 4, type: 'Bug' }, target);
            }
            ticks++;
            if (ticks >= 3) clearInterval(swarmInterval);
        }, 500);
    }
});