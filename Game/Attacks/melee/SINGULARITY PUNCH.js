registerAttack('SINGULARITY PUNCH', { stats: { dmg: 16, type: 'Metal', cooldown: { time: 8000, switch: false } }, action: (player, target) => {
    // Pulls the target slightly inward before delivering a heavy blow
    const dist = target.x - player.x;
    target.x -= dist * 0.2; 

    // 1. Determine direction (1 for right, -1 for left)
    const dir = player.facingRight ? 1 : -1;
    
    // 2. Adjust the box x-position
    // If facing right, x is player.x + some padding
    // If facing left, x is player.x - box.width
    const boxWidth = player.width * 1.5;
    const boxX = player.facingRight ? (player.x + player.width) : (player.x - boxWidth);
    
    let box = { 
        x: boxX, 
        y: player.y + (player.height * 0.15), // Center it vertically a bit
        width: boxWidth, 
        height: player.height * 0.65, 
        dmg: 16, 
        type: 'Metal' 
    };    
    
    stun(player, 800)
    const animation = spawnAnimation(
        './Effects/signularity_punch.png',
        box.x ,
        box.y,
        player.width ,
        player.height ,
        64 ,
        64 ,
        15,
        100,
        800,
        !player.facingRight
    );
    
    const attackName = 'SINGULARITY PUNCH'
    player.indicate(`${player.name} used ${attackName}!`)

    const interval = setInterval(()=>{
        if (!animation.isActive || Date.now() > animation.expiry) {
            clearInterval(interval);
            return;
        }

        if (checkCollision(target, box)) {
            attackResults(player, box, target);
            playRetreivedAudio('punch');
            pauseAnimation(animation, 500)
            clearInterval(interval)
        }

    }, 16)
    
}
})