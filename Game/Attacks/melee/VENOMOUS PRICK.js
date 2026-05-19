registerAttack('VENOMOUS PRICK', {
    stats : {dmg: 6, type: 'Toxic', cooldown: {time: 5000, switch: false}}, action: (player, target)=> {
        let box = {
            x: player.x,
            y: player.y * 1.1,
            width: player.width * 0.85,
            height: player.height / 2,
            dmg: attackFunctions["VENOMOUS PRICK"].stats.dmg,
            color: 'purple',
            type: 'Toxic',
            duration: 1500
        }

        let isFacingRight = player.facingRight
        if (isFacingRight){
            player.x += 15
            box.x = player.x + player.width
        }else {
            player.x -= 15
            box.x = player.x - player.width
        }
        stun(player, box.duration)
        // spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration)

        const animation = spawnAnimation(
            './Effects/venom_prick.png',
            box.x,
            box.y,
            72, //size width
            72, //size height
            128,
            128,
            11,
            50,
            550,
            !player.facingRight
        );

        let hasHit = false;
        const preImage = player.image.src
        const preType = player.type
        
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
        
            if (currentFrame >= 4 && currentFrame <= 9 ) {
                if (checkCollision(box, target) && !hasHit) {
                    hasHit = true
                    stun(target, 500)
                    attackResults(player, box, target)
                    
                    if (Math.random() > 0.50) {
                        if (target.type == 'Toxic' || target.type == 'Metal'){
                            target.indicate(`${target.name} cannot be POISONED! Its ${target.type} Type!`)
                            target.stats.hp -= box.dmg
                            target.updateLabel()
                            return
                        }
                        target.indicate(`${target.name} has been POISONED by ${player.name} temporarily!`)
                        if (player.name === 'Cornickelle') {
                            player.indicate(`${player.name} has became VENOMOUS!`)
                            player.type = 'Toxic'
                            player.image.src = './PixelArt/Transformations/Cornickelle.png'
                        }
            
                        let life = 0
                        const poisonInterval = setInterval(()=>{
                            const particle = spawnAnimation(
                                './Effects/Status/poison_effect.png',
                                target.x,
                                target.y,
                                72, //size width
                                72, //size height
                                128,
                                128,
                                6,
                                50,
                                300,
                                !player.facingRight
                            );
                                        
                            if (life > 1000) {
                                player.image.src = preImage
                                player.type = preType
                                player.indicate(`${player.name} has returned back to normal.`)
                                clearInterval(poisonInterval)
                            }
                            life += 300
            
                            target.stats.hp -= 1
                            target.updateLabel()
                            target.indicate(`${target.name} is taking damage from being POISONED!`)
                        }, 300)
                    }
                    
                }
            }
        
            // 4. Stop checking once animation ends
            if (currentFrame >= animation.frameCount) {
                clearInterval(damageInterval);
            }
        }, 16);

        
        
    }

    
})