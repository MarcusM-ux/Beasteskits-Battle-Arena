// deal small damage
// locked players take move damage 
registerAttack('KEY STAB', {
    stats :{dmg: 5, type: 'Basic', cooldown : {time: 5000, switch: false}}, action: (player, target) => {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: 'gray',
            type: 'Basic',
            duration: 1000,
            dmg: 5
        }

        const isFacingRight = player.facingRight

        if (isFacingRight){
            player.x += 15
            box.x = player.x + player.width
        }else {
            player.x -= 15
            box.x = player.x - player.width
        }
        stun(player, 1500)

        spawnImage('Keys/balance_key', box, {
            playAudioOnHit: true,
            audioName: 'metal-slam',
            target: target,
            flipX : player.facingRight,
            flipY: false,
            priority: true
        })
        
        if (checkCollision(box, target)){
            stun(target, 1000)
            stun(player, 1000)
            if (target.lockedDown) {
                box.dmg *= 2.5
                stun(target, 800)
            }
            if (isFacingRight) target.x += 15
            else target.x -= 15
            
            attackResults(player, box, target)
        }
        
    }
})