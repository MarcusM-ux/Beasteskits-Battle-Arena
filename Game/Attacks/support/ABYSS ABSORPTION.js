registerAttack('ABYSS ABSORPTION', {
    stats: { 
        type: 'Dark', 
        cooldown: { time: 10000, switch: false } 
    }, 
    action: (player, target) => {
        // Initialize abyss power
        player.abyss = player.abyss ?? 0;

        // Check for overflow damage
        if (player.abyss > 99) {
            attackResults(player, { dmg: 8, type: 'Dark' }, player);
            player.indicate(`${player.name} took damage from the darkness!`);
            return; // Exit early if already overloaded
        }

        player.indicate(`${player.name} is absorbing the darkness!`);

        const baselineHP = player.stats.hp;
        const maxDuration = 5000; // 50 intervals of 100ms
        const maxAbyssPower = 99;
        let duration = 0;

        const key = Object.keys(player.keysToAttack).find( k => player.keysToAttack[k].name === 'ABYSS ABSORPTION' )

        const interval = setInterval(() => {
            duration += 100;
            // stun(player, 100)

            // Check for interruption
            player.stats.hp += 1
            player.updateLabel()
            if (player.stats.hp < baselineHP || keybinds.attacks[key]) {
                player.indicate(`${player.name}'s darkness absorption was interrupted...`);
                clearInterval(interval);
                return;
            }

            // Update orb position and visual
            updateOrbVisuals(player);

            // Increase abyss power
            player.abyss = Math.min(player.abyss + 0.5, maxAbyssPower);
            player.indicate(`${player.name} has ${Math.floor(player.abyss)}% ABYSS POWER!`);

            // Check for max power or duration exceeded
            if (player.abyss >= maxAbyssPower || duration >= maxDuration) {
                if (player.abyss >= maxAbyssPower) {
                    player.indicate(`${player.name} has reached MAX POWER!`);
                }
                clearInterval(interval);
            }
        }, 100);
    }
});

// Helper function: Update orb visuals
function updateOrbVisuals(player) {
    const orbSize = 5 + (player.abyss * 0.5);
    const orb = {
        x: player.facingRight 
            ? player.x + (player.width) 
            : player.x - orbSize,
        y: player.y + (player.height / 2),
        width: orbSize,
        height: orbSize,
        duration: 100,
        color: 'black'
    };
    insertEffect(orb);
}
