registerAttack('CLAW SWIPE TITAN', {
    stats: { dmg: 35, type: 'Fighting', cooldown: { time: 30000, switch: false } },
    action: (player, target) => {
        const dir = player.facingRight ? 1 : -1;
        
        const hitBox1 = {
            x: player.x + (dir * 40),
            y: player.y,
            width: 70,
            height: player.height,
        };

        if (player.name === 'Auntos'){
            for (let key of Object.keys(player.keysToAttack)){
                // const attack = player.keysToAttack[key]
                // attack.stats.cooldown.switch = true
    
                if (player.keysToAttack[key].name == 'CLAW SWIPE TITAN'){
                    player.keysToAttack[key].stats.cooldown.time = 12000
                }
                
                // Each attack re-enables after its own cooldown duration
                // setTimeout(() => {
                //     attack.stats.cooldown.switch = false
                //     updatePlayerList(player)
                // }, attack.stats.cooldown.time)
            }

        }
        
        if (player.name == 'Hankclaw' && !player.deconstructed){
            player.indicate(`${player.name} tried to use CLAW SWIPE TITAN but has not DECONSTRUCTED yet!`)
            return
        }else if (player.name !== 'Hankclaw'){
            player.indicate(`${player.name} used CLAW SWIPE TITAN...`);
        }
        
        if (checkCollision(hitBox1, target)) {
            // Lock for shorter duration since the move is now faster
            stun(player, 2000);
            stun(target, 2000);

            const slide = (speed, duration, follow) => {
                const startTime = Date.now();
                const interval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    if (elapsed >= duration) {
                        clearInterval(interval);
                        return;
                    }
                    target.x += dir * speed;
                    if (follow) player.x += dir * speed;

                    spawnEffect(target.x, target.y + target.height/2, 40, 5, 'rgba(255,255,255,0.2)', 30);
                }, 16);
            };

            // --- COMBO SEQUENCE ---
            player.indicate(`${player.name} used CLAW SWIPE TITAN and is attacking!`);
        
            // 1. CLAW SWIPE (Short snappy drag)
            target.indicate("CLAW SWIPE!");

            if (player.name !== 'Hankclaw' || player.name == 'Hankclaw' && player.deconstructed) attackResults(player, { dmg: 4, type: 'Fighting' }, target);
            // Reduced speed from 8 to 4, duration from 400 to 200
            slide(4, 200, true); 

            // 2. DOUBLE SLASH (Minimal movement follow up)
            setTimeout(() => {
                target.indicate("CROSS SLASH!");
                if (player.name !== 'Hankclaw' || player.name == 'Hankclaw' && player.deconstructed) attackResults(player, { dmg: 4, type: 'Fighting' }, target);
                spawnEffect(target.x - 10, target.y - 10, target.width + 20, target.height + 20, 'red', 100);
                // Reduced speed to 3
                slide(3, 200, true);  
            }, 350); // Tightened timing

            // 3. TITAN PUNCH (The Finisher - enough to create space but not off-map)
            setTimeout(() => {
                target.indicate("TITAN PUNCH!");
                if (player.name !== 'Hankclaw' || player.name == 'Hankclaw' && player.deconstructed) attackResults(player, { dmg: 8, type: 'Fighting' }, target);
                
                // Final slide: speed dropped from 18 to 10, duration from 600 to 300
                slide(10, 300, false); 
                
                spawnEffect(target.x - (dir * 30), target.y, 80, 80, 'orange', 400);

                if (player.name == 'Hankclaw' && !player.transformed) {
                    playRetreivedAudio('awake')
                    player.name = 'Hankclaw'
                    player.image.src = "./PixelArt/Transformations/Clawbuster.png";
                    // stats: { hp: 60, atk: 70, def: 44, spd: 2.8 },
                    // moveset: ['CLAW STRIKE', 'SNAP', 'DASH', 'COUNTER'],

                    player.stats.hp = 60
                    player.stats.atk = 82
                    player.stats.def = 52
                    player.stats.spd = 1.4

                    updateKeys(player, 'SNAP', 'RUSH DRILL')

                    player.type = 'Metal'
                    player.indicate(`${player.name} has activated his CLAW BUSTER FORM and now is a METAL TYPE!`)
                    player.transformed = true

                    for (let key of Object.keys(player.keysToAttack)){
                        const attack = player.keysToAttack[key]
                        attack.stats.cooldown.switch = true

                        // if (player.keysToAttack[key].name == 'VILE THRUST'){
                        //     player.keysToAttack[key].stats.cooldown.time = 6000
                        // }
                        
                        // Each attack re-enables after its own cooldown duration
                        setTimeout(() => {
                            attack.stats.cooldown.switch = false
                            updatePlayerList(player)
                        }, attack.stats.cooldown.time)
                    }
                    
                    updatePlayerList(player)
                }
            }, 750); // Tightened timing

        } else {
            // MISS: Small forward lurch, not teleport
            player.indicate(`${player.name} used CLAW SWIPE TITAN and missed!`);
            player.x += dir * 40; 
            stun(player, 1500);
        }
    }
});