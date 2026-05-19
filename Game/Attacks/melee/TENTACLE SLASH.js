registerAttack('TENTACLE SLASH', {
    stats: {dmg: 10, type: 'Dark', cooldown: {time: 5000, switch: false}}, action: (player, target) => {
        const attributes = attackFunctions["TENTACLE SLASH"].stats
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height / 2,
            color: colorFromType('Dark'),
            dmg: attributes.dmg,
            type: attributes.type, 
            duration: 5000
        }
        stun(player, 1000)
        // box.y -= player.height + 5
        box.x += (player.facingRight) ? player.width + 10 : -player.width - 10
        // spawnEffect(box.x, box.y, box.width, box.height, box.color, 100)

        const animation = spawnAnimation(
            './Effects/tentacle_slash.png',
            box.x,
            box.y,
            player.height, //size width
            player.height, //size height
            128,
            128,
            15,
            90,
            1000,
            !player.facingRight
        );
        
        let life = 0
        let speedIncrement = 1.15
        let hit = false
        const interval = setInterval(()=>{
            life += 100
            // box.y += 20 * speedIncrement
            speedIncrement += 0.15

            playRetreivedAudio('quick-whoosh')
            // spawnEffect(box.x, box.y, box.width, box.height, box.color, 100)
            if (checkCollision(box, target) && !hit){
                playRetreivedAudio('ominous-breathe')
                attackResults(player, box, target)
                stun(target, 800)
                hit = true
            }   

            if (life > 500) {
                clearInterval(interval)
            }
        }, 100)

        
    }
})