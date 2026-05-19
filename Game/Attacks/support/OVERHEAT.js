registerAttack('OVERHEAT',{
    stats: {type: 'Fire', cooldown: { time: 10000, switch: false } }, action: (player) => {
    // Buffs speed but deals small tick damage to self
    const attackName = 'OVERHEAT'
    let tickDmg = -1
    if (player.type !== 'Fire'){
        player.indicate(`${player.name} used ${attackName} to increase it's speed! ${player.name} is taking damage!`)
    } else {
        player.indicate(`${player.name} used ${attackName} its healing from the heat!`)
        tickDmg = 1
    }
    
    player.stats.spd *= 1.5;
    const burn = setInterval(() => {
        player.stats.hp = Math.min(player.baseStats.hp, player.stats.hp + tickDmg)
        spawnEffect(player.x, player.y, player.width, player.height, 'orange', 100);
        player.updateLabel()
    }, 500);
    
    setTimeout(() => { 
        clearInterval(burn); 
        player.stats.spd = player.baseStats.spd; 
        player.indicate(`${player.name} stopped OVERHEATING!`)
        setTimeout(()=>{
            player.indicate(``)
        }, 1000)
    }, 5000);
}
})