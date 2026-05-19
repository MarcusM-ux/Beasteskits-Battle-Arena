registerAttack('FADE AWAY', {
    stats: {type: 'Dark', cooldown: {time: 14000, switch: false}}, action: (player, target) => {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: '#13273a',
            duration: 2000
        }


        // if (!player.clone) {
        //     player.clone = new Player(creatures[player.name], player.value, player.name)
        //     player.clone.life = 0
            
        //     clone.x = player.x + (player.facingRight ? 15 : -15)
        //     clone.y = player.y 
        // }
        spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
        
            
        player.stats.spd *= 0.85
        // player.stats.def = 10
        player.isDoding = true
        stun(target, box.duration)
        player.opacity = 0.25

        let life = 0
        let startHP = player.stats.hp
        
        const fadedInterval = setInterval(()=>{
            if (life > 2000 || player.stats.hp < startHP) {
                player.stats.spd = player.stats.spd
                // player.stats.def = player.baseStats.def
                player.isDoding = false
                player.opacity = 1
                spawnEffect(player.x, player.y, box.width, box.height, box.color, box.duration)
                clearInterval(fadedInterval)
            }
            if (checkCollision(box, target)){
                stun(target, box.duration * 2)
            }
            life += 100
        }, 100)
        
    }
})