registerAttack('MIND WARP', {
            stats: { type: 'Mind', cooldown: { time: 7000, switch: false } },
    action: (player, target) => {
        // 1. Brief startup stun so the player can't move while "channeling"
        stun(player, 400); 
        spawnEffect(player.x, player.y, player.width, player.height, 'rgba(150, 0, 255, 0.5)', 300);
        player.indicate("CONCENTRATING...");
        
        setTimeout(() => {
            // 2. Only teleport if the player hasn't been interrupted (optional logic)
            player.x = target.x + (player.facingRight ? -60 : 60);
            player.y = Math.random() 
            spawnEffect(target.x, target.y, target.width, target.height, 'purple', 500);
            
            stun(target, 1300); 
            player.indicate("WARPED!");
        }, 400);
    }
})