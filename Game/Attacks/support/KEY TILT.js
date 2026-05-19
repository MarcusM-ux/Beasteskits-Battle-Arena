const keyOrder = ['balance', 'attack', 'defense', 'speed']

const keyMovesets = {
    balance: ['KEY TILT', 'BITE', 'LOCKDOWN', 'KEY STAB'],
    attack: ['KEY TILT', 'DRAG', 'TERROR', 'BITE'],
    defense: ['KEY TILT', 'LAVA TRAIL', 'CHARGE', 'HAYMAKER'],
    speed: ['KEY TILT', 'SPARKLE RUSH', 'ELECTRO WAVE', 'FLASH BANG']
}

const keyDescriptions = {
    balance: "All stats are 65! Balanced approach!",
    attack: "Attack and Speed up! Defense and HP down!",
    defense: "Defense and HP up! Attack and Speed down!",
    speed: "Speed greatly boosted! Everything else reduced!"
}

function changeStatus(player) {
    // Store old stats for comparison
    const oldStats = {
        hp: player.stats.hp,
        atk: player.stats.atk,
        def: player.stats.def,
        spd: player.stats.spd
    }

    // Reset to base stats
    player.stats.atk = player.baseStats.atk
    player.stats.def = player.baseStats.def
    player.stats.spd = player.baseStats.spd
    player.maxSpeed = player.baseStats.spd

    const keyConfig = {
        balance: { hp: 5, atk: 65, def: 65, spd: 1.2 },
        attack: { hp: 8, atk: 82, def: 30, spd: 1.5 },
        defense: { hp: 10, atk: 35, def: 82, spd: 1 },
        speed: { hp: 13, atk: 60, def: 45, spd: 2 }
    }

    const config = keyConfig[player.activeKeyBlade]
    player.stats.hp += config.hp
    player.stats.atk = config.atk
    player.stats.def = config.def
    player.stats.spd = config.spd
    player.maxSpeed = config.spd

    player.indicate(`${player.name} used ${player.activeKeyBlade.toUpperCase()} Key! ${keyDescriptions[player.activeKeyBlade]}`)

    // Get the new moveset for this key
    const newMoves = keyMovesets[player.activeKeyBlade]
    
    // Get ALL move slots and convert to array for proper indexing
    const moveSlots = Object.keys(player.keysToAttack)
    
    // Replace each move in order
    newMoves.forEach((moveName, index) => {
        const slotKey = moveSlots[index]
        
        // Safety checks
        if (!slotKey) {
            console.warn(`No slot available for move ${index}: ${moveName}`)
            return
        }
        
        if (!attackFunctions[moveName]) {
            console.warn(`Attack function not found: ${moveName}`)
            return
        }
        
        // Replace the move
        player.keysToAttack[slotKey].name = moveName
        player.keysToAttack[slotKey].stats = JSON.parse(JSON.stringify(attackFunctions[moveName].stats))
    })

    player.baseStats.hp = player.baseStats.hp
    updatePlayerList(player)
    player.updateLabel()
}

function switchToNextKey(player) {
    // Count how many keys are unlocked
    const unlockedKeyCount = Object.values(player.keyBlades).filter(k => !k.locked).length
    
    // If only one key is unlocked, don't switch
    if (unlockedKeyCount === 1) {
        player.indicate(`⚠️ Only one key available! Cannot switch!`)
        return
    }

    const currentIndex = keyOrder.indexOf(player.activeKeyBlade)
    let nextIndex = (currentIndex + 1) % keyOrder.length
    let attempts = 0
    
    // Keep searching for an unlocked key
    while (player.keyBlades[keyOrder[nextIndex]].locked && attempts < keyOrder.length) {
        nextIndex = (nextIndex + 1) % keyOrder.length
        attempts++
    }
    
    // If all keys are locked, stay on current key (shouldn't happen)
    if (attempts === keyOrder.length) {
        player.indicate(`All keys are locked!`)
        return
    }
    
    const nextKeyName = keyOrder[nextIndex]
    
    // Deactivate all keys
    Object.values(player.keyBlades).forEach(key => {
        key.active = false
    })
    
    // Activate the new key
    player.keyBlades[nextKeyName].active = true
    player.activeKeyBlade = nextKeyName
    player.indicate(`⚔️ Switched to ${nextKeyName.toUpperCase()} KEY!`)
    changeStatus(player)
}

