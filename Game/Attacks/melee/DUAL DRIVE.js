registerAttack('DUAL DRIVE', {
stats: {
dmg: 8,
type: 'Metal',
cooldown: { time: 7000, switch: false }
},
action: (player, target) => {
const dir = player.facingRight ? 1 : -1;
const DASH_SPEED = 18;

stun(player, 800);
spawnEffect(player.x, player.y, player.width, player.height, 'rgba(200,200,255,0.5)', 200);

setTimeout(() => {
  let dashLife = 0;
  let hit = false;

  const driveBox = {
    x: player.x,
    y: player.y + player.height * 0.1,  // Will update each tick
    width: player.width * 1.1,
    height: player.height * 0.8,
    dmg: 8,
    type: 'Metal'
  };

  const driveInterval = setInterval(() => {
    player.x += dir * DASH_SPEED;

    // FIX 5: update box position every tick, not just x
    driveBox.x = player.x;
    driveBox.y = player.y + player.height * 0.1;

    spawnEffect(driveBox.x, driveBox.y, driveBox.width, driveBox.height, 'rgba(150,180,255,0.6)', 100);

    if (!hit && checkCollision(driveBox, target)) {
      hit = true;
      clearInterval(driveInterval);
      attackResults(player, driveBox, target);
      stun(target, 600);
      target.indicate(`${target.name} was stabbed at full speed!`);
      startGrappleCarry(player, target);
    }

    dashLife += 50;
    if (!hit && (dashLife > 600 || player.x <= 0 || player.x + player.width >= canvas.width)) {
      clearInterval(driveInterval);
    }
  }, 50);
}, 200);

}
});

function startGrappleCarry(player, target) {
player.facingRight = !player.facingRight;

const CARRY_SLAM_DMG    = 4;
const SWING_SPEED       = 4;
const DROP_SPEED        = 1.5;   // FIX 2: small drop per tick, not per bounce
const ESCAPE_THRESHOLD  = 8;
const ESCAPE_INCREMENT  = 1;
const MASH_DECAY        = 0.05;

let swingDir      = player.facingRight ? 5 : -5;
let escapeProgress = 0;
let grappleActive  = true;
let tickCount      = 0;
let speedEscalation = 0;  // FIX 4: escalation is a magnitude, applied with swingDir

const isTargetP1 = target.isPlayer1;
const keys = isTargetP1
? { left: 'a', right: 'd', up: 'w', down: 's' }
: { left: 'arrowleft', right: 'arrowright', up: 'arrowup', down: 'arrowdown' };

stun(player, 99999);

const grappleInterval = setInterval(() => {
if (!grappleActive) {
clearInterval(grappleInterval);
return;
}

tickCount++;

// FIX 6: re-stun target every tick so their movement can't fight the pin
stun(target, 100);

escapeProgress = Math.max(0, escapeProgress - MASH_DECAY);
// Escape mashing
const mashing =
  keybinds.movement[keys.up]    ||
  keybinds.movement[keys.down]  ||
  keybinds.movement[keys.left]  ||
  keybinds.movement[keys.right];

if (mashing && tickCount % 2 === 0) {
  escapeProgress = Math.min(ESCAPE_THRESHOLD, escapeProgress + ESCAPE_INCREMENT);
  target.indicate(`Escape: ${Math.round((escapeProgress / ESCAPE_THRESHOLD) * 100)}%`);
}else {
  target.indicate(`CLICK YOUR MOVEMENT BUTTONS TO ESCAPE!!`);
}

// FIX 4: escalation always pushes in the current swing direction
speedEscalation = Math.min(speedEscalation + 0.05, 4); // cap so it doesn't get absurd
const currentSpeed = (SWING_SPEED + speedEscalation) * swingDir;

// FIX 2: drop player downward every tick, not on wall bounce
player.x += currentSpeed;

// Pin target to player each tick
target.x = player.facingRight
  ? player.x + player.width  * 0.5
  : player.x - target.width  * 0.5;
target.y = player.y;

// Visual carry effect
spawnEffect(player.x, player.y, player.width, player.height, 'rgba(150,180,255,0.35)', 80);

// Wall bounce
const hitLeftWall  = player.x <= 0;
const hitRightWall = player.x + player.width >= canvas.width;

if (hitLeftWall || hitRightWall) {
  player.x = hitLeftWall ? 0 : canvas.width - player.width;
player.y += DROP_SPEED * currentSpeed;

// player.y  = Math.min(player.y, canvas.height - player.height);

  // Slam damage on each wall hit
  // target.hp = Math.max(0, target.hp - CARRY_SLAM_DMG);
  attackResults(player, {type: 'Metal', dmg: CARRY_SLAM_DMG}, target)
  // target.updateLabel();
  spawnEffect(player.x, player.y, player.width * 1.2, player.height, 'rgba(255,100,100,0.6)', 200);
  // target.indicate(`Wall slam! -${CARRY_SLAM_DMG}`);

  // Reverse direction and reset escalation so it rebuilds from the new direction
  swingDir         *= -1;
  speedEscalation   = 0;
  player.facingRight = !player.facingRight;
}

// Termination conditions
const hitBottom = player.y + player.height >= canvas.height;
const escaped   = escapeProgress >= ESCAPE_THRESHOLD;

if (hitBottom || escaped || target.hp <= 0 || target.isCPU && tickCount > 5) {
  grappleActive = false;
  clearInterval(grappleInterval);

  // FIX 1: end player stun with a minimal value rather than 0
  stun(player, 1);

  if (escaped) {
    // FIX 3: use direct position nudge instead of vx/vy
    target.x += (player.facingRight ? 1 : -1) * 40;
    target.x   = Math.max(0, Math.min(canvas.width - target.width, target.x));
    target.y  -= 20; // Small upward pop to sell the "toss" feel
    target.indicate(`${target.name} escaped!`);
    player.indicate(`${target.name} broke free!`);

    stun(player, 1000)
  } else if (hitBottom) {
    // Ground slam — heavier damage and longer stun
    target.hp = Math.max(0, target.hp - CARRY_SLAM_DMG * 3);
    target.updateLabel();
    target.indicate(`Ground slammed! -${CARRY_SLAM_DMG * 3}`);
    spawnEffect(player.x - 10, canvas.height - player.height, player.width * 2, player.height * 0.5, 'rgba(255,80,80,0.7)', 400);
    stun(target, 1200);
  }
}

}, 50);
}