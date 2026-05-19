registerAttack('GRAND DISAPPEARANCE', { 
    stats: {dmg: 35, type: 'Mind', cooldown: {time: 30000, switch: false}}, 
    action: (player, target) => {
        if (!player.ultimateActive) {
            player.ultimateActive = true
            stun(player, 100)
            
            FillUltimate(player, '#870eb3', '#978feb', 'THIS <br> IS <br> MY <br> WORLD', 'transform', ()=>{
                executePortal(player, target)
            })
        }
    }
})


    function executePortal(player, target){
        const PORTAL_DURATION = 1500
        const ROTATION_SPEED = 15
        
        stun(player, 6000)

        // Check if player has summoned obstacles
        if (!player.spawnedObstacles) {
            player.spawnedObstacles = []
        }
        
        const obstacleCount = player.spawnedObstacles.length
        if (obstacleCount > 2) {
            handlePortalRain(player, target, player.spawnedObstacles)
        } else {
            handleCapeSweep(player, target)
        }

        function handlePortalRain(player, target, obstacleList) {
            let elapsedTime = 0
            const portalX = target.x + target.width / 2
            const portalY = target.y - 50
            
            const fallingObjects = obstacleList.map((obs, index) => ({
                x: target.x + target.width / 2 - 32 + (Math.random() - 0.5) * 80,
                y: target.y - 200 - index * 30,
                width: 64,
                height: 64,
                rotation: 0,
                velocityY: 0,
                velocityX: (Math.random() - 0.5) * 2,
                landed: false
            }))

            // Phase 1: Portal animation (objects disappear into portals)
            const portalPhase = setInterval(() => {
                elapsedTime += 100

                // Draw portal at target location (stays put)
                spawnEffect(portalX, portalY, 80, 80, '#6a8dae', 100)
                
                // Draw portals under original obstacles
                obstacleList.forEach((obs) => {
                    spawnEffect(obs.x, obs.y, obs.width, obs.height, '#6a8dae', 100)
                })

                if (elapsedTime >= PORTAL_DURATION) {
                    clearInterval(portalPhase)
                    
                    // Remove obstacles from global array
                    obstacleList.forEach((obs) => {
                        const index = obstacles.indexOf(obs)
                        if (index > -1) obstacles.splice(index, 1)
                    })
                    
                    // Clear from player's array
                    player.spawnedObstacles = []
                    
                    elapsedTime = 0
                    stun(target, 500)

                    // Phase 2: Objects fall from above target
                    const fallPhase = setInterval(() => {
                        elapsedTime += 50

                        // Draw stationary portal
                        spawnEffect(portalX, portalY, 80, 80, '#6a8dae', 100)

                        fallingObjects.forEach((obj) => {
                            if (!obj.landed) {
                                // Gravity
                                obj.velocityY += 0.5
                                obj.y += obj.velocityY
                                
                                // Horizontal drift
                                obj.x += obj.velocityX

                                // Rotation while falling
                                // obj.rotation += ROTATION_SPEED

                                obj.duration = 50
                                spawnImage('obstacle', obj, {
                                    playAudioOnHit: false,
                                    audioName: '',
                                    target: target,
                                    flipX : !player.facingRight,
                                    flipY: false,
                                    priority: true
                                })

                                // Check collision with target
                                if (checkCollision(obj, target)) {
                                    obj.landed = true
                                    playRetreivedAudio('metal-slam')
                                    attackResults(player, {dmg: 12, type: 'Metal'}, target)
                                    stun(target, 1500)
                                }
                            }

                            // Object falls off screen
                            if (obj.y > canvas.height) {
                                obj.landed = true
                            }
                        })

                        // End when all objects landed or fell off screen
                        if (fallingObjects.every(obj => obj.landed)) {
                            stun(player, 500)
                            clearInterval(fallPhase)
                        }

                        // Safety timeout
                        if (elapsedTime > 5000) {
                            stun(player, 500)
                            clearInterval(fallPhase)
                            player.ultimateActive = false
                        }
                    }, 50)
                }
            }, 100)
        }

        function handleCapeSweep(player, target) {
            const SWEEP_DURATION = 1000
            const AIRTIME = 1500
            const targetStartY = target.y

            stun(target, SWEEP_DURATION + AIRTIME + 500)

            // Phase 1: Teleport behind target and sweep
            player.x = (target.facingRight) ? target.x - player.width - 20 : target.x + player.width + 20
            player.y = target.y

            let sweepTime = 0
            const sweepPhase = setInterval(() => {
                sweepTime += 50

                // spawnEffect(
                const box ={
                    x: target.x - 30,
                    y: target.y - 20,
                    width: target.width + 60,
                    height: target.height + 40,
                    color: '#6a8dae',
                    duration: 50
                }
                spawnImage('portal', box, {
                    playAudioOnHit: false,
                    audioName: '',
                    target: target,
                    flipX : !player.facingRight,
                    flipY: false,
                    priority: true
                })

                if (sweepTime >= SWEEP_DURATION) {
                    

                    // Phase 2: Target launched into air
                    target.y = 50
                    let velocityY = -10
                    let airTime = 0

                    const fallPhase = setInterval(() => {
                        airTime += 50

                        // Gravity pulls target down
                        velocityY += 0.6
                        target.y += velocityY

                        // Draw falling target
                        spawnEffect(target.x, target.y, target.width, target.height, '#84bdf2', 50)

                        // Target hits ground
                        if (target.y >= canvas.height - target.height) {
                            target.y = canvas.height

                            const box = {
                                dmg: 12,
                                type: 'Mind',
                            }
                            attackResults(player, box, target)
                            playRetreivedAudio('body-thud')
                            stun(target, 1000)
                            stun(player, 500)
                            clearInterval(fallPhase)
                            player.ultimateActive = false
                             
                        }
                        
                    }, 50)

                    clearInterval(sweepPhase)
                }
            }, 50)
        }
    }