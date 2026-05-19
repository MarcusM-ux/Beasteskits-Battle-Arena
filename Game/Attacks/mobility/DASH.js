registerAttack('DASH', {
    stats: { type: 'Basic', cooldown: { time: 5000, switch: false }}, action: (player) => {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: 'white',
            duration: 1000,
        }

        let flipY = false
        player.isDodging = true
        if ((keybinds.movement.w && player.isPlayer1) || (keybinds.movement.arrowup && !player.isPlayer1)) {
            player.y -= 64
            box.y -= 64
            box.height += player.height
            flipY = true
        } else if ((keybinds.movement.s && player.isPlayer1) || (keybinds.movement.arrowdown && !player.isPlayer1)) {
            player.y += 64
            box.height += player.height
        } else {
            if (Math.random() > 0.5) {
                player.y -= 64
                box.y -= 64
                box.height += player.height
                flipY = true
            } else {
                player.y += 64
                box.height += player.height
            }
        }
        // spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
        spawnImage('dash', box, {
            playAudioOnHit: false,
            audioName: 'whoosh',
            target: null,
            flipX: !player.facingRight,
            flipY: flipY,
            priority: false
        })

        // stun(player, box.duration / 2)
        player.indicate(`${player.name} dashed!`)
        setTimeout(()=>{player.isDodging = false }, 500)
    }
})