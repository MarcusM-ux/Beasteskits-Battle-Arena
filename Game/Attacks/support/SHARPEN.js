registerAttack('SHARPEN', {
  stats: { type: 'Metal', cooldown: { time: 8000, switch: false } },
  action: (player, target) => {
    // if (player.sharpened) return; // Prevent stacking

    const ATK_BOOST = 1.35;
    const DURATION = 6000;

    player.atk *= ATK_BOOST;
    player.sharpened = true;

    stun(player, 400);
    // spawnEffect(player.x, player.y, player.width, player.height, 'rgba(180,180,220,0.6)', 600);
    player.indicate(`${player.name} sharpened its blade! ATK up!`);
    playRetreivedAudio('sharpness')

    setTimeout(() => {
      player.atk /= ATK_BOOST;
      player.sharpened = false;
      player.indicate(`${player.name}'s blade dulled.`);
    }, DURATION);

    const animation = spawnAnimation(
        './Effects/sharpen.png',
        player.x,
        player.y,
        74,
        74,
        192,
        192,
        12,
        50,
        600,
        !player.facingRight
    )    

    // let hasHit = false
    // const damageInterval = setInterval(() => {
    //     // 1. Safety check: if animation is gone or finished
    //     if (!animation || (animation.isActive && Date.now() > animation.expiry)) {
    //         clearInterval(damageInterval);
    //         return;
    //     }
    
    //     const now = Date.now();
    //     const timeElapsed = now - animation.startTime;
    //     const currentFrame = Math.floor(timeElapsed / animation.frameDuration);

    //     // 3. The Specific Frame Check
    //     if (currentFrame >= 1 && currentFrame <=  && !hasHit) {
    //          if (checkCollision(snare, target)) {
    //             // Pull mechanic
    //             target.x = player.x + (player.facingRight ? 50 : -50);
    //             // "Stun Damage" - Increased stun duration on hit
    //             stun(target, 2500); 
    //             // playRetreivedAudio('body-thud');
    //             playRetreivedAudio('ominous-breathe')
    //         }
    //     }
    // }, 50)

    
  }
});