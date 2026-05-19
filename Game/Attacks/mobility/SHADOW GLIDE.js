registerAttack('SHADOW GLIDE', {
    stats : { type: 'Dark', cooldown: {time: 8000, switch: false}}, 
    action: (player, target)=>{
    
        const slideDuration = 5000
        let elaspedTime = 0

        const specialKey = (player.isPlayer1) ? keybinds.attacks.r : keybinds.attacks.m
        const interval = setInterval(()=>{
            elaspedTime += 100
            slidePlayers(8, 100, false, player, player, false)
            // player.vx = 8 * (player.facingRight ? 1 : -1)
            
            spawnEffect(player.x + (player.facingRight ? player.width / 2: -player.width / 2), player.y, player.width, player.height, 'black', 200)

            if (elaspedTime > 5000) clearInterval(interval); 
            if (player.isPlayer1 && keybinds.attacks.r || !player.isPlayer1 && keybinds.attacks.m) clearInterval(interval); player.indicate(`${player.name}'s SHADOW GLIDE has ended!`)
        }, 100)
    
    }
})


