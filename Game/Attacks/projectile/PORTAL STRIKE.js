registerAttack('PORTAL STRIKE', { 
    stats: {dmg: 10, type: 'Mind', cooldown: {time: 6000, switch: false}}, 
    action: (player, target) => {
        const PORTAL_SPEED = 15
        const PORTAL_DURATION = 2000
        const SLAM_INTERVAL = 100
        const MAX_OBSTACLES = 4
        
        const portal = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: '#6a8dae',
            dmg: 10,
            type: 'Mind',
            duration: 100
        }
        
        stun(player, 3000)
        const direction = player.facingRight ? 1 : -1
        let elapsedTime = 0
        const startHP = player.stats.hp
        let hasHit = false

        const portalRun = setInterval(() => {
            elapsedTime += SLAM_INTERVAL
            portal.x += PORTAL_SPEED * direction
            spawnImage('portal', portal, {
                playAudioOnHit: true,
                audioName: 'ominous-note',
                target: target,
                flipX: !player.facingRight,
                flipY: true,
                priority: true
            })
            
            if (!hasHit && checkCollision(portal, target)) {
                hasHit = true
                clearInterval(portalRun)
                handlePortalHit(player, target, portal, direction)
                return
            }

            if (elapsedTime >= PORTAL_DURATION || player.stats.hp < startHP) {
                stun(player, 0)
                clearInterval(portalRun)
            }
        }, SLAM_INTERVAL)

        function handlePortalHit(player, target, portal, direction) {
            stun(target, 3000)
            
            if (!player.spawnedObstacles) player.spawnedObstacles = []

            // Spawn a new obstacle if under max
            if (player.spawnedObstacles.length < MAX_OBSTACLES) {
                const coordinates = {
                    x: Math.random() * (canvas.width - 64),
                    y: target.y + target.height + 20
                }
                const obstacle = new Obstacle('./Effects/obstacle.png', coordinates.x, coordinates.y)
                player.spawnedObstacles.push(obstacle)
                obstacles.push(obstacle)
            }

            // Slam through each obstacle one at a time, never repeating
            const obstaclesLeft = [...player.spawnedObstacles] // copy so we can shift through it
            let damageMultiplier = 1.0
            
            function slamIntoNext() {
                if (obstaclesLeft.length === 0) {
                    // No more unique obstacles — we're done
                    stun(target, 0)
                    stun(player, 0)
                    return
                }

                const currentObstacle = obstaclesLeft.shift() // take the next unvisited obstacle

                // Position target above this obstacle
                target.y = currentObstacle.y - target.height - 40
                target.x = currentObstacle.x

                portal.duration = 2000
                portal.y = target.y
                portal.x = target.x
                spawnImage('portal', portal, {
                    playAudioOnHit: false,
                    audioName: '',
                    target: target,
                    flipX: !player.facingRight,
                    flipY: false,
                    priority: true
                })

                let targetVelocity = 0
                let slamCount = 0

                const portalSlam = setInterval(() => {
                    targetVelocity += 0.8
                    target.y += targetVelocity

                    stun(target, 100)
                    stun(player, 100)

                    if (checkCollision(currentObstacle, target)) {
                        portal.dmg = Math.floor(portal.dmg * damageMultiplier)
                        
                        attackResults(player, portal, target)
                        damageMultiplier = 0.5
                        playRetreivedAudio('metal-slam')
                        clearInterval(portalSlam)
                        slamIntoNext() // ← chain to the next obstacle
                        return
                    }

                    slamCount++
                    if (slamCount > 40) { // failsafe
                        clearInterval(portalSlam)
                        slamIntoNext() // still chain even on timeout
                    }
                }, SLAM_INTERVAL)
            }

            slamIntoNext() // kick off the chain
        }
    }
})

