// ============================================
// SWIPE
// ============================================
registerAttack('SWIPE', {
stats: { dmg: 2, type: 'Basic', cooldown: { time: 3000, switch: false } },
action: (player, target) => {
const attributes = attackFunctions['SWIPE'].stats
const box = { dmg: attributes.dmg, type: attributes.type }

    const direction = player.facingRight ? 1 : -1
    const cx = player.x + player.width / 2
    const cy = player.y + player.height / 2

    // Arc starts top, swings down, curves under
    const arcPoints = []
    const steps = 20
    for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const angle = -Math.PI / 2 + t * Math.PI * 1.2 // top → down → under
        arcPoints.push({
            x: cx + Math.cos(angle) * 35 * direction,
            y: cy + Math.sin(angle) * 45
        })
    }

    let step = 0
    let hasHit = false
    playRetreivedAudio('swoosh')

    const swipeInterval = setInterval(() => {
        if (step >= arcPoints.length) {
            clearInterval(swipeInterval)
            return
        }

        const point = arcPoints[step]
        spawnEffect(point.x - 10, point.y - 10, 20, 20, 'rgba(200,200,200,0.6)', 120)

        const hitbox = { x: point.x - 30, y: point.y - 15, width: 30, height: 30 }
        if (!hasHit && checkCollision(hitbox, target)) {
            attackResults(player, box, target)
            // Push target backwards horizontally
            target.vx = 8 * (target.facingRight ? -1 : 1)
            hasHit = true
            player.indicate(`${player.name} swept forward!`)
        }

        step++
    }, 30)
}

})

// ============================================
// UPSWIPE
// ============================================
registerAttack('UPSWIPE', {
stats: { dmg: 8, type: 'Basic', cooldown: { time: 6000, switch: false } },
action: (player, target) => {
const attributes = attackFunctions['UPSWIPE'].stats
const box = { dmg: attributes.dmg, type: attributes.type }

    const direction = player.facingRight ? -1 : 1
    const cx = player.x + player.width / 2
    const cy = player.y + player.height / 2

    // Reverse arc — starts bottom, swings up, curves over
    const arcPoints = []
    const steps = 20
    for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const angle = Math.PI / 2 + t * Math.PI * 1.2  // bottom → up → over
        arcPoints.push({
            x: cx + Math.cos(angle) * 35 * direction,
            y: cy + Math.sin(angle) * 45
        })
    }

    let step = 0
    let hasHit = false
    playRetreivedAudio('swoosh')

    stun(player, 600)

    const swipeInterval = setInterval(() => {
        if (step >= arcPoints.length) {
            clearInterval(swipeInterval)
            return
        }

        const point = arcPoints[step]
        spawnEffect(point.x - 10, point.y - 10, 20, 20, 'rgba(180,220,255,0.6)', 120)

        const hitbox = { x: point.x - 15, y: point.y - 15, width: 30, height: 30 }
        if (!hasHit && checkCollision(hitbox, target)) {
            attackResults(player, box, target)
            // Launch target upwards like an uppercut
            target.vy = -12
            target.vx = 3 * (target.facingRight ? -1 : 1)
            hasHit = true
            player.indicate(`${player.name} launched ${target.name} upwards!`)

            setTimeout(()=>{
                if (player.name === 'Chaotiboom') stun(target, 5000)
            }, 800)
        }

        step++
    }, 30)
}

})

