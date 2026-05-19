registerAttack('FLASH STEP', {
    stats : { type: 'Basic', cooldown: {time: 9000, switch: false}}, 
    action: (player, target)=>{
    
        let push = 30
        let hit = false
        const dir = player.facingRight ? 1 : -1

        stun(player, 600)
        
        function doStep(step){
            if (step > 3 || hit) return

            // spawnEffect(player.x, player.y, player.width, player.height, 'white', 80)
            spawnImage("horizonal_dash", {x:player.x, y:player.y, width:player.width, height:player.height, color:'white', duration: 120}, {
                playAudioOnHit: false, audioName: '', target: target,
                flipX: !player.facingRight, flipY: false, priority: true,
            })
            
            player.x += dir * push
            playRetreivedAudio('lighting-whip')
            push *= 2

            if (checkCollision(player, target)){
                stun(target, 2000)
                hit = true
                player.indicate(`FLASH HIT`)
                playRetreivedAudio('static')
                return
            }

            setTimeout(()=> doStep(step + 1), 120)
        }      

        doStep(1)
        
    }
})
