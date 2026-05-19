registerAttack('CONCENTRATED BURST', {
    stats : {dmg: 8, type: 'Fire', cooldown : {time: 8000, switch: false}}, 
    action: (player, target) => {
        const attributes = attackFunctions['CONCENTRATED BURST'].stats

        const baseBox = {
            x: player.x,
            y: player.y,
            width: 64 / 5,
            height: 64 / 5,
            dmg: 8,
            duration: 100,
            type: 'Fire',
            color: 'red'
        }

        const key = Object.keys(player.keysToAttack).find(k => player.keysToAttack[k].name === "CONCENTRATED BURST")
        let push = 10
        const dir = player.facingRight ? 1 : -1

        // baseBox.x += (player.facingRight) ? 25 : -25
        // baseBox.y = player.y + 20
        
        let isCharging = false;
        let hasHit = false;
        let CPU_CHARGE = 0
        const maxCharge = Math.random() * 15 + 1
        playRetreivedAudio("sizzle")
        
        const i = setInterval(()=>{
            const flipX = !player.facingRight

            // baseBox.x = (player.facingRight) ? baseBox.x + 25 : baseBox.x - 25
            baseBox.x = player.x
            baseBox.y = player.y + 20
        
            // stun(player, 100)
            // Only stun once when charging starts
            if (keybinds.attacks[key] && baseBox.width < Math.min(player.width, 200) || player.isCPU && CPU_CHARGE < maxCharge) {
                if (!isCharging) {
                    stun(player, 100)
                    isCharging = true;
                }
                player.indicate('CHARGING BURST!')
                spawnImage('fireball', baseBox, {playAudioOnHit: false, audioName: '', flipX, priority: true})
                baseBox.width *= 1.15
                baseBox.height *= 1.15
                push += 4
                baseBox.dmg += 0.5
                CPU_CHARGE += 1
            } else {
                cancelAudio("sizzle")
                player.indicate('SHOOTING BURST!')
                clearInterval(i)
                
                let life = 0
                const burst = setInterval(()=>{
                    life += 100
                    baseBox.x += dir * push
                    push -= 5
                    spawnImage('fireball', baseBox, {playAudioOnHit: true, audioName: 'fireball', flipX, priority: true})
                    
                    // Only hit once
                    if (!hasHit && checkCollision(baseBox, target)) {
                        playRetreivedAudio("fireball")
                        attackResults(player, baseBox, target)
                        hasHit = true;
                        slidePlayers(8, 400, false, player, target)

                    }
                    
                    if (life > 5000 || push < 5) {
                        clearInterval(burst)
                    }
                }, 100)
                
            }
        }, 100)
    }
})
