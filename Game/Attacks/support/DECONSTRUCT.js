registerAttack('DECONSTRUCT', {
    stats: {type: 'Metal', cooldown: {time: 15000, switch: false}}, action: (player)=> {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: '#586363',
            duration: 6000
        }

        playRetreivedAudio('drill')
        stun(player, 1200)
        let life = 0
        const interval = setInterval(()=>{
            life += 2600
            stun(player, 500)
            spawnEffect(player.x, player.y - player.height / 2, player.width, player.height * 0.25, '#4c8f8f', 1300)
            spawnEffect(player.x, player.y - player.height / 4.5, player.width, box.height * 0.65, '#517373', 1500)
            spawnEffect(player.x, player.y + player.height / 2, player.width, player.height * 0.80, '#586363', 2300)

            player.stats.spd += 0.15
            player.stats.atk += 3
            
            player.stats.def = Math.max(0, player.stats.def - 5)
            player.stats.hp = Math.min(player.baseStats.hp, player.stats.hp - 3)
            
            player.updateLabel()
            player.indicate(`${player.name} speed and attack but significantly lowering defense and health!`)
            
            if (life > box.duration) {
                clearInterval(interval)
                cancelAudio('drill')
            }
        }, 2600)

        if (player.name == 'Hankclaw'){
            player.indicate(`${player.name} is prepared!`)
            updateKeys(player, 'DECONSTRUCT', 'VILE THRUST')
            
            for (let key of Object.keys(player.keysToAttack)){
                // const attack = player.keysToAttack[key]
                // attack.stats.cooldown.switch = true

                if (player.keysToAttack[key].name == 'VILE THRUST'){
                    player.keysToAttack[key].stats.cooldown.time = 8000
                }
                
                // Each attack re-enables after its own cooldown duration
                // setTimeout(() => {
                //     attack.stats.cooldown.switch = false
                //     updatePlayerList(player)
                // }, attack.stats.cooldown.time)
            }
            player.deconstructed = true
        }
        
    }
})