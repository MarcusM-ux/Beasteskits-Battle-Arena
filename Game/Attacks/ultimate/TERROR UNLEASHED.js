registerAttack('TERROR UNLEASHED', {
    stats: { type: 'Dark', cooldown: { time: 30000, switch: false } },
    action: (player) => {
        if (!player.ultimateActive) {
                player.ultimateActive = true
                stun(player, 100)
                FillUltimate(player, '#141a1c', '#2f403b', 'I AM <br> PURE <br> TERROR', 'area', ()=>{
                    executePeekaBoo(player)
                })
                
            }
       
    }
});

function playPeekabooTheme() {
    if (currentActiveAudio) {
        fadeAudio(currentActiveAudio, 0, 500)
    }

    const theme = otherThemes.Peekaboo
    theme.loop = false
    theme.volume = 0
    theme.play()

    fadeAudio(theme, 0.7, 3000)
    currentActiveAudio = theme

}

 function executePeekaBoo(player){
        const originalType = player.type;
        const originalImage = player.image.src;
        const originalSize = { width: player.width, height: player.height };

        let box = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            color: 'black',
            duration: 1000
        };

        stun(player, box.duration);
        playRetreivedAudio('monster-scream');

        // Visual Transformation setup
        player.width *= 2;
        player.height *= 2;
        spawnEffect(player.x, player.y, player.width, player.height, box.color, box.duration);

        if (player.name === 'Peekaboo') {
            // pauseAllThemes('menu')
            // pauseAllThemes('battle')
            
            // --- PERMANENT TRANSFORMATION ---
            player.image.src = "./PixelArt/Transformations/Peekaboo.png";
            player.indicate("THE ABOMINATION HAS TRANSFORMED!");

            pauseAll()
            playPeekabooTheme()
            
            // Opposite Stats: Low HP/DEF, Extreme ATK/SPD
            player.stats.hp = 56;    // Was 68
            player.stats.atk = 120;  // Was 53
            player.stats.def = 58;   // Was 79
            player.stats.spd = 3.5;  // Was 1.2
            
            player.type = 'Beast'; // Changing type permanently
            player.updateLabel()

            const interval = setInterval(() => {
                if (player.stats.hp < player.baseStats.hp) player.stats.hp += 2;
                if (isGameOver) clearInterval(interval)
                 player.updateLabel()
            }, 1500); 

            updateKeys(player, 'SULK', 'TENTACLE SLASH')            

        } else {
            // --- TEMPORARY BUFF (For Non-Peekaboo) ---
            player.indicate(`${player.name} GOES BERSERK!`);
            
            player.stats.hp = Math.min(player.baseStats.hp, player.stats.hp + 15);
            player.stats.def += 10;
            player.stats.atk += 15;
            player.stats.spd += 0.5;

            const beastTime = setTimeout(() => {
                player.stats = { ...player.baseStats }; // Reset stats
                player.type = originalType;
                player.width = originalSize.width;
                player.height = originalSize.height;

                player.maxSpeed = player.baseStats.spd;
                player.indicate(`${player.name} is now back to normal...`);
                player.image.src = originalImage;
                
                spawnEffect(player.x, player.y, originalSize.width, originalSize.height, colorFromType(player.type), box.duration);
                clearTimeout(beastTime);
                player.ultimateActive = false
                
            }, 10000);
        }
    }