registerAttack('MULTI CHOMPS', {
    stats: {
        dmg: 12,
        type: 'Basic',
        cooldown: { time: 12000, switch: false }
    },
    action: (player, target) => {
        const fangOffset = player.facingRight ? 64 : -64;
        let fangConfig = {
            x: player.x + fangOffset,
            y: player.y,
            width: player.width,
            height: player.height
        };

        const spawnFangs = (duration) => {
            spawnImage('vicious_fangs', {
            x: player.x + fangOffset,
            y: player.y,
            width: player.width,
            height: player.height
        , duration }, {
                playAudioOnHit: false,
                audioName: 'bite',
                target: target,
                flipX: !player.facingRight,
                flipY: false,
                priority: true
            });
        };

        const executeChompSequence = (delay, dmg, stunTime, slideDistance, fangDuration) => {
            setTimeout(() => {
                spawnFangs(fangDuration);
                stun(player, stunTime);
                slidePlayers(slideDistance, stunTime, false, player, player, false);
                
                if (checkCollision({x: player.x + fangOffset,
            y: player.y,
            width: player.width,
            height: player.height}, target)) {
                    attackResults(player, { dmg, type: 'Basic' }, target);
                    slidePlayers(slideDistance, stunTime, true, player, target, false);
                    
                }
            }, delay);
        };

        stun(player, 1000);
        slidePlayers(2, 300, false, player, player, false);
        spawnFangs(300);

        // Chomp 1
        executeChompSequence(200, 3, 200, 5, 200);
        // Chomp 2
        executeChompSequence(200, 6, 200, 5, 200);
        // Chomp 3
        executeChompSequence(200, 12, 200, 5, 200);
    }
});
