registerAttack('HARDEN', {
    stats: {heal: 5, type: 'Plant', cooldown: {time: 8000, switch: false}}, action: (player) => {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            dmg: attackFunctions.BITE.stats.dmg,
            color: 'green',
            type: 'Plant',
            duration: 600
        }

        if (!player.harden) player.harden = 0
        
        stun(player, 600)

        player.harden++
        if (player.harden > 2) {
            player.indicate(`${player.name} cannot get any harder!`)
            handleHealth(player, 5)
            return
        }
       spawnImage('harden', box, {
                playAudioOnHit: false,
                audioName: '',
                target: null,
                flipX : !player.facingRight,
                flipY: false,
                priority: true,
                // tint: '#e85158'
        })
        
        // spawnEffect(box.x, box.y, box.width, box.height, box.color, 600)
        player.stats.def += 10
        handleHealth(player, 5)
        player.updateLabel()
        player.indicate(`${player.name} healed itself! And gained extra defense!`)
    }
})