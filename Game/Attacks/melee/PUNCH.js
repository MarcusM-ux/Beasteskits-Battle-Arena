registerAttack('PUNCH', {
    stats: { dmg: 1, type: 'Basic', cooldown: { time: 500, switch: false } },
    action: (player, target) => {
        const range = player.facingRight ? 40 : -40;
        const box = { x: player.x + range, y: player.y, width: player.width / 2, height: player.height, dmg: 1, type: 'Basic' };
            
        spawnEffect(box.x, box.y, box.width, box.height, 'gray', 100);
        if (checkCollision(box, target)) {
            slidePlayers(4, 200, true, player, target)
            attackResults(player, box, target);
        }
    }
});