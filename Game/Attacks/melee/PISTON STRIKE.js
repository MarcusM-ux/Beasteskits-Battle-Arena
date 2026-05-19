registerAttack('PISTON STRIKE', {
  stats: { dmg: 12, type: 'Metal', cooldown: { time: 3000, switch: false } },
  action: (player, target) => {
    // CONFIG (tweak as needed)
    const BASE_REACH = 70;         // max piston extension in px
    const STROKE_STEPS = 8;        // number of discrete steps during extension
    const STICK_WIDTH = 8;         // visual stick width
    const STICK_COLOR = 'silver';
    const STICK_EXPOSE_OFFSET = 8; // how far the stick visually appears in front of player when extended

    // Compute health ratio (1 = full health, 0 = dead)
    const hp = (player.stats && player.baseStats) ? player.stats.hp : (player.stats?.hp || 1);
    const maxHp = (player.baseStats && player.baseStats.hp) ? player.baseStats.hp : (player.stats?.hp || 1);
    const hpRatio = Math.max(0.01, Math.min(1, hp / maxHp)); // clamp to avoid divide by zero

    // Scale parameters by hpRatio (higher HP => faster, more knockback, lower damage)
    // We want: higher HP => lower damage, more knockback, faster
    const speedScale = 1 + (hpRatio - 0.5) * 0.8; // ~0.6x to 1.4x
    const knockbackBase = 12;                    // base knockback magnitude
    const damageBase = 14;                       // base damage used for scaling formula

    const pistonDuration = Math.round(300 / speedScale); // ms per stroke phase base
    const stepInterval = Math.max(24, Math.round(pistonDuration / STROKE_STEPS));
    const totalSteps = STROKE_STEPS;

    // Damage & knockback scaling: lower hp => more damage, less knockback
    const damage = Math.round(damageBase * (1.1 - hpRatio * 0.6)); // at hpRatio=1 -> ~0.44*base? tuned
    const knockback = Math.round(knockbackBase * (0.6 + hpRatio * 1.4)); // hpRatio=1 -> larger

    // piston geometry
    const dir = player.facingRight ? 1 : -1;
    const startX = player.x + player.width / 2;
    const startY = player.y + player.height / 2;
    const maxReach = BASE_REACH;

    // Visual: stick object to show extension; we animate its length
    const stick = {
      x: startX,
      y: player.y + (player.height / 2) - STICK_WIDTH / 2,
      width: STICK_WIDTH,
      height: STICK_WIDTH,
      exposed: 0,       // 0..1 fraction
      visible: true
    };

    // ensure player stunned for the duration of entire piston action (prevents movement)
    const totalDuration = (stepInterval * totalSteps * 2) + 60; // extend + retract
    player.stunTimer = Date.now() + totalDuration;
    if (player.indicate) player.indicate('Stunned: PISTON STRIKE');

    // Play metallic sound at start
    // if (typeof playRetreivedAudio === 'function') playRetreivedAudio('piston_charge');

    // step index: 0..totalSteps for extension, then back down
    let step = 0;
    let extending = true;
    const spawnedHitboxes = []; // keep temporary hitboxes to avoid double-hit in same frame if desired

    // Helper to compute current extension fraction (0..1)
    function extensionFraction(stepIndex) {
      return Math.min(1, Math.max(0, stepIndex / totalSteps));
    }

    const attackName = 'PISTON STRIKE'
    player.indicate(`${player.name} used ${attackName}!`)
      
    const strokeInterval = setInterval(() => {
      // compute current extension
      const frac = extensionFraction(step);
      const reach = frac * maxReach;

      // update stick visual (exposed length)
      stick.exposed = frac;

      // spawn a transient visual for the stick: long rectangle from player front to reach
      const stickX = startX + dir * (reach / 2) - STICK_WIDTH / 2;
      const stickW = Math.abs(reach) + STICK_EXPOSE_OFFSET;
      spawnEffect(
        Math.min(startX, startX + dir * reach) - STICK_WIDTH / 2,
        stick.y,
        stickW,
        STICK_WIDTH,
        STICK_COLOR,
        stepInterval + 40
      );

      // Build a hitbox slightly ahead of the stick tip for this step
    const playerFrontX = startX + (dir * (player.width / 2));
    const tipX = playerFrontX + (dir * reach);  
    const hitW = 28; // size of hitbox (can scale with frac)
    const hitH = player.height * 0.9;
    const hitBox = {
      // 2. Center the hitbox on the current tip of the piston
      x: tipX, 
      y: player.y + (player.height - hitH) / 2,
      width: hitW,
      height: hitH,
      dmg: damage,
      type: 'Metal',
      knockback: { x: dir * knockback, y: -Math.round(knockback * 0.3) }
    };
        // brief visual at tip
      spawnEffect(hitBox.x - hitBox.width / 2, hitBox.y, hitBox.width, hitBox.height, 'lightsteelblue', stepInterval + 40);

      // Check collision and apply effects (only on extending steps to simulate push forward)
      if (extending && target && checkCollision(hitBox, target)) {
        // apply damage once per impact; avoid repeated hits in same strike by tagging target with timestamp
        const lastHitKey = '__lastPistonHit';
        const now = Date.now();
        rebukeCollision(hitBox, target, 2)
        if (!target[lastHitKey] || now - target[lastHitKey] > 250) {
          target[lastHitKey] = now;
          attackResults(player, { dmg: hitBox.dmg, type: hitBox.type }, target);

          // apply knockback if target supports vx/vy
          if (typeof target.vx === 'number') target.vx = (target.vx || 0) + hitBox.knockback.x;
          if (typeof target.vy === 'number') target.vy = (target.vy || 0) + hitBox.knockback.y;

          // impact sound
          // if (typeof playRetreivedAudio === 'function') playRetreivedAudio('piston_hit');
        }
      }

      // advance step
      if (extending) {
        step++;
        if (step > totalSteps) {
          // reached full extension, flip to retract after a short hold
          extending = false;
          // small hold at full extension
          setTimeout(() => {}, 80);
        }
      } else {
        step--;
        if (step <= 0) {
          // finished retract cycle
          clearInterval(strokeInterval);

          // cleanup stun and indicator
          player.stunTimer = null;
          if (player.indicate) player.indicate('');

          // small finish sound
          // if (typeof playRetreivedAudio === 'function') playRetreivedAudio('piston_end');
        }
      }
    }, stepInterval);
  }
});
