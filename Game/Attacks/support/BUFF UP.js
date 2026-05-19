registerAttack('BUFF UP', {
    
        stats: { type: 'Air', cooldown: { time: 20000, switch: false } },
        action: (player, target) => {
            player.indicate("MAX POWER!");
            
            // Save original stats
            const originalWidth = player.width;
            const originalHeight = player.height;
            const originalAtk = player.stats.atk;

            // Apply Buffs
            player.width *= 1.3;
            player.height *= 1.3;
            player.stats.atk += 15;
            
            // Visual: Glow effect while buffed
            const buffEffect = setInterval(() => {
                spawnEffect(player.x, player.y, player.width, player.height, 'rgba(255, 255, 255, 0.2)', 100);
            }, 200);

            // Revert after 7 seconds
            setTimeout(() => {
                clearInterval(buffEffect);
                player.width = originalWidth;
                player.height = originalHeight;
                player.stats.atk = originalAtk;
                player.indicate("COOLING DOWN");
                stun(player, 2000);     // 5-second self-stun
            }, 7000);
        }
   
})