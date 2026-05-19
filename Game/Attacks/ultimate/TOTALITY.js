registerAttack('TOTALITY', {
    stats: {type: 'Beast', cooldown: {time: 30000, switch: false}}, action: (player) => {
        
        if (!player.ultimateActive) {
            player.ultimateActive = true
            stun(player, 100)
            
            FillUltimate(player, 'red', 'white', 'I AM <br> THE <br> BEAST', 'transform', ()=>{
                executeTotal(player)
            })
        }
        
    }
})

function executeTotal(player){
        const originalType = player.type
        const originalImage = player.image.src
        const originalSize = {
            width: player.width,
            height: player.height
        }

        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: 'brown',
            type: 'Beast', 
            duration: 1000
        }

        stun(player, box.duration)
        player.type = 'Beast'

        player.stats.hp = Math.min(player.baseStats.hp, player.stats.hp + 8)
        player.stats.def += 6
        player.stats.atk += 6
        player.stats.spd += 0.25

        if (player.name === 'Stressnock'){
            player.image.src = "./PixelArt/Transformations/Stressnock.png"
        }
        
        playRetreivedAudio('monster-scream')
        player.width *= 2
        player.height *= 2
        spawnEffect(player.x, player.y, player.width, player.height, box.color, box.duration)
        player.indicate(`${player.name} is now a BEAST TYPE with overwhelming power!`)

        const currentHealth = player.stats.hp
        const beastTime = setTimeout(()=>{
            player.stats = JSON.parse(JSON.stringify(player.baseStats))
            
            player.updateLabel()
            
            player.type = originalType
            player.width = originalSize.width
            player.height = originalSize.height
            
            player.maxSpeed = player.baseStats.spd
            player.indicate(`${player.name} is now back to normal...`)
            player.image.src = originalImage
            spawnEffect(player.x, player.y, box.width, box.height, colorFromType(player.type), box.duration)
            clearTimeout(beastTime)
            player.ultimateActive = false

            stun(player, 2000)
        }, 10000)

}