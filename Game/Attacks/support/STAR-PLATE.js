registerAttack('STAR-PLATE', {
    
        stats: { type: 'Light', cooldown: { time: 15000, switch: false } },
        action: (player, target) => {
            player.indicate(`${player.name} increased its defense increased drastically!`);
            let originalDef = player.stats.def;
            player.stats.def += 25; // Massive temporary defense boost
            
            // Visual: Purple/Sparkly border
            const effect = setInterval(() => {
                spawnEffect(player.x, player.y, player.width, player.height, 'rgba(128, 0, 128, 0.3)', 100);
            }, 200);
    
            setTimeout(() => {
                clearInterval(effect);
                player.stats.def = originalDef;
                player.indicate(`${player.name}'s defense returned to normal.`);
            }, 5000);
        }
})