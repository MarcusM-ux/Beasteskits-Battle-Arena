registerAttack('FLIGHT', {
    stats: { type: 'Air', cooldown: { time: 25000, switch: false } },
    action: (player, target) => {
        player.indicate("FLYING!");

        const duration = 5000; // 5 seconds of flight
        let life = 0
        const startHp = player.stats.hp
        const keys = keybinds.movement
        const flightLoop = setInterval(() => {
            life += 16
            // Allow vertical movement during flight
            if (keys['w'] || keys['arrowup']) player.y -= 5;
            if (keys['s'] || keys['arrowdown']) player.y += 5;
            
            // Visual wing flap effect
            if (life % 200 < 20) {
                spawnEffect(player.x, player.y - player.height, player.width, player.height, 'rgba(255,255,255,0.3)', 50);
            }

            if (life > duration || player.stats.hp < playerHp || player.vx < 0 && player.vy < 0){
                player.indicate("FLYING STOPPED!");
                clearInterval(flightLoop)
            }
        }, 16);
    }
});