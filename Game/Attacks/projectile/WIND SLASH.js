registerAttack('WIND SLASH', {
  stats: {dmg: 10, type: 'Air', cooldown: {time: 6000, switch: false}}, action : (player, target) => {
        
            const attributes = attackFunctions["WIND SLASH"].stats
            let box = {x: player.x, y: player.y, width: player.width + 20, height: player.height + 30, dmg: attributes.dmg, duration: 3000, type: 'Air', name: 'WIND SLASH', color: 'white'}

            let airSlash = JSON.parse(JSON.stringify(box))
            airSlash.duration = 100

            airSlash.x += Math.ceil(Math.random() * 25) + 1
            
            const facingRight = player.facingRight
            const flipX = !facingRight
            
            spawnImage('windslash', airSlash, {playAudioOnHit: false, audioName: 'whoosh', flipX, priority: true, enableClash: true})
      
            let life = 0
            let airSlashInterval = setInterval(() => {
                airSlash.x += facingRight ? 15 : -15
                // spawnEffect(airSlash.x, airSlash.y, airSlash.width, airSlash.height, airSlash.color, 100)
                spawnImage('windslash', airSlash, {playAudioOnHit: false, audioName: '', flipX, priority: true})
                if (checkCollision(airSlash, target)) {
                    attackResults(player, airSlash, target)
                    rebukeCollision(airSlash, target, 2)
                    clearInterval(airSlashInterval)
                }
                
                life += 100 // Increment by the interval time
                if (life > box.duration) {
                    clearInterval(airSlashInterval)
                }
            }, 100)

    }  
})