// ============================================
// IRON PIERCE
// ============================================
registerAttack('IRON PIERCE', {
stats: { dmg: 12, type: 'Metal', cooldown: { time: 5000, switch: false } },
action: (player, target) => {
const attributes = attackFunctions['IRON PIERCE'].stats
const box = { dmg: attributes.dmg, type: attributes.type }

    const originalX = player.x
    const jumpBackX = player.facingRight
        ? Math.max(0, player.x - 70)
        : Math.min(canvas.width - player.width, player.x + 70)

    // Phase 1 — smooth jump back
    stun(player, 600)
    const jumpBackSteps = 15
    let jumpStep = 0

    const jumpBack = setInterval(() => {
        if (jumpStep >= jumpBackSteps) {
            clearInterval(jumpBack)
            launchStrike()
            return
        }
        const t = jumpStep / jumpBackSteps
        player.x = originalX + (jumpBackX - originalX) * t
        // Small arc upward during the jump
        player.y += jumpStep < 7 ? -2 : 2
        jumpStep++
    }, 20)

    // Phase 2 — strike forward
    function launchStrike() {
        stun(player, 400)
        const strikeTargetX = target.x
        const startX = player.x
        const strikeSteps = 12
        let strikeStep = 0
        let hasHit = false

        playRetreivedAudio('dash')

        const strikeInterval = setInterval(() => {
            if (strikeStep >= strikeSteps) {
                clearInterval(strikeInterval)
                player.rotation = 0
                return
            }

            const t = strikeStep / strikeSteps
            player.x = startX + (strikeTargetX - startX) * t
            player.borders()

            // Gray sparks trail
            for (let i = 0; i < 3; i++) {
                spawnEffect(
                    player.x + Math.random() * player.width,
                    player.y + Math.random() * player.height,
                    6, 6,
                    `rgba(180,180,180,${Math.random() * 0.6 + 0.3})`,
                    180
                )
            }

            const dist = Math.hypot(
                (player.x + player.width  / 2) - (target.x + target.width  / 2),
                (player.y + player.height / 2) - (target.y + target.height / 2)
            )

            if (dist < 50 && !hasHit) {
                attackResults(player, box, target)
                stun(target, 1500)

                // Gray sparks burst on target
                for (let i = 0; i < 10; i++) {
                    spawnEffect(
                        target.x + Math.random() * target.width,
                        target.y + Math.random() * target.height,
                        8, 8,
                        `rgba(160,160,160,${Math.random() * 0.8 + 0.2})`,
                        300
                    )
                }

                hasHit = true
                target.indicate(`${target.name} is stunned!`)
                player.indicate(`${player.name} pierced through!`)
            }

            strikeStep++
        }, 16)
    }
}

})

// ============================================
// ENCHANTING GLARE
// ============================================
registerAttack('ENCHANTING GLARE', {
stats: { dmg: 0, type: 'Mind', cooldown: { time: 6000, switch: false } },
action: (player, target) => {

    // Check target is directly in front of player
    const playerCX  = player.x + player.width  / 2
    const targetCX  = target.x  + target.width  / 2
    const targetInFront = player.facingRight
        ? targetCX > playerCX
        : targetCX < playerCX

    if (!targetInFront) {
        player.indicate(`${target.name} is not in front!`)
        return
    }

    const verticalDiff = Math.abs(
        (player.y + player.height / 2) - (target.y + target.height / 2)
    )

    if (verticalDiff > 80) {
        player.indicate(`${target.name} is too far away!`)
        return
    }

    // Glare effect — pulsing blue ring around target
    stun(target, 2500)
    target.indicate(`${target.name} is entranced!`)
    player.indicate(`${player.name} used ENCHANTING GLARE!`)
    playRetreivedAudio('magic')

    const glareStart = Date.now()
    const glareDuration = 2500
    let radius = 30

    const glareInterval = setInterval(() => {
        const elapsed = Date.now() - glareStart
        if (elapsed >= glareDuration) {
            clearInterval(glareInterval)
            target.indicate('')
            return
        }

        // Pulsing radius
        radius = 30 + Math.sin(elapsed * 0.01) * 8

        // Draw blue glare ring around target
        const tx = target.x + target.width  / 2
        const ty = target.y + target.height / 2

        // Outer glow
        spawnEffect(tx - radius, ty - radius, radius * 2, radius * 2, 'rgba(80,160,255,0.15)', 80)

        // Ring of small sparks
        for (let i = 0; i < 6; i++) {
            const angle = (elapsed * 0.005) + (i / 6) * Math.PI * 2
            spawnEffect(
                tx + Math.cos(angle) * radius - 4,
                ty + Math.sin(angle) * radius - 4,
                8, 8,
                'rgba(100,180,255,0.8)',
                100
            )
        }
    }, 50)
}

})

