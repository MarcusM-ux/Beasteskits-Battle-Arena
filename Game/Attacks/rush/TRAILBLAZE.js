registerAttack('TRAILBLAZE', {
    stats: {
    dmg: 3,
    type: 'Fire',
    cooldown: { time: 9000, switch: false }
    },
    action: (player, target) => {
    let life = 0;
    let hits = 0
    let activeIntervals = [];
    
    // Stun player during the dash
    stun(player, 3000);
    
    // Capture dash start position and direction
    const dashDir = player.facingRight ? 8 : -8;
    const trailEmbers = []; // Store ember positions for post-dash spread
    
    let speedI = 0.05;
    const trailInterval = setInterval(() => {
      player.x += dashDir * 10 * speedI;
      speedI += 0.05;
    
      // 1. Afterimage effect — fades as the player blazes forward
      // const alpha = Math.min(0.85, 0.3 + speedI * 0.4);
      // spawnEffect(player.x, player.y, player.width, player.height, `rgba(203, 49, 49, ${alpha})`, 1000);
    
      // 2. Spawn a fire ember at the current location
      const ember = spawnFireEmber(player.x, player.y, player.width, player.height, target, player);
      trailEmbers.push({ x: player.x, y: player.y });
    
      // Termination conditions
      if (life > 3000 || player.x <= 0 || player.x + player.width >= canvas.width) {
        clearInterval(trailInterval);
        stun(player, 500); // Recovery stun
    
        // --- POST-DASH: Chance to spawn spreading fires ---
        triggerFireSpread(trailEmbers, target, player);
      }
    
      life += 100;
    }, 100);
    
    // Spawns a short-lived ember that deals tick damage on contact
    function spawnFireEmber(x, y, w, h, target, player) {
      const alpha = Math.min(0.85, 0.3 + speedI * 0.4);
      let emberBox = {
        x: x + (Math.random() * 20 - 10),
        y: y + (h / 2),
        width: w / 2,
        height: h / 2,
        dmg: 1,
        type: 'Fire',
        color: `rgba(203, 49, 49, ${alpha})`
      };
    
      let emberLife = 0;
      const emberInt = setInterval(() => {
        spawnEffect(emberBox.x, emberBox.y, emberBox.width, emberBox.height, emberBox.color, 200);
    
        if (checkCollision(emberBox, target) && hits < 5) {
              attackResults(player, emberBox, target);
              hits++
              target.speed *= 0.8; // Slow on contact
        }
    
        // Ember grows slightly as it burns
        emberBox.width += 0.5;
        emberBox.x -= 0.25;
    
        emberLife += 100;
        if (emberLife > 2000) clearInterval(emberInt);
      }, 100);
    
      activeIntervals.push(emberInt);
      return emberBox;
    }
    
    // After the dash, randomly seed smaller fires along the trail
    function triggerFireSpread(trailEmbers, target, player) {
      const SPREAD_CHANCE = 0.4; // 40% chance per ember position to spawn a child fire
      const CHILD_FIRE_DURATION = 3000; // Child fires last 3 seconds
      const CHILD_FIRE_TICK_DMG = 1;
      const CHILD_FIRE_TICK_RATE = 500; // Damage every 500ms
    
      trailEmbers.forEach((pos) => {
        if (Math.random() > SPREAD_CHANCE) return; // Roll for each position
    
        // Offset child fire slightly from the trail for a "spread" feel
        const childBox = {
          x: pos.x + (Math.random() * 40 - 20),
          y: pos.y + (Math.random() * 20 - 10),
          width: 20 + Math.random() * 15,
          height: 20 + Math.random() * 15,
          dmg: CHILD_FIRE_TICK_DMG,
          type: 'Fire',
          life: 0
        };
    
        // let childLife = 0;
        let tickAccumulator = 0;
    
        const childInt = setInterval(() => {
          // Visual — flickers between orange and red to look like a real small fire
          const flicker = Math.random() > 0.5
            ? 'rgba(255, 100, 0, 0.75)'
            : 'rgba(220, 50, 0, 0.65)';
          spawnEffect(childBox.x, childBox.y, childBox.width, childBox.height, flicker, 300);
    
          // Tick damage — only fires every CHILD_FIRE_TICK_RATE ms
          tickAccumulator += 100;
          if (tickAccumulator >= CHILD_FIRE_TICK_RATE) {
            tickAccumulator = 0;
            if (checkCollision(childBox, target)) {
              attackResults(player, childBox, target);
            }
          }
    
          // Child fires slowly shrink as they die out
          childBox.width = Math.max(5, childBox.width - 0.15);
          childBox.height = Math.max(5, childBox.height - 0.15);
    
          childBox.life += 100;
          if (childBox.life >= CHILD_FIRE_DURATION) clearInterval(childInt);
        }, 100);
    
        activeIntervals.push(childInt);
      });
    }
    
    }
});