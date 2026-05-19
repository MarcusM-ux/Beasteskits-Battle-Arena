// --- Gamemode integration & simple CPU AI ---
// Default gamemode if UI hasn't set one yet
if (!window.GameMode) window.GameMode = { mode: 'pvp', cpuLevel: null };

// Map difficulty to timings / accuracy
let cpuLoopHandles = { 
  player1: null, 
  player2: null 
};

const PLAYSTYLE_BEHAVIORS = {
  'Sniper': {
    preferredDistanceMultiplier: 1.8,      // Stay FAR away
    retreatHealthThreshold: 0.35,          // Retreat earlier
    dodgeChance: 0.85,                     // High evasion
    aggressiveThreshold: 0.15,             // Only aggressive when opponent is nearly dead
    movementPattern: 'kiting',             // Circle at distance
    comboChance: 0.2,                      // Less combo-oriented
    priorityAttackTypes: ['projectile', 'trap', 'ultimate'],
    avoidAttackTypes: ['melee', 'rush']
  },
  
  'Bruiser': {
    preferredDistanceMultiplier: 0.7,      // Stay CLOSE
    retreatHealthThreshold: 0.15,          // Rarely retreat
    dodgeChance: 0.25,                     // Low evasion (tank it!)
    aggressiveThreshold: 0.6,              // Aggressive most of the time
    movementPattern: 'charging',           // Rush toward opponent
    comboChance: 0.7,                      // Heavy combo usage
    priorityAttackTypes: ['melee', 'rush', 'ultimate'],
    avoidAttackTypes: ['projectile']
  },
  
  'Harasser': {
    preferredDistanceMultiplier: 1.2,      // Mid-range pressure
    retreatHealthThreshold: 0.4,           // Moderate retreat threshold
    dodgeChance: 0.7,                      // High mobility
    aggressiveThreshold: 0.5,              // Consistently aggressive
    movementPattern: 'circling',           // Constant repositioning
    comboChance: 0.6,                      // Moderate combos
    priorityAttackTypes: ['rush', 'area', 'projectile'],
    avoidAttackTypes: []
  },
  
  'Tank': {
    preferredDistanceMultiplier: 0.6,      // Very close
    retreatHealthThreshold: 0.1,           // Almost never retreat
    dodgeChance: 0.1,                      // Minimal dodging
    aggressiveThreshold: 0.7,              // Frontline aggression
    movementPattern: 'blocking',           // Position between opponent and escape
    comboChance: 0.4,                      // Steady combos
    priorityAttackTypes: ['melee', 'area', 'support'],
    avoidAttackTypes: ['projectile']
  },
  
  'Damage': {
    preferredDistanceMultiplier: 0.9,      // Close-mid range
    retreatHealthThreshold: 0.3,           // Retreat when threatened
    dodgeChance: 0.4,                      // Moderate evasion
    aggressiveThreshold: 0.4,              // Frequently aggressive
    movementPattern: 'positioning',        // Position for burst
    comboChance: 0.75,                     // Combo-heavy
    priorityAttackTypes: ['ultimate', 'rush', 'melee'],
    avoidAttackTypes: []
  },
  
  'Controller': {
    preferredDistanceMultiplier: 1.1,      // Mid-range control
    retreatHealthThreshold: 0.25,          // Moderate retreat
    dodgeChance: 0.5,                      // Decent mobility
    aggressiveThreshold: 0.55,             // Steady pressure
    movementPattern: 'controlling',        // Position to control space
    comboChance: 0.5,                      // Moderate combos
    priorityAttackTypes: ['area', 'support', 'trap'],
    avoidAttackTypes: []
  }
};

