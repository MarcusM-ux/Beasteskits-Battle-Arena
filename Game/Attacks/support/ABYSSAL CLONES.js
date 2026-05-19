registerAttack('ABYSSAL CLONES', {
    stats: { type: 'Dark', untrackable: true, cooldown: { time: 8000, switch: false } },
        action: (player, target) => {
            const player1 = player.isPlayer1
            const keys = player1 ? {
                left: keybinds.movement.a,
                right: keybinds.movement.d,
                up: keybinds.movement.w,
                down: keybinds.movement.s,
                special: keybinds.movement.r
            } : {
                left: keybinds.movement.arrowleft,
                right: keybinds.movement.arrowright,
                up: keybinds.movement.arrowup,
                down: keybinds.movement.arrowdown,
                special: keybinds.movement.m
            }

            function enact(clone){
                clone.x = player.x + (player.facingRight ? 15 : -15)
                clone.y = player.y 
                
                if (keys.right || keys.left || !keys.left && !keys.right && !keys.up && !keys.down) {
                    const dir = (player.facingRight) ? 15 : -15

                    const i = setInterval(()=>{
                        clone.x += dir
                        clone.life += 100
                        
                        if (checkCollision(target, clone)) {
                            clearInterval(i)
                            stun(target, 4000)
                            commitSpecial()
                            
                        }
                        if (clone.life > 4000) {
                            clearInterval(i)
                            commitSpecial()
                            
                        }
                    }, 100)
                }

                if (keys.up || keys.down) {
                    const dir = (keys.down) ? 15 : -15

                    const i = setInterval(()=>{
                        clone.y += dir
                        clone.life += 100
                        
                        if (checkCollision(target, clone)) {
                            clearInterval(i)
                            stun(target, 4000)
                            commitSpecial()
                        }
                        if (clone.life > 4000) {
                            clearInterval(i)
                            commitSpecial()
                        }
                    }, 100)
                }
                

                function commitSpecial(){
                    if (keys.special) {
                            const attackName = player.lastMove || "VOID PULSE"
                            attackFunctions[attackName].action(clone, target)
                    }
                }
                
                setTimeout(()=>{
                    player.clone = null
                }, 6000)
            }
            
            if (!player.clone) {
                player.clone = new Player(creatures[player.name], player.value, player.name)
                player.clone.life = 0
                
                player.indicate(`${player.name} created a clone of itself!`)
                enact(player.clone)
            }
           
        }

})