registerAttack('PERMAFROST', {
    stats: { dmg: 1, type: 'Frost', cooldown: { time: 9000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["PERMAFROST"].stats;
            let duration = 2000;
            
            // Visual: A light blue icy shield
            player.indicate(`${player.name} has made a ICE SHEILD to protect them!`);
            let hit = 0
            let slowed = false
            const iceShield = setInterval(() => {
                let box = {
                    x: player.x - 5,
                    y: player.y - 5,
                    width: player.width + 10,
                    height: player.height + 10,
                    duration: 50
                }
                spawnImage('permafrost', box, {
                        playAudioOnHit: false,
                        audioName: 'ice',
                        target: target,
                        flipX : !player.facingRight,
                        flipY: false,
                        priority: true
                })
                if (checkCollision(player, target)) {
                    playRetreivedAudio('ice')
                    hit++
                    // If target touches the shield, they get slowed and take chip damage
                    stun(target, 500); 
                    target.x -= (player.facingRight) ? -2 : 2; // Slight knockback
                    
                    if (hit < 5) {
                        target.stats.hp -= 1; 
                        target.updateLabel();
                    }else {
                        clearInterval(iceShield)
                    }
                }
            }, 50);

            setTimeout(() => clearInterval(iceShield), duration);
        }
})