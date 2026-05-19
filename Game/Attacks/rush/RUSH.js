registerAttack('RUSH', {
stats: { dmg: 1, type: 'Basic', cooldown: { time: 800, switch: false } },
action: (player, target) => {
const rushDist = player.facingRight ? 60 : -60;

    const dir = player.facingRight ? 1 : -1

     const slide = (speed, duration, follow) => {
        const startTime = Date.now();
        
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                clearInterval(interval);
                return;
            }
            target.x += dir * speed;
            if (follow) player.x += dir * speed;

            spawnEffect(target.x, target.y + target.height/2, 40, 5, 'rgba(255,255,255,0.2)', 30);
        }, 16);
        
    };
        
    // Move the player forward instantly
    player.x += rushDist;
    spawnEffect(player.x - rushDist, player.y, player.width, player.height, 'rgba(255,255,255,0.3)', 200);

    // Check if the player "ran into" the target
    const hitBox = { x: player.x, y: player.y, width: player.width, height: player.height, dmg: 1, type: 'Basic' };
    if (checkCollision(hitBox, target)) {
        attackResults(player, hitBox, target)
        slide(5, 500, true)
    }
}

});