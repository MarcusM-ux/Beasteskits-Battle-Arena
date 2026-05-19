registerAttack('CLAP', {
  stats: { type: 'Basic', cooldown: { time: 2000, switch: false } },
  action: (player, target) => {
        stun(player, 500)
        stun(target, 1000)
        
        const movement = keybinds.movement
        const keys = player.isPlayer1
            ? { up: movement.w, down: movement.s, left: movement.a, right: movement.d }
            : { up: movement.arrowup, down: movement.arrowdown, left: movement.arrowleft, right: movement.arrowright }

        spawnImage('Zooms/blue', {
            x: player.x, y: player.y,
            width: player.width, height: player.height, duration: 1000
        }, {
            playAudioOnHit: false, audioName: 'clap', target: target,
            flipX: !player.facingRight, flipY: false, priority: true,
        })
        spawnImage('Zooms/blue', {
            x: target.x, y: target.y,
            width: target.width, height: target.height, duration: 1000
        }, {
            playAudioOnHit: false, audioName: 'clap', target: player,
            flipX: !player.facingRight, flipY: false, priority: true,
        })

        const plrPositions = { x: player.x, y: player.y }
        const trgPositions = { x: target.x, y: target.y }
        target.x = plrPositions.x
        target.y = plrPositions.y
        player.x = trgPositions.x
        player.y = trgPositions.y

        if (keys.right) {
            // FORWARD — cancel stun early, dash into target
            setTimeout(() => {
                stun(player, 0)
                player.x += player.facingRight ? 60 : -60
            }, 200)

        } else if (keys.left) {
            // BACK — knock target away from their new position
            target.x += player.facingRight ? -80 : 80
            target.y -= 30

        } else if (keys.up) {
            // UP — launch target into the air for a juggle
            target.y -= 150

        } else if (keys.down) {
            // DOWN — pin target to the ground with a longer stun
            target.y = canvas.height - target.height
            stun(target, 1500)

        }
        // else: neutral, plain swap, no extra effect
  }
});
