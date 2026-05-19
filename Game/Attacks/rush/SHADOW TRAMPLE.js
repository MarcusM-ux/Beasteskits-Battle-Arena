registerAttack('SHADOW TRAMPLE', {
            stats: { dmg: 12, type: 'Dark', cooldown: { time: 9000, switch: false } },
        action: (player, target) => {
            let chargeLife = 0;
            const charge = setInterval(() => {
                spawnEffect(player.x, player.y, player.width, player.height, 'rgba(20, 0, 40, 0.5)', 50);
                chargeLife += 100;
                player.x += (player.facingRight ? 8 : -8);
                if (checkCollision(player, target)) {
                    clearInterval(charge);
                    stun(target, 2000);
                    attackResults(player, attackFunctions["SHADOW TRAMPLE"].stats, target);
                }
                if (chargeLife > 2000) clearInterval(charge);
            }, 50);
        }
})