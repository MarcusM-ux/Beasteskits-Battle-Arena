registerAttack('SPINNING DRILL RUSH', {
  stats: { dmg: 7, type: 'Metal', cooldown: { time: 12000, switch: false } },
  action: (player, target) => {
    let life = 0;
    let speed = 2;
    let hitCount = 0;
    const MAX_HITS = 4;
    const HIT_INTERVAL = 300;
    let lastHit = 0;
    let dragging = false;
    let wallSlammed = false;

    const drillBox = {
      x: player.x,
      y: player.y,
      width: player.width * 0.6,
      height: player.height * 0.6,
      dmg: 2,
      type: 'Metal'
    };

    playRetreivedAudio('drill2')
    const drillInterval = setInterval(() => {
      const dir = player.facingRight ? 1 : -1;

      player.x += dir * speed;
      speed += 0.3;

      drillBox.x = player.facingRight
        ? player.x + player.width * 0.4
        : player.x - drillBox.width * 0.4;
      drillBox.y = player.y + player.height * 0.2;

      // --- Dragging: pin target to drill and carry them ---
      if (dragging) {
        stun(target, 100);
        target.x = player.facingRight
          ? player.x + player.width * 0.3
          : player.x - target.width * 0.3;
        target.y = player.y;

        // --- Wall slam check ---
        const hitLeftWall  = player.x <= 0;
        const hitRightWall = player.x + player.width >= canvas.width;

        if ((hitLeftWall || hitRightWall) && !wallSlammed) {
          wallSlammed = true;

          // Clamp both to wall
          if (hitLeftWall) {
            player.x = 0;
            target.x = 0;
          } else {
            player.x = canvas.width - player.width;
            target.x = canvas.width - target.width;
          }

          // Wall slam bonus hit
          const slamBox = {
            x: target.x,
            y: target.y,
            width: target.width,
            height: target.height,
            dmg: 8,  // Big bonus damage
            type: 'Metal'
          };
          attackResults(player, slamBox, target);
          stun(player, 1000)
          stun(target, 2000);
          target.indicate(`${target.name} was drilled into the wall!`);
          playRetreivedAudio('drill2')
          playRetreivedAudio('metal-slam')
          
          spawnEffect(target.x, target.y, target.width * 1.2, target.height * 1.2, 'rgba(255,200,50,0.7)', 500);

          clearInterval(drillInterval);
          return;
        }
      }

      // --- Normal hit detection (before grab) ---
      const now = Date.now();
      if (checkCollision(drillBox, target) && hitCount < MAX_HITS && now - lastHit > HIT_INTERVAL) {
        attackResults(player, drillBox, target);
        hitCount++;
        lastHit = now;
        dragging = true;
        target.indicate(`Drill hit ${hitCount}!`);
          playRetreivedAudio('metal-slam')
      }

      life += 50;
      if (life > 4000 && !wallSlammed) {
        clearInterval(drillInterval);
        // if (hitCount >= MAX_HITS) {
        //   target.indicate(`${target.name} escaped the drill!`);
        // }
        player.indicate(`${player.name} ran out of energy to continue!`)
      }
    }, 50);

    cancelAudio('drill2')
  }
});