registerAttack('PROJECT BEAM', {
    stats: { type: 'Metal', cooldown: { time: 15000, switch: false } },
    action: (player, target) => {
        if (!player.currentProject) {
            player.currentProject = { stage: 0, x: 0, y: 0, parts: [] };
        }

        const proj = player.currentProject;

        // STAGE 1: Place Foundation
        if (proj.stage === 0) {
            proj.x = player.x;
            proj.y = player.y;
            proj.stage = 1;
            player.indicate("PROJECT: FOUNDATION PLACED");
            // Push a persistent part instead of spawning a temporary effect
            // let box = {
            //     width: 64,
            //     height: 64, 
            //     x: player.x,
            //     y: player.y
            // }
            // spawnImage('PROJECT_BEAM/', box, {
            //     playAudioOnHit: false,
            //     audioName: '',
            //     target: target,
            //     flipX : !player.facingRight,
            //     flipY: false,
            //     priority: true
            // })
            const image = new Image()
            image.onload = () => {}
            image.src = './Effects/PROJECT_BEAM/Block1.png'
            proj.parts.push({ x: proj.x, y: proj.y, img: image, offset: 0 });
            return;
        }

        // Proximity Check
        const dist = Math.sqrt(Math.pow(player.x - proj.x, 2) + Math.pow(player.y - proj.y, 2));
        if (dist > 150 && !player.isCPU) {
            player.indicate("TOO FAR FROM PROJECT!");
            return;
        }

        // STAGE 2 & 3: Building
        if (proj.stage === 1) {
            proj.stage = 2;
            const image = new Image()
            image.src = './Effects/PROJECT_BEAM/Block2.png'
            proj.parts.push({ x: proj.x, y: proj.y - 64, img: image, offset: 40 });
            
            // player.indicate("PROJECT: WIRING COMPLETE");
            // proj.parts.push({ x: proj.x, y: proj.y - 40, color: '#555', offset: 40 });
        } 
        else if (proj.stage === 2) {
            proj.stage = 3;
            // player.indicate("PROJECT: READY TO FIRE!");
            // proj.parts.push({ x: proj.x, y: proj.y - 80, color: '#f00', offset: 80 });
            const image = new Image()
            image.src = './Effects/PROJECT_BEAM/Block3.png'
            proj.parts.push({ x: proj.x, y: proj.y - 128, img: image, offset: 80 });
        } 
        // STAGE 4: FIRING
        else if (proj.stage === 3) {
            player.indicate("FIRING EXPERIMENT 001!");
            
            const beamX = target.x;
            const beam = { dmg: 30, type: 'Light' };
            const beamWidth = 100;

            let beamLife = 0;
            let hit = false;
            
            const beamInterval = setInterval(() => {
                beamLife += 100;
                spawnEffect(beamX - 25, 0, beamWidth, canvas.height, 'rgba(255, 255, 255, 0.6)', 100);
                
                if (checkCollision({x: beamX - 25, y: 0, width: beamWidth, height: canvas.height}, target) && !hit) {
                    stun(target, 3000);
                    attackResults(player, beam, target);
                    // rebukeCollision(beam, target, 2);
                    hit = true;
                    playRetreivedAudio('explosion');
                }

                if (beamLife >= 2000) {
                    clearInterval(beamInterval);
                    // Reset everything: Clear the parts array so they disappear
                    proj.parts = []; 
                    proj.stage = 0;
                }
            }, 100);
        }
    }
});