registerAttack('WIND PULSE RAY', {
    stats: { dmg: 40, type: 'Air', cooldown: { time: 30000, switch: false } },
    action: (player, target) => {
        const stats = attackFunctions["WIND PULSE RAY"].stats;

        if (!player.ultimateActive) {
            player.ultimateActive = true
            stun(player, 100)
            FillUltimate(player, 'white', 'cyan', 'FEEL <br> THE <br> MIGHTY WIND', 'beam', ()=>{
                executeWindPulseRay(player, target, stats)
            })
            
        }
    }
})

// Separate function for the actual attack
function executeWindPulseRay(player, target, stats) {
    stun(player, 1000)

    setTimeout(() => {
        let waveSize = 40
        let distance = 0
        let hit = false
        const direction = player.facingRight ? 15 : -15

        const rayInterval = setInterval(() => {
            distance += Math.abs(direction)
            waveSize += 5

            let wave = {
                x: player.x + (player.facingRight ? distance : -distance),
                y: player.y - (waveSize / 4),
                width: 20,
                height: waveSize
            }

            spawnEffect(wave.x, wave.y, wave.width, wave.height, 'rgba(200, 255, 255, 0.8)', 100)

            if (checkCollision(wave, target) && !hit) {
                playRetreivedAudio('whoosh')
                playRetreivedAudio('quick-whoosh')
                
                hit = true
                attackResults(player, stats, target)
                rebukeCollision(player, target, 3.0)
                stun(player, 5000)
            }

            if (distance > 600) {
                clearInterval(rayInterval)
                player.ultimateActive = false
            }
        }, 30)

        player.stats.def -= 10
        setTimeout(() => player.stats.def += 10, 5000)
    }, 1000)
}
