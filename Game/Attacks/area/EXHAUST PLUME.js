registerAttack('EXHAUST PLUME',{
    stats: { type: 'Fire', cooldown: { time: 6000, switch: false } }, action: (player, target) => {
    // Creates a smoke cloud that blinds/slows the target
    const attackName = 'EXHAUST PLUME'
    player.indicate(`${player.name} used ${attackName}! Healing itself by 6 health!`)
    player.stats.hp = Math.min(player.baseStats.hp, player.stats.hp + 6)

    spawnEffect(player.x, player.y, 100, 100, '#333', 2000);
    stun(player, 2000)
    player.isDodging = true
    if (checkCollision({ x: player.x, y: player.y, width: 100, height: 100 }, target)) {
        target.maxSpeed *= 0.7;
        setTimeout(() => { target.maxSpeed = target.baseStats.spd; }, 5000);
    }

    setTimeout(()=>{
        player.isDodging = false
    }, 3000)
}
})