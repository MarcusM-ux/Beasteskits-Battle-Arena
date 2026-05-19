registerAttack('EARTHQUAKE', {
  stats: { dmg: 8, type: 'Ground', cooldown: { time: 12000, switch: false } },
  action: (player, target) => {
    const dir = player.facingRight ? 1 : -1;
    const WAVE_COUNT = 5;       // How many ground chunks travel out
    const WAVE_SPACING = 50;   // px gap between each wave's start position
    const WAVE_SPEED = 2;       // Horizontal travel speed
    const BOB_AMP = 12;         // How far each chunk bobs up and down (px)
    const BOB_FREQ = 0.12;      // Speed of the bobbing oscillation
    const LAUNCH_FORCE = -12;   // Upward velocity applied to target on hit
    const GRAVITY = 0.8;        // Gravity pulling target back down
    let hit = false;
    
    stun(player, 700);
    player.indicate(`${player.name} splits the earth!`);

    // Spawn each wave chunk staggered so they ripple outward
    for (let i = 0; i < WAVE_COUNT; i++) {
      const delay = i * 120; // Each wave launches slightly after the last

      setTimeout(() => {
        const chunk = {
          x: player.x + (dir * WAVE_SPACING * i), // Stagger start positions
          y: player.y + player.height - 30,        // Ground level
          width: 50,
          height: 30,
          dmg: 8,
          type: 'Ground'
        };

        let bobTime = 0;
        const baseY = chunk.y;

        const waveInterval = setInterval(() => {
          // Move chunk horizontally in facing direction
          chunk.x += dir * WAVE_SPEED;

          // Bob up and down using a sine wave
          chunk.y = baseY - Math.abs(Math.sin(bobTime * BOB_FREQ)) * BOB_AMP;
          bobTime++;

          // Render the ground chunk
          spawnEffect(
            chunk.x,
            chunk.y,
            chunk.width,
            chunk.height,
            'rgba(139, 90, 43, 0.85)',
            80
          );
          // Crack detail on top of chunk
          spawnEffect(
            chunk.x + 5,
            chunk.y,
            chunk.width - 10,
            6,
            'rgba(80, 45, 10, 0.9)',
            80
          );

          // Hit detection — only first contact per chunk
          if (checkCollision(chunk, target)) {
            hit = true;
            if (!hit) attackResults(player, chunk, target);
            target.indicate(`${target.name} was launched into the air!`);

            // Launch target upward
            let velY = LAUNCH_FORCE;
            let airTime = 0;
            const launchOriginY = target.y;

            const airInterval = setInterval(() => {
              velY += GRAVITY;
              target.y += velY;
              airTime += 16;

              // Airborne visual trail
              spawnEffect(
                target.x, target.y,
                target.width, target.height,
                'rgba(180, 120, 40, 0.35)',
                120
              );

              // Land when back at original height or below
              if (target.y >= launchOriginY) {
                target.y = launchOriginY;

                // Landing slam damage
                const landBox = {
                  x: target.x, y: target.y,
                  width: target.width, height: target.height,
                  dmg: 4, // Bonus landing hit
                  type: 'Ground'
                };
                attackResults(player, landBox, target);
                stun(target, 600);
                target.indicate(`${target.name} crashed down!`);
                spawnEffect(
                  target.x - 10, target.y + target.height - 10,
                  target.width + 20, 16,
                  'rgba(139, 90, 43, 0.7)',
                  300
                );

                clearInterval(airInterval);
              }
            }, 16);

            clearInterval(waveInterval); // This chunk is done after hit
          }

          // Clear chunk if it leaves the screen
          if (chunk.x > canvas.width + 60 || chunk.x < -60) {
            clearInterval(waveInterval);
          }
        }, 16);
      }, delay);
    }
  }
});