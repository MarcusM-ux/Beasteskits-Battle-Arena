registerAttack('POLLEN CLOUD', {
    stats: { type: 'Air', cooldown: { time: 6000, switch: false } },
    action: (player, target) => {
        const cloud = {
            x: player.x,
            y: player.y,
            width: 150,
            height: 150,
            duration: 100
        };
        let velX = player.facingRight ? 18 : -18;
        let velY = 18; // Start with a diagonal bounce

        let life = 0
        const cloudInterval = setInterval(() => {
            if (life > 5000) {
                clearInterval(cloudInterval);
                return;
            }
            life += 100

            cloud.x += velX
            cloud.y += velY

            // 2. Wall Bounce Logic (X-axis)
            if (cloud.x <= 0 || cloud.x >= canvas.width - player.width) {
                velX *= -1; // Flip horizontal direction
                // playRetreivedAudio('body-thud'); // Feedback for bounce
                // spawnEffect(player.x, player.y, player.width, player.height, 'white', 100);
            }

            // 3. Wall Bounce Logic (Y-axis)
            if (cloud.y <= 0 || cloud.y >= canvas.height - cloud.height) {
                velY *= -1; // Flip vertical direction
                // playRetreivedAudio('body-thud');
            }
            
            // Visual for the gas cloud
            spawnImage('pollen_cloud', cloud, {
                playAudioOnHit: false,
                audioName: '',
                target: target,
                flipX : !player.facingRight,
                flipY: false,
                priority: true,
                // tint: '#e85158'
            })
            
            if (checkCollision(cloud, target) && life % 2 === 0) {
                // target.stats.spd = Math.max(0.5, target.stats.spd - 0.5); // Slow them
                target.stats.hp -= 1 // Siphon health
                target.indicate(`${target.name} is being chocked by the pollen cloud!`);
                target.updateLabel()
            }
        }, 100);
    }
});