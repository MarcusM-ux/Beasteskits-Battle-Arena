registerAttack('PECK', {
    stats : {dmg: 3, type: 'Air', cooldown: {time: 2000, switch: false}}, action: (player, target)=> {
        let box = {
            x: player.x,
            y: player.y ,
            width: player.width,
            height: player.height,
            dmg: attackFunctions.PECK.stats.dmg,
            color: 'white',
            type: 'Air',
            duration: 500
        }

        let isFacingRight = player.facingRight
        if (isFacingRight){
            player.x += 10
            box.x = player.x + player.width
        }else {
            player.x -= 10
            box.x = player.x - player.width
        }
        spawnImage('peck', box, {
                playAudioOnHit: true,
                audioName: 'peck',
                target: target,
                flipX : !player.facingRight,
                flipY: false,
                priority: true
        })
        stun(player, 500)

        if (checkCollision(box, target)){
            stun(target, 500)
            attackResults(player, box, target)
        }

    }
})