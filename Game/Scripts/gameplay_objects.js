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
        arrowright: false,
    },
    attacks: {
        // Player 1
        q: false,
        e: false,
        z: false,
        x: false,
        r: false,

        // Player 2
        o: false,
        p: false,
        k: false,
        l: false,
        m: false
        
    }
    
}

const cpuIntent = {
  player1: {
    movement: { w: false, a: false, s: false, d: false, arrowup: false, arrowdown: false, arrowleft: false, arrowright: false },
    attacks: { q: false, e: false, z: false, x: false, o: false, p: false, k: false, l: false, r: false }
  },
  player2: {
    movement: { w: false, a: false, s: false, d: false, arrowup: false, arrowdown: false, arrowleft: false, arrowright: false },
    attacks: { q: false, e: false, z: false, x: false, o: false, p: false, k: false, l: false, m: false }
  }
};

const creatureImageRotate = document.querySelector('#creature-image-rotate')
const allCreatures = Object.keys(creatures)

const imageSwitchInterval = setInterval(()=>{
    const randomCreature = allCreatures[Math.floor(Math.random() * allCreatures.length)]
    creatureImageRotate.src = creatures[randomCreature].image
}, 2000)

const CLASSES = [
    "Tank",        // high HP/DEF, absorbs damage
    "Bruiser",     // tanky + deals damage
    "Damage",      // high offense, lower survivability
    "Harasser",    // speed + pressure + mobility
    "Utility",     // buffs, debuffs, control
    "Sniper",       // ranged, spacing, precision
    "Controller" //affects the area
];

function generateLabels(creature) {
const { hp, atk, def, spd } = creature.stats;
const moves = creature.moveset;
const role = getRole(creature);
const playstyle = getPlaystyle(hp, atk, def, spd);
const trait = getTrait(moves, spd, atk);
return `${role} • ${playstyle} • ${trait}`;
}

function inRange(val, min, max) {
return val >= min && val <= max;
}

function getRole(creature) {
const { hp, atk, def, spd } = creature.stats;

const roles = {
Tank: 0,
Bruiser: 0,
Damage: 0,
Harasser: 0,
Sniper: 0,
Controller: 0
};

// 🛡️ TANK
if (inRange(hp, 70, 90)) roles.Tank += 2;
if (inRange(def, 65, 85)) roles.Tank += 2;
if (inRange(atk, 40, 65)) roles.Tank += 1;
if (inRange(spd, 0.8, 1.4)) roles.Tank += 1;

// ⚔️ BRUISER
if (inRange(hp, 60, 80)) roles.Bruiser += 1;
if (inRange(atk, 65, 80)) roles.Bruiser += 2;
if (inRange(def, 55, 70)) roles.Bruiser += 1;
if (inRange(spd, 1.0, 1.6)) roles.Bruiser += 1;

// 💥 DAMAGE
if (inRange(hp, 45, 65)) roles.Damage += 1;
if (inRange(atk, 75, 95)) roles.Damage += 2;
if (inRange(def, 40, 60)) roles.Damage += 1;
if (inRange(spd, 1.4, 2.5)) roles.Damage += 1;

// ⚡ HARASSER
if (inRange(hp, 45, 65)) roles.Harasser += 1;
if (inRange(atk, 55, 75)) roles.Harasser += 1;
if (inRange(def, 40, 60)) roles.Harasser += 1;
if (inRange(spd, 2.2, 3.6)) roles.Harasser += 2;

// 🎯 SNIPER
if (inRange(hp, 45, 60)) roles.Sniper += 1;
if (inRange(atk, 70, 90)) roles.Sniper += 2;
if (inRange(def, 40, 55)) roles.Sniper += 1;
if (inRange(spd, 1.2, 2.0)) roles.Sniper += 1;

// 🧠 CONTROLLER
if (inRange(hp, 55, 75)) roles.Controller += 1;
if (inRange(atk, 45, 65)) roles.Controller += 1;
if (inRange(def, 55, 75)) roles.Controller += 2;
if (inRange(spd, 1.2, 2.0)) roles.Controller += 1;

// 🧠 PICK BEST MATCH
let bestRole = "Balanced";
let highestScore = 0;

for (let role in roles) {
if (roles[role] > highestScore) {
highestScore = roles[role];
bestRole = role;
}
}

return bestRole;
}

function validateRole(creature, role) {
const { hp, atk, def, spd } = creature.stats;

switch (role) {
case "Tank":
if (spd > 1.6) return "INVALID_TANK";
break;

case "Harasser":
  if (spd < 2.0) return "INVALID_HARASSER";
  break;

case "Damage":
  if (def > 65) return "TOO_TANKY_FOR_DAMAGE";
  break;

case "Sniper":
  if (atk < 70) return "NOT_A_SNIPER";
  break;

case "Controller":
  if (def < 55) return "TOO_SQUISHY_FOR_CONTROLLER";
  break;

}

return "OK";
}

