registerAttack('ABYSSAL BELLOW', {
    stats: { dmg: 8, type: 'Basic', cooldown: { time: 7000, switch: false } },
    action: (player, target) => {
        // Calculate direction for the visual wave and initial push
        const pushDir = (target.x > player.x) ? 200 : -200; 
        // const b = { x: player.x + (pushDir / 2), y: player.y, width: 200, height: 100 };
        
        const stunDuration = 1500; // Increased duration to make the "growth" impactful
        const originalSize = { w: player.width, h: player.height };

        // 1. Grow the target and apply stun
        player.width *= 2.5;
        player.height *= 2.5;
        stun(player, stunDuration);

        const attackName = 'ABYSSAL BELLOW'
        player.indicate(`${player.name} used ${attackName} and became big!`)
        
        const b = {type: player.type, dmg: 8}
        if (checkCollision(player, target)) {
            rebukeCollision(player, target, 3)
            attackResults(player, b,target)
        }
        // 2. Set a temporary "rebound" property
        // This flag allows the target to damage others they bump into while stunned
        player.isExpanding = true;

        const i = setInterval(()=>{
            noCollision(target, player)
        }, 100)
        
        // 3. Logic to revert size after stun
        setTimeout(() => {
            player.width = originalSize.w;
            player.height = originalSize.h;
            player.isExpanding = false;
            stun(player, 1000)
            clearInterval(i)
        }, stunDuration);


        // Initial knockback push
        // target.x += pushDir;
    }
});