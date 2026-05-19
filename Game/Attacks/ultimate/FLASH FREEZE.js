registerAttack('FLASH FREEZE', {
stats: { dmg: 6, type: 'Frost', cooldown: { time: 12000, switch: false } },

action: (player, target) => {

// 🔥 DOMAIN VERSION
if (player.flashFreezeStack && !player.ultimateActive) {
  player.flashFreezeStack = false;
  player.ultimateActive = true

    if (player.name === 'Lummywhale') {
         FillUltimate(
            player,
            '#0a1a1f',
            '#7df9ff',
            'GRAND <br> FLOOD <br> WALL',
            'domain',
            () => executeLummywhaleDomain(player, target)
          );   
          return
        }
  FillUltimate(
    player,
    '#0a1a1f',
    '#7df9ff',
    'ABSOLUTE <br> ZERO',
    'domain',
    () => executeFlashFreezeDomain(player, target)
  );

  return;
}

// ❄️ NORMAL VERSION
executeFlashFreeze(player, target);

}
});
function executeFlashFreeze(player, target) {
const stats = attackFunctions["FLASH FREEZE"].stats;

const rangeBox = {
x: player.facingRight ? player.x : player.x - 100,
y: player.y,
width: 150,
height: player.height
};

if (checkCollision(rangeBox, target)) {
spawnEffect(
target.x,
target.y,
target.width,
target.height,
'rgba(0,255,255,0.6)',
300
);

stun(target, 2000);
attackResults(player, stats, target);
playRetreivedAudio('ice')

// 🔥 STACK GAINED
player.flashFreezeStack = true;

player.indicate("FROST MARK APPLIED");

} else {
player.indicate("MISSED!");
}
}
function executeFlashFreezeDomain(player, target) {
const stats = attackFunctions["FLASH FREEZE"].stats;

stun(player, 3000);
player.indicate("ABSOLUTE ZERO");

let time = 0;
let hits = 0
const interval = setInterval(() => {
time += 100;

// ❄️ GLOBAL FREEZE VISUAL
spawnEffect(
  0,
  0,
  canvas.width,
  canvas.height,
  'rgba(0,200,255,0.15)',
  100
);

// ❄️ ICICLE STRIKES
const icicle = {
  x: Math.random() * canvas.width,
  y: 0,
  width: 20,
  height: 40,
  vy: 10,
  dmg: 1,
  type: 'Frost'
};

const fall = setInterval(() => {
  icicle.y += icicle.vy;

  spawnEffect(
    icicle.x,
    icicle.y,
    icicle.width,
    icicle.height,
    '#7df9ff',
    80
  );

  if (checkCollision(icicle, target) && hits < 3) {
      hits++
    stun(target, 800);
    attackResults(player, icicle, target);

    clearInterval(fall);
  }

  if (icicle.y > canvas.height) {
    clearInterval(fall);
  }

}, 30);

// ❄️ SLOW FIELD (CONSTANT PRESSURE)
target.spd *= 0.97; // gradual slow

// 🧊 FINAL FREEZE
if (time > 2500) {
  spawnEffect(
    target.x,
    target.y,
    target.width,
    target.height,
    'cyan',
    400
  );

  stun(target, 2500);
  // attackResults(player, { dmg: 8, type: 'Frost' }, target);
}

// END DOMAIN
if (time > 3000) {
  clearInterval(interval);

  // restore speed (IMPORTANT or you break the game)
  target.spd = target.baseStats.spd;

  player.indicate("DOMAIN ENDED");
  player.ultimateActive = false
}

}, 100);
}

function executeLummywhaleDomain(player, target) {
    stun(player, 3500);
    player.indicate("GRAND FLOOD WALL");
    playRetreivedAudio('waves')
    
    let time = 0;
    let waterLevel = canvas.height;
    let hit = false
    
    const interval = setInterval(() => {
        time += 100;
        
        // 🌊 WATER RISING
        waterLevel -= 3 * 15;
        
        spawnEffect(
          0,
          waterLevel,
          canvas.width,
          canvas.height - waterLevel,
          'rgba(0,100,200,0.25)',
          100
        );
        
        // 🌀 CURRENT (PULL PLAYER)
        if (target.y > waterLevel) {
          target.x += (player.x - target.x) * 0.02;
        }
        
        // 🌊 WAVE ATTACKS
        // if (time % 400 === 0) {
          const dir = Math.random() > 0.5 ? 1 : -1;
        
          const wave = {
            x: dir === 1 ? -100 : canvas.width,
            y: waterLevel + 20,
            width: 100,
            height: 40,
            vx: dir * 8,
            dmg: 5,
            type: 'Water'
          };
        
          const waveInterval = setInterval(() => {
            wave.x += wave.vx;
        
            spawnEffect(
              wave.x,
              wave.y,
              wave.width,
              wave.height,
              '#4cc9f0',
              80
            );
        
            if (checkCollision(wave, target)) {
              stun(target, 1000);
              attackResults(player, wave, target);
              clearInterval(waveInterval);
            }
        
            if (wave.x < -150 || wave.x > canvas.width + 150) {
              clearInterval(waveInterval);
            }
        
          }, 30);
        // }
    
        // 💥 FINAL CRUSH
        if (time > 4500) {
          player.indicate("OCEAN COLLAPSE!");
        
          const crush = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
            dmg: 15,
            type: 'Water'
          };
        
          spawnEffect(
            0,
            0,
            canvas.width,
            canvas.height,
            'rgba(0,150,255,0.5)',
            300
          );
        
          if (checkCollision(crush, target) && !hit) {
            hit = true
            stun(target, 2000);
            attackResults(player, crush, target);
          }
        }
        
        // END DOMAIN
        if (time > 5000) {
          clearInterval(interval);
          player.indicate("THE WATERS RECEDE");
          player.ultimateActive = false;
          cancelAudio('waves')
        }
    
    }, 100);
}