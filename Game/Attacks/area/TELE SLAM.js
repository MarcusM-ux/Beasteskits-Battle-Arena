registerAttack('TELE SLAM', {
    stats: { dmg: 15, type: 'Mind', cooldown: { time: 20000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["TELE SLAM"].stats;
            let life = 0;
            let maxLife = 2000;
            let hit = false;
            
            // Initial Box Stats
            let box = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                color: 'rgba(138, 43, 226, 0.5)' // Translucent purple
            };
    
            stun(player, maxLife); // Player is vulnerable while channeling
    
            const growInterval = setInterval(() => {
                life += 100;
                
                // Grow the box visuals
                box.width += 5;
                box.height += 5;
                box.x = player.x - (box.width / 4); // Keep it centered on player
                box.y = player.y - (box.height / 4);
                
                spawnEffect(box.x, box.y, box.width, box.height, box.color, 100);
    
                if (checkCollision(box, target) && !hit) {
                    hit = true;
                    clearInterval(growInterval);
                    stun(target, 2000);
                    
                    let teleLife = 0
                    let teleLifeMax = 1000
                    const interval = setInterval(()=>{
                        if (teleLife < teleLifeMax / 2){
                            target.y -= 10
                        }else {
                            target.y += 10
                        }
                        if (teleLife > teleLifeMax) {
                            attackResults(player, { dmg: stats.dmg, type: stats.type }, target);
                            clearInterval(interval)
                            playRetreivedAudio('body-thud');
                        }
                        teleLife += 100
                    }, 100)
                    
                    // target.y -= 50; // Slam Up
                    // setTimeout(() => {
                    //     target.y += 50; // Slam Down
                    //     attackResults(player, { dmg: stats.dmg, type: stats.type }, target);
                    //     stun(target, 1500);
                    //     playRetreivedAudio('body-thud');
                    // }, 300);
                    
                }
    
                if (life >= maxLife) {
                    clearInterval(growInterval);
                    if (!hit) {
                        // Backfire Damage: Player takes 10% damage for missing
                        player.stats.hp -= 10;
                        player.updateLabel();
                        player.indicate(`${player.name}'s Tele Slam missed! Taking 10 damage!`);
                    }
                }
            }, 100);
        }
})