// ============================================
// METAL CLUBS
// ============================================
registerAttack('METAL CLUBS', {
stats: { dmg: 7, type: 'Metal', cooldown: { time: 4000, switch: false } },
action: (player, target) => {
const attributes = attackFunctions['METAL CLUBS'].stats
const box = { dmg: attributes.dmg, type: attributes.type }

    const startX   = player.x
    const punch1TX = target.x
    let hasHit1    = false
    let hasHit2    = false

    stun(player, 800)
    playRetreivedAudio('punch')

    // Phase 1 — first punch, smooth slide forward
    const punch1Steps = 15
    let punch1Step    = 0

    const punch1 = setInterval(() => {
        if (punch1Step >= punch1Steps) {
            clearInterval(punch1)
            // Brief pause between punches
            setTimeout(secondPunch, 300)
            return
        }

        const t = punch1Step / punch1Steps
        // Ease out: decelerates as it reaches target
        const eased = 1 - Math.pow(1 - t, 2)
        player.x = startX + (punch1TX - startX) * eased
        player.borders()

        // Impact sparks near fist (front of player)
        if (punch1Step > 10) {
            spawnEffect(
                player.facingRight ? player.x + player.width : player.x - 8,
                player.y + player.height / 2 - 8,
                50, 50,
                'rgba(200,200,200,0.5)',
                100
            )
        }

        const dist = Math.hypot(
            (player.x + player.width  / 2) - (target.x + target.width  / 2),
            (player.y + player.height / 2) - (target.y + target.height / 2)
        )

        if (dist < 50 && !hasHit1) {
            attackResults(player, box, target)
            // Push back
            target.vx = 6 * (target.facingRight ? -1 : 1)
            hasHit1 = true
            player.indicate(`${player.name} punched!`)
            playRetreivedAudio('impact')
        }

        punch1Step++
    }, 20)

    // Phase 2 — second punch, closes the gap again
    function secondPunch() {
        stun(player, 600)
        playRetreivedAudio('punch')

        const punch2StartX = player.x
        const punch2TX     = target.x
        const punch2Steps  = 12
        let punch2Step     = 0

        const punch2 = setInterval(() => {
            if (punch2Step >= punch2Steps) {
                clearInterval(punch2)
                player.indicate('')
                return
            }

            const t     = punch2Step / punch2Steps
            const eased = 1 - Math.pow(1 - t, 2)
            player.x    = punch2StartX + (punch2TX - punch2StartX) * eased
            player.borders()

            // Heavier sparks on second hit
            if (punch2Step > 8) {
                for (let i = 0; i < 3; i++) {
                    spawnEffect(
                        (player.facingRight ? player.x + player.width : player.x - 8) + (Math.random() * 10 - 5),
                        player.y + player.height / 2 - 8 + (Math.random() * 10 - 5),
                        50, 50,
                        `rgba(180,180,180,${Math.random() * 0.5 + 0.4})`,
                        150
                    )
                }
            }

            const dist = Math.hypot(
                (player.x + player.width  / 2) - (target.x + target.width  / 2),
                (player.y + player.height / 2) - (target.y + target.height / 2)
            )

            if (dist < 50 && !hasHit2) {
                attackResults(player, box, target)
                // Bigger pushback on second hit
                target.vx = 10 * (target.facingRight ? -1 : 1)
                hasHit2 = true
                player.indicate(`${player.name} landed a second blow!`)
                playRetreivedAudio('impact')
            }

            punch2Step++
        }, 20)
    }
}

})

// registerAttack('ROYAL SCEPTRE', {
// stats: { dmg: 10, type: 'Light', cooldown: { time: 5000, switch: false } },
// action: (player, target) => {
// const box = {
// x: player.facingRight ? player.x + 40 : player.x - 40,
// y: player.y, width: 50, height: 50
// };

//     spawnEffect(box.x, box.y, box.width, box.height, 'gold', 300);

//     if (checkCollision(box, target)) {
//         stun(target, 600);
//         attackResults(player, { dmg: 10, type: 'Light' }, target);
//     }
// }

// });

// registerAttack('SHADOW REIGN', {
// stats: { dmg: 6, type: 'Dark', cooldown: { time: 7000, switch: false } },
// action: (player, target) => {

//     // teleport BUT no instant hit
//     player.x = target.facingRight ? target.x - 60 : target.x + 60;

//     player.indicate("POSITION TAKEN");

//     // reward follow-up instead
//     stun(target, 400);
// }

// });

