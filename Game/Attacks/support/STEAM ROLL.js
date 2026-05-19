registerAttack('STEAM ROLL', {
    stats: {dmg: 4, type: 'Fire', cooldown: {time: 10000, switch: false}}, action: (player, target)=>{
        const baseSpeed = player.stats.spd
        player.stats.spd *= 2
        
        player.indicate(`${player.name} had a drastic spike in speed!`)
        let rolls = 0
        const check = setInterval(()=>{
        
            if (checkCollision(player, target)){
                rolls++
                
                if (rolls < 3){
                    slidePlayers(8, 200, false, player, target)
                    target.stats.hp -= 1
                    target.updateLabel()
                    playRetreivedAudio('metal-slam')
                }else {
                    clearInterval(check)
            
                    slidePlayers(8, 200, true, player, target)
                    attackResults(player, {dmg: 4, type: 'Fire'}, target)
                    
                    player.indicate(`${player.name} has returned to normal!`)
                    player.stats.spd = baseSpeed
                    stun(player, 2000)
                }
            }
            
        }, 50)
        
        setTimeout(()=>{
            if (rolls < 3) return
            clearInterval(check)
            player.indicate(`${player.name} has returned to normal!`)
            player.stats.spd = baseSpeed
            stun(player, 2000)
            clearInterval(check)
        }, 5000)
        
    }
})