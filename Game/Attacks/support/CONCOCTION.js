registerAttack('CONCOCTION', {
    stats: { type: 'Plant', cooldown: { time: 10000, switch: false } },
    action: (player, target) => {
        const formula = Math.ceil(Math.random() * 4);
        const duration = 5000;
        
        playRetreivedAudio('glass-break'); // Hypothetical sound
        player.indicate(`${player.name} is making a CONCOCTION!`)
        const box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            duration: 500
        }

        stun(player, 600)
        switch(formula) {
            case 1: // Adrenaline Serum
                player.stats.atk += 15;
                spawnImage('Zooms/red', box, {
                    playAudioOnHit: false,
                    audioName: '',
                    target: target,
                    flipX : !player.facingRight,
                    flipY: false,
                    priority: true,
                    // tint: '#e85158'
                })
                playRetreivedAudio('pop')
                // spawnEffect(player.x, player.y, player.width, player.height, '#ff4d4d', 500);
                player.indicate(`${player.name} is temporarily stronger!`)
                setTimeout(() => player.stats.atk -= 15, duration);
                break;
            case 2: // Iron-Bark Tonic
                player.stats.def += 15;
                spawnImage('Zooms/blue', box, {
                    playAudioOnHit: false,
                    audioName: '',
                    target: target,
                    flipX : !player.facingRight,
                    flipY: false,
                    priority: true,
                    // tint: '#e85158'
                })
                playRetreivedAudio('pop')
                
                // spawnEffect(player.x, player.y, player.width, player.height, '#99ff99', 500);
                player.indicate(`${player.name} is temporarily more durable!`)
                setTimeout(() => player.stats.def -= 15, duration);
                break;
            case 3: // Chlorophyll Fuel
                player.stats.spd += 1.8;
                spawnImage('Zooms/yellow', box, {
                    playAudioOnHit: false,
                    audioName: '',
                    target: target,
                    flipX : !player.facingRight,
                    flipY: false,
                    priority: true,
                    // tint: '#e85158'
                })
                playRetreivedAudio('pop')
                
                // spawnEffect(player.x, player.y, player.width, player.height, '#33ccff', 500);
                player.indicate(`${player.name} is temporarily faster!`)
                setTimeout(() => player.stats.spd -= 1.8, duration);
                break;
            case 4: // Adrenaline Serum
                player.stats.hp += 15;
                spawnImage('Zooms/green', box, {
                    playAudioOnHit: false,
                    audioName: '',
                    target: target,
                    flipX : !player.facingRight,
                    flipY: false,
                    priority: true,
                    // tint: '#e85158'
                })
                playRetreivedAudio('pop')
                
                // spawnEffect(player.x, player.y, player.width, player.height, '#ff4d4d', 500);
                player.indicate(`${player.name} gained health!`)
                setTimeout(() => player.stats.atk -= 15, duration);
                break;
        }
    }
});