function getPlaystyle(hp, atk, def, spd) {
if (spd > 3) return "Ultra Fast";
if (spd > 2.3) return "Fast";
if (atk > 85) return "Burst";
if (def > 75) return "Defensive";
if (hp > 75) return "Sustained";
return "Balanced";
}

function getTrait(moves, spd, atk) {
if (moves.some(m => m.includes("STUN") || m.includes("FLASH")))
return "Disruptor";
if (moves.some(m => m.includes("TAUNT") || m.includes("SULK")))
return "Pressure";
if (moves.some(m => m.includes("HEAL") || m.includes("BLOAT")))
return "Sustain";
if (moves.some(m => m.includes("TELEPORT") || m.includes("FADE")))
return "Evasive";
if (atk > 90)
return "Nuke";
if (spd > 3.2)
return "Hit-and-Run";
return "Standard";
}

// creature.class = getRole(...);
// creature.labels = generateLabels(creature);

for (const [name, data] of Object.entries(creatures)) {
    // data.class = getRole(data);
    data.labels = generateLabels(data);    
}



// sa => Strong Against (This beasteskit is attacking another beasteskit) (2x)
// wa => Weak Against (This beasteskit is attacking another beasteskit) (0.5x)
// r => Resists (This beasteskit is being attacked by another beasteskit) (0.5x)
// s => Sensitive To (This beasteskit is being attacked by another beasteskit) (2x)
const advancedTypeChart = {
    Basic: {
    sa: [],
    wa: ['Metal'],
    r: ['Dark'],
    s: ['Fighting', 'Beast']
    },
    
    Fire: {
    sa: ['Plant', 'Bug', 'Frost', 'Metal'],
    wa: ['Water', 'Ground'],
    r: ['Fire', 'Plant', 'Bug', 'Frost'],
    s: ['Water', 'Ground']
    },
    
    Water: {
    sa: ['Fire', 'Ground', 'Metal'],
    wa: ['Electric', 'Plant'],
    r: ['Fire', 'Water'],
    s: ['Electric', 'Plant']
    },
    
    Plant: {
    sa: ['Water', 'Ground'],
    wa: ['Fire', 'Bug', 'Toxic', 'Frost'],
    r: ['Water', 'Ground'],
    s: ['Fire', 'Bug', 'Toxic', 'Frost']
    },
    
    Electric: {
    sa: ['Water', 'Air'],
    wa: ['Ground'],
    r: ['Electric'],
    s: ['Ground']
    },
    
    Air: {
    sa: ['Plant', 'Bug'],
    wa: ['Electric', 'Metal'],
    r: ['Ground', 'Bug'],
    s: ['Electric']
    },
    
    Ground: {
    sa: ['Electric', 'Fire', 'Metal', 'Toxic'],
    wa: ['Water', 'Plant', 'Frost'],
    r: ['Electric'],
    s: ['Water', 'Plant', 'Frost']
    },
    
    Metal: {
    sa: ['Frost'],
    wa: ['Fire', 'Ground'],
    r: ['Plant', 'Bug', 'Basic', 'Frost'],
    s: ['Fire', 'Ground']
    },
    
    Frost: {
    sa: ['Plant', 'Air', 'Beast'],
    wa: ['Fire', 'Metal'],
    r: ['Frost'],
    s: ['Fire', 'Metal']
    },
    
    Toxic: {
    sa: ['Plant', 'Beast'],
    wa: ['Ground', 'Metal'],
    r: ['Plant'],
    s: ['Ground', 'Metal']
    },
    
    Beast: {
    sa: ['Basic'],
    wa: ['Electric', 'Toxic'],
    r: ['Dark'],
    s: ['Electric', 'Toxic']
    },
    
    Fighting: {
    sa: ['Basic', 'Metal', 'Beast'],
    wa: ['Air', 'Mind'],
    r: ['Bug'],
    s: ['Air', 'Mind']
    },
    
    Mind: {
    sa: ['Fighting', 'Beast'],
    wa: ['Bug', 'Dark'],
    r: ['Fighting'],
    s: ['Bug', 'Dark']
    },
    
    Dark: {
    sa: ['Mind', 'Light'],
    wa: ['Fighting', 'Bug', 'Basic'],
    r: ['Dark'],
    s: ['Fighting', 'Bug']
    },
    
    Light: {
    sa: ['Dark', 'Toxic'],
    wa: ['Plant'],
    r: ['Dark'],
    s: ['Plant']
    },
    
    Bug: {
    sa: ['Plant', 'Mind'],
    wa: ['Fire', 'Air'],
    r: ['Plant', 'Ground'],
    s: ['Fire', 'Air']
    }

};