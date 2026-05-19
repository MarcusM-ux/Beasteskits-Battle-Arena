registerAttack('SHELL BUNKER', {
    
        stats: { type: 'Plant', cooldown: { time: 10000, switch: false } },
        action: (player, target) => {
            player.indicate(`${player.name} is hiding in its shell.`);
            let originalDef = player.stats.def;
            player.isDodging = true
            // player.stats.def += 40; // Massive defense spike
            
            // Visual: Shrink height to look like he's in a shell
            let originalHeight = player.height;
            let originalWidth = player.width;
            
            player.height /= 2;
            player.width /= 2;
            player.y += originalHeight / 2;
    
            setTimeout(() => {
                player.stats.def = originalDef;
                player.y -= originalHeight / 2;
                player.height = originalHeight;
                player.width = originalWidth
                player.isDodging = false
                player.indicate("");
            }, 3000);
        }
    
})