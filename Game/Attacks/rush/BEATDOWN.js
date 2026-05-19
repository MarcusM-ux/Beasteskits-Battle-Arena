registerAttack('BEATDOWN', {
    stats: {dmg: 13, type: 'Basic', cooldown: {time: 10000, switch: false}}, action: (player, target)=> {
        const attributes = attackFunctions["BEATDOWN"].stats
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            type: attributes.type,
            dmg: attributes.dmg,
            duration: 5000,
            color: 'white'
        }

        stun(player, box.duration)
        // Rush Directionally
        let rushLife = 0
        let incrementOverTime = 1.15
        let bonusDamage = 1
        playRetreivedAudio('running-sounds')

        const rush = setInterval(()=>{
            rushLife += 100
            player.x += (player.facingRight) ? 10 * incrementOverTime : -10 * incrementOverTime 
            
            incrementOverTime += 0.05
            if (checkCollision(player, target)) 
            {
                bonusDamage = incrementOverTime
                clearInterval(rush)

                cancelAudio('running-sounds') 
                stun(target, box.duration)
                stun(player, box.duration)

                target.x -= 30

                playRetreivedAudio('punch')

                let time = 0
                const playtime = setInterval(()=>{

                    time += 100
                    if (time < 1000) {
                        target.y -= 5 * incrementOverTime
                    } else {
                        target.y += 5 * incrementOverTime
                    }

                    spawnEffect(target.x, target.y, target.width, target.height, box.color, 100)
                    
                    if (time > 2000) {
                        let baseDMG = box.dmg
                        if (bonusDamage > 2) bonusDamage = 2
                        box.dmg *= bonusDamage
                        attackResults(player, box, target)
                        playRetreivedAudio('punch')
                        clearInterval(playtime)
                        stun(player, 3000)
                    }
                    
                }, 100)
            }
            
            if (rushLife > 5000 || player.x >= canvas.width - player.width || player.x <= 0 + 10){
                clearInterval(rush)
                stun(player, 3000)
                cancelAudio('running-sounds') 
                incrementOverTime = 1.15
            }
        }, 100)
        // If catch player then slam them up (damage), slam them down (damage + stun)

        // They can escape but rapid pressing their keys with an base 30% chance to escape, +25% if they resist the type / escape by pressing keys that fill up a meter that represents when you can escape
    }
})