registerAttack('KEY TILT', {
  stats: {
    type: 'Metal',
    cooldown: { time: 4000, switch: false }
  },
  action: (player, target) => {
    const specialKey = (player.isPlayer1) ? keybinds.attacks.r : keybinds.attacks.m

    // if (player.keyActive && specialKey && !player.specialKeyCooldown) {
    //     player.indicate(`${player.name} is using its Key Blade Special Strike!`)
        
    //     const dir = (player.facingRight) ? player.width : -player.width
    //     let YSpeedIncrement = 1.15
    //     const animationBox = {
    //         x: player.x + dir,
    //         y: player.y, // Start above the player
    //         width: player.width * 1.25,
    //         height: player.height,
    //         duration: 5000,
    //         color: 'gray',
    //         type: 'Metal',
    //         dmg: 6,
    //         vy: 2,
    //         vx: 2
    //     }

    //     const configures = {
    //         'balance' : {
    //             dmgMult : 1,
    //             duration: 50,
    //             length: 1050,
    //             hits: 1,
    //             color: '#e59d4c'
    //         },
    //         'attack' : {
    //             dmgMult : 1.8,
    //             duration: 80,
    //             length: 1680,
    //             hits : 2,
    //             color: '#e5594c'
    //         },
    //         'defense' : {
    //             dmgMult : 2,
    //             duration: 200,
    //             length: 4200,
    //             hits: 2,
    //             color: '#4cb6e5'
    //         },
    //         'speed' : {
    //             dmgMult : 0.8,
    //             duration: 20,
    //             length: 420,
    //             hits: 4,
    //             color: '#cfe54c'
    //         }
    //     }
        
    //     const config = configures[player.activeKeyBlade]
    //     stun(player, config.length)
    //     animationBox.dmg *= config.dmgMult
        
    //     const animation = spawnAnimation(
    //             './Effects/Keys/slash_key.png',
    //             animationBox.x,
    //             animationBox.y,
    //             126,
    //             126,
    //             105,
    //             126,
    //             21,
    //             config.duration,
    //             config.length,
    //             !player.facingRight
    //     );      

    //     let life = 0
    //     let hits = 0
        
    //     const damageInterval = setInterval(() => {
    //         // 1. Safety check: if animation is gone or finished
    //         if (!animation || (animation.isActive && Date.now() > animation.expiry)) {
    //             clearInterval(damageInterval);
    //             return;
    //         }

    //         // 2. Sync the frame calculation exactly like the draw loop does
    //         const now = Date.now();
    //         const timeElapsed = now - animation.startTime;
    //         const currentFrame = Math.floor(timeElapsed / animation.frameDuration);
    //         spawnEffect(animationBox.x,animationBox.y, animationBox.width, animationBox.height, config.color, config.duration)
            
    //         if (currentFrame >= 2 && currentFrame <= 20) {
    //             if (checkCollision(animationBox, target) && hits < config.hits) {
    //                 hits += 1
                    
    //                 playRetreivedAudio('quick-whoosh');
    //                 playRetreivedAudio('body-thud');
                    
    //                 stun(target, 1000);
    //                 attackResults(player, animationBox, target); // Apply the 15 damage
                    
    //                 target.x += (player.facingRight) ? 15 : -15
    //             }
    //         }
            
    //         if (life > 1500) {
    //             clearInterval(damageInterval);
    //         }
    //     }, 16);

    //     player.specialKeyCooldown = true
    //     setTimeout(()=>{
    //         player.specialKeyCooldown = false
    //         player.indicate(`${player.name} Key Blade Special is off cooldown!`)
    //     }, 8000)
        
    //     return
    // }else if (player.specialKeyCooldown && player.keyActive && specialKey) {
    //     player.indicate(`${player.name}'s Key Blade Special Strike is on cooldown!`)
    // }
        
    if (!player.keyActive) {
      player.keyActive = true
      player.keyBlades = {
        balance: { img: './Effects/Keys/balance_key', active: true, locked: false, cachedImage: null },
        attack: { img: './Effects/Keys/atk_key', active: false, locked: true, cachedImage: null },
        defense: { img: './Effects/Keys/def_key', active: false, locked: true, cachedImage: null },
        speed: { img: '/Effects/Keys/spd_key', active: false, locked: true, cachedImage: null },
      }
      
      // Pre-load images
      for (const blade of Object.values(player.keyBlades)) {
        const img = new Image()
        img.src = blade.img + '.png'
        blade.cachedImage = img
      }
      
      player.activeKeyBlade = 'balance'
      player.lastMoves = []
      player.targetHealthOnSequenceStart = target.stats.hp
      player.sequenceInProgress = false
      
      if (player.name === 'Keypike') {
        player.sequence = ['LOCKDOWN', 'KEY STAB']
        player.indicate(`${player.name} is prepared for collecting KEYS! The sequence is ${player.sequence}!`)
      }
      
      const checkForSequence = setInterval(() => {
        const allUnlocked = Object.values(player.keyBlades).every(k => !k.locked)
        if (allUnlocked || isGameOver) {
          clearInterval(checkForSequence)
          return
        }
        if (player.sequence) {
          checkSequence(player, target)
        }
      }, 100)
    } else {
      switchToNextKey(player) // ← UPDATED: Call with just player
    }
  
  }
})