// ============================================
// CPU vs CPU now uses selected creatures
// ============================================
function ensureGamemodePlayersBeforeStart() {
  const gm = window.GameMode || { mode: 'pvp', cpuLevel: null };
  console.log('Ensuring gamemode players for mode:', gm.mode);

  if (gm.mode === 'pvp') {
    return;
  }

  if (gm.mode === 'pvc') {
    const difficulty = gm.cpuLevel || 'novice';
    
    // CPU is ALWAYS player 2 in PvC mode
    if (challengers.player2 && !challengers.player2.isCPU) {
      console.log('PvC mode: Replacing Player 2 with CPU');
        
      animatePlayers.splice(animatePlayers.indexOf(challengers.player2), 1);
      if (challengers.player2Button) challengers.player2Button.style.color = 'black';

      const cpu = spawnCPUPlayer(challengers.player2.name, 2, difficulty);   
      // challengers.player2 = null;
      // challengers.player2Button = null;
      challengers.player2 = cpu;
      animatePlayers.push(cpu);
      challengers.player2Button = null;
      clearHumanFlagsForSlot('player2');
      console.log('Spawned CPU as Player 2:', cpu.name);
    }
    
    // Spawn CPU as player 2 if not present
    if (!challengers.player2) {
      const allCreatures = Object.keys(creatures).filter(name => name !== 'Random');
      const cpuCandidateName = allCreatures[Math.floor(Math.random() * allCreatures.length)];
      const cpu = spawnCPUPlayer(cpuCandidateName, 2, difficulty);
        
      challengers.player2 = cpu;
      animatePlayers.push(cpu);
      challengers.player2Button = null;
      clearHumanFlagsForSlot('player2');
      console.log('Spawned CPU as Player 2:', cpu.name);
    }
    
    updatePlayerHeading();
  }
  if (gm.mode === 'cvp') {
    const difficulty = gm.cpuLevel || 'novice';
    
    // CPU is ALWAYS player 2 in PvC mode
    if (challengers.player1 && !challengers.player1.isCPU) {
      console.log('CVP mode: Replacing Player 1 with CPU');
        
      animatePlayers.splice(animatePlayers.indexOf(challengers.player1), 1);
      if (challengers.player1Button) challengers.player1Button.style.color = 'black';

      const cpu = spawnCPUPlayer(challengers.player1.name, 1, difficulty);   
      // challengers.player2 = null;
      // challengers.player2Button = null;
      challengers.player1 = cpu;
      animatePlayers.push(cpu);
      challengers.player2Button = null;
      clearHumanFlagsForSlot('player1');
      console.log('Spawned CPU as Player 1:', cpu.name);
    }
    
    // Spawn CPU as player 2 if not present
    if (!challengers.player1) {
      const allCreatures = Object.keys(creatures).filter(name => name !== 'Random');
      const cpuCandidateName = allCreatures[Math.floor(Math.random() * allCreatures.length)];
      const cpu = spawnCPUPlayer(cpuCandidateName, 1, difficulty);
        
      challengers.player1 = cpu;
      animatePlayers.push(cpu);
      challengers.player1Button = null;
      clearHumanFlagsForSlot('player1');
      console.log('Spawned CPU as Player 1:', cpu.name);
    }
    
    updatePlayerHeading();
  }
  
  if (gm.mode === 'cvc') {
    const difficulty = gm.cpuLevel || 'advanced';
    
    // Convert any human players to CPU (keeping their selected creature)
    if (challengers.player1 && !challengers.player1.isCPU) {
      console.log('CvC mode: Converting Player 1 to CPU:', challengers.player1.name);
      const creatureName = challengers.player1.name;
      animatePlayers.splice(animatePlayers.indexOf(challengers.player1), 1);
      if (challengers.player1Button) challengers.player1Button.style.color = 'black';
      
      // Create CPU version of the same creature
      const cpu = spawnCPUPlayer(creatureName, 1, difficulty);
      challengers.player1 = cpu;
      animatePlayers.push(cpu);
      clearHumanFlagsForSlot('player1');
      console.log('Converted Player 1 to CPU:', cpu.name);
    }
    
    if (challengers.player2 && !challengers.player2.isCPU) {
      console.log('CvC mode: Converting Player 2 to CPU:', challengers.player2.name);
      const creatureName = challengers.player2.name;
      animatePlayers.splice(animatePlayers.indexOf(challengers.player2), 1);
      if (challengers.player2Button) challengers.player2Button.style.color = 'black';
      
      // Create CPU version of the same creature
      const cpu = spawnCPUPlayer(creatureName, 2, difficulty);
      challengers.player2 = cpu;
      animatePlayers.push(cpu);
      clearHumanFlagsForSlot('player2');
      console.log('Converted Player 2 to CPU:', cpu.name);
    }
    
    // Only spawn random CPUs if no creatures are selected at all
    if (!challengers.player1) {
      const allCreatures = Object.keys(creatures).filter(name => name !== 'Random');
      const cpu = spawnCPUPlayer(allCreatures[Math.floor(Math.random() * allCreatures.length)], 1, difficulty);
      challengers.player1 = cpu;
      animatePlayers.push(cpu);
      clearHumanFlagsForSlot('player1');
      console.log('No selection - Random CPU as Player 1:', cpu.name);
    }
    
    if (!challengers.player2) {
      const allCreatures = Object.keys(creatures).filter(name => name !== 'Random');
      const cpu2 = spawnCPUPlayer(allCreatures[Math.floor(Math.random() * allCreatures.length)], 2, difficulty);
      challengers.player2 = cpu2;
      animatePlayers.push(cpu2);
      clearHumanFlagsForSlot('player2');
      console.log('No selection - Random CPU as Player 2:', cpu2.name);
    }
    
    updatePlayerHeading();
  }
}

function clearHumanFlagsForSlot(slot) {
  if (slot === 'player1') {
    // player1 human keys
    ['w','a','s','d'].forEach(k => { if (k in keybinds.movement) keybinds.movement[k] = false; });
    ['q','e','r','f'].forEach(k => { if (k in keybinds.attacks) keybinds.attacks[k] = false; });
  } else {
    // player2 human keys
    ['arrowup','arrowdown','arrowleft','arrowright'].forEach(k => { if (k in keybinds.movement) keybinds.movement[k] = false; });
    ['j','k','l','h'].forEach(k => { if (k in keybinds.attacks) keybinds.attacks[k] = false; });
  }
}

function spawnCPUPlayer(creatureName, slot = 2, difficulty = 'novice') {
  if (!creatureName || !creatures[creatureName]) return null;
  const cpu = new Player(creatures[creatureName], slot, creatureName);

  cpu.isCPU = true;
  cpu.cpuDifficulty = difficulty;
  
  // ULTIMATE AI STATE - Battle IQ System
  cpu.aiState = {
    // Core strategy
    strategy: 'balanced',
    lastStrategyChange: Date.now(),
    targetPosition: null,
    dodgeDirection: null,
    dodgeUntil: 0,
    circlingClockwise: Math.random() > 0.5,
    preferredDistance: 80 + Math.random() * 60,
    lastAttackTime: 0,
    consecutiveMisses: 0,
    patience: Math.random() * 2000 + 1000,
    repositionTimer: 0,
    rotatingForAttack: null,
    
    // ADVANCED BATTLE IQ
    opponentPatterns: {
      recentAttacks: [],           // Track last 5 attacks
      favoriteAttack: null,         // Most used attack
      attackFrequency: {},          // How often they use each move
      lastPositions: [],            // Track movement patterns
      predictedNextMove: null       // AI's prediction
    },
    
    comboSystem: {
      isComboActive: false,
      comboChain: [],               // Planned attack sequence
      comboStep: 0,                 // Current step in combo
      lastComboTime: 0
    },
    
    resourceManagement: {
      cooldownTracking: {},         // Track all cooldowns
      optimalAttackOrder: [],       // Best attack rotation
      resourceScore: 100            // How well we're managing attacks
    },
    
    adaptiveLearning: {
      successfulTactics: {},        // What's working
      failedTactics: {},            // What's not working
      adaptationLevel: 0            // How much we've adapted
    },
    
    counterPlay: {
      justGotHit: false,
      lastAttackReceived: null,
      revengeMode: false,
      counterWindow: 0
    },
    
    mindGames: {
      shouldFeint: false,           // Fake out opponent
      baitOpponent: false,          // Trick them into attacking
      unpredictability: 0.3         // Randomness factor
    }
  };
  
  return cpu;
}

