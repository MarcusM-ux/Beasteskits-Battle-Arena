registerAttack('GUARD POP', {
    stats : {dmg: 1, type: 'Basic', cooldown: {time: 800, switch: false}}, 
    action: (player, target)=>{
        const dir = player.facingRight ? 1 : -1
        const slide = (speed, duration, follow) => {
            const startTime = Date.now();
            
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= duration) {
                    clearInterval(interval);
                    return;
                }
                target.x += dir * speed;
                if (follow) player.x += dir * speed;

                spawnEffect(target.x, target.y + target.height/2, 40, 5, 'rgba(255,255,255,0.2)', 30);
            }, 16);
        }
        const reverseslide = (speed, duration, follow) => {
            const startTime = Date.now();
            
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= duration) {
                    clearInterval(interval);
                    return;
                }
                const reverseDir = player.facingRight ? -1 : 1
                player.x += reverseDir * speed;

                spawnEffect(player.x, player.y + player.height/2, 40, 5, 'rgba(255,255,255,0.2)', 30);
            }, 16);
        }

        const box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: '#8da5cc',
            duration: 500
        }

        // insertEffect(box)
        spawnImage('permafrost', box, {
                playAudioOnHit: false,
                audioName: '',
                target: target,
                flipX : !player.facingRight,
                flipY: false,
                priority: true
        })

        const startHP = player.stats.hp

        setTimeout(()=>{
            if (player.stats.hp < startHP){
                slide(7, 300, true)
                stun(target, 300)
    
                attackResults(player, {dmg: 1, type: 'Basic'}, target)
                player.isDodging = true

                setTimeout(()=>{player.isDodging = false}, 1000)
                
            }else {
                stun(player, 1000)
            }
    
        }, 500)
        
    }
})
