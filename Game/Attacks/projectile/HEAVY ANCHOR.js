registerAttack('HEAVY ANCHOR', {
    stats: { dmg: 12, type: 'Metal', cooldown: { time: 15000, switch: false } }, action: (player, target) => {
    // Drops a massive anchor from the sky
    const attackName = 'HEAVY ANCHOR'
    player.indicate(`${player.name} RELEASED THE SAILS!`)
    stun(player, 2000)
        
    let anchor = { x: target.x, y: 0, width: 64, height: 64, dmg: 15, type: 'Metal', duration: 31 };
    const falling = setInterval(() => {
        anchor.y += 15;
        // spawnEffect(anchor.x, anchor.y, 40, 60, 'gray', 50);
        spawnImage('anchor', anchor, {
            playAudioOnHit: true,
            audioName: 'metal-slam',
            target: target,
            flipX : !player.facingRight,
            flipY: false,
            priority: true,
        })
        
        if (checkCollision(anchor, target)) {
            // attackResults(player, anchor, target);
            stun(target, 1200);
            clearInterval(falling);

            let results = dealDamage(player, anchor, target)
            if (results.isFatal) {
                stun(target, 5000)
                target.height /= 2
                target.updateLabel()

                setTimeout(()=>{
                    target.stats.hp = 0
                }, 3000)
            }else {
                target.stats.hp -= results.damage
                target.updateLabel()
            }
            
        }
        if (anchor.y > canvas.height) clearInterval(falling);
    }, 30);
}
})