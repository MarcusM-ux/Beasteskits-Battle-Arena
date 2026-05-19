registerAttack('MOUNTAIN RISE', {
  stats: { dmg: 12, type: 'Ground', cooldown: { time: 40000, switch: false } },
  action: (player, target) => {
  
         if (!player.ultimateActive) {
            player.ultimateActive = true
            stun(player, 100)
            
            FillUltimate(player, 'brown', 'orange', 'THE <br> MOUTAINS <br> RISE!', 'domain', ()=>{
                excuteMoutain(player, target)
            })
            
        }
 
  }
});

function excuteMoutain(player, target){
    const DOMAIN_DURATION = 8000;
    const allIntervals = []; // Track everything for clean teardown

    stun(player, 500);
    stun(target, 500);

    // --- Wind-up shake ---
    let shakeCount = 0;
    const originX = player.x;
    const shakeInterval = setInterval(() => {
      player.x = originX + (Math.random() * 6 - 3);
      shakeCount++;
      if (shakeCount >= 10) {
        player.x = originX;
        clearInterval(shakeInterval);
      }
    }, 50);

    function manifestDomain() {
      player.domain = true;
      stun(player, 500);
      stun(target, 500);
      player.indicate(`${player.name} raises a mountain domain!`);

      // --- Domain image rise ---
      const RISE_SPEED = 12;
      let currentY = canvas.height;
      const riseInterval = setInterval(() => {
        currentY -= RISE_SPEED;
        spawnImage('Domains/MOUTAINRISE', {
          x: 0, y: currentY,
          width: canvas.width, height: canvas.height, duration: 16
        }, { target, flipX: !player.isPlayer1, flipY: false, priority: false });

        if (currentY <= 0) {
          currentY = 0;
          clearInterval(riseInterval);
          spawnImage('Domains/MOUTAINRISE', {
            x: 0, y: 0,
            width: canvas.width, height: canvas.height,
            duration: DOMAIN_DURATION
          }, { target, flipX: !player.isPlayer1, flipY: false, priority: false });

          // ── START ALL DOMAIN EFFECTS ──────────────────────────
          startDomainEffects();
        }
      }, 16);
    }

    function startDomainEffects() {

      // ── EFFECT 1: Falling rocks ───────────────────────────────
      // Rocks spawn at random x positions at the top and fall down
      const rockInterval = setInterval(() => {
        const ROCKS_PER_WAVE = 2 + Math.floor(Math.random() * 2); // 2-3 rocks
        for (let i = 0; i < ROCKS_PER_WAVE; i++) {
          setTimeout(() => {
            const rock = {
              x: Math.random() * (canvas.width - 40),
              y: -40,
              width: 28 + Math.random() * 20,
              height: 28 + Math.random() * 20,
              dmg: 3,
              type: 'Ground'
            };
            let rockHit = false;

            const rockFall = setInterval(() => {
              rock.y += 5;
              spawnEffect(rock.x, rock.y, rock.width, rock.height, 'rgba(100, 75, 35, 0.9)', 80);

              if (!rockHit && checkCollision(rock, target)) {
                rockHit = true;
                attackResults(player, rock, target);
                target.indicate(`${target.name} was hit by falling rock!`);
                // Dust cloud on impact
                spawnEffect(rock.x - 10, rock.y, rock.width + 20, 14, 'rgba(160,130,80,0.6)', 400);
                clearInterval(rockFall);
              }

              if (rock.y > canvas.height) {
                // Dust cloud even on miss
                spawnEffect(rock.x - 10, canvas.height - 14, rock.width + 20, 14, 'rgba(160,130,80,0.5)', 300);
                clearInterval(rockFall);
              }
            }, 16);
            allIntervals.push(rockFall);
          }, i * 300); // Stagger rocks within the wave
        }
      }, 2200);
      allIntervals.push(rockInterval);

      // ── EFFECT 2: Frost creep ─────────────────────────────────
      // Ice patches spread outward from the player's feet
      // Any target standing on them gets a persistent speed penalty
      let frostSlowed = false;
      const frostPatches = [];

      // Seed 4 frost patches around the player
      for (let i = 0; i < 4; i++) {
        frostPatches.push({
          x: player.x + (Math.random() * 120 - 60),
          y: player.y + player.height - 12,
          width: 0,
          height: 12
        });
      }

      const frostInterval = setInterval(() => {
        frostPatches.forEach(patch => {
          // Patches grow outward slowly
          patch.width = Math.min(patch.width + 1.5, 90);
          patch.x -= 0.75;
          spawnEffect(patch.x, patch.y, patch.width, patch.height, 'rgba(180, 220, 255, 0.55)', 200);

          if (!frostSlowed && checkCollision(patch, target)) {
            frostSlowed = true;
            target.speed *= 0.72;
            target.indicate(`${target.name} is slowed by the frost!`);

            setTimeout(() => {
              target.speed /= 0.72;
              frostSlowed = false;
            }, 1800);
          }
        });
      }, 50);
      allIntervals.push(frostInterval);

      // ── EFFECT 3: Ground rumble jitter ────────────────────────
      // Periodic shake staggers both fighters
      const rumbleInterval = setInterval(() => {
        let rumbleCount = 0;
        const targetOriginX = target.x;
        const playerOriginX = player.x;

        const rumble = setInterval(() => {
          player.x = playerOriginX + (Math.random() * 5 - 2.5);
          target.x = targetOriginX + (Math.random() * 5 - 2.5);
          rumbleCount++;
          if (rumbleCount >= 8) {
            player.x = playerOriginX;
            target.x = targetOriginX;
            clearInterval(rumble);
          }
        }, 40);
        allIntervals.push(rumble);

        // Small knockback to interrupt positioning
        const knockDir = Math.random() > 0.5 ? 1 : -1;
        target.x += knockDir * 18;
        target.x = Math.max(0, Math.min(canvas.width - target.width, target.x));
        target.indicate(`The ground trembles!`);
      }, 2800);
      allIntervals.push(rumbleInterval);

      // ── EFFECT 4: Anti-camp spire trap ───────────────────────
      // If target holds position for ~1.5s, a spire erupts under them
      let lastTargetX = target.x;
      let stillTime = 0;
      let spireOnCooldown = false;

      const campInterval = setInterval(() => {
        const moved = Math.abs(target.x - lastTargetX) > 8;
        lastTargetX = target.x;

        if (moved) {
          stillTime = 0;
        } else {
          stillTime += 100;
        }

        if (stillTime >= 1500 && !spireOnCooldown) {
          stillTime = 0;
          spireOnCooldown = true;

          // Warn flash under target before spire erupts
          spawnEffect(target.x, target.y + target.height - 30, target.width, 30, 'rgba(255,200,50,0.6)', 400);

          setTimeout(() => {
            const spire = {
              x: target.x,
              y: canvas.height,
              width: target.width * 1.1,
              height: 0,
              dmg: 6,
              type: 'Ground'
            };

            let spireHit = false;
            const spireRise = setInterval(() => {
              spire.height += 20;
              spire.y -= 20;
              spawnEffect(spire.x, spire.y, spire.width, spire.height, 'rgba(100, 80, 40, 0.85)', 120);

              if (!spireHit && checkCollision(spire, target)) {
                spireHit = true;
                attackResults(player, spire, target);
                stun(target, 500);
                target.indicate(`${target.name} was impaled for standing still!`);
              }

              if (spire.y <= 0 || spire.height > canvas.height) clearInterval(spireRise);
            }, 16);
            allIntervals.push(spireRise);

            // Spire cooldown so it doesn't fire constantly
            setTimeout(() => { spireOnCooldown = false; }, 3000);
          }, 450); // Small delay after warning flash
        }
      }, 100);
      allIntervals.push(campInterval);
    }

    // ── DOMAIN END: Collapse burst ────────────────────────────
    // Final shockwave + rock volley as the domain fades
    function collapseEffect() {
      player.indicate(`The mountain collapses!`);

      // Final shockwave outward from player
      const wave = {
        x: player.x + player.width / 2,
        y: player.y + player.height - 20,
        width: 10, height: 20,
        dmg: 5, type: 'Ground'
      };
      let waveHit = false;
      const waveInt = setInterval(() => {
        wave.x -= 9;
        wave.width += 18;
        spawnEffect(wave.x, wave.y, wave.width, wave.height, 'rgba(139, 90, 43, 0.7)', 120);
        if (!waveHit && checkCollision(wave, target)) {
          waveHit = true;
          attackResults(player, wave, target);
          stun(target, 600);
          target.indicate(`${target.name} caught in the collapse!`);
        }
        if (wave.x <= 0) clearInterval(waveInt);
      }, 16);

      // Final rock volley — 5 rocks all at once
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const rock = {
            x: Math.random() * (canvas.width - 30),
            y: -30, width: 22, height: 22,
            dmg: 2, type: 'Ground'
          };
          let hit = false;
          const fall = setInterval(() => {
            rock.y += 7;
            spawnEffect(rock.x, rock.y, rock.width, rock.height, 'rgba(100, 75, 35, 0.9)', 60);
            if (!hit && checkCollision(rock, target)) {
              hit = true;
              attackResults(player, rock, target);
              clearInterval(fall);
            }
            if (rock.y > canvas.height) clearInterval(fall);
          }, 16);
        }, i * 100);
      }
    }

    // ── TEARDOWN ──────────────────────────────────────────────
    setTimeout(() => {
      // Clear all running domain intervals
      allIntervals.forEach(id => clearInterval(id));

      // Run collapse burst
      collapseEffect();

      player.domain = false;
      player.ultimateActive = false
      player.indicate(`The mountain recedes.`);
    }, DOMAIN_DURATION);

    // ── CLASH CHECK & LAUNCH ──────────────────────────────────
    setTimeout(() => {
        if (target.domain) {
            player.indicate('An opposing domain is already Active!')            
        }else {
          manifestDomain();
        }
      // if (target.domain) {
      //   // DomainClash.start(player, target, manifestDomain, target.domainManifest ?? (() => {}));
      //   return
      // } else {
      //   manifestDomain();
      // }
    }, 600);

    player.domainManifest = manifestDomain;
  }