registerAttack('LIFE GRASP', {
    stats : {dmg: 6, type: 'Dark', cooldown: {time: 12000, switch: false}}, 
    action: (player, target)=>{
    
        const stats = attackFunctions['LIFE GRASP'].stats
        const dir = player.facingRight ? 1 : -1
        const attackBox = createBox(player.x, player.y, player.width, player.height, '#bdafb5', stats, 100)
        const push = 25 * (!player.incRange ? 1 : player.incRange)

        if (player.lifeDrainSession){
            player.indicate(`${player.name} has LIFE GRASP active already!`)
            return
        }
        player.lifeDrainSession = true
        
        const cooldown = setInterval(()=>{
            const key = Object.keys(player.keysToAttack).find(k => player.keysToAttack[k].name === 'LIFE GRASP')
            player.keysToAttack[key].stats.cooldown.switch = true
            updatePlayerList(player)
        }, 10000)
        
        function returnToPlayer(){
            let pullLife = 0
            const reverseDir = player.facingRight ? -1 : 1
            
            const back = setInterval(()=>{
                pullLife += 100
                spawnImage('abysmouth_hand', attackBox, {
                    playAudioOnHit: false,
                    audioName: '',
                    target: target,
                    flipX : !player.facingRight,
                    flipY: false,
                    priority: true
                })
                // insertEffect(attackBox)
                
                let dx = player.x - attackBox.x;
                let dy = player.y - attackBox.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                let speed = 12; // Adjust speed as needed

                 if (pullLife > 10000) {
                    stun(player, 100)
                    clearInterval(cooldown)
                    clearInterval(back)
                    player.lifeDrainSession = false
                }
    
                if (distance > 5) {
                    attackBox.x += (dx / distance) * speed;
                    attackBox.y += (dy / distance) * speed;
                }else {
                    stun(player, 2000)
                    clearInterval(back)
                    clearInterval(cooldown)
                    player.lifeDrainSession = false
                }

            }, 100)
        }   

        const grab = setInterval(()=>{
            // insertEffect(attackBox)
            spawnImage('abysmouth_hand', attackBox, {
                    playAudioOnHit: false,
                    audioName: '',
                    target: target,
                    flipX : !player.facingRight,
                    flipY: false,
                    priority: true
            })

            attackBox.x += dir * push 
            attackBox.life += 100
            stun(player, 100)

            if (checkCollision(attackBox, target)) {
                // drain target health for 5 seconds
                // stop draining if player takes damage

                clearInterval(grab)
                // attackBox.duration = 1000
                
                let drainLife = 0
                let drained = 0

                const visuals = setInterval(()=>{
                    attackBox.x = target.x
                    attackBox.y = target.y
                    insertEffect(attackBox)
                }, 100)

                playRetreivedAudio('horror-impact')

                const minPlayerHealth = player.stats.hp
                const drain = setInterval(()=>{
                    drainLife += 1000
                    
                    const baseHealth = target.stats.hp
                    attackResults(player, stats, target)
                    const healthDrained = baseHealth - target.stats.hp

                    drained += healthDrained
                    
                    // player.stats.hp = Math.min(player.baseStats.hp, player.stats.hp + healthDrained + (drainLife / 1000))
                    player.updateLabel()
                    playRetreivedAudio('drain')

                    if (player.stats.hp < minPlayerHealth || drainLife >= 4000) {
                        clearInterval(drain)
                        clearInterval(visuals)
                        returnToPlayer()
                        playRetreivedAudio('horror-impact')

                        player.stats.hp = Math.min(player.baseStats.hp, player.stats.hp + drained + (drainLife / 1000))

                        player.updateLabel()
                    } 
                }, 1000) 
                
            }

            if (attackBox.life > 500){
                // return to player
                clearInterval(grab)
                returnToPlayer()
            }
        }, 100)
        
    }
})