// registerAttack('CROWNED ROAM', {
// stats: { dmg: 0, type: 'Mind', cooldown: { time: 9000, switch: false } },
// action: (player) => {
// player.stats.spd *= 1.8;
// player.indicate("ADVANCE");

//     setTimeout(() => {
//         player.stats.spd = player.baseStats.spd;
//     }, 2500);
// }

// });

// registerAttack('EXECUTION', {
// stats: { dmg: 35, type: 'Dark', cooldown: { time: 14000, switch: false } },
// action: (player, target) => {

//     stun(player, 800);
//     const dir = player.facingRight ? 1 : -1

//     const box = { x: player.x + (dir * 25), y: player.y, width: 40, height: 40 };

//     spawnEffect(box.x, box.y, box.width, box.height, '#2b2b2b', 800);

//     if (checkCollision(box, target)) {
//         if (target.isStunned) {
//             player.indicate(`${player.name} did MORE damage because target is stunned!`)
//             attackResults(player, { dmg: 40, type: 'Dark' }, target);
            
//         }else {
//             player.indicate(`${player.name} did LESS damage because target is NOT stunned...`)
//             attackResults(player, { dmg: 12, type: 'Dark' }, target);
//         }
//     }
// }

// });

// registerAttack('DUST CLOUD', {
// stats: { dmg: 2, type: 'Ground', cooldown: { time: 6000, switch: false } },
// action: (player, target) => {

//     const zone = { x: player.x - 50, y: player.y - 50, width: 150, height: 100 };

//     const cloud = setInterval(() => {
//         spawnEffect(zone.x + Math.random()*150, zone.y + Math.random()*100, 10, 10, 'tan', 300);

//         if (checkCollision(zone, target)) {
//             target.stats.spd *= 0.85;
//             stun(target, 100)
//         }

//     }, 100);

//     setTimeout(() => {
//         clearInterval(cloud);
//         target.stats.spd = target.baseStats.spd;
//     }, 3000);
// }

// });

// registerAttack('SAND SHIELD', {
// stats: { dmg: 0, type: 'Ground', cooldown: { time: 7000, switch: false } },
// action: (player) => {

//     player.isDodging = true;

//     const v = setInterval(()=>{
//         spawnEffect(player.x, player.y, player.width, player.height, 'peru', 80);
//     }, 100);

//     setTimeout(() => {
//         player.isDodging = false;
//         clearInterval(v);
//     }, 1800);
// }

// });

// registerAttack('ERODING SLAM', {
// stats: { dmg: 12, type: 'Ground', cooldown: { time: 4000, switch: false } },
// action: (player, target) => {
//         player.y -= 100; // Leap
//         stun(player, 1500);

//         setTimeout(() => {
//             player.y += 100; // Impact
//             playRetreivedAudio('whoosh')
//             const shockwave = { 
//                 x: player.x, 
//                 y: player.y + (player.height / 2), 
//                 width: player.width, 
//                 height: 30 
//             };

//             spawnEffect(shockwave.x, shockwave.y, shockwave.width, shockwave.height, 'brown', 500);

//             if (checkCollision(shockwave, target) || checkCollision(player, target)) {
//                 rebukeCollision(player, target, 2.0); 
//                 stun(target, 1200);
//                 attackResults(player, attackFunctions["ERODING SLAM"].stats, target);
//                 playRetreivedAudio('body-thud')
//             } else {
//                 stun(player, 2500); // Miss penalty
//             }
//         }, 500);
            
    
// }

// });

// registerAttack('QUICKSAND', {
// stats: { dmg: 6, type: 'Ground', cooldown: { time: 9000, switch: false } },
// action: (player, target) => {

//     player.indicate("COME!");
    
//         const moveToPull = () => {
//             const dx = player.x - target.x
//             const dy = player.y - target.y
    
//             target.x += dx * 0.15
//             target.y += dy * 0.15

//         };


//     const i = setInterval(() => {
//         moveToPull()
//     }, 50);

//     setTimeout(() => clearInterval(i), 2000);
// }

// });

// registerAttack('RUSHING TIDE', {
// stats: { dmg: 10, type: 'Water', cooldown: { time: 3500, switch: false } },
// action: (player, target) => {

//     const oldX = player.x;
//     player.x += player.facingRight ? 100 : -100;

