registerAttack('BLANK', {
    stats : {dmg: 0, type: 'Basic', cooldown: {time: 500, switch: false}}, 
    action: (player, target)=>{
        player.indicate(`${player.name} did nothing...`)
    }
})