function checkSequence(player, target) {
  const sequence = player.sequence
  const lastMoves = player.lastMoves
  
  if (!lastMoves || lastMoves.length < sequence.length) return
  
  const recentMoves = lastMoves.slice(-sequence.length)
  const sequenceMatches = recentMoves.every((move, index) => move === sequence[index])
  
  if (sequenceMatches) {
    const targetHealthLoss = player.targetHealthOnSequenceStart - target.stats.hp
    if (targetHealthLoss > 0) {
      unlockNextKey(player)
      // Reset for next sequence attempt
      player.lastMoves = []
      player.targetHealthOnSequenceStart = target.stats.hp
    } else {
      player.lastMoves = []
      player.targetHealthOnSequenceStart = target.stats.hp
    }
  }
}

function unlockNextKey(player) {
  for (let keyName of keyOrder) {
    if (player.keyBlades[keyName].locked) {
      player.keyBlades[keyName].locked = false
      // player.activeKeyBlade = keyName
      player.indicate(`🔓 ${keyName.toUpperCase()} KEY unlocked!`)
      break
    }
  }
}

// ← UPDATED FUNCTION: Switch to the next key in order, skipping locked ones
function switchToNextKey(player) {
  const currentIndex = keyOrder.indexOf(player.activeKeyBlade)
  let nextIndex = (currentIndex + 1) % keyOrder.length // Wrap around to start if at end
  let attempts = 0
  
  // Keep searching for an unlocked key
  while (player.keyBlades[keyOrder[nextIndex]].locked && attempts < keyOrder.length) {
    nextIndex = (nextIndex + 1) % keyOrder.length
    attempts++
  }
  
  // If all keys are locked, stay on current key
  if (attempts === keyOrder.length) {
    player.indicate(`All keys are locked!`)
    return
  }
  
  const nextKeyName = keyOrder[nextIndex]
  
  // Deactivate all keys
  Object.values(player.keyBlades).forEach(key => {
    key.active = false
  })
  
  // Activate the new key
  player.keyBlades[nextKeyName].active = true
  player.activeKeyBlade = nextKeyName
  player.indicate(`⚔️ Switched to ${nextKeyName.toUpperCase()} KEY!`)
  changeStatus(player)
}
