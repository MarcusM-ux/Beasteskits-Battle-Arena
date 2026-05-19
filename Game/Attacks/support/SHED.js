registerAttack('SHED', {
    stats: {heal: 6, type: 'Bug', cooldown: {time: 12000, switch: false}}, action: (player)=>{
        const attributes = attackFunctions.SHED.stats
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: '#586363',
            duration: 6000
        }

        if (!player.sheds) player.sheds = 0
        stun(player, 1200)
        
        spawnEffect(player.x, player.y - player.height / 2, player.width, player.height * 0.25, '#173a5a', 1300)
        spawnEffect(player.x, player.y - player.height / 4.5, player.width, box.height * 0.65, '#173a5a', 1500)
        spawnEffect(player.x, player.y + player.height / 2, player.width, player.height * 0.80, '#59656f', 2300)
        
        let life = 0
        const interval = setInterval(()=>{
            playRetreivedAudio('power-off')
            life += 2600
            stun(player, 500)
            spawnEffect(player.x, player.y - player.height / 2, player.width, player.height * 0.25, '#173a5a', 1300)
            spawnEffect(player.x, player.y - player.height / 4.5, player.width, box.height * 0.65, '#173a5a', 1500)
            spawnEffect(player.x, player.y + player.height / 2, player.width, player.height * 0.80, '#59656f', 2300)
            
            player.indicate(`${player.name} boosted health, speed, and attack, significantly lowering defense!`)
            
            player.stats.hp = Math.min(player.baseStats.hp, player.stats.hp + (attributes.heal / player.sheds))
            if (life > box.duration) {
                player.stats.spd = Math.min(player.baseStats.spd + 1.5, player.stats.spd + 0.5)
                player.stats.maxSpeed = player.stats.spd
                player.stats.originalVelocity = player.stats.spd
                player.sheds += 1

                if (player.sheds > 2) {
                    player.indicate(`${player.name} is running of out skin to SHED!`)
                    player.stats.hp -= 5 * player.sheds
                }
                
                player.stats.def = Math.max(0, player.stats.def - 12)
                player.updateLabel()
                clearInterval(interval)
            }
        }, 2600)
    }
})