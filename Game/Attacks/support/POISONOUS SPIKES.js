registerAttack('POISONOUS SPIKES', {
    stats : {dmg: 4, type: 'Toxic', cooldown: {time: 10000, switch: false}}, 
    action: (player, target)=>{
        const startY = player.y
        const box = {
            x: player.x,
            y: player.y,
            width: 84,
            height: 84,
            duration: 500,
            life: 0,
            maxLife: 30000,
        }

        stun(player, 2000)
        player.indicate(`${player.name} is setting up its POISONOUS SPIKES!`)
        let hits = 0
        setTimeout(()=>{
            const dir = !player.facingRight
            const i = setInterval(()=>{
                spawnImage("posion_barbs", box, {
                    playAudioOnHit: false,
                    audioName: '',
                    target: target,
                    flipX : dir,
                    flipY: false,
                    priority: true
                })
                box.life += 500
                box.height -= 1.4
                box.y += 1.4
                
                if (checkCollision(box, target) && hits < 4) {
                    attackResults(player, {dmg: 4, type: 'Toxic'}, target)
                    hits++
                }
                if (hits > 4) clearInterval(i)
                if (box.life > box.maxLife) clearInterval(i)
            }, 500)
            
        }, 2000)

    }
})