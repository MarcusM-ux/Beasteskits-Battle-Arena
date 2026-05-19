registerAttack('TAUNT', {
    stats: {type: 'Basic', cooldown: {time: 5000, switch: false}}, action: (player, target)=>{
        player.stats.atk += 5
        player.indicate(`${player.name} increased it's attack!`)

        target.indicate(`${target.name} is furious! Its speed increased temporarily!`)
        target.stats.spd *= 1.6
        target.stats.atk *= 1.6

        const angerInterval = setInterval(()=>{
            let box ={
                x: target.x,
                y: target.y,
                width: player.width,
                height: player.height,
                duration: 100
            }
            spawnImage('Status/anger', box, {
                    playAudioOnHit: false,
                    audioName: '',
                    target: target,
                    flipX : !player.facingRight,
                    flipY: false,
                    priority: true,
                    // tint: '#e85158'
            })
        }, 100)
        
        setTimeout(()=>{
            target.stats.spd = target.baseStats.spd
            target.stats.atk = target.baseStats.atk
            
            target.indicate(`${target.name} calmed down...`)
            clearInterval(angerInterval)
        }, 4000)
        
    }
})