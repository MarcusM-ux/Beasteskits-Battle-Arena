registerAttack('SNATCH', {
    stats: {type: 'Dark', cooldown: {time: 8000, switch: false}}, action: (player, target)=>{
        
        const attributes = attackFunctions.SNATCH.stats
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: '#302933',
            duration: 100,
            dmg: attributes.dmg
        }
        
        stun(player, 1350)
        
        box.y -= player.height + 10
        box.x += (player.facingRight) ? player.width + 10 : -player.width - 10
        // spawnEffect(box.x, box.y, box.width, box.height, box.color, 101)
        
        let life = 0
        let speedIncrement = 1.15
        let hit = false
        const interval = setInterval(()=>{
            life += 100
            box.y += 12 * speedIncrement
            speedIncrement += 0.15
            
            if (player.name === 'Snawlocker'){
                spawnImage('snawlocker_bag', box, {playAudioOnHit: false, audioName: '', flipX: !player.facingRight, priority: true})
            }else {
                spawnEffect(box.x, box.y, box.width, box.height, box.color, 100)
            }
            
            if (checkCollision(box, target) && !hit){
                clearInterval(interval)
                playRetreivedAudio('quick-whoosh')
                setTimeout(()=>{target.image.src = startImage;}, 3000)
                
                stun(target, 3200)
                hit = true

                const startImage = target.image.src
                target.image.src = retreiveEffect('snawlocker_bag_cased')

                // const bagged = setInterval(()=>{
                //     target.x = player.x
                //     target.y = player.y
                // }, 50)

            }

            if (life > 500) {
                clearInterval(interval)
                stun(player, 3200)
            }
        }, 100)
    }
})