registerAttack('QUICK RIFT', { 
    stats: {type: 'Mind', cooldown: {time: 6000, switch: false}}, 
    action: (player, target) => {
        const DURATION = 1500
        const CONTROL_SPEED = 5
        const IDLE_TIMEOUT = 2000
        const BOUNDARY_PADDING = 50
        
        const portal = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height * 1.5,
            color: '#6a8dae',
            type: 'Mind'
        }

        stun(player, 5000)

        let elapsedTime = 0
        let lastMoveTime = Date.now()
        let portalActive = true

        const portalMovement = setInterval(() => {
            if (!portalActive) return

            elapsedTime += 100
            
            portal.duration = 100
            spawnImage('portal', portal, {
                playAudioOnHit: false,
                audioName: 'peck',
                target: target,
                flipX : !player.facingRight,
                flipY: false,
                priority: true
            })

            // Get movement input based on player
            const moveInput = getPortalMovement(player)
            
            // Update portal position
            if (moveInput.x !== 0 || moveInput.y !== 0) {
                portal.x += moveInput.x * CONTROL_SPEED
                portal.y += moveInput.y * CONTROL_SPEED
                lastMoveTime = Date.now()
            }

            // Clamp portal to screen bounds
            portal.x = Math.max(BOUNDARY_PADDING, Math.min(canvas.width - BOUNDARY_PADDING, portal.x))
            portal.y = Math.max(BOUNDARY_PADDING, Math.min(canvas.height - BOUNDARY_PADDING, portal.y))

            // Check collision with target
            if (checkCollision(portal, target)) {
                stun(target, 1200)
                endAttack()
                return
            }

            // End conditions
            const idleTime = Date.now() - lastMoveTime
            if (elapsedTime >= DURATION || idleTime >= IDLE_TIMEOUT) {
                endAttack()
            }
        }, 100)

        function getPortalMovement(player) {
            const keys = keybinds.movement
            let x = 0, y = 0

            if (player.isPlayer1) {
                if (keys.w) y -= 5
                if (keys.s) y += 5
                if (keys.a) x -= 5
                if (keys.d) x += 5
            } else {
                if (keys.arrowup) y -= 5
                if (keys.arrowdown) y += 5
                if (keys.arrowleft) x -= 5
                if (keys.arrowright) x += 5
            }

            return { x, y }
        }

        function endAttack() {
            portalActive = false
            stun(player, 500)
            
            // Final visual effect at destination
            portal.duration = 2000
            spawnImage('portal', portal, {
                playAudioOnHit: false,
                audioName: 'ominous-note',
                target: target,
                flipX : !player.facingRight,
                flipY: false,
                priority: true
            })

            if (checkCollision(portal, target)) {
                stun(target, 1500)
                target.indicate(`${target.name} was dazzled by the portal!`)
            }
            
            // Teleport player to portal
            player.x = portal.x
            player.y = portal.y
            
            clearInterval(portalMovement)
        }
    }
})
