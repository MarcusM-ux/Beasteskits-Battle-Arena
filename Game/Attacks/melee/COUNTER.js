registerAttack('COUNTER', {
    stats: { type: 'Fighting', cooldown: { time: 12000, switch: false } },
    action: (player, target) => {
        // --- PART 1: The Actual Attack (The 'SNATCH' logic) ---
        function triggerCounterAttack(text, basedmg) {
            stun(target, 2000);
            let counterBox = {
                x: player.x,
                y: player.y - (player.height + 20),
                width: player.width,
                height: player.height,
                color: '#302933',
                duration: 4000,
                dmg: basedmg,
                type: 'Fighting'
            };

            // This now uses the updated facingRight property set during the teleport
            counterBox.x += (player.facingRight) ? player.width + 10 : -player.width - 10;
            let life = 0;
            let speedIncrement = 1.15;
            let hit = false;

            const moveInterval = setInterval(() => {
                life += 100;
                counterBox.y += 22 * speedIncrement;
                speedIncrement += 0.18;

                spawnEffect(counterBox.x, counterBox.y, counterBox.width, counterBox.height, counterBox.color, 150);

                if (checkCollision(counterBox, target) && !hit) {
                    playRetreivedAudio('quick-whoosh');
                    playRetreivedAudio('body-thud');
                    stun(target, counterBox.duration);
                    attackResults(player, counterBox, target);

                    // target.x += (player.facingRight) ? 65 : -65;
                    slidePlayers(8, 200, false, player, target, false)
                    spawnEffect(target.x, target.y, target.width, target.height, 'black', 500);
                    hit = true;
                }
                
                player.indicate(text)
                
                if (life > 600 || counterBox.y > canvas.height) {
                    clearInterval(moveInterval);
                }
            }, 100);
        }

        // --- PART 2: The Stance ---
        let stanceLife = 0;
        let maxStanceTime = 3000;
        let startingHP = player.stats.hp;

        stun(player, maxStanceTime);
        player.indicate("READY TO COUNTER...");

        const stanceInterval = setInterval(() => {
            stanceLife += 100;
            // player.isDodging = true

            if (stanceLife % 500 === 0) {
                spawnEffect(player.x, player.y, player.width, player.height, '#173a5a', 300);
            }
            
            if (player.stats.hp < startingHP) {
                const damageTaken = startingHP - player.stats.hp;
                const recoveryMultiplier = 0.5;
                const healAmount = damageTaken * recoveryMultiplier;

                const distanceThreshold = player.width;
                const dx = target.x - player.x;
                let text;
                let basedmg;
                // AUTOMATIC TELEPORT LOGIC
                if (Math.abs(dx) > distanceThreshold * 2) {
                    player.indicate(`${target.name} is too far for ${player.name} to counter!`)
                    clearInterval(stanceInterval);
                    stun(player, 0)
                    return
                }
                
                if (Math.abs(dx) > distanceThreshold) {
                    text = `${player.name} countered the oncoming attack! Reducing the damage it took.`
                    
                    // 1. Move the player
                    player.x = target.x + (target.facingRight ? -60 : 60);
                    player.y = target.y;

                    // 2. FACE THE TARGET (The Fix)
                    // If the player landed at target.x - 60, target is to the right.
                    // If the player landed at target.x + 60, target is to the left.
                    player.facingRight = (player.x < target.x);
                    
                    spawnEffect(player.x, player.y, player.width, player.height, '#00ffcc', 400);
                    player.stats.hp += healAmount;
                    if (player.stats.hp > player.stats.maxHp) player.stats.hp = player.stats.maxHp;
                    player.updateLabel()
                    basedmg = 8

                } else {
                    text = "FULL ON COUNTER!"
                    spawnEffect(player.x, player.y, player.width, player.height, 'cyan', 400);

                    player.stats.hp = startingHP
                    player.updateLabel()
                    basedmg = 12
                }


                triggerCounterAttack(text, basedmg);
                clearInterval(stanceInterval);
                stun(player, 0);
            }

            if (stanceLife >= maxStanceTime || Math.abs(player.vx) > 5 || Math.abs(player.vy) > 5) {
                clearInterval(stanceInterval);
                stun(player, 0);
                // player.isDodging = false
            }
        }, 100);
    }
});