registerAttack('ARSONAL SWITCH', {
    stats : {type: 'Metal', cooldown: {time: 10000, switch: false}}, 
    action: (player, target)=>{

        stun(player, 2000)
        
        // const weaponTypes = {
        //     pulseRay: ()=>{},
        //     gauntlet : ()=>{},
        //     gernadeLauncher : ()=>{}
        // }

        if (!player.weaponry) {
            player.weaponry = 'pulseRay'
            updateKeys(player, "SLASH", "RAY BLAST")
            player.indicate(`${player.name} switched to its PULSE RAY!`)
        }else {
            switch(player.weaponry) {
                case 'pulseRay':
                    player.weaponry = 'gauntlet'
                    updateKeys(player, "RAY BLAST", "RURAL PUNISHMENT")
                    player.indicate(`${player.name} switched to its GAUNTLET!`)
                break
                case 'gauntlet':
                    player.weaponry = 'gernadeLauncher'
                    updateKeys(player, "RURAL PUNISHMENT", "BLAST VALLEY")
                    player.indicate(`${player.name} switched to its GERNADE LAUNCHER!`)
                break
                case 'gernadeLauncher':
                    player.weaponry = 'pulseRay'
                    updateKeys(player, "BLAST VALLEY", "RAY BLAST")
                    player.indicate(`${player.name} switched to its PULSE RAY!`)
                break
            }
        }
    }
})