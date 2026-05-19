registerAttack('SHINE', {
stats: { dmg: 6, type: 'Light', cooldown: { time: 10000, switch: false } },
action: (player, target) => {
const DURATION       = 5000;
const BEAM_LENGTH_MAX = 130; // Full range
const BEAM_LENGTH_MIN = 40;  // Shortest it can shrink to
const SHRINK_RATE    = 18;   // px lost per hit tick
const RECOVER_RATE   = 0.8;  // px recovered per frame when not hitting
const BEAM_W         = 24;
const ROT_ACCEL      = 2;
const ROT_FRICTION   = 0.88;
const MAX_ROT_SPEED  = 0.07;

// Flashlight cone — two extra rays flanking the main beam
const CONE_SPREAD    = 0.18; // Radians between main beam and side rays
const CONE_FALLOFF   = 0.6;  // Side rays are this fraction of main beam length

const isPlayerOne = player.isPlayer1
const keys = isPlayerOne
  ? { left: 'a', right: 'd' }
  : { left: 'arrowleft', right: 'arrowright' };

let angle     = player.facingRight ? 0 : Math.PI;
let rotSpeed  = 0;
let beamLength = BEAM_LENGTH_MAX; // Live length — shrinks and recovers
let beamLife  = 0;
let hit       = false;

// stun(player, DURATION);
player.indicate(`${player.name} extends the light!`);

const beamInterval = setInterval(() => {

  // --- Rotation ---
  if (keybinds.movement[keys.left])  rotSpeed -= ROT_ACCEL;
  if (keybinds.movement[keys.right]) rotSpeed += ROT_ACCEL;
  rotSpeed *= ROT_FRICTION;
  rotSpeed  = Math.max(-MAX_ROT_SPEED, Math.min(MAX_ROT_SPEED, rotSpeed));
  angle    += rotSpeed;

  const originX = player.x + player.width  / 2;
  const originY = player.y + player.height / 2;

  // --- Check if tip is currently touching target (continuous contact) ---
  const mainCos = Math.cos(angle);
  const mainSin = Math.sin(angle);
  const tipX = originX + mainCos * beamLength - BEAM_W / 2;
  const tipY = originY + mainSin * beamLength - BEAM_W / 2;
  const tipBox = {
    x: tipX, y: tipY,
    width: BEAM_W, height: BEAM_W,
    dmg: 6, type: 'Light'
  };

  const touching = checkCollision(tipBox, target);

  if (touching) {
    // Shrink beam while in contact
    beamLength = Math.max(BEAM_LENGTH_MIN, beamLength - SHRINK_RATE);
  } else {
    // Slowly recover when not touching
    beamLength = Math.min(BEAM_LENGTH_MAX, beamLength + RECOVER_RATE);
  }

  // --- Draw all three rays (main + two cone edges) ---
  const rays = [
    { a: angle,               len: beamLength },              // Main beam
    { a: angle - CONE_SPREAD, len: beamLength * CONE_FALLOFF }, // Left edge
    { a: angle + CONE_SPREAD, len: beamLength * CONE_FALLOFF }, // Right edge
  ];

  rays.forEach((ray, rayIdx) => {
    const cos = Math.cos(ray.a);
    const sin = Math.sin(ray.a);
    const SEGMENTS = rayIdx === 0 ? 6 : 4; // Main ray gets more segments

    for (let i = 1; i <= SEGMENTS; i++) {
      const t     = i / SEGMENTS;
      const segX  = originX + cos * (ray.len * t) - 8;
      const segY  = originY + sin * (ray.len * t) - 8;
      const alpha = rayIdx === 0
        ? 0.25 + t * 0.55               // Main beam: bright at tip
        : 0.1  + t * 0.2;               // Side rays: dimmer throughout
      const size  = rayIdx === 0
        ? 10 + t * 10                   // Main beam widens toward tip
        : 6  + t * 5;                   // Side rays stay thinner

      spawnEffect(segX, segY, size, size, `rgba(255, 230, 60, ${alpha})`, 40);
    }

    // Tip flare on main beam only
    if (rayIdx === 0) {
      const tx = originX + cos * ray.len - BEAM_W / 2;
      const ty = originY + sin * ray.len - BEAM_W / 2;
      spawnEffect(tx - 4, ty - 4, BEAM_W + 8, BEAM_W + 8, 'rgba(255, 255, 180, 0.9)', 40);
    }
  });

  // --- Damage tick (with cooldown so it doesn't fire every frame) ---
  if (!hit && touching) {
    hit = true;
    attackResults(player, tipBox, target);
    target.indicate(`${target.name} is burned by the light!`);
    spawnEffect(tipBox.x - 20, tipBox.y - 20, BEAM_W + 40, BEAM_W + 40, 'rgba(255,255,100,0.85)', 300);
    setTimeout(() => { hit = false; }, 600);
  }

  // --- Visual: show current beam range as a faint arc ---
  // Draws a subtle arc between the two cone edges so the player
  // can see how much range they have left
  const arcAlpha = 0.06 + (1 - (beamLength - BEAM_LENGTH_MIN) / (BEAM_LENGTH_MAX - BEAM_LENGTH_MIN)) * 0.1;
  spawnEffect(
    originX + mainCos * beamLength - 6,
    originY + mainSin * beamLength - 6,
    12, 12,
    `rgba(255, 220, 50, ${arcAlpha})`, 60
  );

  beamLife += 16;
  if (beamLife >= DURATION) {
    clearInterval(beamInterval);
    player.indicate(`The light fades.`);
  }
}, 16);

}
});