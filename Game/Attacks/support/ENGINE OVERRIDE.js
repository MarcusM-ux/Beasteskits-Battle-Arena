registerAttack('ENGINE OVERRIDE', {
    stats: { type: 'Metal', cooldown: { time: 15000, switch: false } },
    action: (player, target) => {
        // 1. Store original stats to restore them later
        const originalSpd = player.baseStats.spd;
        const originalAtk = player.baseStats.atk;
        const originalDef = player.baseStats.def;

        // 2. Apply Massive Buffs
        player.stats.spd *= 2.5; 
        player.stats.atk += 30;
        player.stats.def += 40;
        player.indicate("OVERRIDE ACTIVE!");

        const i = setInterval(()=>{
            spawnEffect(player.x, player.y, player.width, player.height, 'red', 50)
        }, 100)
        
        
        // 3. The "Crash" Logic (Occurs after 4 seconds of power)
        setTimeout(() => {
            // Restore stats
            player.stats.spd = originalSpd;
            player.stats.atk = originalAtk;
            player.stats.def = originalDef;

            // Apply Penalties
            stun(player, 3000); // 3-second stun
            player.indicate("SYSTEM OVERHEAT!");

            clearInterval(i)

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

        }, 4000); 
    }
});