registerAttack('RURAL PUNISHMENT', {
stats: { dmg: 28, type: 'Fighting', cooldown: { time: 22000, switch: false } },

action: (player, target) => {
const dir = player.facingRight ? 1 : -1;

const grabBox = {
  x: player.x + dir * 40,
  y: player.y,
  width: 60,
  height: player.height
};

player.indicate(`${player.name} attempts RURAL PUNISHMENT!`);
spawnEffect(grabBox.x, grabBox.y, grabBox.width, grabBox.height, 'gray', 500)
if (checkCollision(grabBox, target)) {

  stun(player, 1800);
  stun(target, 1800);

  // 1. GRAB HIT
  target.indicate("GRABBED!");
  attackResults(player, { dmg: 6, type: 'Fighting' }, target);
  playRetreivedAudio('punch')

  // pull target slightly in
  target.x = player.x + dir * 30;

  // 2. SLAM DOWN
  setTimeout(() => {
    target.indicate("SLAM!");

    attackResults(player, { dmg: 8, type: 'Fighting' }, target);
      playRetreivedAudio('punch2')
    

    spawnEffect(target.x, target.y + target.height, 60, 20, 'brown', 200);

  }, 400);

  // 3. FINAL STOMP
  setTimeout(() => {
    target.indicate("CRUSH!");
      playRetreivedAudio('thud')

    attackResults(player, { dmg: 10, type: 'Fighting' }, target);

    spawnEffect(target.x - 20, target.y, 80, 80, 'orange', 300);

    // knockback (short, heavy)
    // target.vx += dir * 60;
    slidePlayers(12, 300, false, player, target)

  }, 900);

} else {
  player.indicate(`${player.name} missed RURAL PUNISHMENT!`);
  player.x += dir * 30;
  stun(player, 1200);
}

}
});