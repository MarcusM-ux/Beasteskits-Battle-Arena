registerAttack('VILE THRUST', {
    stats: { dmg: 8, type: 'Fighting', cooldown: { time: 3000, switch: false } },
    action: (player, target) => {
        const attributes = attackFunctions["VILE THRUST"].stats;
        
        let life = 0;
        let hit = false;
        const dashSpeed = 25; // How fast the player moves
        const dashDuration = 800; // How long the dash lasts (ms)
        
        playRetreivedAudio('fireball');
        // Optional: Stun the player briefly so they can't move manually during the thrust
        // stun(player, dashDuration);
        
        const thrustInterval = setInterval(() => {
            // 1. Move the actual player
            player.x += player.facingRight ? dashSpeed : -dashSpeed;

            // 2. Create the trail effect behind the player
            // spawnEffect(
            //     player.x,
            //     player.y,
            //     player.width,
            //     player.height,
            //     'orange',
            //     150
            // );

            // We use a temporary object to represent the "hitbox" of the dash
            let dir = player.facingRight ? -50 : 50
            const dashHitbox = {
                x: player.x + dir,
                y: player.y,
                width: player.width,
                height: player.height,
                dmg: attributes.dmg,
                type: 'Fighting',
                duration: 50
            }

            spawnImage('thrust', dashHitbox, {
                playAudioOnHit: false,
                audioName: '',
                target: target,
                flipX : !player.facingRight,
                flipY: false,
                priority: true
            })
        
            if (checkCollision(dashHitbox, target) && !hit) {
                attackResults(player, dashHitbox, target);
                rebukeCollision(player, target, 1.5)
                playRetreivedAudio('body-thud');
                stun(target, 500)
                hit = true; 
                // We don't clear the interval here so the player finishes the dash movement
            }

            life += 50;
            if (life >= dashDuration) {
                clearInterval(thrustInterval);
            }
        }, 50);
    }
});