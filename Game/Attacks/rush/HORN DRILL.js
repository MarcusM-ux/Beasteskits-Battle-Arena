registerAttack('HORN DRILL', {
    
        stats: { dmg: 18, type: 'Beast', cooldown: { time: 8000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["HORN DRILL"].stats;
            let hits = 0;
            
            // Small forward lunge
            // player.x += (player.facingRight) ? 30 : -30;
            
            const horn = {
                x: player.x + (player.facingRight ? 40 : -40),
                y: player.y,
                width: player.width + 10,
                height: 30,
                duration: 100,
                color: 'gray'
            }
            
            let stamina = 30
            const interval = setInterval(() => {
                player.x += (player.facingRight) ? 15 : -15;
                spawnEffect(player.x, player.y, horn.width, horn.height, 'gray', 100);
                stamina -= 1
                playRetreivedAudio('whoosh')
                
                if (checkCollision(player, target)) {
                    // Multi-hit logic: deals a fraction of damage 3 times
                    target.stats.hp -= (stats.dmg / 3);
                    target.updateLabel();
                    hits++;
                    stamina -= 5
                    
                    // playRetreivedAudio('impact');
                }
    
                if (hits >= 3 || stamina <= 0){
                    stun(player, 1200)
                    clearInterval(interval);
                }
            }, 150);
        }
})