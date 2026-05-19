registerAttack('VICIOUS RAM', {
    stats: {dmg: 10, type: 'Fighting', cooldown: {time: 10000, switch: false}}, action: (player, target)=> {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: 'red',
            duration: 2000,
            dmg: 10,
            type: "Fighting"
        }

        let rushLife = 0
        let incrementOverTime = 1.15
        let bonusDamage = 1
        playRetreivedAudio('running-sounds')

        const rush = setInterval(()=>{
            rushLife += 100
            player.x += (player.facingRight) ? 10 * incrementOverTime : -10 * incrementOverTime
            spawnEffect(player.x, player.y, player.width, player.height, 'orange', 50)
            
            incrementOverTime += 0.15
            if (checkCollision(player, target)) 
            {
                bonusDamage = incrementOverTime
                incrementOverTime = 1.15
                clearInterval(rush)

                cancelAudio('running-sounds') 
                stun(target, box.duration)
                stun(player, box.duration)

                // target.x -= (player.facingRight) ? 40 : -40
                rebukeCollision(player, target, 3)
                
                playRetreivedAudio('punch')
                let baseDMG = box.dmg
                if (bonusDamage > 2) bonusDamage = 2
                box.dmg *= bonusDamage
                
                attackResults(player, box, target)
                playRetreivedAudio('punch')
            }
            
            if (rushLife > 5000 || player.x >= canvas.width - player.width || player.x <= 0 + 10){
                clearInterval(rush)
                stun(player, 3000)
                cancelAudio('running-sounds') 
            }
        }, 100)
    }
})