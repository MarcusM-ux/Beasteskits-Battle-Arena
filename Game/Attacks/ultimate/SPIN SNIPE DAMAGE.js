registerAttack('SPIN SNIPE DAMAGE', {
    stats: {dmg: 25, type: 'Light', cooldown: { time: 30000, switch: false } }, action: (player, target) => {
            if (!player.ultimateActive) {
                player.ultimateActive = true
                stun(player, 100)
                FillUltimate(player, '#ebd78f', '#d4d137', 'THE <br> STARS <br> FALL', 'area', ()=>{
                    executeStars(player, target)
                })
                
            }

}})

function executeStars(player, target){
    const flares = [];
    const flareCount = 5;
    const orbitRadius = 120; // Distance from player to spin
    const orbitSpeed = 0.2; // How fast they rotate
    const expansionSpeed = 8;
    const damageToUser = 5;
    const damageToTarget = 5;
    
    playRetreivedAudio('explosion');
    
    for (let i = 0; i < flareCount; i++) {
        const angle = (i / flareCount) * Math.PI * 2;
        flares.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            width: 25,
            height: 25,
            angle: angle,
            distance: 0,
            state: 'expanding', // States: 'expanding', 'orbiting', 'returning'
            color: '#f2da1c', 
            hasHit: false,
            dmg: 5,
            type: 'Light'
        });
    }
    
    let life = 0;
    // stun(player, 4500)
    const interval = setInterval(() => {
        life += 50;
    
        for (let i = flares.length - 1; i >= 0; i--) {
            const flare = flares[i];
    
            // --- PHASE 1: EXPANDING ---
            if (flare.state === 'expanding') {
                flare.distance += expansionSpeed;
                flare.x = (player.x + player.width / 2) + Math.cos(flare.angle) * flare.distance;
                flare.y = (player.y + player.height / 2) + Math.sin(flare.angle) * flare.distance;
    
                if (flare.distance >= orbitRadius) {
                    flare.state = 'orbiting';
                }
            } 
            // --- PHASE 2: ORBITING ---
            else if (flare.state === 'orbiting') {
                flare.angle += orbitSpeed;
                flare.x = (player.x + player.width / 2) + Math.cos(flare.angle) * orbitRadius;
                flare.y = (player.y + player.height / 2) + Math.sin(flare.angle) * orbitRadius;
            }
    
            spawnEffect(flare.x, flare.y, flare.width, flare.height, flare.color, 100);
    
            // --- COLLISION LOGIC ---
            if (checkCollision(flare, target)) {
                flare.hasHit = true;
                attackResults(player, flare,target);
                // stun(target, 500);
                playRetreivedAudio('fireball');
                flares.splice(i, 1);
                continue;
            }
    
            // --- PHASE 3: RETURN/END ---
            if (life >= 4000) { // Move lasts 4 seconds
                if (!flare.hasHit) {
                    player.indicate("BACKFIRE!");
                    attackResults(player, flare, player); // Flare hits user on return
                }
                flares.splice(i, 1);
            }
        }
    
        if (flares.length === 0) {
            clearInterval(interval);
            player.ultimateActive = false
            // Start 40s Cooldown here
        }
    }, 50);      
}
