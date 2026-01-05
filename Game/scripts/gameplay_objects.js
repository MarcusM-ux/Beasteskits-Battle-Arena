const keybinds = {
    movement: {
        // Player 1
        w: false,
        a: false,
        s: false,
        d: false,

        // Player 2
        arrowup: false,
        arrowdown: false,
        arrowleft: false,
        arrowright: false
    },
    attacks: {
        // Player 1
        q: false,
        e: false,
        z: false,
        x: false,

        // Player 2
        j: false,
        k: false,
        l: false,
        m: false
    }
    
}

const creatures = {
    Abysmouth : {
        image: retreiveImage('Abysmouth'),
        stats: {hp: 65, atk: 43, def: 70, spd: 1},
        moveset: ['CHOMP', 'DASH', 'HARDEN', 'BITE'],
        type: 'Dark'
    },
    Exsis : {
        image: retreiveImage('Exsis'),
        stats: {hp: 45, atk: 56, def: 37, spd: 3},
        moveset: ['CHOMP', 'DODGE', 'STATIC', 'ELECTRO WAVE'],
        type: 'Electric'
    },
    Bloshrimp : {
        image: retreiveImage('Bloshrimp'),
        stats: {hp: 35, atk: 67, def: 30, spd: 3.5},
        moveset: ['PUDDLE', 'CHOMP', 'SNAP'],
        type: 'Water'
    },
    Magmos : {
        image: retreiveImage('Magmos'),
        stats: {hp: 50, atk: 70, def: 60, spd: 0.8},
        moveset: ['DASH','BODY SLAM', 'FIREBOLT', 'ERUPT'],
        type: 'Fire'
    },
    Stressnock : {
        image: retreiveImage('Stressnock'),
        stats: {hp: 70, atk: 53, def: 78, spd: 2},
        moveset: ['CHOMP', 'TENTACLE SLASH', 'SHADOW STEP', 'TOTALITY'],
        type: 'Dark'
    },
    Deadgrace : {
        image: retreiveImage('Deadgrace'),
        stats: {hp: 53, atk: 68, def: 40, spd: 0.5},
        moveset: ['CHOMP', 'TENTACLE SLASH', 'TOTALITY', 'FADE AWAY'],
        type: 'Dark'
    },
    Puffblitz : {
        image: retreiveImage('Puffblitz'),
        stats: {hp: 40, atk: 35, def: 26, spd: 4},
        moveset: ['WIND SLASH', 'WIND MILL', 'CHRONIC SLAM', 'DASH'],
        type: 'Air' 
    },
    Motomech : {
        image:  retreiveImage('Motomech'),
        stats: {hp: 60, atk: 45, def: 56, spd: 2},
        moveset: ['BEAM', 'DECONSTRUCT', 'CLAMP', 'DASH'],
        type: 'Metal'
    },
    Celestitoo : {
        image: retreiveImage('Celestitoo'),
        stats: {hp: 40, atk: 60, def: 33, spd: 1.5},
        moveset: ['BEAM', 'FLASH BANG', 'PECK'],
        type: 'Light'
    },
    Chaotiboom : {
        image: retreiveImage('Chaotiboom'),
        stats: {hp: 50, atk: 55, def: 40, spd: 1.5},
        moveset: ['CLAMP', 'FIREWORK', 'CHARGE'],
        type: 'Metal',
    },
    Pigment : {
        image: retreiveImage('Pigment'),
        stats: {hp: 50, atk: 50, def: 30, spd: 1},
        moveset: ['WIND SLASH', 'BODY SLAM', 'BEATDOWN', 'SNORT'], 
        type: 'Basic'
    },
    Shrimm : {
        image: retreiveImage('Shrimm'),
        stats: {hp: 25, atk: 28, def: 22, spd: 3},
        moveset: ['PUDDLE', 'SHADOW STEP', 'FADE AWAY', 'SHED'], 
        type: 'Water'
    },
    Snawlocker : {
        image: retreiveImage('Snawlocker'),
        stats: {hp: 80, atk: 75, def: 69, spd: 0.9},
        moveset: ['VICIOUS BITE','CHOMP', 'BODY SLAM', 'SNATCH'],
        type: 'Beast'
    },
    Aqualamity : {
        image: retreiveImage('Aqualamity'),
        stats: {hp: 55, atk: 60, def: 48, spd: 1.9},
        moveset: ['PUDDLE','BLOAT', 'SNATCH'],
        type: 'Mind'
    },

    Exzeenos : {
        image: retreiveImage('Exzeenos'),
        stats: {hp: 42, atk: 43, def: 60, spd: 2},
        moveset: ['STATIC', 'CHOMP', 'BLOAT'],
        type: 'Electric'
    },
    Snaretooth : {
        image: retreiveImage('Snaretooth'),
        stats: {hp: 55, atk: 60, def: 48, spd: 1.9},
        moveset: ['VICIOUS BITE', 'CHOMP', 'SNATCH'],
        type: 'Beast'
    },
    Towerx : {
        image: retreiveImage('Towerx'),
        stats: {hp: 70, atk: 62, def: 68, spd: 1.2},
        moveset: ['BEAM', 'DECONSTRUCT', 'DASH', 'CLAMP'],
        type: 'Metal'
    },
    Lipsysis : {
        image: retreiveImage('Lipsysis'),
        stats: {hp: 65, atk: 42, def: 65, spd: 1},
        moveset: ['HARDEN', 'CHOMP', 'BLOAT', 'BITE'],
        type: 'Dark'
    },
    Bornvee : {
        image: retreiveImage('Bornvee'),
        stats: {hp: 56, atk: 52, def: 50, spd: 1.3},
        moveset: ['FLASH BANG', 'BEAM', 'PECK'],
        type: 'Dark'
    },
    Magmolt : {
        image: retreiveImage('Magmolt'),
        stats: {hp: 65, atk: 53, def: 50, spd: 1},
        moveset: ['FIREBOLT', 'CHARGE', 'ERUPT', 'BEATDOWN'],
        type: 'Fire'
    },
    Hoodfur : {
        image: retreiveImage('Hoodfur'),
        stats: {hp: 43, atk: 72, def: 40, spd: 3.5},
        moveset: ['FIREBOLT', 'CHARGE', 'ERUPT', 'BEATDOWN'],
        type: 'Air'
    },
    Rockbo : {
        image: retreiveImage('Rockbo'),
        stats: {hp: 48, atk: 62, def: 55, spd: 1.6},
        moveset: ['DECONSTRUCT', 'FIREWORK', 'DASH', 'CLAMP'],
        type: 'Metal'
    }
}