//     const trail = {
//         x: Math.min(oldX, player.x),
//         y: player.y,
//         width: 100,
//         height: player.height
//     };

//     spawnEffect(trail.x, trail.y, trail.width, trail.height, 'blue', 200);

//     if (checkCollision(trail, target)) {
//         attackResults(player, { dmg: 10, type: 'Water' }, target);
//     }
// }

// });

// registerAttack('SERRATED BITE', {
// stats: { dmg: 16, type: 'Beast', cooldown: { time: 5000, switch: false } },
// action: (player, target) => {

//     const box = { 
//         x: player.facingRight ? player.x + 20 : player.x - 20, 
//         y: player.y, width: 30, height: 30 
//     };
//     stun(player, 500)
//     spawnEffect(box.x, box.y, box.width, box.height, 'red', 500)

//     if (checkCollision(box, target)) {
//         attackResults(player, { dmg: 16, type: 'Beast' }, target);

//         // bleed effect
//         let ticks = 0;
//         const bleed = setInterval(() => {
//             attackResults(player, { dmg: 2, type: 'Water' }, target);
//             ticks++;
//             if (ticks >= 3) {clearInterval(bleed);  }
//         }, 500);
//     }
// }

// });

// registerAttack('HYDRO BLADE', {
// stats: { dmg: 7, type: 'Water', cooldown: { time: 2500, switch: false } },
// action: (player, target) => {

//     let projectile = { x: player.x, y: player.y, width: 20, height: 10 };

//     const move = setInterval(() => {

//         projectile.x += player.facingRight ? 10 : -10;

//         spawnEffect(projectile.x, projectile.y, 10, 10, 'cyan', 100);

//         if (checkCollision(projectile, target)) {

//             if (!target.bleed) {
//                 attackResults(player, { dmg: 7, type: 'Water' }, target);
//             } else {
//                 attackResults(player, { dmg: 12, type: 'Water' }, target);
//                 player.indicate(`${player.name} did more DAMAGE! ${target.name} is bleeding!`)
//             }

//             clearInterval(move);
            
//         }

//     }, 30);

//     setTimeout(() => clearInterval(move), 2000);
// }

// });

// registerAttack('WHIRLPOOL REPELLENT', {
// stats: { dmg: 4, type: 'Water', cooldown: { time: 7000, switch: false } },
// action: (player, target) => {

//     const spin = setInterval(() => {

//         spawnEffect(player.x, player.y, 80, 80, 'blue', 100, true);

//         if (checkCollision(player, target)) {
//             rebukeCollision(player, target);
//         }

//     }, 100);

//     setTimeout(() => clearInterval(spin), 1500);
// }

// });

// registerAttack('OVERDRIVE', {
//     stats: { dmg: 0, type: 'Metal', cooldown: { time: 12000, switch: false } },
//     action: (player) => {
//     player.stats.spd *= 2.5;
//     player.indicate("OVERCLOCK");
//     setTimeout(() => {
//     player.stats.spd = creatures[player.name].stats.spd;
//     stun(player, 600);
//     }, 2000);
//     }
// });

// registerAttack('GEAR SHRED', {
// stats: { dmg: 5, type: 'Metal', cooldown: { time: 1000, switch: false } },
// action: (player, target) => {
// const box = { x: player.facingRight ? player.x + 20 : player.x - 20, y: player.y, width: 40, height: 40 };
// for(let i=0; i<3; i++) {
// setTimeout(() => {
// spawnEffect(box.x, box.y, box.width, box.height, 'silver', 100);
// if (checkCollision(box, target)) attackResults(player, {dmg: 5, type: 'Metal'}, target);
// }, i * 150);
// }
// }
// });

// registerAttack('STATIC DISCHARGE', {
// stats: { dmg: 10, type: 'Electric', cooldown: { time: 5000, switch: false } },
// action: (player, target) => {
// spawnEffect(player.x, player.y, 120, 120, 'yellow', 300, true);
// if (checkCollision({x: player.x, y: player.y, width: 120, height: 120}, target)) {
// attackResults(player, {dmg: 10, type: 'Electric'}, target);
// stun(target, 400);
// }
// }
// });

