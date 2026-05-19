registerAttack('SCREAM', {
    stats: {type: 'Basic', cooldown: {time: 9000, switch: false}}, action: (player, target)=>{
        if (!player.screams) player.screams = 0 
        if (player.screams >= 2) {
            player.indicate(`${player.name}'s throat is sore! They can no longer scream!`)
            return
        }
        player.screams += 1
        player.indicate(`${player.name}'s SCREAMED!`)
        target.indicate(`${target.name}'s attack has decreased!`)
        playRetreivedAudio('monster-scream')

        target.stats.atk = Math.min(20, target.stats.atk - 10)
        stun(player, 500)
        stun(target, 500)
        
        setTimeout(()=>{
            target.indicate(`${target.name} has calmed down.`)
            target.stats.atk = target.baseStats.atk
        }, 5000)
    }
})