// sa => Strong Against (This beasteskit is attack another beasteskit) (2x)
// wa => Weak Against (This beasteskit is attack another beasteskit) (0.5x)
// r => Resists (This beasteskit is being attack by another beasteskit)
// s => Sensitive To (This beasteskit is attack another beasteskit)
const advancedTypeChart = {
    Basic: {sa: [''], wa: ['Metal'], r: ['Dark'], s: ['Beast']},
    Fire: {sa: ['Plant', 'Metal', 'Dark', 'Beast'], wa: ['Water', 'Light'], r: ['Electric', 'Metal', 'Dark'], s: ['Air', 'Water']},
    Water: {sa: ['Fire', 'Metal'], wa: ['Plant'], r: ['Plant', 'Fire', 'Metal'], s: ['Electric', 'Plant']},
    Plant: {sa: ['Water', 'Light'], wa: ['Dark', 'Fire', 'Air'], r: ['Water', 'Light'], s: ['Fire', 'Dark', 'Air']},
    Dark: {sa: ['Light', 'Plant'], wa: ['Basic', 'Fire', 'Light', 'Electric', 'Beast'], r: ['Dark'], s: ['Fire', 'Light']},
    Electric: {sa: ['Beast', 'Air', 'Water', 'Metal'], wa: ['Fire'], r: ['Beast'], s: ['']},
    Light: {sa: ['Dark'], wa: ['Plant'], r: ['Dark', 'Fire', 'Electric'], s: ['Plant']},
    Air: {sa: ['Plant', 'Fire'], wa: ['Electric', 'Metal'], r: ['Beast'], s: ['Electric']},
    Metal: {sa: [''], wa: ['Fire', 'Water'], r: ['Beast', 'Mind'], s: ['Electric', 'Fire', 'Water']},
    Beast: {sa: ['Basic'], wa: ['Air', 'Metal'], r: ['Dark'], s: ['Electric', 'Fire', 'Mind']},
    Mind: {sa: ['Beast'], wa: [''], r: ['Basic'], s: ['Beast']}
}