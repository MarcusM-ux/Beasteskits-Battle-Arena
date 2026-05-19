registerAttack('ERUPT', {
    stats: { dmg: 3, type: 'Fire', cooldown: { time: 30000, switch: false } }, action: (player, target) => {
        if (!player.ultimateActive) {
            player.ultimateActive = true
            stun(player, 100)
            FillUltimate(player, '#171514', '#bd481a', 'LAVA <br> CONSUMES <br> US', 'area', ()=>{
                executeErupt(player, target)
            })
            
        }

    }
})

function executeErupt(player, target) {
const attributes = attackFunctions.ERUPT.stats;

stun(player, 4000);

const cracks = [];
const eruptions = [];

// =========================
// PHASE 1: WARNING CRACKS
// =========================
for (let i = 0; i < 6; i++) {
const x = Math.random() * canvas.width;

cracks.push({
  x,
  y: player.y + player.height,
  width: 64,
  height: 64,
  timer: 0
});

}

player.indicate("THE GROUND IS BREAKING!");

let phase = 1;
let time = 0;

const interval = setInterval(() => {
time += 100;

// =========================
// DRAW CRACKS
// =========================
cracks.forEach(c => {
  c.timer += 100;

  // spawnEffect(c.x, c.y, c.width, c.height, 'darkred', 150);
  spawnImage('volcano', c, {
        playAudioOnHit: false,
        audioName: '',
        target: target,
        flipX : !player.facingRight,
        flipY: false,
        priority: true,
    })

  // 🔥 TRANSITION TO ERUPTION
  if (phase === 2 && c.timer > 500) {
    eruptions.push({
      x: c.x,
      y: c.y,
      height: 0,
      width: 40,
      active: true
    });

    playRetreivedAudio('explosion');
    c.timer = -999; // disable reuse
  }
});

// =========================
// PHASE 2: ERUPTION BURSTS
// =========================
if (phase >= 2) {
  for (let i = eruptions.length - 1; i >= 0; i--) {
    const e = eruptions[i];

    e.height += 20;

    spawnEffect(
      e.x,
      e.y - e.height,
      e.width,
      e.height,
      'orange',
      120
    );

    const hitbox = {
      x: e.x,
      y: e.y - e.height,
      width: e.width,
      height: e.height,
      dmg: attributes.dmg,
      type: attributes.type
    };

    if (checkCollision(hitbox, target)) {
      stun(target, 1200);
      attackResults(player, hitbox, target);
    }

    if (e.height > 120) {
      eruptions.splice(i, 1);
    }
  }
}

// =========================
// PHASE TIMING
// =========================
if (time > 800 && phase === 1) {
  phase = 2;
  player.indicate("ERUPTION!");
}

// =========================
// FINAL BLAST
// =========================
if (time > 2200 && phase === 2) {
  phase = 3;

  player.indicate("TOTAL ERUPTION!");

  const finalBox = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    dmg: 10,
    type: 'Fire'
  };

  spawnEffect(0, 0, canvas.width, canvas.height, 'red', 300);

  if (checkCollision(finalBox, target)) {
    stun(target, 2000);
    attackResults(player, finalBox, target);
  }
}

// =========================
// END
// =========================
if (time > 2600) {
  clearInterval(interval);
  player.ultimateActive = false;
}

}, 100);
}