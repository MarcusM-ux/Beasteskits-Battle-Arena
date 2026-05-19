registerAttack('VOID PULSE', {
    
        stats: { dmg: 12, type: 'Dark', cooldown: { time: 3000, switch: false } },
        action: (player, target) => {
            const stats = attackFunctions["VOID PULSE"].stats;
            const pos = (player.facingRight) ? 40 : -40;
            const pulse = {
                x: player.x + pos,
                y: player.y,
                width: player.width + 40,
                height: 40,
                color: 'rgba(40, 0, 80, 0.6)',
            };
            
            playRetreivedAudio('pulse-sound');
            spawnEffect(pulse.x, pulse.y, pulse.width, pulse.height, pulse.color, 500);
            stun(player, 1500);

            if (checkCollision(pulse, target)) {
                attackResults(player, stats, target);
                // Dark Effect: Slow
                target.stats.spd *= 0.8;
                setTimeout(() => target.stats.spd /= 0.8, 1000);
                stun(target, 1500);
                slidePlayers(8, 300, false, player, target)
            }
        }
    
})