// registerAttack('LIGHTNING DASH', {
// stats: { dmg: 0, type: 'Electric', cooldown: { time: 4000, switch: false } },
// action: (player) => {
// const dest = player.facingRight ? player.x + 150 : player.x - 150;
// spawnEffect(player.x, player.y, player.width, player.height, 'white', 200);
// player.x = dest;
// }
// });

// //

// registerAttack('IRON ROOTS', {
// stats: { dmg: 5, type: 'Metal', cooldown: { time: 8000, switch: false } },
// action: (player, target) => {

// const box = { x: target.x, y: target.y, width: target.width, height: target.height };
// spawnEffect(box.x, box.y, box.width, 20, 'gray', 1500);
// if (checkCollision(box, target)) {
// const originalSpd = target.stats.spd;
// target.stats.spd = 0;
// setTimeout(() => target.stats.spd = originalSpd, 1500);
// }
// }
// });

// registerAttack('POLLEN SHIELD', {
// stats: { dmg: 0, type: 'Plant', cooldown: { time: 10000, switch: false } },
// action: (player) => {
// const heal = setInterval(() => {
// player.stats.hp = Math.max(player.baseStats.hp, player.stats.hp + 2); 
// player.updateLabel()
//     spawnEffect(player.x, player.y, player.width, player.height, 'lightgreen', 500);

// }, 500);

//     setTimeout(() => { clearInterval(heal) }, 3000);
// }

// });

// registerAttack('THORN LAUNCH', {
// stats: { dmg: 4, type: 'Ground', cooldown: { time: 3000, switch: false } },
// action: (player, target) => {
// for(let i=0; i<3; i++) {
// let p = { x: player.x, y: player.y + (i*10), width: 10, height: 5, dmg: 4, type: 'Ground' };
// const m = setInterval(() => {
// p.x += player.facingRight ? 12 : -12;
// spawnEffect(p.x, p.y, 5, 5, 'darkgreen', 50);
// if (checkCollision(p, target)) { attackResults(player, p, target); clearInterval(m); }
// }, 30);
// setTimeout(() => clearInterval(m), 1000);
// }
// }
// });

// registerAttack('FLOWER BLOOM', {
//   stats: { dmg: 20, type: 'Plant', cooldown: { time: 12000, switch: false } },
//   action: (player, target) => {
//     player.indicate("BLOOM");

//     let phase = 1;
//     let time = 0;
//     const cracks = [];
//     const eruptions = [];
    
//     // Initialize crack positions
//     for (let i = 0; i < 3; i++) {
//       cracks.push({
//         x: target.x + (i * 40) - 40,
//         y: target.y + 20,
//         width: 30,
//         height: 5,
//         timer: 0
//       });
//     }

//     const interval = setInterval(() => {
//       time += 100;

//       // =========================
//       // PHASE 1: DRAW CRACKS
//       // =========================
//       cracks.forEach((c) => {
//         c.timer += 100;
//         spawnEffect(c.x, c.y, c.width, c.height, 'lightgreen', 150);

//         // TRANSITION TO ERUPTION
//         if (phase === 2 && c.timer > 500 && c.active !== false) {
//           eruptions.push({
//             x: c.x,
//             y: c.y,
//             height: 0,
//             width: 40,
//             active: true
//           });
//           c.active = false; // Prevent reuse
//         }
//       });

//       // =========================
//       // PHASE 2: ERUPTION BURSTS
//       // =========================
//       if (phase >= 2) {
//         for (let i = eruptions.length - 1; i >= 0; i--) {
//           const e = eruptions[i];
//           e.height += 20;

//           spawnEffect(
//             e.x,
//             e.y - e.height,
//             e.width,
//             e.height,
//             'pink',
//             120
//           );

//           const hitbox = {
//             x: e.x,
//             y: e.y - e.height,
//             width: e.width,
//             height: e.height,
//             hit : false
//           };

//           if (checkCollision(hitbox, target) && !hitbox.hit) {
//               hitbox.hit = true
//             stun(target, 1200);
//             attackResults(player, { dmg: 5, type: 'Plant' }, target);
//           }

//           // Remove finished eruptions
//           if (e.height > 120 || hitbox.hit) {
//             eruptions.splice(i, 1);
//           }
//         }
//       }

//       // =========================
//       // PHASE TIMING
//       // =========================

