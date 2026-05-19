registerAttack('STRIKE', {
    stats : {dmg: 9, type: 'Basic', cooldown: {time: 9000, switch: false}}, action: (player, target)=> {
        let box = {
            x: player.x,
            y: player.y,
            width: player.width * 1.5,
            height: player.height,
            dmg: attackFunctions.STRIKE.stats.dmg,
            color: 'white',
            type: 'Basic',
            duration: 1500
        }

        player.indicate(`${player.name} is striking!`)
        stun(player, box.duration)
        const animation = spawnAnimation(
            './Effects/strike.png',
            box.x,
            box.y,
            72,
            72 ,
            128 ,
            128 ,
            14,
            25,
            350,
            !player.facingRight
        );       
        
        if (player.type === 'Fighting') {
            player.indicate(`${player.name} used STRIKE! It became a Fighting Type Attack and it dealts more damage!`)
            box.color = 'orange'
            box.type = 'Fighting'
            box.damage = 10
        }
        
        let hasHit = false;
        const damageInterval = setInterval(() => {
            // 2. DYNAMIC POSITIONING 
            // This ensures the hitbox follows the player if they move!
            if (player.facingRight) {
                box.x = player.x + player.width;
                animation.x = box.x
            } else {
                box.x = player.x - box.width;
                animation.x = box.x
            }
            box.y = player.y;
            animation.y = box.y

            // Optional: Visual debugging
            spawnEffect(box.x, box.y, box.width, box.height, 'rgba(255,255,255,0.3)', 16);

            if (!animation || (animation.isActive && Date.now() > animation.expiry)) {
                clearInterval(damageInterval);
                return;
            }
        
            const now = Date.now();
            // Important: Subtract the time it took to load if you want perfect sync
            const timeElapsed = now - animation.startTime;
            const currentFrame = Math.floor(timeElapsed / animation.frameDuration);
        
            // 3. FRAME WINDOW
            // If the target is moving fast, check collision every frame 
            // between 8 and 14.
            if (currentFrame >= 8 && currentFrame <= 14 && !hasHit) {
                if (checkCollision(box, target)) {
                    attackResults(player, box, target);
                    rebukeCollision(box, target, 1.2);
                    hasHit = true; 
                    // Note: We don't clear interval here so visuals can keep drawing
                }
            }
        
            if (currentFrame >= animation.frameCount) {
                clearInterval(damageInterval);
            }
        }, 16);

    }
})