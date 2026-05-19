registerAttack('TATICAL HEADBUTT', {
    stats: {dmg: 10, type: 'Basic', cooldown: {time: 10000, switch: false}}, action: (player, target)=> {
        // spawnEffect(0, 0, canvas.width, canvas.height, 'black', 5000)
    
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
        playRetreivedAudio('running-sounds')

        const rush = setInterval(()=>{
            rushLife += 100
            player.x += (player.facingRight) ? 10 * incrementOverTime : -10 * incrementOverTime
            spawnEffect(player.x, player.y, player.width, player.height, 'gray', 50)
            
            incrementOverTime += 0.15
            if (checkCollision(player, target)) 
            {
                clearInterval(rush)

                cancelAudio('running-sounds') 
                stun(target, box.duration)
                stun(player, box.duration)

                rebukeCollision(player, target, 3)
                
                playRetreivedAudio('punch')
                box.dmg += player.stats.spd
                
                attackResults(player, box, target)
                playRetreivedAudio('punch')
                stun(player, 500 + (player.stats.spd * 1000))
            }
            
            if (rushLife > 3000 || player.x >= canvas.width - player.width || player.x <= 0 + 10){
                clearInterval(rush)
                stun(player, 3000)
                cancelAudio('running-sounds') 
            }
        }, 100)
    }
})