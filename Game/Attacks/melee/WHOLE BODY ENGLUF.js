registerAttack('WHOLE BODY ENGLUF', {
    stats: {dmg: 12, type: 'Beast', cooldown: {time: 12000, switch: false}},
    action: (player, target) => {
        const MIN_DISTANCE = 50
        stun(player, 500)

        const tImage = target.image.src
        target.image.src = ''
        
        if (target.x - player.x < MIN_DISTANCE && 
            target.y - player.y < MIN_DISTANCE
        ) {
            player.indicate(`${player.name} is absorbing ${target.name}`)
            stun(player, 6000)
            stun(target, 6000)
            
            let life = 0
            const chew = setInterval(()=>{
                stun(target, 500)
                target.stats.hp -= 1
                player.stats.hp += 1
                
                target.updateLabel()
                player.updateLabel()
                
                life += 500
                
                if (life > 3000){
                
                clearInterval(chew)
                const dir = (player.facingRight) ? 5 : -5 
                let inc = 15
                life = 0
    
                const i = setInterval(()=>{
                    target.x += dir * inc
                    inc -= 2
                    life += 100
                    stun(target, 100)
                    
                    if (life > 4000 ||
                        target.x >= canvas.width - target.width ||
                        target.x <= target.width || inc < 5
                    ) {
                        clearInterval(i)
                        target.image.src = tImage
                        attackResults(player, {dmg: 3, type: player.type}, target)
                        target.updateLabel()
                        stun(player, 500)
                        
                    }
                }, 100)
            
                }
            }, 500)

    

            
        }else {
            player.indicate(`${player.name} missed!`)
            attackResults(player, {dmg: 8, type: "Beast"}, player)
            player.updateLabel()
        }
    }
})  
