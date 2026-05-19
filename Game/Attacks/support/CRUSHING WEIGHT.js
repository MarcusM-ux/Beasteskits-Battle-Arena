registerAttack('CRUSHING WEIGHT', {
  stats: { dmg: 12, type: 'Metal', cooldown: { time: 9000, switch: false } },

  action: (player, target) => {
    // ---------- TUNABLE CONFIG ----------
    const BASE_DAMAGE = 12;          // base damage at start of fall
    const DAMAGE_PER_PIXEL = 0.025;  // extra damage per pixel fallen
    const MAX_DAMAGE = 60;           // hard cap so it can't one-shot
    const BASE_SPEED = 6;            // initial descent speed (px per frame)
    const GRAVITY = 0.25;            // acceleration per frame
    const FRAME_MS = 16;             // ~60 FPS tick
    const HITBOX_WIDTH = player.width;
    const HITBOX_HEIGHT = player.height;
    const OUT_OF_BOUNDS_PAD = 50;    // allow a small pad outside canvas
    const HIT_COOLDOWN_MS = 500;     // minimum ms between hits on same target
    const MAX_RUNTIME_MS = 8000;     // safety abort

    // ---------- PREP / SAFETY ----------
    if (player._isCrushingWeight) return; // already active

    const worldBottom = (typeof canvas !== 'undefined') ? canvas.height : (player.y + 600);
    const startY = player.y;
    let speed = BASE_SPEED;
    let distanceTraveled = 0;

    // stun/lock player during descent
    player._isCrushingWeight = true;
    player.stunTimer = Date.now() + MAX_RUNTIME_MS;
    const attackName = 'CRUSHING WEIGHT'
    player.indicate(`${player.name} used ${attackName}!`)

    // visual persistent object (if activeEffects exists)
    let visualObj = null;
    if (typeof activeEffects !== 'undefined') {
      visualObj = { x: player.x, y: player.y, width: player.width, height: player.height, color: 'darkgray', expiry: Date.now() + 1000 };
      activeEffects.push(visualObj);
    }

    // play start sound
    // playRetreivedAudio('crush_start');

    // ---------- MAIN DESCENT LOOP ----------
    const startTime = Date.now();
    const handle = setInterval(() => {
      const now = Date.now();

      // safety: abort if runtime exceeded
      if (now - startTime > MAX_RUNTIME_MS) {
        cleanup();
        return;
      }

      // accelerate and move down
      speed += GRAVITY;
      player.y += speed;
      distanceTraveled = Math.max(0, player.y - startY);

      // update or spawn visual
      if (visualObj) {
        visualObj.x = player.x;
        visualObj.y = player.y;
        visualObj.width = player.width;
        visualObj.height = player.height;
        visualObj.expiry = Date.now() + 200;
      } else {
        spawnEffect(player.x, player.y, player.width, player.height, 'darkgray', FRAME_MS * 2);
      }

      // compute scaled damage (clamped)
      const scaledDamage = Math.min(MAX_DAMAGE, Math.round(BASE_DAMAGE + distanceTraveled * DAMAGE_PER_PIXEL));

      // check collision and apply hit (rate-limited per target)
      if (target && checkCollision({ x: player.x, y: player.y, width: HITBOX_WIDTH, height: HITBOX_HEIGHT }, target)) {
        const lastHitKey = '__lastCrushHit';
        if (!target[lastHitKey] || now - target[lastHitKey] > HIT_COOLDOWN_MS) {
          target[lastHitKey] = now;

          // Apply damage
          attackResults(player, { dmg: scaledDamage, type: 'Metal' }, target);
          playRetreivedAudio('metal-slam')

          // Small knockback upward to simulate impact; scale with speed
          if (typeof target.vy === 'number') target.vy = (target.vy || 0) - Math.min(10, Math.round(speed * 0.6));

          // impact sound
          // playRetreivedAudio('crush_hit');
        }
      }

      // if below world bottom (landed)
      if (player.y + player.height >= worldBottom - OUT_OF_BOUNDS_PAD) {
        // final impact: extra burst damage if colliding exactly at landing
        if (target && checkCollision({ x: player.x, y: player.y, width: HITBOX_WIDTH, height: HITBOX_HEIGHT }, target)) {
          const finalDamage = Math.min(MAX_DAMAGE, Math.round(BASE_DAMAGE + distanceTraveled * DAMAGE_PER_PIXEL * 1.2));
          attackResults(player, { dmg: finalDamage, type: 'Metal' }, target);
        }
        stun(player, 3000)

        // land sequence & cleanup
        // playRetreivedAudio('crush_land');
        cleanup();
      }
    }, FRAME_MS);

    // ---------- cleanup helper ----------
    function cleanup() {
      try {
        clearInterval(handle);
      } catch (e) {}
      player._isCrushingWeight = false;
      player.stunTimer = null;
      if (player.indicate) player.indicate('');
      if (visualObj) visualObj.expiry = Date.now() + 120;
    }

    // safety finalizer
    setTimeout(() => {
      if (player._isCrushingWeight) cleanup();
    }, MAX_RUNTIME_MS + 200);
  }
});
