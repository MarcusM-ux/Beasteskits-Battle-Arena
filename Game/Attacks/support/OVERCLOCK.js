registerAttack('OVERCLOCK',{
    stats: {type: 'Electric', cooldown: { time: 12000, switch: false } }, action: (player, target) => {
    // Buffs speed but deals small tick damage to self
    const attackName = 'OVERCLOCK'
    player.indicate(`${player.name} used ${attackName} to increase it's speed!`)
        
    player.stats.spd *= 2;
    let life = 0
    
    const shock = setInterval(() => {
        spawnEffect(player.x, player.y, player.width, player.height, 'yellow', 500);
        if (Math.random() < 0.2 && !player.type === 'Electric') {
            stun(player, 500)
            player.indicate(`${player.name} is being paralyzed!`)
        }

        if (checkCollision(player, target))
        
        if (checkCollision(player, target) && player.type === 'Electric') {
            stun(target, 1000)
            target.stats.hp -= 1
            target.updateLabel()
        }
        
        life += 500
    }, 500);
    
    setTimeout(() => { 
        clearInterval(shock); 
        player.stats.spd = player.baseStats.spd; 
        player.indicate(`${player.name}'s OVERCLOCK stopped!`)
        setTimeout(()=>{
            player.indicate(``)
        }, 1000)
    }, 5000);
}
})