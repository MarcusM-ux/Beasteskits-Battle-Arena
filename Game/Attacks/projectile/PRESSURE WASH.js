// --- Full registration for PRESSURE WASH ---
registerAttack('PRESSURE WASH', {
    stats: {
        dmg: 2,
        type: 'Water',
        cooldown: {
            time: 6000,
            switch: false
        }
    },
    action: (player, target) => {
        const DURATION_MS = 1000; // total spray duration
        const TICK_MS = 200; // spawn every 100ms
        const TOTAL_TICKS = Math.ceil(DURATION_MS / TICK_MS);
        const SPEED = 6; // px per tick
        const SIZE = 18; // square size
        const DAMAGE_PER_DROP = 2;
        const MAX_DISTANCE = 310; // NEW: Maximum pixels a drop can travel
        let hit = 0;

        // stun the player for duration
        player.stunTimer = Date.now() + DURATION_MS;
        const attackName = 'PRESSURE WASH';
        player.indicate(`${player.name} used ${attackName}!`);

        const spawned = [];
        let tick = 0;
        const sprayInterval = setInterval(() => {
            // direction: toward target if provided, otherwise facing direction
            let dirX = 0,
                dirY = 0;
            if (target) {
                const cx = player.x + player.width / 2;
                const cy = player.y + player.height / 2;
                const tx = target.x + target.width / 2;
                const ty = target.y + target.height / 2;
                const dx = tx - cx;
                const dy = ty - cy;
                const mag = Math.sqrt(dx * dx + dy * dy) || 1;
                dirX = dx / mag;
                dirY = dy / mag;
            } else {
                dirX = player.facingRight ? 1 : -1;
                dirY = 0;
            }

            // add spread
            const spreadAngle = (Math.random() - 0.5) * (Math.PI / 6);
            const baseAngle = Math.atan2(dirY, dirX);
            const angle = baseAngle + spreadAngle;
            const vx = Math.cos(angle) * SPEED;
            const vy = Math.sin(angle) * SPEED;

            const startX = player.x + player.width / 2 + (player.facingRight ? 12 : -12);
            const startY = player.y + player.height / 2;

            const drop = {
                x: startX,
                y: startY,
                startX: startX, // NEW: track start position
                startY: startY, // NEW: track start position
                width: SIZE,
                height: SIZE,
                vx,
                vy,
                dmg: DAMAGE_PER_DROP,
                type: 'Water',
                createdAt: Date.now(),
            };

            // initial visual
            spawnEffect(drop.x - drop.width / 2, drop.y - drop.height / 2, drop.width, drop.height, 'lightblue', 300);
            spawned.push(drop);

            tick++;
            if (tick >= TOTAL_TICKS) {
                clearInterval(sprayInterval);
            }
        }, TICK_MS);

        // Updater to move drops, check collisions
        const updaterInterval = setInterval(() => {
            const now = Date.now();
            for (let i = spawned.length - 1; i >= 0; i--) {
                const s = spawned[i];

                // move
                s.x += s.vx;
                s.y += s.vy;

                // NEW: Calculate distance traveled
                const dist = Math.sqrt(Math.pow(s.x - s.startX, 2) + Math.pow(s.y - s.startY, 2));

                // collision with target
                if (target && checkCollision(s, target) && hit < 3) {
                    hit++;
                    attackResults(player, {
                        dmg: s.dmg,
                        type: s.type
                    }, target);
                    spawned.splice(i, 1);
                    continue;
                }

                // expire if too far, older than DURATION_MS or out of bounds
                if (dist > MAX_DISTANCE || now - s.createdAt > DURATION_MS || s.x < -50 || s.x > canvas.width + 50 || s.y < -50 || s.y > canvas.height + 50) {
                    spawned.splice(i, 1);
                } else {
                    // trailing visual
                    spawnEffect(s.x - s.width / 2, s.y - s.height / 2, s.width, s.height, 'lightblue', 120);
                }
            }

            // clear updater and remove stun when done
            if (spawned.length === 0 && Date.now() >= (player.stunTimer || 0)) {
                clearInterval(updaterInterval);
                player.stunTimer = null;
                if (player.indicate) player.indicate('');
            }
        }, 16);

        // safety fallback to clear stun
        setTimeout(() => {
            player.stunTimer = null;
            if (player.indicate) player.indicate('');
        }, DURATION_MS + 200);
    }
});