// ============================================
// PART 2: Enhanced CPU Configuration
// ============================================

const CPU_CONFIG = {
  novice: { 
    actionInterval: 1400, 
    moveInterval: 700, 
    accuracy: 0.40, 
    reactionJitter: 400,
    dodgeChance: 0.15,
    strategyChangeInterval: 8000,
    attackRange: 120,
    comboChance: 0.1,
    patternRecognition: false,
    adaptiveLearning: false
  },
  intermediate: { 
    actionInterval: 900, 
    moveInterval: 450, 
    accuracy: 0.65, 
    reactionJitter: 250,
    dodgeChance: 0.55,
    strategyChangeInterval: 5000,
    attackRange: 140,
    comboChance: 0.3,
    patternRecognition: true,
    adaptiveLearning: true
  },
  advanced: { 
    actionInterval: 550, 
    moveInterval: 300, 
    accuracy: 0.85, 
    reactionJitter: 150,
    dodgeChance: 0.75,
    strategyChangeInterval: 3000,
    attackRange: 160,
    comboChance: 0.8,
    patternRecognition: true,
    adaptiveLearning: true
  }
};

// ============================================
// PART 3: Battle IQ Helper Functions
// ============================================

// Track opponent's attack patterns
function trackOpponentAttack(cpu, attackName) {
  const patterns = cpu.aiState.opponentPatterns;
  
  patterns.recentAttacks.push(attackName);
  if (patterns.recentAttacks.length > 5) {
    patterns.recentAttacks.shift();
  }
  
  // Count frequency
  patterns.attackFrequency[attackName] = (patterns.attackFrequency[attackName] || 0) + 1;
  
  // Find favorite attack
  let maxUses = 0;
  for (const [attack, count] of Object.entries(patterns.attackFrequency)) {
    if (count > maxUses) {
      maxUses = count;
      patterns.favoriteAttack = attack;
    }
  }
}

// Predict opponent's next move
function predictOpponentMove(cpu) {
  const patterns = cpu.aiState.opponentPatterns;
  
  if (patterns.recentAttacks.length < 3) return null;
  
  // Check for repeating patterns
  const last3 = patterns.recentAttacks.slice(-3);
  const beforeLast3 = patterns.recentAttacks.slice(-6, -3);
  
  if (JSON.stringify(last3) === JSON.stringify(beforeLast3)) {
    // Pattern detected! Predict they'll repeat
    patterns.predictedNextMove = patterns.favoriteAttack;
    console.log(`${cpu.name} PREDICTS opponent will use: ${patterns.predictedNextMove}`);
    return patterns.predictedNextMove;
  }
  
  return patterns.favoriteAttack; // Default to most common
}

// Generate optimal combo based on situation
function generateCombo(cpu, opponent, distance) {
  const combos = {
    // Close range rush combo
    closeRush: ['melee', 'melee', 'rush'],
    
    // Mid range pressure
    midPressure: ['projectile', 'area', 'melee'],
    
    // Long range poke
    longPoke: ['projectile', 'projectile', 'mobility'],
    
    // Finish combo (when opponent is low)
    finisher: ['rush', 'ultimate', 'melee'],
    
    // Defensive reset
    defensive: ['mobility', 'area', 'support']
  };
  
  const hpRatio = cpu.stats.hp / cpu.baseStats.hp;
  const oppHpRatio = opponent.stats.hp / opponent.baseStats.hp;
  
  // Select combo based on situation
  if (oppHpRatio < 0.3) return combos.finisher;
  if (hpRatio < 0.4) return combos.defensive;
  if (distance < 80) return combos.closeRush;
  if (distance > 150) return combos.longPoke;
  
  return combos.midPressure;
}

function isAlignedForAttack(attacker, target, attackCategory, tolerance = 55) {
  const ax = attacker.x + attacker.width  / 2;
  const ay = attacker.y + attacker.height / 2;
  const tx = target.x  + target.width    / 2;
  const ty = target.y  + target.height   / 2;

  const absDx = Math.abs(tx - ax);
  const absDy = Math.abs(ty - ay);

  switch (attackCategory.type) {
    case 'projectile':
      // Horizontal-firing projectiles need same-ish Y row
      return absDy <= tolerance;

    case 'rush':
      // Rush attacks travel toward opponent — allow a bit more vertical tolerance
      return absDy <= tolerance * 1.4;

    case 'area':
      // Area attacks need to be somewhat close on BOTH axes
      return absDx <= 140 && absDy <= 100;

    case 'melee':
    case 'basic':
      // Close range — diagonal distance check is fine, no extra restriction needed
      return absDy <= 60;

    case 'support':
    case 'mobility':
    case 'trap':
    case 'ultimate':
      // These work regardless of alignment
      return true;

    default:
      return true;
  }
}