//       // =========================
//       // END ATTACK
//       // =========================
//       if (time > 2600) {
//         clearInterval(interval);
//       }
//     }, 100);
//   }
// });


// // //

// registerAttack('FERAL LUNGE', {
// stats: { dmg: 14, type: 'Fighting', cooldown: { time: 5000, switch: false } },
// action: (player, target) => {
// player.x += player.facingRight ? 80 : -80;
// if (checkCollision(player, target)) {
// attackResults(player, {dmg: 14, type: 'Fighting'}, target);
// pullCollision(player, target);
// }
// }
// });

// registerAttack('CLAW FRENZY', {
// stats: { dmg: 4, type: 'Beast', cooldown: { time: 4000, switch: false } },
// action: (player, target) => {
// let hits = 0;
// const interval = setInterval(() => {
// spawnEffect(player.x + (player.facingRight ? 30 : -30), player.y, 30, 30, 'red', 100);
// if (checkCollision(player, target)) attackResults(player, {dmg: 4, type: 'Beast'}, target);
// hits++;
// if (hits >= 5) clearInterval(interval);
// }, 150);
// }
// });

// registerAttack('TERRIFYING HOWL', {
// stats: { dmg: 0, type: 'Basic', cooldown: { time: 9000, switch: false } },
// action: (player, target) => {
// player.indicate("AWROOOO!");
// spawnEffect(player.x, player.y, 250, 250, 'rgba(255,255,255,0.2)', 500, true);
// if (Math.abs(player.x - target.x) < 200) {
// target.stats.atk -= 10;
// target.indicate(`${target.name}'s attack was lowered!`)
// setTimeout(() => {target.stats.atk += 10}, 4000);
// }
// }
// });

// registerAttack('BEASTLY ENDURANCE', {
// stats: { dmg: 0, type: 'Beast', cooldown: { time: 15000, switch: false } },
// action: (player) => {
// player.stats.hp = Math.max(player.stats.hp, player.stats.hp + 10)
// spawnEffect(player.x, player.y, player.width, player.height, 'red', 500);
// }
// });

// //

// registerAttack('FLICKER', {
// stats: { dmg: 0, type: 'Light', cooldown: { time: 10000, switch: false } },
// action: (player) => {
// player.indicate(`${player.name}'s wax is making it untouchable!`)
// player.isDodging = true;
// player.opacity = 0.5; // Visual spectral effect
// setTimeout(() => { player.isDodging = false; player.opacity = 1; player.indicate(`${player.name} stopped leaking...`) }, 2500);
// }
// });

// registerAttack('BLINDING WICK', {
// stats: { type: 'Light', cooldown: { time: 7000, switch: false } },
// action: (player, target) => {
// const dir = player.facingRight ? 1 : -1
// const push = 25

//     spawnEffect(player.x + (dir * push), player.y, 150, 150, 'white', 400, true);
//     if (checkCollision({x: dir * push, y: player.y, width: 150, height: 150}, target)) {
//         stun(target, 1200);
//     }
// }

// });

// registerAttack('WAX MELT', {
// stats: { dmg: 2, type: 'Light', cooldown: { time: 5000, switch: false } },
// action: (player, target) => {
// const puddle = { x: player.x, y: player.y + 30, width: 60, height: 10 };
// const life = setInterval(() => {
// spawnEffect(puddle.x, puddle.y, puddle.width, puddle.height, 'yellow', 100);
// if (checkCollision(puddle, target)) target.stats.spd = 0.5;
// else target.stats.spd = creatures[target.name].stats.spd;
// }, 100);
// setTimeout(() => { clearInterval(life); target.stats.spd = creatures[target.name].stats.spd; }, 4000);
// }
// });

// registerAttack('GUIDING LIGHT', {
// stats: { dmg: 8, type: 'Light', cooldown: { time: 6000, switch: false } },
// action: (player, target) => {
// player.indicate("I SEE YOU");
// // Simple light beam
// const beam = { x: player.x, y: player.y, width: 400, height: 10 };
// if (!player.facingRight) beam.x -= 400;
// spawnEffect(beam.x, beam.y, beam.width, beam.height, 'gold', 200);
// if (checkCollision(beam, target)) attackResults(player, {dmg: 8, type: 'Light'}, target);
// }
// });