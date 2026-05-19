registerAttack('VICIOUS BEAST', {
stats: { dmg: 0, type: 'Beast', cooldown: { time: 14000, switch: false } },

action: (player, target) => {
if (player.inBeastMode) return;

player.inBeastMode = true;
player.indicate("VICIOUS BEAST!");

const original = {
  atk: player.stats.atk,
  spd: player.stats.spd
};

// 🔥 BUFFS
player.stats.atk *= 1.4;
player.stats.spd *= 1.8;

let duration = 800;
let elapsed = 0;

const interval = setInterval(() => {
  elapsed += 100;

  // 🧠 AUTO TARGETING (IMPERFECT ON PURPOSE)
  const dirX = target.x - player.x;
  const dir = dirX > 0 ? 1 : -1;

  // slight randomness so it’s not perfect tracking
  const wobble = (Math.random() - 0.5) * 20;

  player.x += dir * player.stats.spd * 4;
  player.y += wobble * 0.1;

  spawnEffect(
    player.x,
    player.y,
    player.width,
    player.height,
    'rgba(255,0,0,0.2)',
    80
  );

  // 💥 HITBOX (lunging bite style)
  const hitbox = {
    x: player.x + dir * 20,
    y: player.y,
    width: player.width,
    height: player.height,
    dmg: Math.floor(Math.random() * 6) + 1,
    type: 'Beast'
  };

  if (checkCollision(hitbox, target)) {
      duration += 200
    attackResults(player, hitbox, target);
    stun(target, 500);
  rslidePlayers(8, 100, false, target, target)
    

    // recoil so it’s not infinite pressure
    // player.x -= dir * 30;
  rslidePlayers(8, 100, false, player, player)
    
  }

  if (Math.random() > 0.5) {
    player.indicate(`${player.name} hurt themselves!`)
    attackResults(player, hitbox, player)
  }

  if (elapsed >= duration) {
    clearInterval(interval);

    // restore stats
    player.stats.atk = original.atk;
    player.stats.spd = original.spd;

    player.inBeastMode = false;
    player.indicate("CALMED DOWN");
    stun(player, 2000)
  }

}, 100);

}
});