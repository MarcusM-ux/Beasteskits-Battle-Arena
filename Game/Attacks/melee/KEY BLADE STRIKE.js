registerAttack('KEY BLADE STRIKE', {
    stats : {dmg: 6, type: 'Metal', cooldown: {time: 8000, switch: false}}, 
    action: (player, target)=>{

        if (!player.activeKeyBlade) {
            player.indicate(`${player.name} does not have an active key blade!`)
            return
        }
        player.indicate(`${player.name} is using its Key Blade Special Strike!`)
        
        const dir = (player.facingRight) ? player.width : -player.width
        let YSpeedIncrement = 1.15
        const animationBox = {
            x: player.x + dir,
            y: player.y, // Start above the player
            width: player.width * 1.25,
            height: player.height,
            duration: 5000,
            color: 'gray',
            type: 'Metal',
            dmg: 6,
            vy: 2,
            vx: 2
        }

        const configures = {
            'balance' : {
                dmgMult : 1,
                duration: 50,
                length: 1050,
                hits: 1,
                color: '#e59d4c'
            },
            'attack' : {
                dmgMult : 1.8,
                duration: 80,
                length: 1680,
                hits : 2,
                color: '#e5594c'
            },
            'defense' : {
                dmgMult : 2,
                duration: 200,
                length: 4200,
                hits: 2,
                color: '#4cb6e5'
            },
            'speed' : {
                dmgMult : 0.8,
                duration: 20,
                length: 420,
                hits: 4,
                color: '#cfe54c'
            }
        }
        
        const config = configures[player.activeKeyBlade]
        stun(player, config.length)
        animationBox.dmg *= config.dmgMult
        
        const animation = spawnAnimation(
                './Effects/Keys/slash_key.png',
                animationBox.x,
                animationBox.y,
                126,
                126,
                105,
                126,
                21,
                config.duration,
                config.length,
                !player.facingRight
        );      

        let life = 0
        let hits = 0
        
        const damageInterval = setInterval(() => {
            // 1. Safety check: if animation is gone or finished
            if (!animation || (animation.isActive && Date.now() > animation.expiry)) {
                clearInterval(damageInterval);
                return;
            }

            // 2. Sync the frame calculation exactly like the draw loop does
            const now = Date.now();
            const timeElapsed = now - animation.startTime;
            const currentFrame = Math.floor(timeElapsed / animation.frameDuration);
            spawnEffect(animationBox.x,animationBox.y, animationBox.width, animationBox.height, config.color, config.duration)
            
            if (currentFrame >= 2 && currentFrame <= 20) {
                if (checkCollision(animationBox, target) && hits < config.hits) {
                    hits += 1
                    
                    playRetreivedAudio('quick-whoosh');
                    playRetreivedAudio('body-thud');
                    
                    stun(target, 1000);
                    attackResults(player, animationBox, target); // Apply the 15 damage
                    
                    target.x += (player.facingRight) ? 15 : -15
                }
            }
            
            if (life > 1500) {
                clearInterval(damageInterval);
            }
        }, 16);

    }
    
})