registerAttack('MAGNETIC PULL', {
    stats: { type: 'Metal', cooldown: { time: 50000, switch: false } },
    action: (player, target) => {
        const CONFIG = {
            PULL_DISTANCE: 300,
            INITIAL_PULL_POWER: 5,
            PULL_POWER_INCREMENT: 3,
            PULL_DURATION: 5000,
            DRAG_DURATION: 3000,
            INITIAL_STUN: 5000,
            DRAG_STUN: 100,
            DAMAGE_PER_TICK: 1,
            EXPLOSION_GROWTH: 3,
            EXPLOSION_DAMAGE_GROWTH: 2,
            EXPLOSION_KNOCKBACK_GROWTH: 3,
            DISTANCE_THRESHOLD: 10,
            TICK_RATE: 100
        };

        const state = {
            elapsedTime: 0,
            pullPower: CONFIG.INITIAL_PULL_POWER,
            caught: false,
            exploding: false
        };

        // Helper function to check player input
        const isPlayerInputting = () => {
            return (player.isPlayer1 && keybinds.attacks.r) ||
                   (!player.isPlayer1 && keybinds.attacks.m);
        };

        // Helper function to move target towards player
        const moveToPull = () => {
            const dx = player.x - target.x;
            const dy = player.y - target.y;

            if (checkCollision(player, target)){
                target.x = (Math.random() + player.x - player.width) * 1.8
                target.y = (Math.random() + player.y - player.height) * 1.8
                state.caught = true;
            }

            target.x += dx * 0.15
            target.y += dy * 0.15
            // if (Math.abs(dx) > CONFIG.DISTANCE_THRESHOLD) {
            //     target.x += Math.sign(dx) * state.pullPower;
                
            // } else if (Math.abs(dx) < CONFIG.DISTANCE_THRESHOLD){
            //     target.x -= Math.sign(dx) * state.pullPower;
            
            // }else {
            //     target.x = (Math.random() + player.x - player.width) * 1.8
            //     state.caught = true;
            // }

            // if (Math.abs(dy) > CONFIG.DISTANCE_THRESHOLD) {
            //     target.y += Math.sign(dy) * state.pullPower;
                
            // } else if (Math.abs(dy) < CONFIG.DISTANCE_THRESHOLD){
            //     target.y -= Math.sign(dy) * state.pullPower;
            
            // }else{
            //     target.y = (Math.random() + player.y - player.height) * 1.8
            //     state.caught = true;
            // }
        };

        // PULL PHASE
        stun(player, CONFIG.INITIAL_STUN);
        const pullInterval = setInterval(() => {
            state.elapsedTime += CONFIG.TICK_RATE;

            if (isPlayerInputting()) {
                player.indicate(`${player.name} magnetic pull INCREASED!`);
                state.pullPower += CONFIG.PULL_POWER_INCREMENT;
            }

            if (state.caught) {
                target.x = player.x;
                target.y = player.y;
                target.indicate(`${target.name} has been CAUGHT in the magnetic pull!`);
                stun(target, CONFIG.DRAG_STUN);
            }

            moveToPull();

            if (state.elapsedTime > CONFIG.PULL_DURATION) {
                clearInterval(pullInterval);
                if (state.caught) {
                    startDragPhase();
                }
            }
        }, CONFIG.TICK_RATE);

        // DRAG/EXPLOSION PHASE
        const startDragPhase = () => {
            stun(player, 0);

            const explosionRig = {
                x: player.x,
                y: player.y,
                width: 5,
                height: 5,
                color: 'gray',
                type: 'Metal',
                dmg: 0,
                knockback: 5
            };

            state.elapsedTime = 0;
            state.exploding = false;

            const dragInterval = setInterval(() => {
                state.elapsedTime += CONFIG.TICK_RATE;
                // stun(target, CONFIG.DRAG_STUN);

                // Keep target locked to player
                target.x = player.x + (player.facingRight ? -8 : 8);
                target.y = player.y;

                // Apply continuous damage
                if (state.elapsedTime % 2 === 0 && Math.random() > 0.5 && player.stats.hp > player.baseStats.hp * 0.60) {
                    attackResults(player, { dmg: CONFIG.DAMAGE_PER_TICK, type: 'Metal' }, target);
                    stun(player, 100)
                }

                // Toggle explosion on input
                if (isPlayerInputting() && !state.exploding) {
                    state.exploding = true;
                    player.indicate(`${player.name} is about to explode!`);
                }

                // Build explosion if active
                if (state.exploding && explosionRig.dmg < 30) {
                    explosionRig.width += CONFIG.EXPLOSION_GROWTH;
                    explosionRig.height += CONFIG.EXPLOSION_GROWTH;
                    explosionRig.x = player.x;
                    explosionRig.y = player.y;
                    explosionRig.dmg += CONFIG.EXPLOSION_DAMAGE_GROWTH;
                    explosionRig.knockback += CONFIG.EXPLOSION_KNOCKBACK_GROWTH;
                    spawnEffect(explosionRig.x, explosionRig.y, explosionRig.width, explosionRig.height, explosionRig.color, 100);
                }

                // End drag phase
                if (state.elapsedTime > CONFIG.DRAG_DURATION) {
                    clearInterval(dragInterval);
                    endAttack(explosionRig);
                }
            }, CONFIG.TICK_RATE);
        };

        // Final explosion and knockback
        const endAttack = (explosionRig) => {
            stun(player, 1000);
            stun(target, 1000);

            attackResults(player, explosionRig, target);
            attackResults(player, explosionRig, player);

            player.x += 10 * explosionRig.knockback;
            target.x += -10 * explosionRig.knockback;
        };
    }
});
