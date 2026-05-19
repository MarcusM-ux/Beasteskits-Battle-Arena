registerAttack('BLAST VALLEY', {
stats: { dmg: 6, type: 'Fire', cooldown: { time: 18000, switch: false } },

action: (player, target) => {
const dir = player.facingRight ? 1 : -1;

player.indicate(`${player.name} unleashes BLAST VALLEY!`);
stun(player, 1200);

const projectiles = [];
let hits = 0

for (let i = 0; i < 12; i++) {
  projectiles.push({
    x: player.x,
    y: player.y,
    vx: (Math.random() * 6 + 4) * dir,
    vy: -(Math.random() * 6 + 4),
    size: 12,
    life: 0
  });
}

const interval = setInterval(() => {
  projectiles.forEach(p => {
    p.life += 16;

    // gravity effect
    p.vy += 0.4;

    p.x += p.vx;
    p.y += p.vy;

    spawnEffect(p.x, p.y, p.size, p.size, 'orange', 40);

    const hitbox = {
      x: p.x,
      y: p.y,
      width: p.size,
      height: p.size,
      dmg: 6,
      type: 'Fire'
    };

    if (checkCollision(hitbox, target) && hits < 3) {
        hits++
      attackResults(player, hitbox, target);

      // explosion effect
      spawnEffect(p.x - 10, p.y - 10, 30, 30, 'red', 200);

      p.life = 9999; // kill projectile
    }

    // explode on ground / timeout
    if (p.y > player.y + 200 || p.life > 1500) {
      spawnEffect(p.x - 10, p.y - 10, 25, 25, 'orange', 150);
      p.life = 9999;
    }
  });

  // remove dead projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    if (projectiles[i].life > 2000) {
      projectiles.splice(i, 1);
    }
  }

  if (projectiles.length === 0) {
    clearInterval(interval);
  }

}, 16);

}
});