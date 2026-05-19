registerAttack('RADAR', {
    stats : { type: 'Dark', cooldown: {time: 10000, switch: false}}, 
    action: (player, target)=>{
        player.stats.atk = player.baseStats.atk
        const preImages = {
            p: player.image.src,
            t: target.image.src
        }

        stun(player, 5000)
        stun(target, 5000)

        player.image.src = ''
        target.image.src = ''
        
        spawnEffect(0, 0, canvas.width, canvas.height, 'black', 5000)

        player.indicate(`${player.name} is locating the target...`)
        
        const random = Math.random()
        const audio = setInterval(()=>{
            playRetreivedAudio('radarping')
        }, 2000)

        setTimeout(()=>{
            clearInterval(audio)
            if (random > 0.5) {
                stun(player, 0)
                stun(target, 0)
                
                player.indicate(`${player.name} found the target! ${player.name} deals more damage!`)
                player.x = target.x + (target.facingRight ? -25 : 25)
                player.y = target.y

                slidePlayers(8, 400, true, player, target)

                player.stats.atk *= 1.5
            }else {
                stun(player, 0)
                stun(target, 0)
    
                player.indicate(`${player.name} did not find the target!`)
            }

            player.image.src = preImages.p
            target.image.src = preImages.t
            
        }, 5000)

        
    }
})

