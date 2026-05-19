registerAttack('FLASH BANG', {
    stats: {dmg: 2, type: 'Light', cooldown: {time: 7000, switch: false}}, action: (player, target) => {
        let factor = 1.1
        let box = {
            x: player.x,
            y: player.y * 1.1,
            width: 5,
            height: 5,
            dmg: attackFunctions['FLASH BANG'].stats.dmg,
            color: '#a8ad55',
            type: 'Light',
            duration: 3500
        }
        
        stun(player, 1000)
        // spawnEffect(box.x, box.y, box.width, box.height, box.color, 101)
        const fr = player.facingRight
        if (fr) {
            box.x += player.width
        } else {
            box.x -= player.width
        }
        let rate = 10
        let life = 0

        const moving = (keybinds.movement.d && player.isPlayer1 || 
           keybinds.movement.arrowright && !player.isPlayer1 ||
           keybinds.movement.a && player.isPlayer1 || 
           keybinds.movement.arrowleft && !player.isPlayer1) ? true : false
        
        // const moving = (player.vx > 0 || player.vy > 0)
        if (!moving) {
            rate *= 1.5
        } 
        
        const interval = setInterval(()=>{
            life += 100
            if (fr) {
                box.x += rate
            } else {
                box.x -= rate
            }

            if (!moving) {
                box.width *= factor
                box.height *= factor
                spawnEffect(box.x, box.y, box.width, box.height, box.color, 100)

                if (checkCollision(box, target)){
                    attackResults(player, box, target)
                    stun(target, box.duration)
                }
                
                if (box.width >= 40|| life >= box.duration) {
                    spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
                    clearInterval(interval)
                }
                else {
                    factor += 0.02
                } 
            } else {
                box.width = player.width * 1.2
                box.height = player.height * 1.2
                
                spawnEffect(player.x, player.y, player.width, player.height, box.color, box.duration / 2)
                if (checkCollision(box, target)){
                    stun(target, 4000)
                    rebukeCollision(box, target, 3.5)
                    attackResults(player, box, target)
                    target.indicate(`${target.name} was flashed banged!`)
                }
                clearInterval(interval)
            }

        }, 100)
        
    }
})