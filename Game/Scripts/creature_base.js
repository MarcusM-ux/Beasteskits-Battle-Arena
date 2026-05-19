// const CLASSES = [
//     "Tank",        // high HP/DEF, absorbs damage
//     "Bruiser",     // tanky + deals damage
//     "Damage",      // high offense, lower survivability
//     "Harasser",    // speed + pressure + mobility
//     "Utility",     // buffs, debuffs, control
//     "Sniper",      // ranged, spacing, precision
//     "Controller"   //affects the area
// ]

const creatures = {
  Random: {
    image: retreiveImage('Random'),
    stats: { hp: 52, atk: 90, def: 58, spd: 1.5 },
    moveset: ['BEATDOWN', 'BODY SLAM', 'FADE AWAY', 'SHADOW STEP'],
    type: 'Basic',
    title: 'Unknown',
    class: 'Bruiser'
  },
  Abysmouth: {
    image: retreiveImage('Abysmouth'),
    stats: { hp: 70, atk: 55, def: 60, spd: 1.15 },
    moveset: ['LIFE GRASP', 'PHASE', 'HAND EXTENSTION', 'RURAL PUNISHMENT', 'PUNCH'],
    type: 'Dark',
    title: 'Mad Mouth',
    class: 'Tank'
  },
  // Exsis: {
  //   image: retreiveImage('Exsis'),
  //   stats: { hp: 45, atk: 60, def: 45, spd: 3.2 },
  //   moveset: ['ELECTRO WAVE', 'STATIC', 'FLASH BANG', 'DASH'],
  //   type: 'Electric',
  //   title: 'Sharp Thundering',
  //   class: 'Harasser'
  // },
  // Bloshrimp: {
  //   image: retreiveImage('Bloshrimp'),
  //   stats: { hp: 55, atk: 85, def: 30, spd: 3.3 },
  //   moveset: ['SNAP', 'BITE', 'PUDDLE', 'DASH'],
  //   type: 'Water',
  //   title: 'Blue Shrimp',
  //   class: 'Damage'
  // },
  Magmos: {
    image: retreiveImage('Magmos'),
    stats: { hp: 80, atk: 78, def: 70, spd: 1.1 },
    moveset: ['CONCENTRATED BURST', 'BODY SLAM', 'SCORCHED EARTH', 'ERUPT', 'QUICK SHOT'],
    type: 'Fire',
    title: 'Walking Valcano',
    class: 'Bruiser'
  },
  Stressnock: {
    image: retreiveImage('Stressnock'),
    stats: { hp: 78, atk: 48, def: 74, spd: 1.2 },
    moveset: ['CHOMP', 'TENTACLE SLASH', 'SHADOW STEP', 'TOTALITY', 'GUARD POP'],
    type: 'Dark',
    title: 'Tentacled Warden',
    class : 'Tank'
  },
  // Deadgrace: {
  //   image: retreiveImage('Deadgrace'),
  //   stats: { hp: 56, atk: 60, def: 50, spd: 1.5 },
  //   moveset: ['VILE THRUST', 'SHADOW STEP', 'FADE AWAY', 'STRIKE'],
  //   type: 'Dark',
  //   title: 'Dark Disgrace',
  //   class : 'Damage'
  // },
  Puffblitz: {
    image: retreiveImage('Puffblitz'),
    stats: { hp: 53, atk: 82, def: 50, spd: 1.8 },
    moveset: ['FORCEFUL GUST', 'SUCTION PUNCH', 'FLASH STEP', 'BLITZ', 'SPINNING PUSH'],
    type: 'Air',
    title: 'Windy Bodybuilder',
    class : 'Damage'
  },
  Motomech: {
    image: retreiveImage('Motomech'),
    stats: { hp: 60, atk: 72, def: 62, spd: 1.4 },
    moveset: ['BEAM', 'CLAMP', 'DECONSTRUCT', 'STEAM ROLL', 'FLASH BEAM'],
    type: 'Metal',
    title: 'Robotic',
    class: 'Sniper' 
  },
  // Celestitoo: {
  //   image: retreiveImage('Celestitoo'),
  //   stats: { hp: 48, atk: 50, def: 50, spd: 2.8 },
  //   moveset: ['BEAM', 'PECK', 'FLASH BANG', 'DASH'],
  //   type: 'Light',
  //   title: 'Wing of Light',
  //   class: 'Harasser' // mobile support/control
  // },
  Chaotiboom: {
    image: retreiveImage('Chaotiboom'),
    stats: { hp: 60, atk: 75, def: 50, spd: 1.5 },
    moveset: ['FIREWORK', 'CHARGE', 'EXPLOSION', 'SWIPE', 'UPSWIPE'],
    type: 'Metal',
    title: 'Chaotic Firecracker',
    class: 'Damage' // high ATK; explosive kit
  },
  Pigment: {
    image: retreiveImage('Pigment'),
    stats: { hp: 70, atk: 65, def: 52, spd: 1.2 },
    moveset: ['BODY SLAM', 'TAUNT', 'BEATDOWN', 'WIND SLASH', 'CLOUDY PUFF'],
    type: 'Basic',
    title: 'Floaty Boar',
    class: 'Bruiser'
  },
  // Shrimm: {
  //   image: retreiveImage('Shrimm'),
  //   stats: { hp: 45, atk: 60, def: 55, spd: 3.2 },
  //   moveset: ['PUDDLE', 'SHADOW STEP', 'SHED', 'FADE AWAY'],
  //   type: 'Water',
  //   title: 'Small Shrimp',
  //   class: 'Utility' 
  // },
  Snawlocker: {
    image: retreiveImage('Snawlocker'),
    stats: { hp: 80, atk: 73, def: 68, spd: 1 },
    moveset: ['VICIOUS BITE', 'BODY SLAM', 'SNATCH', 'SCREAM'],
    type: 'Beast',
    title: 'Heavy Jawed',
    class: 'Tank' 
  },
  // Aqualamity: {
  //   image: retreiveImage('Aqualamity'),
  //   stats: { hp: 60, atk: 65, def: 56, spd: 1.9 },
  //   moveset: ['PUDDLE', 'BLOAT', 'SNATCH', 'BITE'],
  //   type: 'Mind',
  //   title: 'One Eyed Jellyfish',
  //   class: 'Balanced' // BLOAT suggests sustain/support
  // },
  // Exembee: {
  //   image: retreiveImage('Exembee'),
  //   stats: { hp: 65, atk: 55, def: 60, spd: 2 },
  //   moveset: ['STATIC', 'CHOMP', 'BLOAT', 'OVERCLOCK'],
  //   type: 'Electric',
  //   title: 'Sparkling Flight',
  //   class: 'Balanced'
  // },
  Snaretooth: {
    image: retreiveImage('Snaretooth'),
    stats: { hp: 65, atk: 69, def: 58, spd: 1.9 },
    moveset: ['WHOLE BODY ENGLUF', 'VENOMOUS PRICK', 'ABYSS ABSORPTION', 'ABYSSAL SHOT'],
    type: 'Beast',
    title: 'Trapfanged Abyss',
    class: 'Bruiser' 
  },
  Todoboid: {
    image: retreiveImage('Todoboid'),
    stats: { hp: 70, atk: 68, def: 58, spd: 1.2 },
    moveset: ['IRON PIERCE', 'RECONSTRUCT', 'CLAP', 'METAL CLUBS', 'ENCHANTING GLARE'],
    // IRON PIERCE > BEAM, ENCHANTING GLARE > CLAMP, 
    type: 'Metal',
    title: 'Titan Crawler',
    class: 'Bruiser' 
  },
  // Lipsysis: {
  //   image: retreiveImage('Lipsysis'),
  //   stats: { hp: 78, atk: 30, def: 72, spd: 1.4 },
  //   moveset: ['HARDEN', 'SHED', 'VILE CALAMITY', 'VOID BURST'],
  //   type: 'Dark',
  //   title: 'Void Shard',
  //   class: 'Tank'
  // },
  Bornoglow: {
    image: retreiveImage('Bornoglow'),
    stats: { hp: 62, atk: 65, def: 60, spd: 1.3 },
    moveset: ['FLASH BANG', 'BEAM', 'SHADOW GLIDE', 'ECHO BITE', 'FADE AWAY'],
    type: 'Dark',
    title: 'Darkest Light',
    class: 'Sniper'
  },
  Magmochef: {
    image: retreiveImage('Magmochef'),
    stats: { hp: 78, atk: 72, def: 52, spd: 1.0 },
    // moveset: ['FIREBOLT', 'BEATDOWN', 'LAVA TRAIL', 'TAUNT'],
    moveset: ['CONCOCTION', 'EXPLOSION', 'TRAILBLAZE', 'DISMEMBERING SLASHES'], // SLASH
    type: 'Fire',
    title: 'Chef\'s Ember',
    class: 'Bruiser' // high HP; strong offense
  },
  // Hoodfur: {
  //   image: retreiveImage('Hoodfur'),
  //   stats: { hp: 50, atk: 78, def: 45, spd: 3.6 },
  //   moveset: ['WIND SLASH', 'WIND MILL', 'DASH', 'STRIKE'],
  //   type: 'Air',
  //   title: 'Woolen Sage',
  //   class: 'Harasser' // high ATK + very fast (Harasser hybrid)
  // },
  // Rockbo: {
  //   image: retreiveImage('Rockbo'),
  //   stats: { hp: 55, atk: 64, def: 60, spd: 1.6 },
  //   moveset: ['RECONSTRUCT', 'DASH', 'CLAMP', 'RUSH DRILL'],
  //   type: 'Metal',
  //   spriteOffset: 45,
  //   title: 'Rocket Ram',
  //   class: 'Damage' // balanced with mobility
  // },
  Keypike: {
    image: retreiveImage('Keypike'),
    stats: { hp: 55, atk: 75, def: 54, spd: 1.6 },
    moveset: ['KEY TILT', 'BITE', 'LOCKDOWN', 'KEY STAB', 'KEY BLADE STRIKE'],
    type: 'Dark',
    title: 'Keyserpent',
    class: 'Utility'
  },
  Trimmer: {
    image: retreiveImage('Trimmer'),
    stats: { hp: 73, atk: 80, def: 48, spd: 1.1 },
    moveset: ['RUSH DRILL', 'VICIOUS BEAST', 'LUNGE', 'STRIKE'],
    type: 'Beast',
    title: 'Drillhound',
    class: 'Bruiser'
  },
  // Gordol: {
  //   image: retreiveImage('Gordol'),
  //   stats: { hp: 66, atk: 75, def: 60, spd: 1.1 },
  //   moveset: ['VILE THRUST', 'COUNTER', 'STRIKE', 'SNATCH'],
  //   type: 'Dark',
  //   title: 'Grim Knight',
  //   class: 'Tank'
  // },
  // Slugut: {
  //   image: retreiveImage('Slugut'),
  //   stats: { hp: 42, atk: 30, def: 85, spd: 1 },
  //   moveset: ['CHOMP', 'BITE', 'SHED', 'SNATCH'],
  //   type: 'Bug',
  //   title: 'Sneaky Stealer Slugish',
  //   class: 'Utility'
  // },
  Hankclaw: {
    image: retreiveImage('Hankclaw'),
    stats: { hp: 60, atk: 70, def: 44, spd: 2.8 },
    moveset: ['CLAW STRIKE', 'SNAP', 'DASH', 'COUNTER'],
    type: 'Fighting',
    title: 'One Clawed Victimiser',
    class: 'Harasser' 
  },
  // Cornickelle: {
  //   image: retreiveImage('Cornickelle'),
  //   stats: { hp: 48, atk: 55, def: 50, spd: 3.2 },
  //   moveset: ['VENOMOUS PRICK', 'WRAP', 'SHED', 'DASH'],
  //   type: 'Bug',
  //   title: 'Toxic Suprise',
  //   class: 'Harasser'
  // },
  Zobirdee: {
    image: retreiveImage('Zobirdee'),
    stats: { hp: 62, atk: 54, def: 68, spd: 1.5 },
    moveset: ['HYPE', 'BREAK DANCE', 'FLASH BANG', 'SPARKLE RUSH', 'DISC SHOT'],
    type: 'Basic',
    title: 'Poprock Birdy',
    class: 'Bruiser'
  },
  Sandorin: {
    image: retreiveImage('Sandorin'),
    stats: { hp: 65, atk: 82, def: 42, spd: 1.1 },
    moveset: ['VICIOUS RAM', 'VILE THRUST', 'ADRENALINE', 'MUD LAUNCH'],
    type: 'Ground',
    title: 'Sabortooth',
    class: 'Damage'
  },
  // Agnotic: {
  //   image: retreiveImage('Agnotic'),
  //   stats: { hp: 62, atk: 42, def: 58, spd: 1.9 },
  //   moveset: ['ORBITAL STRIKE', 'TELEPORT', 'TELE SLAM', 'DRAG'],
  //   type: 'Metal',
  //   title: 'Sentient Robot',
  //   class: 'Utility' // teleport + control
  // },
  // Cosmos: {
  //   image: retreiveImage('Cosmos'),
  //   stats: { hp: 68, atk: 72, def: 52, spd: 1.1 },
  //   moveset: ['DASH', 'STAR-PLATE', 'COSMIC GULP', 'HORN DRILL'],
  //   type: 'Beast',
  //   title: 'Cosmic Three Horned',
  //   class: 'Brusier' 
  // },
  Turtledome: {
    image: retreiveImage('Turtledome'),
    stats: { hp: 72, atk: 80, def: 68, spd: 1.1 },
    moveset: ['HAYMAKER', 'ROOT HOOK', 'SHELL BUNKER', 'SHELL RICOCHET', 'QUICK PUNCH'],
    type: 'Plant',
    title: 'Glamrock Boxer',
    class: 'Tank' // very sturdy with strong ATK
  },
  Hunvergent: {
    image: retreiveImage('Hunvergent'),
    stats: { hp: 62, atk: 53, def: 72, spd: 1.15 },
    moveset: ['SHADOW SNARE', 'VOID PULSE', 'TRANSPORT', 'RADIUS'],
    type: 'Dark',
    title: 'Dark Vengenace',
    class: 'Tank'
  },
  "Dee Dee Royal": {
    image: retreiveImage('Dee Dee Royal'),
    stats: { hp: 58, atk: 65, def: 75, spd: 1.5 },
    moveset: ['WIND PUSH', 'DOUGHBOY DROP', 'WIND PULSE RAY', 'BUFF UP'],
    type: 'Air',
    title: 'Doughboy',
    class: 'Balanced'
  },
  // Typhern: {
  //   image: retreiveImage('Typhern'),
  //   stats: { hp: 52, atk: 43, def: 75, spd: 1.4 },
  //   moveset: ['PERMAFROST', 'ICICLE SHARD', 'HARDEN', 'FLASH FREEZE'],
  //   type: 'Frost',
  //   title: 'Enclosed Frost Bug',
  //   class: 'Tank' // high DEF, control kit
  // },
  Auntos: {
    image: retreiveImage('Auntos'),
    stats: { hp: 56, atk: 78, def: 55, spd: 1.9 },
    moveset: ['PSY-SHREDDER', 'MIND WARP', 'GRAVITY WELL', 'CLAW SWIPE TITAN', 'THIN SWIPE'],
    type: 'Mind',
    title: 'Ancient Rock',
    class: 'Controller' // high ATK and control spells
  },
  // Thorack: {
  //   image: retreiveImage('Thorack'),
  //   stats: { hp: 52, atk: 58, def: 82, spd: 1.3 },
  //   moveset: ['LUNGE', 'ABYSS SHIELD', 'SHADOW TRAMPLE', 'HORN OF MALICE'],
  //   type: 'Dark',
  //   title: 'Dark Horn',
  //   class: 'Damage'
  // },
  Galmous: {
    image: retreiveImage('Galmous'),
    stats: { hp: 72, atk: 54, def: 49, spd: 1.6 },
    moveset: ['ABYSS SHIELD', 'SINGULARITY PUNCH', 'SEISMIC TOSS', 'MAGNETIC PULL', 'RUSH'],
    type: 'Metal',
    title: 'Internal Abyss',
    class: 'Damage'
  },
  Lummywhale: {
    image: retreiveImage('Lummywhale'),
    stats: { hp: 66, atk: 59, def: 84, spd: 1 },
    moveset: ['FLASH FREEZE', 'ABYSSAL BELLOW', 'PRESSURE WASH', 'HEAVY ANCHOR', 'AQUA SHOT'],
    type: 'Water',
    title: 'Abnormal Marine Whale',
    class: 'Tank'
  },
  Enginene: {
    image: retreiveImage('Enginene'),
    stats: { hp: 56, atk: 63, def: 69, spd: 2.2 },
    moveset: ['DECONSTRUCT', 'EXHAUST PLUME', 'OVERHEAT', 'PISTON STRIKE'],
    type: 'Metal',
    title: 'Hot Engine',
    class: 'Harasser'
  },
  // Inceli: {
  //   image: retreiveImage('Inceli'),
  //   stats: { hp: 54, atk: 62, def: 73, spd: 2.8 },
  //   moveset: ['FLIGHT', 'BUG BITE', 'ACID SPIT', 'INFESTATION'],
  //   type: 'Bug',
  //   title: 'Mutant Fly',
  //   class: 'Harasser'
  // },
  Stardust: {
    image: retreiveImage('Stardust'),
    stats: { hp: 58, atk: 72, def: 64, spd: 3.2 },
    moveset: ['FLASH BANG', 'NOIR SLASH', 'SHOOTING STAR', 'SPIN SNIPE DAMAGE', 'RUSH'],
    type: 'Light',
    title: 'Dark Arm Star',
    class: 'Damage'
  },
  Peekaboo: {
    image: retreiveImage('Peekaboo'),
    stats: { hp: 68, atk: 53, def: 79, spd: 1.2 },
    moveset: ['SULK', 'ARM STRIKES', 'TERROR', 'TERROR UNLEASHED'],
    type: 'Dark',
    title: 'Mutant Abomination',
    class: 'Tank'
  },
  Ebnob: {
    image: retreiveImage('Ebnob'),
    stats: { hp: 75, atk: 52, def: 54, spd: 1.5 },
    moveset: ['EXPERIMENTAL CRISIS', 'POLLEN CLOUD', 'CONCOCTION', 'PROJECT BEAM'],
    type: 'Plant',
    title: 'Scientistic',
    class: 'Utility'
  },
    Marcovous: {
    image: retreiveImage('Marcovous'),
    stats: { hp: 83, atk: 70, def: 53, spd: 1.4 },
    moveset: ['LAVA TRAIL', 'VICIOUS BITE', 'MAGMA BURST', 'OVERHEAT'],
    type: 'Fire',
    title: 'Hot Dragon',
    class: 'Damage'
  },
    Cragmaw: {
    image: retreiveImage('Cragmaw'),
    stats: { hp: 80, atk: 54, def: 72, spd: 1.1 },
    moveset: ['MULTI CHOMPS', 'HARDEN', 'RUBBLE THROW', 'CRUSHING WEIGHT', 'CHOMP'],
    type: 'Ground',
    title: 'Living Pitfall',
    class: 'Tank'
  },
  //   Umbrail: {
  //   image: retreiveImage('Umbrail'),
  //   stats: { hp: 56, atk: 75, def: 68, spd: 2.1 },
  //   moveset: ['ABYSSAL CLONES', 'VOID PULSE', 'FADE AWAY', 'MIND WARP'],
  //   type: 'Dark',
  //   title: 'Cloaked Unfortune',
  //   class: 'Utility'
  // },
  //   Sharnide: {
  //   image: retreiveImage('Sharnide'),
  //   stats: { hp: 60, atk: 88, def: 45, spd: 1.4 },
  //   moveset: ['BEAM', 'FLASH BANG', 'ORBITAL STRIKE', 'STAR-PLATE'],
  //   type: 'Light',
  //   title: 'Astral Weaver',
  //   class: 'Sniper'
  // },
  //   Burnuckle: {
  //   image: retreiveImage('Burnuckle'),
  //   stats: { hp: 50, atk: 95, def: 44, spd: 3.5 },
  //   moveset: ['OVERHEAT', 'CHARGE', 'HAYMAKER', 'FIREBOLT'],
  //   type: 'Fire',
  //   title: 'Blazing Projectile',
  //   class: 'Damage'
  // },
  Arsonal : {
    image: retreiveImage('Arsonal'),
    stats: { hp: 70, atk: 83, def: 68, spd: 1.2 },
    moveset: ['SLASH', 'VIOLENT RAM', 'SHARPEN', 'SPINNING DRILL RUSH'], 
    
    type: 'Metal',
    title: 'Catastrophic Warlord',
    class: 'Bruiser'
  },
    Mounttana : {
        image: retreiveImage('Mounttana'),
        stats: { hp: 68, atk: 52, def: 75, spd: 1.6 },
        moveset: ['MOUNTAIN BARRIERS', 'EARTHQUAKE', 'SNOWFALL', 'MOUNTAIN RISE'],
        type: 'Ground',
        title: 'Frosty Mountain',
        class: 'Controller'
    },
    Riftwing : {
        image: retreiveImage('Riftwing'),
        stats: { hp: 68, atk: 62, def: 52, spd: 2.7 },
        moveset: ['PORTAL STRIKE', 'QUICK RIFT', 'TALON SWEEP', 'GRAND DISAPPEARANCE'],
        type: 'Mind',
        title: 'Portal Wing',
        class: 'Utility'
    },
    Desyncton : {
        image: retreiveImage('Desyncton'),
        stats: { hp: 64, atk: 82, def: 70, spd: 1.5 },
        moveset: ['ASYNC', 'SHINE', 'DIG', 'DUAL DRIVE'],
        type: 'Mind',
        title: 'Pink Diamond Diver',
        class: 'Utility'
    },
    "E.A.B.O.R.N" : {
        image: retreiveImage('E.A.B.O.R.N'),
        stats: { hp: 78, atk: 52, def: 68, spd: 1.4 },
        moveset: ['SLASH', 'OVERCLOCK', 'OVERHEAT', 'ARSONAL SWITCH'],
        type: 'Metal',
        title: 'Deadly Terminator',
        class: 'Tank',
        custom: {
            width: 64,
        }
    },
    "Hovernet" : {
        image: retreiveImage('Hovernet'),
        stats: { hp: 68, atk: 74, def: 78, spd: 1.7 },
        moveset: ['TATICAL HEADBUTT', 'DUAL DRIVE', 'ENGINE OVERRIDE', 'QUICK PERCEPTION', 'RADAR'],
        // ENGINE OVERRIDE
        // QUICK PERCEPTION
        
        type: 'Metal',
        title: 'Hovering Agent',
        class: 'Balanced'
    },
    "Thornspire" : {
        image: retreiveImage('Thornspire'),
        stats: { hp: 64, atk: 52, def: 78, spd: 1.1 },
        moveset: ['POISONOUS SPIKES', 'WRAP', 'SHED', 'GOO LEAK', 'VENOMOUS PRICK'],
        // POISONOUS SPIKES > HARDEN
        // GOO LEAK
        
        type: 'Bug',
        title: 'Slug Of Spike',
        custom: {
            width: 100,
        },
        class: 'Controller'
        
    },

    // "Wargypt" : {
    //     image: retreiveImage('Wargypt'),
    //     stats: { hp: 68, atk: 65, def: 75, spd: 1.2 },
    //     moveset: [''],
        
    //     type: 'Ancient',
    //     title: 'Abandon Sentinel',
    //     class: 'Tank'
    // }
    // "Bootolux" : {
    //     image: retreiveImage('Bootolux'),
    //     stats: { hp: 60, atk: 72, def: 54, spd: 1.5 },
    //     moveset: ['RUSH', 'ABYSSAL CLONES', 'NOXIOUS EXPOSURE', 'SINGULARITY PUNCH'],
    //     // NIGHTMARE VALLEY > SINGULARITY PUNCH
        
    //     type: 'Toxic',
    //     title: 'Noxious Shadow',
    //     class: 'Bruiser'
        
    // },

    // "King Choo" : {
    //     image: retreiveImage('King Choo'),
    //     stats: { hp: 42, atk: 68, def: 48, spd: 1.35 },
    //     moveset: ['ROYAL SCEPTRE', 'SHADOW REIGN', 'CROWNED ROAM', 'EXECUTION'],
    //     type: 'Dark',
    //     title: 'Crowned Roamer',
    //     class: 'Damage'
    // },
    // "Kintoris": {
    //     image: retreiveImage('Kintoris'),
    //     stats: { hp: 70, atk: 65, def: 78, spd: 1.25 },
    //     moveset: ['DUST CLOUD', 'SAND SHIELD', 'ERODING SLAM', 'QUICKSAND'],
    //     type: 'Ground',
    //     title: 'Erroded',
    //     class: 'Tank'
    // },
    // "Gadblade": {
    //     image: retreiveImage('Gadblade'),
    //     stats: { hp: 60, atk: 65, def: 58, spd: 1.6 },
    //     moveset: ['RUSHING TIDE', 'SERRATED BITE', 'HYDRO BLADE', 'WHIRLPOOL REPELLENT'],
    //     type: 'Water',
    //     title: 'Sharp Fanged Aqua',
    //     class: 'Brusier'
    // },
    // "Calefigure": {
    //     image: retreiveImage('Calefigure'),
    //     stats: { hp: 58, atk: 78, def: 56, spd: 2.45 },
    //     moveset: ['OVERDRIVE', 'GEAR SHRED', 'STATIC DISCHARGE', 'LIGHTNING DASH'],
    //     type: 'Metal',
    //     title: 'Mechanical Speed Burst',
    //     class: 'Harasser'
    // },
    // "Torpopot": {
    //     image: retreiveImage('Torpopot'),
    //     stats: { hp: 68, atk: 55, def: 75, spd: 1.1 },
    //     moveset: ['IRON ROOTS', 'POLLEN SHIELD', 'THORN LAUNCH', 'FLOWER BLOOM'],
    //     type: 'Plant',
    //     title: 'Iron Flower',
    //     class: 'Controller'
    // },
    // "Rawvern": {
    //     image: retreiveImage('Rawvern'),
    //     stats: { hp: 65, atk: 79, def: 55, spd: 1.55 },
    //     moveset: ['FERAL LUNGE', 'VICIOUS BEAST', 'TERRIFYING HOWL', 'BEASTLY ENDURANCE'],
    //     type: 'Beast',
    //     title: 'Long Claw Hound',
    //     class: 'Brusier'
    // },
    // "Dimlisp": {
    //     image: retreiveImage('Dimlisp'),
    //     stats: { hp: 55, atk: 45, def: 58, spd: 2 },
    //     moveset: ['FLICKER', 'BLINDING WICK', 'WAX MELT', 'GUIDING LIGHT'],
    //     type: 'Light',
    //     title: 'Dull Candle',
    //     class: 'Utility'
    // }
}