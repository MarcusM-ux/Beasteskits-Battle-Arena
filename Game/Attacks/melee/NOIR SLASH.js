registerAttack('NOIR SLASH', {
  stats: { dmg: 8, type: 'Dark', cooldown: { time: 6000, switch: false } },
  action: (player, target) => {
    const dir = player.facingRight ? 1 : -1;
    const box = {
      x: player.facingRight ? player.x + player.width : player.x - player.width,
      y: player.y,
      width: player.width,
      height: player.height,
      dmg: 8,
      type: 'Dark',
      duration: 500
    };

    const animation = spawnAnimation(
        './Effects/noir_slash.png',
        box.x,
        box.y,
        box.width,
        box.height,
        256,
        256,
        9,
        50,
        450,
        !player.facingRight
    )    

    stun(player, 500);
    
    let hasHit = false
    const damageInterval = setInterval(() => {
        // 1. Safety check: if animation is gone or finished
        if (!animation || (animation.isActive && Date.now() > animation.expiry)) {
            clearInterval(damageInterval);
            return;
        }
    
        const now = Date.now();
        const timeElapsed = now - animation.startTime;
        const currentFrame = Math.floor(timeElapsed / animation.frameDuration);

        // spawnEffect(box.x, box.y, box.height, box.width, 'black', 50)
        
        // 3. The Specific Frame Check
        if (currentFrame >= 1 && currentFrame <= 9 && !hasHit) {
            if (checkCollision(box, target)){
                hasHit = true; 
                playRetreivedAudio('quick-whoosh');
                // playRetreivedAudio('body-thud');
                
                stun(target, 600)
                attackResults(player, box, target); 
                target.indicate(`${target.name} was slashed!`);
            }
        }
    }, 50)

  }
});