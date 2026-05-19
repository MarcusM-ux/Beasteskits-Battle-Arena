registerAttack('PHASE', {
    stats: {type: 'Mind', cooldown: {time: 14000, switch: false}}, action: (player, target) => {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: '#d176db',
            duration: 2000
        }

        // spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)
        
        player.stats.spd *= 1.5
        player.isDodging = true

        playRetreivedAudio('ominous-note')

        for (const key of Object.keys(player.keysToAttack)) {
            const data = player.keysToAttack[key]
            data.stats.cooldown.switch = true

            const desiredElement = document.querySelector(`#${key}-attack`)
            const originalText = desiredElement.textContent

            desiredElement.innerHTML = `${data.name} | Cooldown <br>(${player.keysToAttack[key].stats.cooldown.time * 0.001} seconds)`

            const timeOut = setTimeout(() => {
                player.keysToAttack[key].stats.cooldown.switch = false
                desiredElement.textContent = originalText
                player.indicate('')
                clearTimeout(timeOut)
            }, player.keysToAttack[key].stats.cooldown.time)
        }
        
        // stun(target, box.duration)

        let life = 0
        let startHP = player.stats.hp

        function refreshMoves(){
            for (const key of Object.keys(player.keysToAttack)) {
                const data = player.keysToAttack[key]
                if (attackFunctions[data.name].stats.type !== 'Dark') continue
                data.stats.cooldown.switch = false
            }
            updatePlayerList(player)
        }
        const fadedInterval = setInterval(()=>{
            player.opacity = Math.max(0, player.opacity - 0.5)
            
            if (life > 3500 || player.stats.hp < startHP) {
                stun(player, 1000)
                player.stats.spd = player.baseStats.spd
                player.stats.def = player.baseStats.def
                player.opacity = 1
                // spawnEffect(player.x, player.y, player.width, player.height, box.color, box.duration)
                clearInterval(fadedInterval)
                refreshMoves()
                player.isDodging = false
                playRetreivedAudio('horror-impact')
                
            }
            
            if (checkCollision(player, target)){
                stun(target, 3500)
                player.stats.spd = player.baseStats.spd
                player.stats.def = player.baseStats.def
                player.opacity = 1
                // spawnEffect(player.x, player.y, player.width, player.height, box.color, box.duration)
                clearInterval(fadedInterval)
                refreshMoves()
                player.isDodging = false
                playRetreivedAudio('horror-impact')
            }
            life += 100
        }, 100)
        
    }
})