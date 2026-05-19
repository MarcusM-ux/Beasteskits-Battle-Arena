registerAttack('SEISMIC TOSS', {
        stats: { dmg: 15, type: 'Fighting', cooldown: { time: 12000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["SEISMIC TOSS"].stats;
            const dir = player.facingRight ? 1 : -1
            const push = 15
            
            stun(player, 6000)
            
            const rush = setInterval(()=>{
                player.x += dir * push

                if (checkCollision(player, target)) {
                    clearInterval(rush)
                    target.vy = 25 * -1
                    

                    let elaspedTime = 0
                    let inc = 0.05
                    const upward = setInterval(()=>{
                        stun(target, 100)
                        stun(player, 100)
                        elaspedTime += 100

                        // player.x += dir * push
                        // player.x += dir * push
                        // player.y -= 1 * push
                        
                        // target.x = player.x
                        // target.y = player.y

                        inc += 0.05

                        if (elaspedTime >= 100 || player.y <= 0) {
                            clearInterval(upward)
                            
                            const downward = setInterval(()=>{
                                stun(target, 100)
                                stun(player, 100)
                                elaspedTime += 100

                                inc -= 0.05

                                // player.x += dir * push
                                // player.y += 1 * push
                                
                                // target.x = player.x
                                // target.y = player.y

                                if (elaspedTime >= 1000 || target.y >= canvas.height - target.height) {
                                    clearInterval(downward)
                                    target.vy = 25
                                    attackResults(player, stats, target)
                                }
                            }, 100)
                        }
                    }, 100)
                }
                if (player.x >= canvas.width - player.width ||
                    player.x <= player.width
                ) clearInterval(rush)
                
            }, 100)            
        }
})