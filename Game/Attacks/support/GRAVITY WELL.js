registerAttack('GRAVITY WELL', {
  stats: { type: 'Mind', cooldown: { time: 12000, switch: false } },
  action: (player, target) => {
    const duration = 2000; // 3 seconds of control
    const controlSpeed = 5; // How fast you can "drag" the enemy
    
    player.indicate(`${player.name} used GRAVITY WELL to control ${target.name}`)
    target.indicate(`${target.name} is under control!`);

    // 1. Stun both players to stop normal movement logic
    // const endStunTime = Date.now() + duration;
    // player.stunTimer = endStunTime;
    // target.stunTimer = endStunTime;

    stun(player, 2000)
    stun(target, 2000)

    let life = 0
    // 2. Start the Control Loop
    const controlInterval = setInterval(() => {
      if (life > duration) {
          // --- THIS PART IS CRUCIAL ---
        // player.stunTimer = null; // Release Player 1
        // target.stunTimer = null; // Release Player 2
        stun(player, 1)
        stun(target, 1)
        
        // // If your engine uses a 'stunned' boolean:
        // player.stunned = false;
        // target.stunned = false;
    
        player.indicate(""); // Clear the text
        target.indicate("");
        clearInterval(controlInterval);

        stun(target, 3000)
        return;
      }
      life += 16
      // Check Player 1's movement keys from your keybinds object
      // We apply the movement to the TARGET instead of the player
      if (player.isPlayer1) {
          if (keybinds.movement.w) target.y -= controlSpeed;
          if (keybinds.movement.s) target.y += controlSpeed;
          if (keybinds.movement.a) target.x -= controlSpeed;
          if (keybinds.movement.d) target.x += controlSpeed;
        }else {
          if (keybinds.movement.arrowup) target.y -= controlSpeed;
          if (keybinds.movement.arrowdown) target.y += controlSpeed;
          if (keybinds.movement.arrowleft) target.x -= controlSpeed;
          if (keybinds.movement.arrowright) target.x += controlSpeed;
      }

      // 3. Visual: Blue box around the target
      // We spawn it with a very short life (16ms) so it refreshes every frame
      spawnEffect(
        target.x - 5, 
        target.y - 5, 
        target.width + 10, 
        target.height + 10, 
        'rgba(0, 150, 255, 0.5)', 
        20 
      );

      // Optional: Add a "tether" line from player to target
      spawnEffect(player.x + player.width/2, player.y + player.height/2, 2, 2, 'cyan', 20);
      
    }, 16); // Run at ~60fps
  }
});