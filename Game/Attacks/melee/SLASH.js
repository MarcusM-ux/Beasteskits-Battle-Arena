registerAttack('SLASH', {
  stats: { dmg: 4, type: 'Basic', cooldown: { time: 1500, switch: false } },
  action: (player, target) => {
    const dir = player.facingRight ? 1 : -1;
    const box = {
      x: player.facingRight ? player.x + player.width : player.x - player.width,
      y: player.y,
      width: player.width * 0.9,
      height: player.height,
      dmg: 4,
      type: 'Metal',
      duration: 500
    };

    const animation = spawnAnimation(
        './Effects/slash.png',
        box.x,
        box.y,
        box.width,
        box.height,
        168,
        168,
        8,
        50,
        400,
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
        
        // 3. The Specific Frame Check
        if (currentFrame >= 2 && currentFrame <= 7 && !hasHit) {
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