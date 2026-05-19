registerAttack('RAY BLAST', {
stats: { dmg: 8, type: 'Light', cooldown: { time: 8000, switch: false } },

action: (player, target) => {
const dir = player.facingRight ? 1 : -1;

let box = {
  x: player.x,
  y: player.y + player.height / 4,
  width: 20,
  height: player.height / 2,
  type: 'Light',
  color: '#ffeb53',
  dmg: 8
};

stun(player, 800);

let time = 0;
let hit = false
const ray = setInterval(() => {
  time += 50;

  // expand forward
  box.width += 12;
  box.x += dir * 12;

  spawnEffect(box.x, box.y, box.width, box.height, box.color, 60);

  // hit detection (continuous beam)
  if (checkCollision(box, target) && !hit) {
    hit = true
    attackResults(player, box, target);
    
  }

  if (time >= 800) {
    clearInterval(ray);
  }

}, 50);

}
});