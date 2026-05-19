registerAttack('VOID BURST', {
    stats: { dmg: 22, type: 'Dark', cooldown: { time: 12000, switch: false } }, action: (player, target) => {

        const sizeBasedHealth = 200 * (player.stats.hp / 100)
        // A large explosion centered on the player
        spawnEffect(player.x, player.y, sizeBasedHealth, sizeBasedHealth, 'black', 500);
        const attackName = 'VOID BURST'
        player.indicate(`${player.name} used ${attackName}!`)

        if (checkCollision({ x: player.x, y: player.y, width: sizeBasedHealth, height: sizeBasedHealth}, target)) {
        attackResults(player, { dmg: 22, type: 'Dark' }, target);
        stun(target, 1000);
    }
}
})