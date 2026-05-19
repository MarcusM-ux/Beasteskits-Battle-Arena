registerAttack('SNOWFALL', {
  stats: { dmg: 5, type: 'Frost', cooldown: { time: 10000, switch: false } },
  action: (player, target) => {
    const DURATION = 4000;
    const SPAWN_RATE = 300; // New flake every 300ms
    const FLAKE_SPEED = 4;
    const SLOW_FACTOR = 0.7;
    const SLOW_DURATION = 2000;

    stun(player, 400);
    player.indicate(`${player.name} calls a blizzard!`);

    let snowLife = 0;
    let targetSlowed = false;

    const snowInterval = setInterval(() => {
      // Spawn a new flake at a random x across the top
      const flake = {
        x: Math.random() * (canvas.width - 20),
        y: 0,
        width: 18,
        height: 18,
        dmg: 1,
        type: 'Frost'
      };

      let flakeLife = 0;
      const flakeInterval = setInterval(() => {
        flake.y += FLAKE_SPEED;
        spawnEffect(flake.x, flake.y, flake.width, flake.height, 'rgba(180, 220, 255, 0.75)', 200);

        if (checkCollision(flake, target)) {
          if (target.flakeHits < 4) attackResults(player, flake, target);
            target.flakeHits++
            
          // Apply slow if not already slowed
          if (!targetSlowed) {
            targetSlowed = true;
            target.stats.spd *= SLOW_FACTOR;
            target.indicate(`${target.name} is slowed by the cold!`);

            setTimeout(() => {
              target.stats.spd /= SLOW_FACTOR;
              targetSlowed = false;
              target.indicate(`${target.name} thawed out.`);
            }, SLOW_DURATION);
          }

          clearInterval(flakeInterval); // Flake disappears on hit
        }

        if (checkCollision(flake, player)) {
          if (player.flakeHits < 4) attackResults(player, flake, player);
            player.flakeHits++

          // Apply slow if not already slowed
          if (!playerSlowed) {
            playerSlowed = true;
            player.stats.spd *= SLOW_FACTOR;
            player.indicate(`${target.name} is slowed by the cold!`);

            setTimeout(() => {
              player.stats.spd /= SLOW_FACTOR;
              player = false;
              player.indicate(`${target.name} thawed out.`);
            }, SLOW_DURATION);
          }

          clearInterval(flakeInterval); // Flake disappears on hit
        }

        flakeLife += 50;
        if (flakeLife > 2000) flake.dmg = 0
        if (flake.y > canvas.height) clearInterval(flakeInterval);
      }, 50);

      snowLife += SPAWN_RATE;
      if (snowLife >= DURATION){
          clearInterval(snowInterval);
          player.flakeHits = 0
          target.flakeHits = 0
          
      }
    }, SPAWN_RATE);
  }
});