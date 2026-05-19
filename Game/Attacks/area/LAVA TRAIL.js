registerAttack('LAVA TRAIL', {
    stats: {type: 'Fire', dmg: 5, cooldown: {time: 15000, switch: false}}, action: (player, target) => {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: 'red',
            duration: 2000,
            dmg: 5,
            type: "Fire"
        }

        // spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
        // player.maxSpeed *= 1.5
        // player.stats.def = 10
        // stun(target, box.duration)
        // player.opacity = 0.25

        let life = 0
        let hit = 0
        const fadedInterval = setInterval(()=>{
            let fireBox = {
                x: player.x,
                y: player.y,
                width: player.width,
                height: player.height,
                color: 'red',
                duration: 2000,
                dmg: 5,
                type: "Fire"
            }
            
            if (life > 3000) {
                clearInterval(fadedInterval)
                stun(player, fireBox.duration)
            }
            spawnEffect(fireBox.x, fireBox.y, fireBox.width, fireBox.height, fireBox.color, fireBox.duration)

            let boxLife = 0
            const lifeInt = setInterval(()=>{
                if (boxLife > fireBox.duration) clearInterval(lifeInt)
                boxLife += 100
                if (checkCollision(fireBox, target) && hit < 4){
                    hit++
                    stun(target, fireBox.duration)
                    attackResults(player, fireBox, target)
                    rebukeCollision(target, fireBox, 2)
                }
            }, 100)
            life += 100
        }, 100)
        
    }
})