registerAttack('BITE', {
    stats :{dmg: 5, type: 'Basic', cooldown : {time: 2000, switch: false}}, action: (player, target) => {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            dmg: attackFunctions.BITE.stats.dmg,
            color: 'gray',
            type: 'Basic',
            duration: 1000
        }
        box.type = player.type
        box.color = colorFromType(player.type)
        player.indicate(`${player.name}'s BITE became a ${box.type} Type!`)

        const isFacingRight = player.facingRight

        if (isFacingRight){
            player.x += 15
            box.x = player.x + player.width
        }else {
            player.x -= 15
            box.x = player.x - player.width
        }
        stun(player, 1500)

        // spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
        spawnImage('fangs', box, {
            playAudioOnHit: true,
            audioName: 'bite',
            target: target,
            flipX : !player.facingRight,
            flipY: false,
            priority: true
        })

        if (checkCollision(box, target)){
            stun(target, 1900)
            attackResults(player, box, target)
        }
        
    }
})