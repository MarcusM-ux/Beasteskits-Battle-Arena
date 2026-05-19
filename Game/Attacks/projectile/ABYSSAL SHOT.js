registerAttack('ABYSSAL SHOT', {
    stats: { dmg: 5, type: 'Dark', cooldown: { time: 10000, switch: false } }, 
    action: (player, target) => {
        const dir = player.facingRight ? 1 : -1;

        let box = {
            x: player.x,
            y: player.y + player.height / 4,
            width: 20,
            height: player.height / 2,
            type: 'Dark',
            color: 'black',
            dmg: 5
        };

        player.indicate('ABYSS SHOT!!');
        stun(player, 1200);

        let time = 0;
        let hit = false;
        
        // Reduced push multiplier (was using abyss directly)
        let push = player.abyss ? Math.min(player.abyss * 0.3, 12) : 1;
        
        // Damage scales more gently with abyss
        box.dmg = 5 + (push * 0.5); // Was: Math.max(25, box.dmg + push)
        push = Math.max(20, push); // Minimum push, not 25
        
        // Duration scales with push, but capped
        let max = Math.min(2000, 500 + (push * 20)); // Was: Math.max(1500, ...)
        player.abyss = 0

        const ray = setInterval(() => {
            time += 50;

            // Reduced expansion rate
            box.width += push * 0.5; // Was: push (doubled it!)
            box.x += dir * (push);

            spawnEffect(box.x, box.y, box.width, box.height, box.color, 60);

            // Hit detection (single hit only)
            if (checkCollision(box, target) && !hit) {
                hit = true;
                attackResults(player, box, target);
                stun(player, 2000)
                stun(target, 1000)
                target.x += dir * push
            }

            if (time >= max) {
                clearInterval(ray);
                stun(player, 2000)
            }
        }, 50);
    }
});
