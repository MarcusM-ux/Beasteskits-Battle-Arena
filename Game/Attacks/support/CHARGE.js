registerAttack('CHARGE', {
    stats: {type: 'Electric', cooldown: {time: 15000, switch: false}}, action: (player, target) => {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: 'yellow',
            duration: 6000
        }
        
        stun(player, 4000)
        
        let life = 0
        let attackMod = 1

        const startHP = player.stats.hp
        const charge = setInterval(()=>{
            // let isPressingUp = (keybinds.movement.w && player.isPlayer1 || 
            // keybinds.movement.arrowup && !player.isPlayer1)
            life += 1000
            playRetreivedAudio('charging')
            // stun(player, 1000)
            spawnEffect(player.x, player.y - player.height / 2, player.width, player.height * 0.25, 'yellow', 500)
            spawnEffect(player.x, player.y - player.height / 4.5, player.width, box.height * 0.65, 'orange', 600)
            spawnEffect(player.x, player.y + player.height / 2, player.width, player.height * 0.80, 'red', 700)
            
            // attackMod += 0.15
            attackMod = 2
            player.stats.atk *= attackMod
            
            player.indicate(`${player.name} increased its attack for its next attacks!`)

            if (player.stats.hp < startHP) {
                player.indicate(`${player.name}'s charge was interrupted!`)
            }
            if (life > 4000) {
                clearInterval(charge)
            }
        }, 1000)

        
        // player.indicate(`${player.name} is charged for its next attacks!`)
        setTimeout(()=>{
            player.indicate(`${player.name}'s charge fizzed out...`)
            player.stats.atk = player.baseStats.atk
        }, 10000)
    }
})