function alignToOpponent(opponent, attackCategory, tolerance = 55) {
  const ax = p.x + p.width  / 2;
  const ay = p.y + p.height / 2;
  const tx = opponent.x + opponent.width  / 2;
  const ty = opponent.y + opponent.height / 2;

  const absDy = Math.abs(ty - ay);
  const absDx = Math.abs(tx - ax);

  for (const k in intent.movement) intent.movement[k] = false;

  if (attackCategory.type === 'projectile' && absDy > tolerance) {
    // Close the Y gap
    if (ty > ay) { if (p.isPlayer1) intent.movement.s = true; else intent.movement.arrowdown = true; }
    else         { if (p.isPlayer1) intent.movement.w = true; else intent.movement.arrowup   = true; }
    // Also get close enough horizontally to be in range
    if (absDx > attackCategory.maxDist * 0.85) {
      if (tx > ax) { if (p.isPlayer1) intent.movement.d = true; else intent.movement.arrowright = true; }
      else         { if (p.isPlayer1) intent.movement.a = true; else intent.movement.arrowleft  = true; }
    }
  } else if (attackCategory.type === 'rush' && absDy > tolerance * 1.4) {
    if (ty > ay) { if (p.isPlayer1) intent.movement.s = true; else intent.movement.arrowdown = true; }
    else         { if (p.isPlayer1) intent.movement.w = true; else intent.movement.arrowup   = true; }
  } else if (attackCategory.type === 'area' && (absDx > 140 || absDy > 100)) {
    // Move toward opponent on whichever axis is more misaligned
    if (absDy > 100) {
      if (ty > ay) { if (p.isPlayer1) intent.movement.s = true; else intent.movement.arrowdown = true; }
      else         { if (p.isPlayer1) intent.movement.w = true; else intent.movement.arrowup   = true; }
    }
    if (absDx > 140) {
      if (tx > ax) { if (p.isPlayer1) intent.movement.d = true; else intent.movement.arrowright = true; }
      else         { if (p.isPlayer1) intent.movement.a = true; else intent.movement.arrowleft  = true; }
    }
  }
}

// Execute combo step
function executeComboStep(cpu, comboType, keys) {
  const step = cpu.aiState.comboSystem.comboStep;
  const targetType = cpu.aiState.comboSystem.comboChain[step];
  
  // Find an attack matching the combo type
  const matchingKeys = keys.filter(k => {
    const name = cpu.keysToAttack[k].name;
    const cat = categorizeAttack(name);
    return cat.type === targetType;
  });
  
  if (matchingKeys.length > 0) {
    const key = matchingKeys[Math.floor(Math.random() * matchingKeys.length)];
    console.log(`${cpu.name} COMBO STEP ${step + 1}: ${cpu.keysToAttack[key].name} (${targetType})`);
    return key;
  }
  
  return null;
}

// Attack categorization (same as before)
const categorizeAttack = (attackName) => {
  const name = attackName.toUpperCase();
  
  if (['FIREBOLT', 'VILE THRUST', 'BOLT', 'BEAM', 'ORBITAL', 'ICICLE SHARD', 
       'VOID PULSE', 'WIND PUSH', 'ELECTRO WAVE', 'WIND SLASH'].some(kw => name.includes(kw))) {
    return { type: 'projectile', range: 'long', minDist: 60, maxDist: 180 };
  }
  
  if (['CHOMP', 'BITE', 'SNAP', 'PECK', 'STRIKE', 'VENOMOUS PRICK', 'WRAP',
       'CLAMP', 'GRAB', 'VICIOUS', 'TENTACLE', 'HAYMAKER', 'HORN DRILL',
       'ROOT HOOK', 'CLAW STRIKE', 'SNATCH', 'BODY SLAM'].some(kw => name.includes(kw))) {
    return { type: 'melee', range: 'close', minDist: 0, maxDist: 80 };
  }
  
  if (['BEATDOWN', 'RAM', 'RUSH', 'MUD LAUNCH', 'COSMIC GULP',
       'SPARKLE RUSH', 'DRILL', 'FIREWORK'].some(kw => name.includes(kw))) {
    return { type: 'rush', range: 'mid', minDist: 50, maxDist: 200 };
  }
  
  if (['WIND MILL', 'PUDDLE', 'LAVA TRAIL', 'PERMAFROST', 'BREAK DANCE',
       'ERUPT', 'RADIUS', 'HYPE', 'STATIC'].some(kw => name.includes(kw))) {
    return { type: 'area', range: 'mid', minDist: 40, maxDist: 120 };
  }
  
  if (['BLOAT', 'HARDEN', 'SHED', 'DECONSTRUCT', 'CHARGE', 'TAUNT',
       'ADRENALINE', 'BUFF UP', 'STAR-PLATE', 'SHELL BUNKER', 'STAR'].some(kw => name.includes(kw))) {
    return { type: 'support', range: 'any', minDist: 0, maxDist: 999 };
  }
  
  if (['DASH', 'SHADOW STEP', 'FADE AWAY', 'TELEPORT', 'TRANSPORT',
       'SHELL RICOCHET'].some(kw => name.includes(kw))) {
    return { type: 'mobility', range: 'any', minDist: 0, maxDist: 999 };
  }
  
  if (['FLASH BANG', 'TELE SLAM', 'COUNTER', 'SHADOW SNARE'].some(kw => name.includes(kw))) {
    return { type: 'trap', range: 'mid', minDist: 60, maxDist: 150 };
  }
  
  if (['TOTALITY', 'WIND PULSE RAY', 'CHRONIC SLAM', 'FLASH FREEZE',
       'DOUGHBOY DROP'].some(kw => name.includes(kw))) {
    return { type: 'ultimate', range: 'any', minDist: 0, maxDist: 999 };
  }
  
  return { type: 'basic', range: 'close', minDist: 0, maxDist: 80 };
};

