registerAttack('ABYSS SHIELD', {
            stats: { type: 'Dark', cooldown: { time: 10000, switch: false } },
        action: (player) => {
            player.indicate(`DARK SHELL! ${player.name}'s defense increased drastically`);
            player.stats.def += 50;
            
            let duration = 0;
            const maxDuration = 5000; // 2 seconds of protection

            // Follow Interval: Updates the visual to the player's X/Y every 50ms
            const shieldInterval = setInterval(() => {
                duration += 50;
                
                // Spawns a sticky aura around the current player position
                spawnEffect(
                    player.x - 10, 
                    player.y - 10, 
                    player.width + 20, 
                    player.height + 20, 
                    'rgba(20, 0, 40, 0.5)', 
                    60 // Very short duration so it doesn't leave a ghost trail
                );

                // Stop if time runs out or player dies
                if (duration >= maxDuration || player.stats.hp <= 0) {
                    player.stats.def = player.stats.def;
                    player.indicate(`${player.name}'s defense decreased...`);
                    clearInterval(shieldInterval);
                }
            }, 50);
        }
})