registerAttack('QUICK PERCEPTION', {
    stats: { type: 'Mind', cooldown: { time: 8000, switch: false } },
    action: (player, target) => {
        // Increases SPD and sets a "Dodge" flag
        const originalSpd = player.baseStats.spd;
        player.stats.spd *= 1.8;
        player.isDodging = true; // You would check this in your dealDamage function

        player.indicate("PERCEPTION SHARPENED");
        // stun(player, 4000)
        
        spawnEffect(player.x, player.y, player.width, player.height, 'pink', 100);

        setTimeout(() => {
            player.stats.spd = originalSpd;
            player.isDodging = false;
        }, 4000); // Short duration
    }
});