// ============================================
// PART 4: Strategy Determination (Enhanced)
// ============================================
// PLAYSTYLES
function returnPlaystyle(cpu){
    let playstyle = ''
    for (const [name, table] of Object.entries(PLAYSTYLES)){
        if (table.includes(cpu.name)) playstyle = name
        break
    }

    switch(playstyle){
    
    }
}   
function determineCPUStrategy(cpu, opponent) {
  if (!cpu || !opponent) return 'balanced';
  
  const playstyle = getPlaystyleForCPU(cpu);
  const behaviors = PLAYSTYLE_BEHAVIORS[playstyle] || {};
  
  const hpRatio = cpu.stats.hp / cpu.baseStats.hp;
  const opponentHpRatio = opponent.stats.hp / opponent.baseStats.hp;
  
  // Use playstyle-specific thresholds
  const retreatThreshold = behaviors.retreatHealthThreshold || 0.25;
  const aggressiveThreshold = behaviors.aggressiveThreshold || 0.5;
  
  if (hpRatio < retreatThreshold) return 'retreat';
  if (opponentHpRatio < 0.3) return 'aggressive';
  if (hpRatio < 0.4 && opponentHpRatio > 0.7) return 'defensive';
  if (hpRatio > aggressiveThreshold && cpu.stats.hp > opponent.stats.hp) return 'aggressive';
  
  return 'balanced';
}

function getPlaystyleForCPU(cpu) {
  for (const [playstyle, creatures] of Object.entries(PLAYSTYLES)) {
    if (creatures.includes(cpu.name)) {
      return playstyle;
    }
  }
  return 'Balanced'; // Default fallback
}


function calculateTacticalPosition(cpu, opponent, strategy, cfg) {
  const dx = (opponent.x + opponent.width/2) - (cpu.x + cpu.width/2);
  const dy = (opponent.y + opponent.height/2) - (cpu.y + cpu.height/2);
  const distance = Math.sqrt(dx*dx + dy*dy);
  
  let targetX = cpu.x;
  let targetY = cpu.y;
  
  switch(strategy) {
    case 'aggressive':
      const aggroOffset = (Math.random() - 0.5) * 40;
      targetX = opponent.x + aggroOffset;
      targetY = opponent.y + aggroOffset;
      cpu.aiState.preferredDistance = 60 + Math.random() * 40;
      break;
      
    case 'defensive':
      const angle = Math.atan2(dy, dx);
      const circleOffset = cpu.aiState.circlingClockwise ? Math.PI/4 : -Math.PI/4;
      const defDistance = cpu.aiState.preferredDistance;
      targetX = opponent.x + Math.cos(angle + circleOffset) * defDistance;
      targetY = opponent.y + Math.sin(angle + circleOffset) * defDistance;
      break;
      
    case 'retreat':
      targetX = opponent.x < canvas.width/2 ? canvas.width - 50 : 50;
      targetY = opponent.y < canvas.height/2 ? canvas.height - 50 : 50;
      break;
      
    case 'balanced':
    default:
      // Analyze moveset for optimal distance
      const keys = Object.keys(cpu.keysToAttack).filter(k => 
        cpu.keysToAttack[k].name && cpu.keysToAttack[k].stats
      );
      
      let projectileCount = 0;
      let meleeCount = 0;
      let rushCount = 0;
      
      keys.forEach(k => {
        const name = cpu.keysToAttack[k].name.toUpperCase();
        if (['FIREBOLT', 'BOLT', 'BEAM', 'ORBITAL', 'ICICLE', 'VOID PULSE', 'ELECTRO'].some(kw => name.includes(kw))) {
          projectileCount++;
        } else if (['CHOMP', 'BITE', 'SNAP', 'PECK', 'STRIKE', 'CLAW', 'WRAP'].some(kw => name.includes(kw))) {
          meleeCount++;
        } else if (['BEATDOWN', 'RAM', 'RUSH', 'SLAM', 'COSMIC'].some(kw => name.includes(kw))) {
          rushCount++;
        }
      });
      
      if (projectileCount > meleeCount && projectileCount > rushCount) {
        cpu.aiState.preferredDistance = 120 + Math.random() * 40;
      } else if (meleeCount > projectileCount && meleeCount > rushCount) {
        cpu.aiState.preferredDistance = 50 + Math.random() * 30;
      } else if (rushCount > 0) {
        cpu.aiState.preferredDistance = 90 + Math.random() * 40;
      } else {
        cpu.aiState.preferredDistance = 80 + Math.random() * 40;
      }
      
      if (distance < cpu.aiState.preferredDistance - 20) {
        targetX = cpu.x - dx * 0.5;
        targetY = cpu.y - dy * 0.5;
      } else if (distance > cpu.aiState.preferredDistance + 40) {
        targetX = opponent.x + (Math.random() - 0.5) * 60;
        targetY = opponent.y + (Math.random() - 0.5) * 60;
      } else {
        const angle = Math.atan2(dy, dx);
        const circleOffset = cpu.aiState.circlingClockwise ? Math.PI/6 : -Math.PI/6;
        targetX = opponent.x + Math.cos(angle + circleOffset) * cpu.aiState.preferredDistance;
        targetY = opponent.y + Math.sin(angle + circleOffset) * cpu.aiState.preferredDistance;
      }
      break;
  }
  
  targetX = Math.max(30, Math.min(canvas.width - 30, targetX));
  targetY = Math.max(30, Math.min(canvas.height - 30, targetY));
  
  return { x: targetX, y: targetY };
}

// ============================================
// PART 6: THE ULTIMATE CPU CONTROLLER
// ============================================

