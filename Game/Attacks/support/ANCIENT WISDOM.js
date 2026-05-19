registerAttack('ANCIENT WISDOM', {
     stats: { type: 'Mind', cooldown: { time: 15000, switch: false } },
        action: (player) => {
            player.stats.atk += 20;
            player.indicate(`${player.name} used ANCIENT WISDOM! It gained 20 attack!`);
            setTimeout(() => {
                player.stats.atk -= 20
                player.indicate(`${player.name}'s attack returned to normal!`);
            }, 5000);
        }
})