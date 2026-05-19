registerAttack('MOUNTAIN BARRIERS', {
  stats: { type: 'Ground', cooldown: { time: 6000, switch: false } },
  action: (player, target) => {
    const BARRIER_WIDTH = 20;
    const BARRIER_HEIGHT = player.height * 1.8;
    const BARRIER_DURATION = 5000;
    const STUN_ON_CONTACT = 600;

    stun(player, 400);
    player.indicate(`${player.name} raised stone barriers!`);

    // Left barrier
    const leftBarrier = {
      x: player.x - BARRIER_WIDTH * 3,
      y: player.y + player.height - BARRIER_HEIGHT,
      width: BARRIER_WIDTH,
      height: BARRIER_HEIGHT,
      dmg: 2,
      type: 'Ground'
    };

    // Right barrier
    const rightBarrier = {
      x: player.x + player.width + BARRIER_WIDTH * 2,
      y: player.y + player.height - BARRIER_HEIGHT,
      width: BARRIER_WIDTH,
      height: BARRIER_HEIGHT,
      dmg: 2,
      type: 'Ground'
    };

    let barrierLife = 0;
    const barrierInterval = setInterval(() => {
      spawnEffect(leftBarrier.x, leftBarrier.y, leftBarrier.width, leftBarrier.height, 'rgba(120,100,60,0.75)', 200);
      spawnEffect(rightBarrier.x, rightBarrier.y, rightBarrier.width, rightBarrier.height, 'rgba(120,100,60,0.75)', 200);

      // Stun target on contact with either barrier
      if (checkCollision(leftBarrier, target) || checkCollision(rightBarrier, target)) {
        attackResults(player, leftBarrier, target); // Use leftBarrier box for dmg calc
        stun(target, STUN_ON_CONTACT)
        target.indicate(`${target.name} hit a stone barrier!`);

        const dir = (target.facingRight) ? -25 : 25
        target.x += dir
      }

     // [leftBarrier, rightBarrier].forEach(bar => {
     //    if (checkCollision(player, bar)){
     //    rebukeCollision(bar, player, 1)
     //    rebukeCollision(bar, player, 1)
     //    }
     //  })
      
      barrierLife += 100;
      if (barrierLife >= BARRIER_DURATION) {
        clearInterval(barrierInterval);
        player.indicate(`The barriers crumbled.`);
      }
    }, 100);
  }
});