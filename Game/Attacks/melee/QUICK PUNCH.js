registerAttack('QUICK PUNCH', {
    stats: {dmg: 3, type: 'Fighting', cooldown: { time: 1500, switch: false } },
    action: (player, target) => {
        const now = Date.now();
        
        // 1. COMBO RESET & INCREMENT
        // Reset combo if the player waited too long since the last strike
        // if (now - (player.lastArmStrike || 0) > 2500) {
        //     player.armComboCount = 0;
        // }
        // player.lastArmStrike = now;
        
        const strikes = {
            1: { dmg: 3,  w: player.width,  h: player.height, spd: 2, txt: `${player.name} swung a Jab!`, animW: player.width, animH: player.height, frameDuration: 25, length: 500 },
        };

        const current = strikes[1];
        player.indicate(current.txt);
        
        // When facing left, we subtract the hitbox width from the player's x to project it forward
        const hbX = player.facingRight ? (player.x + player.width) : (player.x - current.w);
        const hitBox = {
            x: hbX,
            y: player.y,
            width: current.w,
            height: player.height,
            dmg: current.dmg,
            type: 'Fighting'
        };

        // Short "startup" stun so player can't move during the swing
        stun(player, 400);
        const punchAnimation = spawnAnimation(
            './Effects/punching.png',
            hitBox.x,
            hitBox.y,
            current.animW,
            current.animH,
            64,
            64,
            17,
            current.frameDuration,
            current.length,
            !player.facingRight
        );

        // let punchAnimation
        // let action = 'grab'
        // if (player.armComboCount < 2) {
        //     //GRAB
        //     punchAnimation = spawnAnimation(
        //         './Effects/punchingc.png',
        //         hitBox.x,
        //         hitBox.y,
        //         current.animW,
        //         current.animH,
        //         64,
        //         64,
        //         10,
        //         current.frameDuration,
        //         2000,
        //         !player.facingRight
        //     );
        // }else {
        //     punchAnimation = spawnAnimation(
        //         './Effects/punchingc.png',
        //         hitBox.x,
        //         hitBox.y,
        //         current.animW,
        //         current.animH,
        //         64,
        //         64,
        //         17,
        //         current.frameDuration,
        //         2000,
        //         !player.facingRight
        //     );
        //     action = 'punch'
        // }
        
        let hasHit = false;
        const damageInterval = setInterval(() => {
            
            if (!punchAnimation.isActive || Date.now() > punchAnimation.expiry) {
                // If it was the 4th hit and we finished/expired, apply long recovery stun
                return;
            }

            const frame = punchAnimation.currentFrame;

            // Grab Logic (Frames 0-4)
            // if (frame >= 0 && frame <= 10 && !hasHit && action == 'grab' ) {
            //     if (checkCollision(hitBox, target)) {
            //         console.log(`🤝 GRAB HIT on frame ${frame}!`);
            //         stun(target, 800);
            //         hasHit = true;
            //         pauseAnimation(punchAnimation, 800);
            //         target.indicate('Has been grabbed!');
            //     }
            // }

            // Punch Logic (Frames 5-17)
            if (frame >= 10 && frame <= 15 && !hasHit) {
                if (checkCollision(hitBox, target)) {
                    // console.log(`👊 PUNCH HIT on frame ${frame}!`);
                    player.indicate(`${player.name} punched!`)
                    
                    attackResults(player, hitBox, target);
                    
                    // Knockback logic
                    slidePlayers(8, 120, false, player, target)
                    
                    hasHit = true;

                    clearInterval(damageInterval);
                }
            }
            
            if (frame >= 15 && frame <= 17 && !hasHit) {
                let strike = {
                    x: hitBox.x,
                    y: hitBox.y,
                    width: player.width,
                    height: player.height,
                    type: 'Fighting',
                    dmg: 2
                }
                strike.x += player.facingRight ? 64 : -64
                
                if (checkCollision(strike, target)) {
                    // console.log(`👊 PUNCH HIT on frame ${frame}!`);
                    attackResults(player, strike, target);
                    
                    // Knockback logic
                    // const pushDir = player.facingRight ? 4 : -4;
                    // target.x += pushDir * current.spd * 6; // Multiplied spd for feel
                    slidePlayers(16, 120, false, player, target)
                    player.indicate(`${player.name} hit the SWEET SPOT!`)
                    noCollision(target, strike);
                    
                    hasHit = true;
                    // pauseAnimation(punchAnimation, 1000);
                    // target.indicate('Punched!');

                    // If this was the finisher, clear combo and apply recovery stun
                    clearInterval(damageInterval);
                }
            }

            
        }, 16);
    }
});