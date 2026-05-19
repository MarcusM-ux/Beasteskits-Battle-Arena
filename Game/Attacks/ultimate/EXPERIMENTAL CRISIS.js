registerAttack('EXPERIMENTAL CRISIS', {
    stats: { type: 'Plant', cooldown: { time: 30000, switch: false } },
    action: (player, target) => {
        player.indicate("MAXIMUM OUTPUT!");
        const originalSize = { w: player.width, h: player.height };
        
        player.width *= 1.5;
        player.height *= 1.5;
        // player.stats.atk += 25;
        player.stats.spd += 0.5;

        let stability = 0;
        const experiment = setInterval(() => {
            stability += 500;
            
            // Self damage from instability
            player.stats.hp -= 1;
            player.updateLabel();
            spawnEffect(player.x, player.y, player.width, player.height, 'green', 100);

            if (checkCollision(player,target)){
                target.stats.hp -= 2
                rebukeCollision(player, target, 1.5)
                target.indicate(`${target.name} is getting radiation poisoning!`)
                target.updateLabel()
            }
            
            if (stability >= 6000 || player.stats.hp <= 5 || isGameOver) {
                player.width = originalSize.w;
                player.height = originalSize.h;
                player.stats.atk -= 25;
                player.stats.spd -= 0.5;
                player.indicate("CRASHED...");
                stun(player, 2000); // Exhaustion
                clearInterval(experiment);
            }
        }, 500);
    }
});