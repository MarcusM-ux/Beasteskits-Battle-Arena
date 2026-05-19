registerAttack('BLOCK', {
stats: { dmg: 0, type: 'Basic', cooldown: { time: 2000, switch: false } },
action: (player, target) => {
        player.isDodging = true;
        
    const blockTimer = setInterval(() => {
        spawnEffect(player.x, player.y, player.width, player.height, 'blue', 50)
        // Check distance between centers
        const dist = Math.abs(player.x - target.x);

        if (dist < 40) { // 15px radius + sprite widths
            const pushDir = player.x < target.x ? -5 : 5;
            player.x += pushDir; // Slowly pushed away
            spawnEffect(player.x, player.y, 5, 20, 'gray', 50);
            if (player.ultimateActive && target.ultimateActive) {
                player.damageTaken -= 0.5 
            }
        }
    }, 50);

    setTimeout(() => {
        clearInterval(blockTimer);
        player.isDodging = false;
    }, 1500); // Blocks for 1.5 seconds
}

});