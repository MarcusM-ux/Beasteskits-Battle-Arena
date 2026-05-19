registerAttack('TRANSPORT', {
    
        stats: { type: 'Metal', cooldown: { time: 5000, switch: false } },
        action: (player, target) => {
            // Check if a marker already exists
            if (!player.transportMarker) {
                // Phase 1: Place Marker
                player.indicate("MARKER SET");
                player.transportMarker = { x: player.x, y: player.y };
                
                // Visual for the marker
                player.markerTimer = setInterval(() => {
                    if (player.transportMarker) {
                        spawnEffect(player.transportMarker.x, player.transportMarker.y, 40, 40, 'purple', 100);
                    }
                }, 200);
            } else {
                if (target.isMarked) {
                    spawnEffect(target.x, target.y, target.width, target.height, 'black', 200); // Poof at current spot
                    target.x = player.transportMarker.x;
                    target.y = player.transportMarker.y;
                    
                    spawnEffect(target.x, target.y, target.width, target.height, 'purple', 200); // Poof at new spot
                    
                    // Cleanup
                    clearInterval(player.markerTimer);
                    player.transportMarker = null;
                    player.indicate("TRANSPORTED");
                    stun(target, 1500); // Short recovery
                    return
                }
                // Phase 2: Teleport to Marker
                spawnEffect(player.x, player.y, player.width, player.height, 'black', 200); // Poof at current spot
                
                player.x = player.transportMarker.x;
                player.y = player.transportMarker.y;
                
                spawnEffect(player.x, player.y, player.width, player.height, 'purple', 200); // Poof at new spot
                
                // Cleanup
                clearInterval(player.markerTimer);
                player.transportMarker = null;
                player.indicate("TRANSPORTED");
                stun(player, 200); // Short recovery
            }
        }
    
})