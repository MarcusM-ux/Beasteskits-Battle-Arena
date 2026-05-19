registerAttack('ECHO BITE', {
stats: {
dmg: 6,
type: 'Dark',
cooldown: { time: 6000, switch: false }
},
action: (player, target) => {
let box = {
x: player.x,
y: player.y,
width: player.width,
height: player.height,
dmg: 3,
color: 'black',
type: 'Dark',
duration: 1000
};

// --- Echo follow-up hit ---
if (player.activeEchoBite) {
  box.dmg *= 2;
  attackResults(player, box, target);
  target.indicate(`The shadows echo! ${target.name} takes double damage!`);
  box.x = target.x
  box.y = target.y 
  
  spawnImage('dark_bite', box, {
    playAudioOnHit: true,
    audioName: 'ominous-note',
    target: target,
    flipX: !player.facingRight,
    flipY: false,
    priority: true
  });
  player.activeEchoBite = false;
  clearTimeout(player.echoBiteTimeout); // Cancel the expiry timer
  return;
}

// --- Initial lunge ---
if (player.facingRight) {
  player.x += 15;
  box.x = player.x + player.width;
} else {
  player.x -= 15;
  box.x = player.x - player.width;
}

stun(player, 1500);

spawnImage('dark_bite', box, {
  playAudioOnHit: true,
  audioName: 'ominous-note',
  target: target,
  flipX: !player.facingRight,
  flipY: false,
  priority: true
});

if (checkCollision(box, target)) {
  attackResults(player, box, target);
  target.indicate(`${target.name} has been bitten by the shadows!`);
  player.indicate(`Shadow mark set use ECHO BITE again to detonate!`);
  player.activeEchoBite = true;

  // Expire the mark after 9 seconds if not consumed
  player.echoBiteTimeout = setTimeout(() => {
    if (player.activeEchoBite) {
      player.activeEchoBite = false;
      player.indicate(`${player.name} lost the shadow mark!`);
      target.indicate(`${target.name} is no longer marked by the shadows!`);
    }
  }, 9000);
}

}
});