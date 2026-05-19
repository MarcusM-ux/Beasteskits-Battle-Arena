registerAttack('DRAG', {
    stats: {
        dmg: 3,
        type: 'Basic',
        cooldown: {
            time: 9000,
            switch: false
        }
    },
    action: (player, target) => {
        const attackStats = attackFunctions.WRAP.stats;
        const originalSpeed = player.stats.spd;
        // Start with no initial stun on player to allow "hunting"
        // Only stun the target once caught
        let life = 0;
        let choked = false;
        
        // --- THROW CONFIGURATION ---
        const throwDistance = 200; // How far to throw the target
        const throwSpeed = 20;     // Speed of the throw
        const throwDuration = 300; // Total time of throw animation (ms)
        // ---------------------------

        const interval = setInterval(() => {
            // End condition
            if (life > 4000 || isGameOver) {
                target.indicate('');
                player.stats.spd = originalSpeed; // Reset speed

                // --- FINISHED: THROW MECHANIC ---
                if (choked) {
                    const direction = (player.facingRight) ? 1 : -1;
                    const endX = target.x + (throwDistance * direction);
                    const throwStep = (throwDistance / (throwDuration / 50)) * direction;
                    let throwLife = 0;

                    // Stun target during flight
                    stun(target, throwDuration + 100);

                    const throwInterval = setInterval(() => {
                        target.x += throwStep;
                        target.indicate('THROWN!');
                        
                        throwLife += 50;
                        if (throwLife >= throwDuration) {
                            clearInterval(throwInterval);
                            target.indicate('');
                        }
                    }, 50);
                }
                // --------------------------------

                clearInterval(interval);
                return;
            }

            life += 100;

            // 1. DETECTION PHASE
            if (!choked && checkCollision(player, target)) {
                choked = true;
                player.indicate(`${player.name} is dragging ${target.name}!`);
                // Slow the player down because they are carrying weight
                player.stats.spd = originalSpeed * 0.6;
            }

            // 2. SLITHER PHASE (The user is moving, target is dragged)
            if (choked) {
                // Keep target stunned and locked to player
                stun(target, 200);
                // Dragging logic: Target follows player with a slight offset
                target.x = player.x + (player.width / 4);
                target.y = player.y;
                target.indicate(`${player.name} is being DRAGGED!!`);
                
                // Damage Ticks
                if (life % 500 === 0) {
                    target.stats.hp -= Math.floor(Math.random() * 3 + 1);
                    target.updateLabel();
                }
            } else {
                // Aura while hunting
                spawnEffect(player.x, player.y, player.width, player.height, 'gray', 100);
            }
        }, 100);
    }
});
