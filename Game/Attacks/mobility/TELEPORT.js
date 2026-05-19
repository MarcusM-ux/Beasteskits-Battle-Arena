registerAttack('TELEPORT', {
    stats: { type: 'Mind', cooldown: { time: 8000, switch: false } },
        action: (player, target) => {
            // Visual effect at current position
            spawnEffect(player.x, player.y, player.width, player.height, 'purple', 300);
            // playRetreivedAudio('teleport-sound'); // Optional audio trigger
    
            // The actual teleport
            player.x = target.x;
            player.y = target.y;
    
            // Visual effect at new position
            spawnEffect(player.x, player.y, player.width, player.height, 'cyan', 300);
            stun(player, 100); // Tiny self-stun to prevent instant frame-1 attacks
        }
    
})