registerAttack('MAGMA BURST', {
stats: { dmg: 4, type: 'Fire', cooldown: { time: 7000, switch: false } },

action: (player, target) => {
const attributes = attackFunctions['MAGMA BURST'].stats;

stun(player, 600);

player.indicate("MAGMA BURST!");

const chunks = [];
const count = 5;

for (let i = 0; i < count; i++) {
  chunks.push({
    x: player.x + player.width / 2,
    y: player.y + player.height,
    width: 18,
    height: 18,
    dmg: attributes.dmg,
    type: attributes.type,
    color: '#ff5a1f',

    vx: (Math.random() - 0.5) * 6,
    vy: -(Math.random() * 6 + 6) // upward burst
  });
}

let life = 0;

const interval = setInterval(() => {
  life += 100;

  for (let i = chunks.length - 1; i >= 0; i--) {
    const c = chunks[i];

    // physics
    c.x += c.vx;
    c.y += c.vy * player.stats.spd;
    c.vy += 0.5; // gravity

    spawnEffect(
      c.x,
      c.y,
      c.width,
      c.height,
      c.color,
      120
    );

    // hit
    if (checkCollision(c, target)) {
      attackResults(player, c, target);
      playRetreivedAudio('fireball');
      chunks.splice(i, 1);
      continue;
    }

    // ground impact = small explosion
    if (c.y > canvas.height - 20) {
      spawnEffect(
        c.x - 10,
        c.y - 10,
        40,
        40,
        'orange',
        150
      );

      // splash damage
      const splash = {
        x: c.x - 20,
        y: c.y - 20,
        width: 60,
        height: 60,
        dmg: 2,
        type: 'Fire'
      };

      if (checkCollision(splash, target)) {
        attackResults(player, splash, target);
      }

      chunks.splice(i, 1);
    }
  }

  if (chunks.length === 0 || life > 1500) {
    clearInterval(interval);
  }

}, 100);

}
});