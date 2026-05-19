registerAttack('DIG', {
stats: { type: 'Ground', cooldown: { time: 11000, switch: false } },
action: (player, target) => {

let variant 
const isPlayerOne = player.isPlayer1
const keys = isPlayerOne
? { left: 'a', right: 'd', up: 'w', down: 's' }
: { left: 'arrowleft', right: 'arrowright', up: 'arrowup', down: 'arrowdown' };

if (keybinds.movement[keys.left] || keybinds.movement[keys.right]) {
variant = 'burrow'
} else if (keybinds.movement[keys.up] || keybinds.movement[keys.down]) {
variant = 'trap'
} else {
variant = Math.random() < 0.5 ? 'burrow' : 'trap';
}

// ── VARIANT 1: BURROW STRIKE ─────────────────────────────────
if (variant === 'burrow') {
  const BURROW_DURATION = 2500; // How long underground
  const BURROW_SPEED    = 5;    // px per tick
  const ERUPT_DMG       = 10;
  const TRAIL_SLOW      = 0.70;
  const TRAIL_DURATION  = 5000;
  const TRAIL_SIZE      = 30;

  const isPlayerOne = player.isPlayer1
  const keys = isPlayerOne
    ? { left: 'a', right: 'd', up: 'w', down: 's' }
    : { left: 'arrowleft', right: 'arrowright', up: 'arrowup', down: 'arrowdown' };

  stun(player, BURROW_DURATION + 600);
  player.indicate(`${player.name} dives underground!`);

  // Hide player visually by shrinking them to 0 height
  const originalHeight = player.height;
  const originalY      = player.y;
  player.height = 0;

  const trail = []; // Collect positions as player moves
  let burrowLife = 0;

  const burrowInterval = setInterval(() => {

    // Directional movement underground
    if (keybinds.movement[keys.left])  player.x -= BURROW_SPEED;
    if (keybinds.movement[keys.right]) player.x += BURROW_SPEED;
    
    // if (keybinds.movement[keys.up]) player.y -= BURROW_SPEED;
    // if (keybinds.movement[keys.down]) player.y += BURROW_SPEED;
    
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    // Visible dirt trail on the surface
    spawnEffect(
      player.x, originalY + originalHeight - 12,
      player.width, 14,
      'rgba(120, 75, 30, 0.75)', 300
    );
    // Rumble dust particles along the trail
    spawnEffect(
      player.x + Math.random() * player.width - 8,
      originalY + originalHeight - 20,
      12, 12,
      'rgba(160, 110, 50, 0.5)', 200
    );

    // Record trail position every 150ms for hazard spots
    if (burrowLife % 150 === 0) {
      trail.push({ x: player.x, y: originalY + originalHeight - TRAIL_SIZE });
    }

    burrowLife += 16;
    if (burrowLife >= BURROW_DURATION) {
      clearInterval(burrowInterval);

      // --- Erupt ---
      player.height = originalHeight;
      player.y      = originalY;

      spawnEffect(
        player.x - 10, player.y - 10,
        player.width + 20, player.height + 20,
        'rgba(139, 90, 43, 0.9)', 500
      );

      const eruptBox = {
        x: player.x, y: player.y,
        width: player.width, height: player.height,
        dmg: ERUPT_DMG, type: 'Ground'
      };

      if (checkCollision(eruptBox, target)) {
        attackResults(player, eruptBox, target);
        stun(target, 700);
        target.indicate(`${target.name} was erupted on!`);
      } else {
        player.indicate(`${player.name} erupted but missed!`);
      }

      // --- Trail becomes slow hazard spots after eruption ---
      if (trail.length > 0) {
        // player.indicate(`The tunnel lingers...`);
        
        let trailLife = 0;
        const trailInterval = setInterval(() => {
          let targetSlowed = false;

          trail.forEach(pos => {
            spawnEffect(pos.x, pos.y, TRAIL_SIZE, TRAIL_SIZE, 'rgba(100, 60, 20, 0.55)', 250);

            const holeBox = {
              x: pos.x, y: pos.y,
              width: TRAIL_SIZE, height: TRAIL_SIZE,
              dmg: 0, type: 'Ground'
            };

            if (!targetSlowed && checkCollision(holeBox, target)) {
              targetSlowed = true;
              target.stats.spd *= TRAIL_SLOW;
              target.indicate(`${target.name} is caught in the tunnel!`);
              setTimeout(() => {
                target.stats.spd /= TRAIL_SLOW;
                target.indicate(`${target.name} pulled free.`);
              }, 1200);
            }
          });

          trailLife += 100;
          if (trailLife >= TRAIL_DURATION) clearInterval(trailInterval);
        }, 100);
      }
    }
  }, 16);

// ── VARIANT 2: TRAP DIG ───────────────────────────────────────
} else {
  const SPOT_COUNT    = Math.floor(Math.random() * 4) + 2; // 2-5 traps
  const SPOT_DURATION = 8000;
  const SPOT_SIZE     = 38;
  const TRAP_SLOW     = 0.65;
  const TRAP_TICK_DMG = 1;
  const TRAP_TICK_RATE = 400; // ms between damage ticks while stuck

  stun(player, 500);
  player.indicate(`${player.name} plants hidden traps!`);

  // One random spot is a power vein (buff for the player)
  const buffIndex = Math.floor(Math.random() * SPOT_COUNT);

  const spots = Array.from({ length: SPOT_COUNT }, (_, i) => ({
    x: Math.random() * (canvas.width - SPOT_SIZE * 2) + SPOT_SIZE,
    y: Math.random() * (canvas.height - SPOT_SIZE - 40) + 20,
    width:  SPOT_SIZE,
    height: SPOT_SIZE,
    kind: i === buffIndex ? 'buff' : 'trap',
    triggered: false,
    stuckTimer: 0
  }));

  let spotLife  = 0;
  let lastTick  = 0;
  let buffTaken = false;

  const spotInterval = setInterval(() => {
    const now = Date.now();

    spots.forEach(spot => {
      if (spot.triggered && spot.kind !== 'trap') return;

      // All spots look the same — faint brown shimmer
      spawnEffect(
        spot.x, spot.y,
        spot.width, spot.height,
        'rgba(110, 65, 20, 0.45)', 250
      );

      // --- Player walks over buff vein ---
      if (!buffTaken && spot.kind === 'buff' && checkCollision(spot, player)) {
        buffTaken     = true;
        spot.triggered = true;
        player.stats.atk  *= 1.25;
        player.stats.def  *= 1.15;
        player.indicate(`${player.name} found a power vein! (+ATK +DEF)`);
        spawnEffect(spot.x - 6, spot.y - 6, spot.width + 12, spot.height + 12, 'rgba(255, 200, 50, 0.8)', 500);
        setTimeout(() => {
          player.stats.atk /= 1.25;
          player.stats.def /= 1.15;
          player.indicate(`The power vein wore off.`);
        }, 5000);
      }

      // --- Target steps in a trap ---
      if (spot.kind === 'trap' && !spot.triggered && checkCollision(spot, target)) {
        spot.triggered = true;
        target.stats.spd  *= TRAP_SLOW;
        target.indicate(`${target.name} is stuck in a trap!`);
        spawnEffect(spot.x - 4, spot.y - 4, spot.width + 8, spot.height + 8, 'rgba(80, 40, 10, 0.7)', 400);

        // Tick damage while stuck in the hole
        let tickCount  = 0;
        const MAX_TICKS = 5;
        const tickInterval = setInterval(() => {
          const tickBox = {
            x: spot.x, y: spot.y,
            width: spot.width, height: spot.height,
            dmg: TRAP_TICK_DMG, type: 'Ground'
          };
          attackResults(player, tickBox, target);
          target.indicate(`Stuck!`);
          tickCount++;
          if (tickCount >= MAX_TICKS) {
            clearInterval(tickInterval);
            target.stats.spd /= TRAP_SLOW;
            target.indicate(`${target.name} climbed out.`);
          }
        }, TRAP_TICK_RATE);
      }
    });

    spotLife += 100;
    if (spotLife >= SPOT_DURATION) {
      clearInterval(spotInterval);
      player.indicate(`The traps collapsed.`);
    }
  }, 100);
}

}
});