function startCPUControllers(condition) {
  stopCPUControllers();
  if (!condition) {
      if (challengers.player1 && challengers.player1.isCPU) clearHumanFlagsForSlot('player1');
      if (challengers.player2 && challengers.player2.isCPU) clearHumanFlagsForSlot('player2');
  }
  // How often each difficulty exploits a stun window (0–1 chance)
  const STUN_EXPLOIT_CHANCE = { novice: 0.45, intermediate: 0.78, advanced: 0.97 };

  ['player1', 'player2'].forEach(slot => {
    const p = challengers[slot];
    if (!p || !p.isCPU) return;

    const cfg    = CPU_CONFIG[p.cpuDifficulty] || CPU_CONFIG.novice;
    const intent = cpuIntent[slot];

    // ── HELPER: close the gap toward opponent ──────────────────────────────
    function rushOpponent(opponent) {
      const dx = (opponent.x + opponent.width  / 2) - (p.x + p.width  / 2);
      const dy = (opponent.y + opponent.height / 2) - (p.y + p.height / 2);
      for (const k in intent.movement) intent.movement[k] = false;
      if (dx > 0) { if (p.isPlayer1) intent.movement.d = true; else intent.movement.arrowright = true; }
      else        { if (p.isPlayer1) intent.movement.a = true; else intent.movement.arrowleft  = true; }
      if (dy > 0) { if (p.isPlayer1) intent.movement.s = true; else intent.movement.arrowdown  = true; }
      else        { if (p.isPlayer1) intent.movement.w = true; else intent.movement.arrowup    = true; }
    }
    // ── HELPER: fire best available (non-cooldown) attack ──────────────────
    function fireBestAttack() {
      const keys = Object.keys(p.keysToAttack).filter(k =>
        p.keysToAttack[k].name &&
        p.keysToAttack[k].stats &&
        !p.keysToAttack[k].stats.cooldown.switch
      );
      if (keys.length === 0) return false;
      const best = keys.sort((a, b) =>
        (p.keysToAttack[b].stats.dmg || 0) - (p.keysToAttack[a].stats.dmg || 0)
      )[0];
      intent.attacks[best] = true;
      setTimeout(() => { intent.attacks[best] = false; }, 80);
      return true;
    }

    // ── REACTIVE LOOP — runs every 120 ms, only cares about stuns / revenge ─
    const reactiveHandle = setInterval(() => {
      const opponent = (slot === 'player1') ? challengers.player2 : challengers.player1;
      if (!opponent) return;

      const exploitChance = STUN_EXPLOIT_CHANCE[p.cpuDifficulty] ?? 0.5;

      // 1. OPPONENT IS STUNNED — highest-priority punish
      if (opponent.isStunned && opponent.isStunned()) {
        if (Math.random() < exploitChance) {
          rushOpponent(opponent);
          fireBestAttack();
          console.log(`${p.name} PUNISHING STUN`);
        }
        return; // don't stack with revenge logic this tick
      }

      // 2. REVENGE — CPU just got hit; fire back fast
      if (p.aiState.counterPlay.revengeMode && Math.random() < exploitChance * 0.85) {
        const keys = Object.keys(p.keysToAttack).filter(k =>
          p.keysToAttack[k].name &&
          p.keysToAttack[k].stats &&
          !p.keysToAttack[k].stats.cooldown.switch
        );
        const rushKeys = keys.filter(k => {
          const cat = categorizeAttack(p.keysToAttack[k].name);
          return (cat.type === 'rush' || cat.type === 'ultimate') && p.keysToAttack[k].stats.dmg > 8;
        });
        const pool = rushKeys.length > 0 ? rushKeys : keys;
        if (pool.length > 0) {
          const key = pool[0];
          intent.attacks[key] = true;
          setTimeout(() => { intent.attacks[key] = false; }, 80);
          p.aiState.counterPlay.revengeMode = false;
          console.log(`${p.name} REACTIVE REVENGE`);
        }
      }

      // 3. PRESSURE WHEN ALL COOLDOWNS ARE ACTIVE — close the gap instead of idling
      const allOnCooldown = Object.keys(p.keysToAttack).every(k =>
        !p.keysToAttack[k].name || p.keysToAttack[k].stats?.cooldown?.switch
      );
      if (allOnCooldown && p.aiState.strategy !== 'retreat') {
        rushOpponent(opponent);
      }

    }, 120);

    // ── MOVEMENT LOOP (unchanged logic, small addition for dynamic spacing) ─
    const moveHandle = setInterval(() => {
      const opponent = (slot === 'player1') ? challengers.player2 : challengers.player1;
      if (!opponent) return;
      
      const playstyle = getPlaystyleForCPU(p);
      const behaviors = PLAYSTYLE_BEHAVIORS[playstyle] || {};
      const distanceMultiplier = behaviors.preferredDistanceMultiplier || 1.0;
      
      // Apply playstyle multiplier to base distance
      p.aiState.preferredDistance = (80 + Math.random() * 40) * distanceMultiplier;
    
        const now = Date.now();
    
    if (now - p.aiState.lastStrategyChange > cfg.strategyChangeInterval) {
        p.aiState.strategy = determineCPUStrategy(p, opponent);
        p.aiState.lastStrategyChange = now;
        p.aiState.circlingClockwise = Math.random() > 0.5;
    }
    
    const hpLead = p.stats.hp - opponent.stats.hp;
    if (hpLead > 20) p.aiState.preferredDistance = Math.max(50, p.aiState.preferredDistance - 3)
    else if (hpLead < -20) p.aiState.preferredDistance = Math.min(150, p.aiState.preferredDistance + 3)
    
    // Clear ONCE at the top of the tick, set below, never clear mid-tick
    for (const k in intent.movement) intent.movement[k] = false;
    
    // Dodge — only trigger occasionally, not every tick
    // if (Math.random() < cfg.dodgeChance && now > p.aiState.dodgeUntil) {
    //     p.aiState.dodgeDirection = Math.random() * Math.PI * 2;
    //     p.aiState.dodgeUntil = now + 400;
    // }
  
  
      if (Math.random() < behaviors.dodgeChance && now > p.aiState.dodgeUntil) {
        p.aiState.dodgeDirection = Math.random() * Math.PI * 2;
        p.aiState.dodgeUntil = now + 400;
      }
  
    if (now < p.aiState.dodgeUntil) {
        const ddx = Math.cos(p.aiState.dodgeDirection);
        const ddy = Math.sin(p.aiState.dodgeDirection);
        if (ddx > 0.3) { if (p.isPlayer1) intent.movement.d = true; else intent.movement.arrowright = true; }
        else if (ddx < -0.3) { if (p.isPlayer1) intent.movement.a = true; else intent.movement.arrowleft = true; }
        if (ddy > 0.3) { if (p.isPlayer1) intent.movement.s = true; else intent.movement.arrowdown = true; }
        else if (ddy < -0.3) { if (p.isPlayer1) intent.movement.w = true; else intent.movement.arrowup = true; }
        return; // committed to dodge this tick, skip normal movement
    }
    
    const targetPos = calculateTacticalPosition(p, opponent, p.aiState.strategy, cfg);
    const dx = targetPos.x - p.x;
    const dy = targetPos.y - p.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 15) {
        if (Math.abs(dx) > 10) {
            if (dx > 0) { if (p.isPlayer1) intent.movement.d = true; else intent.movement.arrowright = true; }
            else { if (p.isPlayer1) intent.movement.a = true; else intent.movement.arrowleft = true; }
        }
        if (Math.abs(dy) > 10) {
            if (dy > 0) { if (p.isPlayer1) intent.movement.s = true; else intent.movement.arrowdown = true; }
            else { if (p.isPlayer1) intent.movement.w = true; else intent.movement.arrowup = true; }
        }
    }
    // No setTimeout to clear — next tick handles it
    }, cfg.moveInterval);    
    
    const actionHandle = setInterval(() => {
      const opponent = (slot === 'player1') ? challengers.player2 : challengers.player1;
      if (!opponent) return;
    
      const now = Date.now();
      for (const k in intent.attacks) intent.attacks[k] = false;
    
      const dx = (opponent.x + opponent.width  / 2) - (p.x + p.width  / 2);
      const dy = (opponent.y + opponent.height / 2) - (p.y + p.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
    
      // ── REUSABLE RANGE GATE ─────────────────────────────────────────────
      function isInRange(attackKey) {
        const cat = categorizeAttack(p.keysToAttack[attackKey].name);
        return distance >= cat.minDist &&
               distance <= cat.maxDist &&
               isAlignedForAttack(p, opponent, cat);
      }
    
      // // Handle rotation attacks
      // if (p.aiState.rotatingForAttack) {
      //   handleRotationAttack(p, opponent, slot, intent, p.aiState.rotatingForAttack);
      // }
    
      // ── STUN PUNISH — beats every other priority ────────────────────────
      const exploitChance = STUN_EXPLOIT_CHANCE[p.cpuDifficulty] ?? 0.5;
      if (opponent.isStunned && opponent.isStunned() && Math.random() < exploitChance) {
        rushOpponent(opponent);
        fireBestAttack();
        return;
      }
    
      if (p.aiState.strategy === 'retreat' && Math.random() > 0.3) return;
    
      const keys = Object.keys(p.keysToAttack).filter(k =>
        p.keysToAttack[k].name &&
        p.keysToAttack[k].stats &&
        !p.keysToAttack[k].stats.cooldown.switch
      );
      if (keys.length === 0) return;
    
      let pickKey;
      const hpRatio    = p.stats.hp       / p.baseStats.hp;
      const oppHpRatio = opponent.stats.hp / opponent.baseStats.hp;
    
      // COMBO SYSTEM — only start if close enough for the first step to make sense
      if (cfg.comboChance && Math.random() < cfg.comboChance && !p.aiState.comboSystem.isComboActive) {
        if (distance < 150 && hpRatio > 0.5) {
          p.aiState.comboSystem.isComboActive = true;
          p.aiState.comboSystem.comboChain    = generateCombo(p, opponent, distance);
          p.aiState.comboSystem.comboStep     = 0;
        }
      }
      if (p.aiState.comboSystem.isComboActive) {
        const candidate = executeComboStep(p, p.aiState.comboSystem.comboChain, keys);
        // Only commit to the combo step if we're actually in range for it
        pickKey = (candidate && isInRange(candidate) ) ? candidate : null;
        p.aiState.comboSystem.comboStep++;
        if (p.aiState.comboSystem.comboStep >= p.aiState.comboSystem.comboChain.length || !pickKey) {
          p.aiState.comboSystem.isComboActive = false;
          p.aiState.comboSystem.comboStep     = 0;
        }
      }
    
      // COUNTER PLAY — only revenge with attacks that can actually reach
      if (!pickKey && p.aiState.counterPlay.revengeMode && Math.random() < 0.7) {
        const rushKeys = keys.filter(k => {
          const cat = categorizeAttack(p.keysToAttack[k].name);
          return (cat.type === 'rush' || cat.type === 'ultimate') &&
                 p.keysToAttack[k].stats.dmg > 8 &&
                 isInRange(k);
        });
        if (rushKeys.length > 0) {
          pickKey = rushKeys[0];
          p.aiState.counterPlay.revengeMode = false;
        }
      }
    
      // HEALING — no range requirement, support moves work anywhere
      if (!pickKey && hpRatio < 0.4) {
        const healKeys = keys.filter(k => {
          const cat = categorizeAttack(p.keysToAttack[k].name);
          return cat.type === 'support' && p.keysToAttack[k].stats.heal > 0;
        });
        if (healKeys.length > 0 && Math.random() < 0.6)
          pickKey = healKeys[Math.floor(Math.random() * healKeys.length)];
      }
    
      // MOBILITY — no range requirement, these reposition the CPU
      if (!pickKey && (p.aiState.strategy === 'retreat' || (distance > 200 && Math.random() < 0.3))) {
        const mobKeys = keys.filter(k => categorizeAttack(p.keysToAttack[k].name).type === 'mobility');
        if (mobKeys.length > 0) pickKey = mobKeys[Math.floor(Math.random() * mobKeys.length)];
      }
    
      // BUFF — no range requirement, support moves work anywhere
      if (!pickKey && p.aiState.strategy === 'aggressive' && hpRatio > 0.6 && Math.random() < 0.2) {
        const buffKeys = keys.filter(k => {
          const cat = categorizeAttack(p.keysToAttack[k].name);
          return cat.type === 'support' && !p.keysToAttack[k].stats.heal;
        });
        if (buffKeys.length > 0) pickKey = buffKeys[Math.floor(Math.random() * buffKeys.length)];
      }
    
      // ULTIMATE FINISHER — only fire if in range
      if (!pickKey && oppHpRatio < 0.3 && Math.random() < cfg.accuracy) {
        const ultKeys = keys.filter(k => {
          const cat = categorizeAttack(p.keysToAttack[k].name);
          return cat.type === 'ultimate' &&
                 p.keysToAttack[k].stats.dmg > 10 &&
                 isInRange(k);
        });
        if (ultKeys.length > 0) pickKey = ultKeys[Math.floor(Math.random() * ultKeys.length)];
      }
    
      // DISTANCE-BASED SELECTION
      if (!pickKey) {
        const available = keys.map(k => ({
          key     : k,
          category: categorizeAttack(p.keysToAttack[k].name),
          damage  : p.keysToAttack[k].stats.dmg || 0
        }));
    
        const valid = available.filter(a =>
          distance >= a.category.minDist &&
          distance <= a.category.maxDist &&
          isAlignedForAttack(p, opponent, a.category)
        );
    
        const inRangeButMisaligned = available.filter(a =>
          distance >= a.category.minDist &&
          distance <= a.category.maxDist &&
          !isAlignedForAttack(p, opponent, a.category)
        );
    
        if (valid.length > 0) {
          if (p.aiState.strategy === 'aggressive') {
            valid.sort((a, b) => b.damage - a.damage);
            pickKey = valid[0].key;
          } else if (p.aiState.strategy === 'defensive') {
            const safe = valid.filter(a => ['projectile', 'area', 'trap'].includes(a.category.type));
            const pool = safe.length > 0 ? safe : valid;
            pickKey = pool[Math.floor(Math.random() * pool.length)].key;
          } else {
            pickKey = valid[Math.floor(Math.random() * valid.length)].key;
          }
        } else if (inRangeButMisaligned.length > 0) {
          const bestMisaligned = inRangeButMisaligned.sort((a, b) => b.damage - a.damage)[0];
          alignToOpponent(opponent, bestMisaligned.category);
          return;
        } else {
          rushOpponent(opponent);
          return;
        }
      }
      
      // DISTANCE-BASED SELECTION (modified)
        // if (!pickKey) {
        //   const playstyle = getPlaystyleForCPU(p);
        //   const behaviors = PLAYSTYLE_BEHAVIORS[playstyle] || {};
          
        //   const available = keys.map(k => ({
        //     key     : k,
        //     category: categorizeAttack(p.keysToAttack[k].name),
        //     damage  : p.keysToAttack[k].stats.dmg || 0
        //   }));
        
        //   const valid = available.filter(a =>
        //     distance >= a.category.minDist &&
        //     distance <= a.category.maxDist &&
        //     isAlignedForAttack(p, opponent, a.category)
        //   );
        
        //   // PLAYSTYLE FILTERING
        //   const preferredAttacks = valid.filter(a =>
        //     behaviors.priorityAttackTypes?.includes(a.category.type)
        //   );
          
        //   const avoidedAttacks = valid.filter(a =>
        //     behaviors.avoidAttackTypes?.includes(a.category.type)
        //   );
          
        //   const pool = preferredAttacks.length > 0 ? preferredAttacks : valid;
          
        //   if (pool.length > 0) {
        //     if (p.aiState.strategy === 'aggressive') {
        //       pool.sort((a, b) => b.damage - a.damage);
        //       pickKey = pool[0].key;
        //     } else {
        //       pickKey = pool[Math.floor(Math.random() * pool.length)].key;
        //     }
        //   }
        // }

    
      if (!pickKey) return;
    
      // if (p.keysToAttack[pickKey].name.toUpperCase().includes('FIREWORK')) {
      //   p.aiState.rotatingForAttack = p.keysToAttack[pickKey].name;
      //   setTimeout(() => { p.aiState.rotatingForAttack = null; }, 3000);
      // }
    
      intent.attacks[pickKey] = true;
      p.aiState.lastAttackTime = now;
      setTimeout(() => { intent.attacks[pickKey] = false; }, 100 + Math.random() * cfg.reactionJitter);
    
    }, cfg.actionInterval + (Math.random() * cfg.reactionJitter));
    
    
    cpuLoopHandles[slot] = { movement: moveHandle, action: actionHandle, reactive: reactiveHandle };
  });
}

function stopCPUControllers() {
  for (const slot of ['player1', 'player2']) {
    const h = cpuLoopHandles[slot];
    if (!h) continue;
    if (h.movement) clearInterval(h.movement);
    if (h.action)   clearInterval(h.action);
    if (h.reactive) clearInterval(h.reactive);   // <-- NEW: stop reactive loop
    cpuLoopHandles[slot] = null;
  }
}