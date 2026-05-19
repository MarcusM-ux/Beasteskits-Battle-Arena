registerAttack('TERROR', {
    stats: { type: 'Dark', cooldown: { time: 12000, switch: false } },
    action: (player, target) => {
        const zone = {
            x: player.x - 100,
            y: player.y - 100,
            width: 250,
            height: 250
        };
        stun(player, 1000)
        playRetreivedAudio('monster-scream'); // Hypothetical audio

        let duration = 0;
        const interval = setInterval(() => {
            duration += 100;
            
            // Visual for the box
            spawnEffect(zone.x, zone.y, zone.width, zone.height, 'rgba(138, 43, 226, 0.2)', 100);

            if (checkCollision(zone, target)) {
                stun(target, 1000);
                target.indicate("TERRIFIED");
            }

            if (duration >= 2000) clearInterval(interval);
        }, 100);
    }
});