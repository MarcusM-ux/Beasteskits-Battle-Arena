registerAttack('BLOAT',{
    stats: { heal: 10, type: 'Basic', cooldown: { time: 8000, switch: false }}, action: (player) => {
            let box = {
                x: player.x, 
                y: player.y, 
                width: player.width, 
                height: player.height, 
                color: 'lime', 
                duration: 2000 
            }
            spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
            stun(player, box.duration)

            const healAmount = attackFunctions.BLOAT.stats.heal
            player.stats.hp += healAmount
            const maxHp = creatures[player.name].stats.hp
            player.stats.hp = Math.min(player.stats.hp, maxHp)

            player.updateLabel()
            player.indicate(`${player.name} healed itself!`)
        }
})