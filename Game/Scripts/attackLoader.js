// attackLoader.js - CLEAN CATEGORY-BASED LOADER
// Register attacks by category - no more typing file paths!

const attackFunctions = {};
const attackData = {}

function registerAttack(name, attackData) {
  attackFunctions[name] = attackData;
  console.log(`✅ Loaded: ${name}`);
}

function quickRegister(name, attackData){
  attackFunctions[name] = attackData;
}

// Helper function to load attacks by category
function loadCategory(category, attackNames) {
  attackNames.forEach(name => {
    const script = document.createElement('script');
    script.src = `./Game/Attacks/${category}/${name}.js`;
    script.async = false;
    attackData[name] = category
    script.onerror = () => console.error(`❌ Failed to load: ${category}/${name}.js`);
    document.head.appendChild(script);
  });
}

// Load all attacks by category
console.log('📂 Loading attacks...');

// MELEE ATTACKS
loadCategory('melee', [
    'KEY BLADE STRIKE',
    'QUICK PUNCH',
    'VICIOUS BEAST',
    'NOIR SLASH',
    'BLANK',
    'SUCTION PUNCH',
    'LIFE GRASP',
    'PUNCH',
  'BITE',
  'CHOMP',
  'CLAW STRIKE',
  'COSMIC GULP',
  'COUNTER',
  'VILE CALAMITY',
  'PECK',
  'PERMAFROST',
  'ROOT HOOK',
  'SNAP',
  'STATIC',
  'STRIKE',
  'TENTACLE SLASH',
  'VENOMOUS PRICK',
  'VICIOUS BITE',
  'VILE THRUST',
  'WIND PUSH',
  'WRAP',
  'DRAG',
  'SINGULARITY PUNCH',
    'ABYSSAL BELLOW',
    'PISTON STRIKE',
    'BUG BITE',
    'ARM STRIKES',
    'KEY STAB',
    'ECHO BITE',
    'SLASH',
    'VIOLENT RAM',
    'DUAL DRIVE',
    'WHOLE BODY ENGLUF',
    'RURAL PUNISHMENT',
  'CLAW SWIPE TITAN',
  'HAYMAKER',    
]);

// PROJECTILE ATTACKS
loadCategory('projectile', [
    'DISC SHOT',
    'FLASH BEAM',
    'THIN SWIPE',
    'QUICK SHOT',
    'ABYSSAL SHOT',
    'RUBBLE THROW',
    'FORCEFUL GUST',
  'BEAM',
  'CLAMP',
  'ELECTRO WAVE',
  'FIREBOLT',
  'FIREWORK',
  'FLASH BANG',
  'GRAB',
  'ICICLE SHARD',
  'ORBITAL STRIKE',
  'PSY-SHREDDER',
  'RADIUS',
  'VOID PULSE',
  'WIND SLASH',
    'PRESSURE WASH',
    'HEAVY ANCHOR',
    'ACID SPIT',
    'SHOOTING STAR',
    'THE PROJECT',
    'PORTAL STRIKE',
    'DISMEMBERING SLASHES',
    'SHINE',
    'RAY BLAST',
    'CONCENTRATED BURST'
]);

// RUSH ATTACKS
loadCategory('rush', [
    'TATICAL HEADBUTT',
    'RUSH',
  'BEATDOWN',
  'HORN DRILL',
  'RUSH DRILL',
  'SHADOW TRAMPLE',
  'SPARKLE RUSH',
  'VICIOUS RAM',
    'TRAILBLAZE',
    'SPINNING DRILL RUSH',
    'SEISMIC TOSS',
  'CHRONIC SLAM',
  'MULTI CHOMPS'
    
]);

// SUPPORT ATTACKS
loadCategory('support', [
    'KEY TILT',
    'STEAM ROLL',
    'AQUA SHOT',
    'GUARD POP',
    'ABYSS ABSORPTION',
    'HAND EXTENSTION',
    'BLOCK',
  'SHADOW SNARE',
  'POISONOUS SPIKES',
  'ABYSS SHIELD',
  'POLLEN CLOUD',
  'ADRENALINE',
  'ANCIENT WISDOM',
  'BLOAT',
  'BUFF UP',
  'DECONSTRUCT',
  'GRAVITY WELL',
  'HARDEN',
  'HYPE',
  'MUD LAUNCH',
  'SHED',
  'SHELL BUNKER',
  'SNATCH',
  'STAR-PLATE',
  'SNATCH',
  'TAUNT',
  'CRUSHING WEIGHT',
    'OVERHEAT',
    'CHARGE',
    'TERROR',
    'CONCOCTION',
    'QUICK RIFT',
    'RECONSTRUCT',
    'SCREAM',
    'SHARPEN',
    'MOUNTAIN BARRIERS',
    'ASYNC',
    'DIG',
    'OVERCLOCK',
    'ARSONAL SWITCH',
    'QUICK PERCEPTION',
    'ENGINE OVERRIDE',
    'MAGNETIC PULL',
    'ABYSSAL CLONES',
    
]);

// MOBILITY ATTACKS
loadCategory('mobility', [
    'CLOUDY PUFF',
    'FLASH STEP',
    'PHASE',
    'LUNGE',
  'MIND WARP',
  'DASH',
  'FADE AWAY',
  'SHADOW STEP',
  'SHELL RICOCHET',
  'TELEPORT',
  'TRANSPORT',
    'FLIGHT',
    'SULK',
    'CLAP',
    'SHADOW GLIDE'
]);

// AREA ATTACKS
loadCategory('area', [
    'RADAR',
    'SCORCHED EARTH',
    'SPINNING PUSH',
    'NOXIOUS EXPOSURE',
    'MAGMA BURST',
  'BREAK DANCE',
  'DOUGHBOY DROP',
  'LAVA TRAIL',
  'PUDDLE',
  'TELE SLAM',
  'WIND MILL',
  'VOID BURST',
    'EXHAUST PLUME',
    'INFESTATION',
    'TALON SWEEP',
    'EXPLOSION',
    'SNOWFALL',
    'EARTHQUAKE',
    'BLAST VALLEY',
    'GOO LEAK',
  'BODY SLAM',
    'LOCKDOWN',
    
]);

// ULTIMATE ATTACKS
loadCategory('ultimate', [
  'FLASH FREEZE',
  'HORN OF MALICE',
  'TOTALITY',
  'WIND PULSE RAY',
  'SPIN SNIPE DAMAGE',
    'TERROR UNLEASHED',
    'EXPERIMENTAL CRISIS',
    'GRAND DISAPPEARANCE',
    'MOUNTAIN RISE',
  'ERUPT',
    'BLITZ'
]);

// Check status after a short delay
setTimeout(() => {
  const total = Object.keys(attackFunctions).length;
  if (total > 0) {
    console.log(`✅ Successfully loaded ${total} attacks!`);
    const catalog = document.querySelector('#attacksCatalog')
    for (const [name, data] of Object.entries(attackFunctions)) {
    
        const li = document.createElement('li')
        li.innerHTML = `<p style='font-size: 4vw;'>${name}</p> <br> ${attackDescriptions[name]}`
        li.children[0].style.color = colorFromType(data.stats.type)
        catalog.appendChild(li)
        li.classList.add('catalog-element')
    }

  } else {
    console.error('❌ No attacks loaded! Check your file paths and folder structure.');
  }
}, 2000);
