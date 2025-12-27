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
        moveset: ['CHOMP', 'BLOAT', 'STATIC'],
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
        stats: {hp: 50, atk: 70, def: 60, spd: 0.5},
        moveset: ['CHOMP', 'DASH', 'FIREBOLT'],
        type: 'Fire'
    },
    Stressnock : {
        image: retreiveImage('Stressnock'),
        stats: {hp: 63, atk: 53, def: 62, spd: 2},
        moveset: ['CHOMP', 'DASH', 'SHADOW STEP'],
        type: 'Dark'
    },
    Puffblitz : {
        image: retreiveImage('Puffblitz'),
        stats: {hp: 40, atk: 35, def: 26, spd: 4},
        moveset: ['WIND SLASH', 'WIND MILL', 'BITE', 'DASH'],
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
    Rockbo : {
        image: retreiveImage('Rockbo'),
        stats: {hp: 40, atk: 55, def: 42, spd: 1.5},
        moveset: ['CLAMP', 'FIREWORK', 'CHARGE'],
        type: 'Metal',
        spriteOffset: 45
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
}

// WHEN ATTACKING
const typeChart = {
    Electric: {strong: ['Dark', 'Water', 'Air', 'Metal', 'Beast'], weak: ['Fire', 'Light']},
    Dark: {strong: ['Basic', 'Plant'], weak: ['Electric', 'Fire', 'Light']},
    Water: {strong: ['Fire', 'Metal'], weak: ['Electric', 'Plant']},
    Basic: {strong: [''], weak: ['Dark', 'Fire', 'Metal']},
    Fire: {strong: ['Dark', 'Basic', 'Plant', 'Metal', 'Beast'], weak: ['Water', 'Air', 'Light', 'Electric']},
    Plant : {strong: ['Water', 'Light'], weak: ['Dark', 'Fire', 'Air', 'Metal']},
    Air: {strong: ['Fire', 'Plant'], weak: ['Dark', 'Electric']},
    Metal: {strong: [''], weak: ['Fire', 'Electric', 'Air']},
    Light: {strong: ['Dark'], weak: ['Electric', 'Fire', 'Plant']},
    Beast: {strong: ['Basic'], weak: ['Air']}
    // Add Earth
}