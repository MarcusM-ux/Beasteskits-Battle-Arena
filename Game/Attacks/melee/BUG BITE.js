registerAttack('BUG BITE', {
    stats: { dmg: 8, type: 'Bug', cooldown: { time: 4500, switch: false } },
    action: (player, target) => {
        const dir = player.facingRight ? player.width : -player.width;
        const hitBox = { x: player.x + dir, y: player.y, width: player.width, height: player.height, duration: 500, dmg: 8, type: 'Bug' };

        stun(player, 500)
        player.indicate(`${player.name} used BUG BITE!`)
        
        spawnImage('bug_bite', hitBox, {
            playAudioOnHit: true,
            audioName: 'bite',
            target: target,
            flipX : !player.facingRight,
            flipY: false,
            priority: true
        })

        if (checkCollision(hitBox, target)) {
            attackResults(player, hitBox, target);
            
            const healAmount = 6;
            player.hp = Math.min(player.maxHp, player.hp + healAmount);
            player.indicate(`${player.name} used BUG BITE and drained ${target.name}'s health!`);
        }
    }
});