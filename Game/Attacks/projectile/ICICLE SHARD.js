registerAttack('ICICLE SHARD', {
    
        stats: { dmg: 8, type: 'Frost', cooldown: { time: 4000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["ICICLE SHARD"].stats;
            let shard = {
                x: player.x,
                y: player.y,
                width: 20,
                height: 20,
                color: 'cyan'
            };
    
            const velocity = player.facingRight ? 10 : -10;
    
            const travel = setInterval(() => {
                shard.x += velocity;
                spawnEffect(shard.x, shard.y, shard.width, shard.height, 'white', 40);
    
                if (checkCollision(shard, target)) {
                    clearInterval(travel);
                    attackResults(player, { dmg: stats.dmg, type: stats.type }, target);
                    // Frost Effect: Lower target speed temporarily
                    let originalSpeed = target.stats.spd;
                    target.stats.spd *= 0.5;
                    setTimeout(() => target.stats.spd = originalSpeed, 2000);
                    
                    // playRetreivedAudio('impact');
                }
    
                if (shard.x > canvas.width || shard.x < 0) clearInterval(travel);
            }, 20);
        }
})