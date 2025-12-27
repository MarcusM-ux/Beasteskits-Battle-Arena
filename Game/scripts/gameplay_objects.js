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
        moveset: ['CHOMP', 'BLOAT', 'STATIC', 'ELECTRO WAVE'],
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
        moveset: ['CHOMP', 'DASH', 'FIREBOLT', 'ERUPT'],
        type: 'Fire'
    },
    Stressnock : {
        image: retreiveImage('Stressnock'),
        stats: {hp: 63, atk: 53, def: 62, spd: 2},
        moveset: ['CHOMP', 'TENTACLE SLASH', 'SHADOW STEP', 'TOTALITY'],
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
        stats: {hp: 40, atk: 55, def: 40, spd: 1.5},
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
}

// WHEN ATTACKING
// const typeChart = {
//     Electric: {strong: ['Dark', 'Water', 'Air', 'Metal', 'Beast'], weak: ['Fire', 'Light']},
//     Dark: {strong: ['Basic', 'Plant'], weak: ['Electric', 'Fire', 'Light']},
//     Water: {strong: ['Fire', 'Metal'], weak: ['Electric', 'Plant']},
//     Basic: {strong: [''], weak: ['Dark', 'Fire', 'Metal']},
//     Fire: {strong: ['Dark', 'Basic', 'Plant', 'Metal', 'Beast'], weak: ['Water', 'Air', 'Light', 'Electric']},
//     Plant : {strong: ['Water', 'Light'], weak: ['Dark', 'Fire', 'Air', 'Metal']},
//     Air: {strong: ['Fire', 'Plant'], weak: ['Dark', 'Electric']},
//     Metal: {strong: [''], weak: ['Fire', 'Electric', 'Air']},
//     Light: {strong: ['Dark'], weak: ['Electric', 'Fire', 'Plant']},
//     Beast: {strong: ['Basic'], weak: ['Air']}
//     // Add Earth
// }

// sa => Strong Against (This beasteskit is attack another beasteskit) (2x)
// wa => Weak Against (This beasteskit is attack another beasteskit) (0.5x)
// r => Resists (This beasteskit is being attack by another beasteskit)
// s => Sensitive To (This beasteskit is attack another beasteskit)
// const allTypes = ['Electric', 'Dark', 'Water', 'Basic', 'Fire', 'Plant', 'Air', 'Metal', 'Light', 'Beast']
const advancedTypeChart = {
    Basic: {sa: [''], wa: ['Metal'], r: ['Dark'], s: ['Beast']},
    Fire: {sa: ['Plant', 'Metal', 'Dark', 'Beast'], wa: ['Water', 'Light'], r: ['Electric', 'Metal', 'Dark'], s: ['Air', 'Water']},
    Water: {sa: ['Fire', 'Metal'], wa: ['Plant'], r: ['Plant', 'Fire', 'Metal'], s: ['Electric', 'Plant']},
    Plant: {sa: ['Water', 'Light'], wa: ['Dark', 'Fire', 'Air'], r: ['Water', 'Light'], s: ['Fire', 'Dark', 'Air']},
    Dark: {sa: ['Light', 'Plant'], wa: ['Basic', 'Fire', 'Light', 'Electric', 'Beast'], r: ['Dark'], s: ['Fire', 'Light']},
    Electric: {sa: ['Beast', 'Air', 'Water', 'Metal'], wa: ['Fire'], r: ['Beast'], s: ['']},
    Light: {sa: ['Dark'], wa: ['Plant'], r: ['Dark', 'Fire', 'Electric'], s: ['Plant']},
    Air: {sa: ['Plant', 'Fire'], wa: ['Electric', 'Metal'], r: ['Beast'], s: ['Electric']},
    Metal: {sa: [''], wa: ['Fire', 'Water'], r: ['Beast'], s: ['Electric', 'Fire', 'Water']},
    Beast: {sa: ['Basic'], wa: ['Air', 'Metal'], r: ['Dark'], s: ['Electric', 'Fire']},
}