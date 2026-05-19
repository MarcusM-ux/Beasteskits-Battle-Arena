registerAttack('VIOLENT RAM', {
  stats: { dmg: 9, type: 'Fighting', cooldown: { time: 9000, switch: false } },
  action: (player, target) => {
    const dir = player.facingRight ? 1 : -1;
    const KNOCKBACK = 100;

    // --- Smooth easing functions ---
    const easeIn  = t => t * t * t;                  // Slow pull-back start
    const easeOut = t => 1 - Math.pow(1 - t, 3);    // Hard deceleration on slam

    const PULLBACK_DIST = 60;   // How far back the player pulls
    const PULLBACK_TIME = 400;  // ms
    const RUSH_DIST     = 180;  // How far forward the slam travels
    const RUSH_TIME     = 300;  // ms — faster than pullback for impact feel

    const startX = player.x;
    stun(player, PULLBACK_TIME + RUSH_TIME + 200);

    // --- Phase 1: smooth pull-back ---
    let pullStart = null;
    let hit = false;

    function pullBack(timestamp) {
      if (!pullStart) pullStart = timestamp;
      const elapsed = timestamp - pullStart;
      const t = Math.min(elapsed / PULLBACK_TIME, 1);

      player.x = startX + (-dir * PULLBACK_DIST * easeIn(t));

      // Wind-up flash, gets brighter as player pulls further back
      spawnEffect(
        player.x, player.y, player.width, player.height,
        `rgba(255, 80, 0, ${0.2 + t * 0.5})`, 80
      );

      if (t < 1) {
        requestAnimationFrame(pullBack);
      } else {
        // Pull-back done — start the slam
        const rushStartX = player.x;
        let rushStart = null;

        requestAnimationFrame(function rush(ts) {
          if (!rushStart) rushStart = ts;
          const re = ts - rushStart;
          const rt = Math.min(re / RUSH_TIME, 1);

          player.x = rushStartX + (dir * RUSH_DIST * easeOut(rt));

          const box = {
            x: player.facingRight
              ? player.x + player.width
              : player.x - player.width * 1.2,
            y: player.y,
            width: player.width * 1.2,
            height: player.height,
            dmg: 9,
            type: 'Fighting'
          };

          spawnEffect(
            player.x, player.y, player.width, player.height,
            `rgba(255, 120, 0, ${0.4 + rt * 0.4})`, 60
          );

          if (!hit && checkCollision(box, target)) {
                hit = true;
                attackResults(player, box, target);
    
                target.x += dir * KNOCKBACK;
                target.x = Math.max(0, Math.min(canvas.width - target.width, target.x));
                stun(target, 800);
                playRetreivedAudio('body-thud')
                target.indicate(`${target.name} was sent flying!`);
                stun(player, 1000)
                stun(target, 500)
            
          }

          if (rt < 1) requestAnimationFrame(rush);
        });
      }
    }

    requestAnimationFrame(pullBack);
  }
});