registerAttack('ADRENALINE', {
    stats: {type: 'Basic', cooldown: {time: 10000, switch: false}}, action: (player, target)=>{
        const baseSpeed = player.stats.spd
        player.stats.spd *= 2
        player.indicate(`${player.name} had a ADRENALINE spike!`)
        setTimeout(()=>{
            player.indicate(`${player.name} had a ADRENALINE crash!.`)
            player.stats.spd = baseSpeed
            stun(player, 2000)
        }, 5000)
    }
})