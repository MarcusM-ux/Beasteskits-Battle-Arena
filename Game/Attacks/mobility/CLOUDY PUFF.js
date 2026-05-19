registerAttack('CLOUDY PUFF', {
    stats: { type: 'Air', cooldown: { time: 8000, switch: false } },
    action: (player, target) => {
        const originalSpeed = player.baseStats.spd;
        const startHP = player.stats.hp
        
        player.stats.spd += 0.5; // Move super fast
        if (!player.cloud) player.cloud = 0
        if (player.cloud >= 3) return
        
        player.cloud += 1

        // const box = {x:player.x, y:player.y + (player.height / 2), width: player.width, height: player.height, duration: 100}

        const checkMovement = setInterval(() => {
            // If player stops (vx and vy are near 0) or takes damage
            if ((Math.abs(player.vx) < 0.1 && Math.abs(player.vy) < 0.1) || player.stats.hp < startHP) {
                player.stats.spd = originalSpeed;
                
                stun(player, 2000); 
                player.indicate("UNCOVERED!");
                player.cloud -= 1
                clearInterval(checkMovement);
            }

            if (player.cloud >= 3) {
                clearInterval(checkMovement);

                stun(player, 50)
                
                player.cloud = 0
                player.image.src = retreiveEffect('cloud')
                player.indicate(`${player.name} is hiding in a cloud!`)
                player.isDodging = true

                setTimeout(()=>{
                    player.image.src = retreiveImage(player.name)
                    player.isDodging = false
                    player.indicate(`${player.name} came out its cloud!`)
                    player.stats.spd = originalSpeed;
                    player.cloud = 0
                    stun(player, 2000)
                }, 5000)
            }else {
                    spawnImage("cloud", {x:player.x, y:player.y + (player.height / 2), width: player.width, height: player.height, duration: 100}, {
                        playAudioOnHit: false,
                        audioName: '',
                        target: target,
                        flipX : !player.facingRight,
                        flipY: false,
                        priority: true,
                })
            }

            // Spawn dark particles at feet
            // spawnEffect(player.x, player.y, player.width, player.height, '#222', 100);
        }, 100)
    }
});