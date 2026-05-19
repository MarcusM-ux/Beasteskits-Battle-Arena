const attackDescriptions = {
    'BEATDOWN' : "Basic Type Rush - User rushes at the enemy, gaining more speed as it travels. If the user hits the enemy it will slam the enemy upwards then downwards. <span class='warning'>Missing this attack will result in major stun!</span>",
    
    'BODY SLAM' : 'Basic Type Melee - User leaps into the air and comes crashing down, <span class="highlight">dealing more damage as it falls.<span> <span class="warning">This attack can be interrupted if used too close to the enemy. Keep your distance.</span>',
    
    'FADE AWAY' : 'Dark Type Mobility -  User fades away becoming semi transparent and invincible, leaving a perfect clone in its place <span class="highlight">that stuns the enemy upon contact.</span> <span class="warning">The user is slower than usual while in this state.</span>',
    
    'SHADOW STEP' : 'Dark Type Mobility - User summons an abundance of shadows beneath itself <span class="highlight">that stun upon contact for a long duration.</span> Then by either pressing the up or down key, the user can teleport to either the top or bottom of the map, <span class="highlight">spawning shadows that stun upon contact.</span>',
    
    'LIFE GRASP': 'Dark Type Melee - User throws out a hand that upon contact, starts draining the target\'s health. If the user is attacked or once the 4 second drain is finished, <span class="highlight">the hand will return and heal the user according to how much health the target lost.</span>',
    
    'PHASE': 'Mind Type Mobility - User becomes fully transparent and invinvible. <span class="highlight">Touching the enemy while in this state will freeze them for 3 seconds.</span> <span class="connect">If the user also has LIFE GRASP then upon contact, LIFE GRASP will automatically become avaliable but, every other move will go on cooldown.</span>',
    
    'HAND EXTENSTION': 'Basic Type Support - User stretches their arms, becoming slightly more agile. <span class="connect">If the user has LIFE GRASP then this move will increase the range that the hand can travel.</span> ',
    
    'RURAL PUNISHMENT': 'Fighting Type Melee - A 3 hit attack where the user grabs, punches, and slams the target, <span class="highlight">dealing serious damage and knockback.</span>',
    
    'PUNCH': 'Basic Type Melee Poke - A simple, short ranged, punch that deals 1 damage but good knockback',
    
    'CONCENTRATED BURST': 'Fire Type Projectile - User charges up a firebolt that gradually increases in size, power, and knockback. <span class="highlight">Hold down the move\'s attack key to charge the attack.</span>',
    
    'SCORCHED EARTH': 'Ground Type Area - User summons a volcano ontop of itself that <span class="highlight">does stuns and knocksback upon contact.</span>',
    
    'ERUPT': 'Fire Type Ultimate - User summons a valley of volcanos in a straight line. At once <span class="h">they all erupt dealing serious damage upon contact.</span> Afterwards a <span class="h">massive explosion occurs, hitting the enemy automatically.</span>',
    
    'QUICK SHOT': 'Light Type Poke Projectile - User shoots a fast projectile at the enemy dealing only 1 damage. <span class="c">The type and color of the projectile change depending on the user\'s type.</span',

    'DISC SHOT': 'Basic Type Poke Projectile - User shoots a fast disc at the enemy dealing minor damage.',

    'CLOUDY PUFF' : 'Air Type Mobility - User summons a cloud beneath itself, <span class="h">increasing its speed by 1.5. After summoning 3 clouds without stopping the user will become engluffed by its clouds, becoming invincible for 5 seconds</span> then returning to normal.',

    
    'CHOMP': 'Dark Type Melee - User stretches out their mouth and bites the target.',
    
    'TENTACLE SLASH': 'Dark Type Melee - User winds up their tentacles and delivers a quick slash towards the enemy.',
    
    'TOTALITY': 'Beast Type Ultimate - User transforms into a large beast <span class="h">dealing more damage and having an increase of all stats by 5 with a speed increase of 0.25.</span> Upon deactivation, after 10 seconds, the user gains half of their health back while all their stats return to normal. <span class="w">The user will be temporarily stunned after deactivation!</span>',
    
    'GUARD POP': 'Basic Type Support - User initiates a quick block. Upon taking any damage the user will become temporarily invincible while being knocked back from the impact, sending both the target and the user flying in opposite directions. <span class="w">The activation window is less than a second, missing this attack will leave you open.</span>',
    
    'FORCEFUL GUST': 'Air Type Projectile - User summons an abundance of clouds in the shape of a sideways v, forcing them forward with extreme pressure, <span class="h">dealing serious amounts of damage and knockback.</span>',
    
    'SUCTION PUNCH': 'Air Type Melee - User concentrates the air towards their arm causing everything within the area to be pulled toward itself. <span class="h">After 1 second, if anything is close to the user, it will punch it outwards dealing knockback and damage.</span>',
    
    'FLASH STEP': 'Air Type Mobility - User quickly steps forward 3 times. If the user touches then enemy during its flash step then the target will become stunned temporarily.',
    
    'BLITZ': 'Electric Type Ultimate - User blitzes forwards. Upon hitting the enemy it will perform a 6 hit combo before <span class="h">dealing a final catastrophic blow.</span> <span class="w">Try not to use this move too close to the target because, it will be counted as interrupted.</span>',
    
    'SPINNING PUSH': 'Air Type Poke Projectile - User sends out mini tornados that deal 1 damage and decent knockback.',
    
    'BEAM': 'Light Type Projectile - User sends out <span class="h">a directional beam that can be sent upwards, downwards, left, or right depending on which key is being pressed.</span> Any target caught inside of the beam will take tick damage and slowly be pushed away from the beam. <span class="w">Missing this attack will leave you completely open to attacks! Be cautious.</span>',
    
    'CLAMP': 'Metal Type Projectile - User sends out a metal clamp that <span class="h">deals massive damage and stun</span> if it touches the enemy. <span class="w">Missing the clamp will leave you stunned and open to attacks!</span>',
    
    'DECONSTRUCT': 'Metal Type Support - User tears off some of its mechanical parts, <span class="h">gaining 0.45 speed and 9 attack total.</span> <span class="w">While losing some health and a total of 9 defense.</span> <span class="c">Hankclaw acquires this move after hitting 3 successful clawstrikes. Once this move is Hankclaw will transform into Clawbuster, its more powerful and tankier counterpart.</span>',
    
    'STEAM ROLL': 'Fire Type Mobility - User oils up their gears and <span class="h">becomes significantly faster!</span> Upon touching the enemy the enemy will go flying backwards. <span class="h">After 3 hits the enemy will take damage and the user will stop with minor stun afterwards.<span> <span class="w">The user will stop automatically after 5 seconds, if they did not hit the enemy 3 times.</span> ',
    
    'FLASH BEAM': 'Light Type Poke Projectile - <span class="h">User shoots two beams.</span> The first beam stunning the enemy upon impact, the second beam dealing minor damage to the enemy. <span class="w">Only one beam will shoot out at a time, with a short cooldown between each beam. This move is easily dodgeable so be tactful.</span>',
    
    'FIREWORK': 'Fire Type Projectile - User becomes stunned and is able to be rotated left or right through the movement keys. After a 5 second charge up, <span class="h">the user will shoot towards whatever direction its facing, dealing damage upon impact.</span> <span class="w">This attack can be interrupted if the user takes damage so ensure the target is stunned before using this attack!</span>', 
    
    'CHARGE': 'Electric Type Support - User charges itself up with electricity, <span class="h">doubling its attack power for 10 seconds!</span>',
    
    'EXPLOSION': 'Fire Type Area - User combustes into an giant explosion. <span class="h">The enemy takes damage by either being too close to the user during the start of the explosion or taking damage from the moving particles that come from the explosion,<span> which deal decent damage but outstanding knockback. <span class="w">Using this attack deals damage to the user upon usage. Note you much health you have BEFORE using this attack to ensure you don\'t lose while trying beat your opponent. You will also be severely stunned during the duration of this attack so take note of your enemy\'s attack cooldowns.</span>',
    
    'SWIPE': 'Basic Type Melee - User throws their arm at the enemy, dealing minor damage and knockback.',
    
    'UPSWIPE': 'Basic Type Melee - User throws their arm upwards in a uppercut like motion, sending the enemy upwards upon impact and dealing minor damage. <span class="c">If the user is Chaotiboom and the target is hit, then the target will be stunned for 5 seconds, acting as a combo extender for him.</span>',
    
    'TAUNT': 'Basic Type Support - User angers the target, <span class="w">multiplying the target\'s speed and strength by extra 1.6x for 4 seconds</span> meanwhile the <span class="h">user gains an additional 5 attack strength.</span>',
    
    'WIND SLASH' : 'Air Type Projectile - User sends a wave of air towards the target, dealing damage and minor knockback on contact.',
    
    'VICIOUS BITE': 'Beast Type Melee - User stretches out their mouth and <span class="h">bites the target with extreme force.</span>',
    
    'SNATCH': 'Dark Type Support - User grabs a bag and stretches it out to trap the target. Upon contact <span class="h">the target will be trapped in the bag unable to move for 3 seconds!</span> <span class="w">This attack is very easy to hit but detrimental to miss. Don\'t miss this attack.</span>',
    
    'SCREAM': 'Basic Type Support - User screams as loud as they can, reducing the enemy\'s attack power by 10! <span class="w">The user can only scream 2 times every match. Ensure the enemy cannot wipe away their debuffs! Be tactful!</span>',
    
    'WHOLE BODY ENGLUF': 'Beast Type Melee - User englufs the target, chewing on them and slowly draining their health before spitting them out. <span class="h">The user will gain health from the target as the target is being chewed. Once the target is spit out they will take more damage upon hiting the wall.</span> <span class="w">If you miss this attack you will take serious damage. This is not an attack you want to miss at low health. Use positioning to your advantage and get close!</span>',
    
    'VENOMOUS PRICK': 'Toxic Type Melee - User pricks the target their toxic body part, dealing damage and <span class="h">having a chance to deal poison damage.<span> <span class="w">Toxic and Metal types cannot be poisoned! Keep note of that fact when using this attack.</span>',
    
    'ABYSS ABSORPTION': 'Dark Type Support - User starts gradually absorbing dark matter storing it within itself. <span class="w">The darkness will stop being absorbed once it reaches 99 percent. Any futher attempts to use this move while having an enormous amount of darkness stored up will result in the user taking significant damage.</span> <span class="c">This move significantly impacts the damage and knockback of ABYSSAL SHOT</span>',
    
    'ABYSSAL SHOT': 'Dark Type Projectile - <span class="c">User shoots its stored up abyss towards the enemy, dealing damage according to how much abyss was stored.<span> <span class="w">After usage the user\'s abyss percent resets to zero.<span>',
    
    'IRON PIERCE': 'Metal Type Melee - User jumps backwards then smoothly swings themself forwards damaging and stunning whatever object it encountered for 2 seconds.',
    
    'RECONSTRUCT': 'Metal Type Support - User reinforces its mechanical body to <span class="h">gain health and 15 defense</span> while <span class="w">losing 9 attack and 0.15 speed.</span>',
    
    'CLAP': 'Basic Type Support - User claps their hands together and swaps places with the user. <span class="h">Depending on the keys pressed while using this attack, unique effects can happen. Clicking no keys causing the basic swap to occur. Pressing the right key swaps the creatures but sends the user sliding forwards afterwards. Pressing the left key swaps the creatures but makes the target be slightly more pushed back and upwards. Pressing the up key will swap the creatures but send the target way into the air. Then pressing the down key will swap the creatures but the target will be sent towards the bottom of the map.</span> <span class="h">This is a really good mobility, support, and discombobulator tool but you can still get baited into traps with your own move so be careful where you swap.</span>',
    
    'METAL CLUBS': 'Metal Type Melee - User slides forward to deliver two back to back blows that deal good damage and amazing knockback!',
    
    'ENCHANTING GLARE': 'Mind Type Support - User glares at the target intently and if the target is close enough, they will be caught in a trance for 3 seconds, unable to move.',
    
    'SHADOW GLIDE': 'Dark Type Mobility - User summons shadows to ride along, giving itself an significant speed boost for 5 seconds. <span class="c">This move can be cancelled by pressing the special key.</span>',
    
    'ECHO BITE': 'Dark Type Melee - User stretches out its fangs and bites the target, <span class="w">dealing no damage but leaving a shadow mark on them.<span> <span class="c">If this move is used again before 9 second mark duration is up then the target will take damage!</span> <span class="w">After taking damage or the 9 seconds are up the user will lose its shadow mark.</span>',
    
    'KEY TILT': 'Metal Type Support - User summons a key on their hip. <span class="h">Activating this move will grant you access to different keys that change the user\'s stats and moveset.</span> New keys can only be unlocked if the user successfully hits the target with the move LOCKDOWN then KEY STAB. <span class="c">There are 4 keys in total: balance, attack, defense, and speed. Using the special key and this move at the same time will cause the user to perform an unique attack move called KEY BLADE SPECIAL STRIKE that changes in speed and power depending on what key is active.</span> This special attack has a 8 second cooldown. <span class="w">Be warned. In order to unlock keys this attack must be used FIRST, therefore using LOCKDOWN and KEY STAB before using this move will not grant you keys<span>',
    
    'BITE': 'Basic Type Melee - User stretches out their mouth and bites the target. <span class="h">This attack\'s type changes to the user\'s type</span>',
    
    'LOCKDOWN': 'Metal Type Area - User jumps backwards and lunges forward placing a lock on whatever object it touches. <span class="h">On contact, the target will be stunned for 2 seconds and take minor damage.<span> <span class="w">Be cautious because, missing this attack will lock you instead. So for 2 seconds you will be stunned, vulnerable, and slightly damage. Be percise with this move, do not rush it.</span> <span class="c">This move is a complement to KEY TILT and KEY STAB</span>',
    
    'KEY STAB': 'Metal Type Melee - User leaps forward with a key in hand ready to strike! Upon contact the user deals minor damage and subtle knockback. <span class="c">Although if the target is locked down and has recently been hit with the attack LOCKDOWN then the user deals 2.5x extra damage!</span>',
    
    'RUSH DRILL': 'Metal Type Rush - User plummets downwards then comes shooting back upwards, <span class="h">dealing massive damage and stun upon contact.</span>',
    
    'VICIOUS BEAST': 'Beast Type Melee - <span class="w">User becomes wild and uncontrollable.</span> In this mode the user <span class="h">gains a 1.4x strength buff, a 1.8 speed buff, and deals aggressive knockback on contact.</span> This mode normally lasts for less than a second but <span class="h">hitting the target while in this state prolongs this mode for a few more milliseconds.</span> <span class="w">Beware. Sometimes the creature has a chance to hit themself, dealing serious damage to itself. Note your health before carelessly using this attack.</span>', 
    
    'STRIKE': 'Basic Type Melee - User does a quick forward thrust with their hand, dealing minor knockback and damage.',
    
    'CLAW STRIKE': 'Fighting Type Melee - User stretches out their claw overhead and swipes down towards the enemy. <span class="c">Hankclaw, upon hitting 3 successful claw strikes unlocks the move DECONSTRUCT! and this move is replaced by CLAW SWIPE TITAN.</span>',
    
    'SNAP': 'Basic Type Melee Poke - User snaps their fingers causing minor knockback, stun, and dealing around 2 damage.',
    
    'DASH': 'Basic Type Mobility - User dashes upwards or downwards depending on if the up or down key is being pressed.',
    
    'COUNTER': 'Fighting Type Support - User waits for their the target to attack. <span class="h">If the enemy attacks, depending on how close the attack is, the user will either do a FULL COUNTER, a PARTICAL COUNTER, or No Counter.<span> <span class="h">A Full Counter makes it so the user\'s health is restored back to wait it was originally and only activates if the target is extremely close. A Partical Counter occurs when the target is far but still within attacking distance therefore the counter does less damage, and heals only 50% of the damage taken.</span> <span class="w">While No Counter means the user will simply take damage with no compensation, avoid this outcome.</span>',
    
    'HYPE': 'Basic Type Support - User throws confetti around to get their self energized! <span class="h">This move can either increase the user\'s strength by 3, increase the user\'s speed by 0.25, increase the user\'s durability by 4 or regenerate the user\'s health by 8.</span> <span class="w">WARNING IF YOU HAVE EPILEPSY DO NOT USE THIS MOVE, CONTAINS FLASHING LIGHTS!</span>',
    
    'BREAK DANCE': 'Basic Type Area - User starts to break dance, causing any enemy within its radius to be pushed back, stunned, and faced with minor stun. <span class="w">WARNING IF YOU HAVE EPILEPSY DO NOT USE THIS MOVE, CONTAINS FLASHING LIGHTS!</span>',
    
    'FLASH BANG': 'Light Type Projectile - User sends a slow moving beam of light towards the enemy. <span class="h">This move has two variations, Standing and Idle. If the user is idle while using this move it will send a slow moving beam of light that steadly grows bigger, causing tick damage and a 3 second stun. If the user is moving then the light englufs the user and causes severe knockback, a 4 second stun, and damage upon contact.</span> <span class="w">This move has a small stun time for the user, but don\'t let your guard down. Wouldn\'t want to miss such a valuable move!</span>',
    
    'SPARKLE RUSH': 'Light Type Rush - User runs straight forward causing a light show as it runs across. <span class="h">As the user runs, it gains more momentum. The greater the momentum the more bonus damage you will receive if the attack hits. Upon touching the target, the user will throw the target in the air and slam them back down again, dealing massive amounts of stun and damage.</span> <span class="w">The target can easily slip out while being thrown in the air so be on guard!</span> <span class="w">WARNING IF YOU HAVE EPILEPSY DO NOT USE THIS MOVE, CONTAINS FLASHING LIGHTS!</span>',
    
    'VICIOUS RAM': 'Fighting Type Rush - User runs wildly, <span class="h">gradually gaining momentum and doing bonus damage on impact,</span> depending on momentum. <span class="w">Missing this attack will result in a massive 3 second stun. You will be open and vulnerable. Try not to miss.</span>',
    'VILE THRUST': 'Fighting Type Melee - User leaps quickly, blitzing the target and dealing minor damage if they are in the way.',
    'ADRENALINE': 'Basic Type Support - User <span class="h">gains an 2x speed increase for 5 seconds</span> until they crash, <span class="w">leaving the user vulnerable for 2 seconds.</span>',
    'MUD LAUNCH': 'Ground Type Support - User piles up mud and launches it towards the target. Grabbing on top the mud while its moving, the user is able to ride the mud and stun the target for 1 second.',
    
    'HAYMAKER': 'Fighting Type Melee - User charges up a massive bunch, dealing heavy damage and knockback! <span class="w">This move has a fairly slow windup time so ensure the target is stunned before trying to attack with this move!</span>',
    'ROOT HOOK': 'Ground Type Melee - User summons a root from the ground. Stretching it out to make a fist and punching the target with it, dealing good knockback and damage. <span class="w">This move has a severely slow windup time so ensure the target is stunned before trying to attack with this move!</span>',
    'SHELL BUNKER': 'Plant Type Support - User hides itself in their shell, <span class="h">becoming invincible for 3 seconds.</span>',
    'SHELL RICOCHET': 'Basic Type Support - User bounces itself around the arena with no control. <span class="h">For 8 seconds the user bounces from wall to wall until either it hits nothing and returns to normal, the user takes more than 15 damage, or it hits the target, stunning the target for 3 solid seconds.<span>',
    
    'QUICK PUNCH': 'Fighting Type Melee - User sends a quick percise punch towards the enemy. The punch minimal damage and little knockback but hitting the enemy at the right time, the sweet spot of the attack, will make it deal way more knockback.',
    
    'SHADOW SNARE': 'Dark Type Support - User summons an array of shadows infront of itself from the ground. <span class="h">Upon contact, the target will be stunned for 3 seconds.</span>',
    
    'VOID PULSE': 'Dark Type Projectile - User shoots out a massive projectile from their body, <span class="h">dealing serious damage</span> and a 2 second stun upon contact.',
    
    'TRANSPORT': 'Metal Type Support - User places down a tracker. <span class="h">If a tracker is already placed, then the user will be teleported to the tracker.</span> <span class="c">Although, if the target has been tracked by moves like RADIUS then, instead of the user being teleported to the tracker, the target will be teleported with stun.</span>',
    
    'RADIUS': 'Dark Type Projectile - User <span class="h">creates a tracker that orbits around the user for 5 seconds. If the tracker touches the target it will latch onto the target and after 3 seconds it will explode,</span> dealing great damage to the target. ',
    
    'WIND PUSH': 'Air Type Melee - User performs a massive push, dealing massive amounts of knockback and damage. <span class="h">Catching the target towards the end of this attack\'s animation will allow the user to deal more damage and knockback!</span> <span class="w">Missing this attack will cause the user to be stunned for 2 seconds. Be tactful with your positioning and percision when using this attack.</span>',
    
    'DOUGHBOY DROP': 'Air Type Area - User jumps in the air and slams downwards, dealing massive stun damage and knockback on contact. <span class="w">This attack has serious stun backlash and a long windup. Try to stun the target first before using this attack.</span>',
    
    'WIND PULSE RAY': 'Air Type Ultimate - User creates a massive soundwave towards the enemy that deals major knockback and damage.',
    
    'BUFF UP': 'Air Type Support - User uses air to enlarge their body and <span class="h">increase their attack strength by 1.3x for 7 seconds.</span> <span class="w">After 7 seconds the user will be stunned for 2 seconds and return to normal.</span>',
    
    'PSY-SHREDDER': 'Mind Type Projectile - User sends a projectile towards the target dealing mediocre damage and knockback.',
    
    'MIND WARP': 'Mind Type Support - User warps towards the target, stunning the target temporarily.',
    
    'GRAVITY WELL': 'Mind Type Support - User takes complete control over the target for 2 seconds.',
    
    'CLAW SWIPE TITAN': 'Fighting Type Melee - A 3 hit move that deals massive damage and knockback every hit. <span class="c">After Hankclaw uses CLAW STRIKES 3 times, Hankclaw\'s CLAW STRIKE attack will be replaced with CLAW SWUPE TITAN.  </span>',
    
    'THIN SWIPE': 'Basic Type Melee Poke - User sends a wave of slashes directly at the target, dealing damage and knockback.',
    
    'ABYSS SHIELD': 'Dark Type Support - Darkness surrounds the user in a dark shell for 5 seconds, granting a massive +50 Defense boost.',
    
    'SINGULARITY PUNCH': 'Metal Type Melee - User creates a magnetic pull that <span class="highlight">drags the target slightly inward</span> before delivering a heavy, high-impact blow. <span class="warning">This attack briefly stuns the user during execution, so timing is key.</span>',

    'SEISMIC TOSS': 'Fighting Type Rush - User charges forward with extreme force. Upon contact, the user <span class="highlight">grabs the target and launches them into the stratosphere before slamming them back into the ground</span> for massive impact damage. <span class="warning">Missing the initial rush will leave the user stationary and vulnerable for a significant duration!</span>',

    'MAGNETIC PULL': 'Metal Type Support - User emits a powerful electromagnetic pulse that <span class="highlight">forcibly draws the enemy toward them.</span> This move deals no damage but is perfect for setting up close-range combos or interrupting an escaping opponent.',
    
'RUSH': 'Basic Type Poke Rush - User charges forward at high speeds, dealing 1 damage and knockback on contact. <span class="warning">Dashing toward the target will drag them with you and they will not be stunned. Be ready for direct battles.</span>',

    'FLASH FREEZE': 'Frost Type Ultimate - User instantly drops the temperature around them, <span class="highlight">freezing all nearby enemies for 2 seconds.</span> <span class="h">If the user successfully hits a FLASH FREEZE, then the next time they use this move it will be an ultimate move called ABSOLUTE ZERO, which makes dangerous frost icicles fall from the sky slowing the target down and dealing damage.</span> <span class="c">Although if the creature Lummywhale uses this move after succesfully hitting their FLASH FREEZE then the ultimate GRAND FLOOD WALL will arise and waves will come crashing from the sides of the map dealing damage to the target, reducing their speed, and increasing the speed of the user.</span>',
    
    'ABYSSAL BELLOW': 'Water Type Support - The user swells to 2.5x their original size. While expanded, they <span class="highlight">knock back and damage enemies on contact.</span>',
    
    'PRESSURE WASH': 'Water Type Projectile - User fires a high-pressure stream of water. <span class="highlight">The spray auto aims and deals rapid, multi-hit damage.</span>',
    
    'HEAVY ANCHOR': 'Metal Type Projectile - User drops a massive iron anchor from the sky. <span class="highlight">Deals heavy damage and applies a long stun.</span>',
    
    'AQUA SHOT': 'Water Type Projectile - User creates a water container that gradually <span class="h">generates 1 dropplet every 3 seconds. When using this move, the user takes water from that container and uses it to boosts itself.</span> The higher the water contained, the more health and speed you will acquire from the container.',
    
    'EXHAUST PLUME': 'Fire Type Support - User emits a thick smoke cloud that <span class="highlight">heals the user while slowing any enemy caught inside.</span>',
    
    'OVERHEAT': 'Fire Type Support - User pushes their internal temperature to the limit, <span class="highlight">gaining 1.5x speed</span> but <span class="warning">taking constant chip damage while active.</span> <span class="h">If the user is a Fire type then instead of losing health, they will be gaining it.</span>',
    
    'PISTON STRIKE': 'Metal Type Melee - A mechanical strike where <span class="highlight">knockback is higher at high HP, and damage is higher at low HP.</span>',
    'NOIR SLASH': 'Dark Type Melee - A quick, shadow-infused blade strike that deals high damage with a short reach.',
    'SHOOTING STAR': 'Light Type Projectile - User spins and launches as a star. <span class="warning">Missing this attack will permanently lower the user stats for the rest of the match!</span>',
    'SULK': 'Dark Type Mobility - User sinks into a shadow puddle, <span class="highlight">gaining a massive speed boost and semi-invulnerability.</span>',
    'ARM STRIKES': 'Fighting Type Melee - A 4-hit boxing combo. <span class="highlight">The final hit deals massive damage but has a long recovery time.</span>',
    'TERROR': 'Dark Type Area - User emits a haunting scream. <span class="highlight">Any enemy caught inside is repeatedly stunned and "Terrified."</span>',
    'TERROR UNLEASHED': 'Dark Type Ultimate - User transforms into a gargantuan abomination, <span class="highlight">gaining permanent Beast typing and extreme offensive stats.</span>',
    'SPIN SNIPE DAMAGE': 'Light Type Ultimate - Summons 5 flares that orbit the user. <span class="warning">Flares hit foes on contact but backfire if they expire without hitting anyone.</span>',
    'EXPERIMENTAL CRISIS': 'Plant Type Support - User undergoes a volatile transformation, <span class="highlight">increasing size and speed</span> but <span class="warning">slowly losing HP over time.</span>',
    'POLLEN CLOUD': 'Air Type Projectile - User releases a bouncing cloud that <span class="highlight">deals continuous chip damage to any enemy caught inside.</span>',
    'PROJECT BEAM': 'Metal Type Ultimate - User builds a turret that, once completed, <span class="highlight">fires a massive, screen-spanning laser beam.</span>',
    'LAVA TRAIL': 'Fire Type Mobility - User leaves a continuous trail of heat while moving that <span class="highlight">deals multiple hits of damage and stuns.</span>',
    'MAGMA BURST': 'Fire Type Area - User causes the ground to explode with molten rock, dealing massive area damage.',
    'HARDEN': 'Plant Type Support - User anchors themselves to the ground to <span class="highlight">heal slightly and gain a temporary defense boost.</span>',
    'RUBBLE THROW': 'Ground Type Projectile - User hurls heavy rocks at the opponent, dealing high knockback.',
    'CRUSHING WEIGHT': 'Metal Type Melee - User leaps and falls. <span class="highlight">Damage scales drastically based on the distance fallen.</span>',
    'SLASH': 'Basic Type Melee - A standard blade swipe dealing reliable damage.',
    'VIOLENT RAM': 'Fighting Type Rush - A reckless charge that deals massive damage. <span class="warning">The user takes a small portion of the damage dealt.</span>',
    'SHARPEN': 'Metal Type Support - User hones their edges, <span class="highlight">increasing the damage of the next 3 melee attacks.</span>',
    'SPINNING DRILL RUSH': 'Metal Type Rush - User transforms into a drill and spins forward, <span class="highlight">piercing through enemy defenses.</span>',
    'MOUNTAIN BARRIERS': 'Ground Type Support - User summons two stone pillars to block movement and projectiles.',
    'EARTHQUAKE': 'Ground Type Area - User slams the ground, <span class="highlight">stunning all grounded enemies regardless of distance.</span>',
    'SNOWFALL': 'Frost Type Area - User summons a blizzard that <span class="highlight">slowly reduces enemy speed over time.</span>',
    'MOUNTAIN RISE': 'Ground Type Melee - A pillar of stone erupts beneath the enemy, launching them skyward.',
    'PORTAL STRIKE': 'Mind Type Melee - User sends a portal forward; if it hits, <span class="highlight">the target is pulled underground and slammed into a block.</span>',
    'QUICK RIFT': 'Mind Type Mobility - A short-range instant teleport used to dodge attacks.',
    'TALON SWEEP': 'Air Type Area - User summons a rising tornado. <span class="highlight">Objects caught are lifted and damaged repeatedly before falling.</span>',
    'GRAND DISAPPEARANCE': 'Mind Type Ultimate - User rains summoned obstacles on the target or <span class="highlight">teleports behind them for a final cape-sweep slam.</span>',
    'ASYNC': 'Mind Type Support - User glitches their position, <span class="highlight">becoming briefly untouchable while preparing a counter.</span>',
    'SHINE': 'Light Type Support - A blinding flash that <span class="highlight">reduces the enemy\'s accuracy and vision.</span>',
    'DIG': 'Ground Type Mobility - User burrows underground, becoming invincible before surfacing for an attack.',
    'DUAL DRIVE': 'Metal Type Support - User overclocks two systems at once, <span class="highlight">flashing toward the target, grabbing them, and slamming them from wall to wall continously.</span>',
    'ABYSSAL CLONES': 'Dark Type Support - User summons three temporary clones that mimic the user\'s movements.',
    'ARSONAL SWITCH': 'Metal Type Support - User cycles through different mechanical weapons, changing attack range.',
    'OVERCLOCK': 'Electric Type Support - User pushes their gears to 200% capacity, drastically increasing their speed but, <span class="highlight">resetting all other move cooldowns instantly.</span>',
    'TATICAL HEADBUTT': 'Basic Type Rush - A rushing strike that <span class="highlight">deals higher damage the faster the user is going but causes dangerous stun to the user.</span> <span class="w">The user will be very vulnerable if they hit the enemy at high speeds. Be cautious.</span>',
    'ENGINE OVERRIDE': 'Electric Type Ultimate - User enters a permanent state of high-power output until the match ends or they are defeated.',
    'QUICK PERCEPTION': 'Mind Type Support - User slows down time from their perspective, <span class="highlight">making it easier to dodge the next incoming attack.</span>',
    'RADAR': 'Metal Type Support - User clears itself of all buffs and pauses as it reveals the enemy\'s position, having the chance to <span class="highlight">teleport to the target\'s position with a 1.5x attack bonus.</span>',
    'POISONOUS SPIKES': 'Toxic Type Area - User leaves traps on the floor that <span class="highlight">deal poison damage to anyone who steps on them.</span>',
    'WRAP': 'Basic Type Melee - User wraps around the target, <span class="highlight">dealing repeated damage while both are briefly rooted.</span>',
    'GOO LEAK': 'Toxic Type Support - User leaves a trail of sticky goo that <span class="highlight">drastically reduces the speed of anyone walking over it.</span>',

    'CLOUDY PUFF' : 'Air Type Mobility - User summons clouds that increase mobility. The clouds go away if the user stands still. If 3 clouds have formed then the user will become invincible for 5 seconds.'
}

// const attackDescriptions = {
//   BITE: "Basic — Lunging bite dealing solid damage that converts to the user's current type. Heavily stuns on hit and briefly stuns the user on startup.",
//   SNAP: "Basic — Extremely fast short-range snap that deals light damage and applies knockback. Low cooldown and good for interrupting or poking.",
//   STRIKE: "Basic — A strong frontal strike that deals solid damage and briefly stuns. Reliable close-range attack for pressure.",
//   DASH: "Basic — A directional evasive dash that quickly repositions the user and leaves a visual trail. Briefly incapacitates the user while moving.",
//   GRAB: "Basic — Fast forward grab that pulls the user to the enemy's position if it connects. Excellent for closing distance and setting up combos.",
//   WRAP: "Basic — Wraps and squeezes the target, dealing repeated damage over time while both user and target are briefly rooted.",
//     DRAG: "Basic — Grabs and drags the target, dealing repeated damage over time while both user and target are briefly rooted.",
//   BEATDOWN: "Basic — Momentum-based multi-hit rush that scales damage with speed. Excellent for carry-through combos and finishing sequences.",
//   "CHRONIC SLAM": "Basic — Rapid multi-slam assault that repeatedly hits the foe, scaling damage over the sequence and applying chip damage between hits.",
//   "BODY SLAM": "Basic — Heavy aerial slam whose damage scales with user size and defense. Hard-hitting from above with strong knockback on impact.",
//   HYPE: "Basic — A flashy hype move that spawns effects and grants one of several random temporary buffs to Attack, Speed, Defense, or HP.",
//   TAUNT: "Basic — Short self-buff that increases the user's Attack temporarily but enrages the opponent, raising their Speed as a drawback.",
//   ADRENALINE: "Basic — A sudden surge that doubles the user's movement speed for 5 seconds. Perfect for aggressive chasing or quick escapes.",
//   BLOAT: "Basic — Restores a moderate amount of HP while the user is rooted and vulnerable during channeling. Strong for sustain but punishable.",
//   FIREBOLT: "Fire — Launches multiple small fire projectiles across the stage for zoning. Projectiles deal small fire damage and can be dodged or blocked.",
//   FIREWORK: "Fire — Chargeable high-risk dash-launch that turns the user into a fiery projectile. Massive impact damage with long charge and recovery.",
//   "LAVA TRAIL": "Fire — Leaves a continuous trail of heat while moving. The trail persists and deals multiple hits of fire damage and stuns to enemies.",
//   ERUPT: "Fire — Roots the user to launch several fiery flares into the air. Flares travel in random paths and deal damage on contact.",
//   "EXHAUST PLUME": "Fire — Emits a thick smoke cloud that heals the user for 6 HP and slows the speed of any enemy caught inside for several seconds.",
//   PUDDLE: "Water — Creates a large, shrinking pool of water that heavily slows both the user and the enemy while dealing periodic damage.",
//   "ABYSSAL BELLOW": "Water — The user swells to 2.5x their original size, gaining a massive hitbox. While expanded, they knock back and damage enemies on contact.",
//   "PRESSURE WASH": "Water — The user roots themselves to fire a high-pressure stream of water droplets. The spray can be aimed and deals rapid, multi-hit damage.",
//   STATIC: "Electric — Close-range electric discharge that deals light damage and stuns the target on hit. Briefly stuns the user to balance the effect.",
//   CHARGE: "Electric — Hold-to-charge move that increases next attack damage and visual effects; charge decays if unused.",
//   "ELECTRO WAVE": "Electric — Shoots vertical bolts that grow downward; each bolt deals increasing Electric damage as it forms. Strong anti-air pressure.",
//   PECK: "Air — Quick forward or upward peck that deals light Air damage and briefly staggers the target. Short startup and recovery; good for juggles.",
//   "WIND MILL": "Air — Creates a large vortex that pulls enemies toward the user. The field shrinks over time and ends with a blast that knocks the enemy back.",
//   "WIND SLASH": "Air — Fires a fast-moving wind blade that travels forward, dealing Air damage and applying knockback. Great for space control.",
//   "WIND PUSH": "Air — Blast of wind that knocks enemies back with solid damage. Strong zoning tool with a high knockback multiplier.",
//   "DOUGHBOY DROP": "Air — High leap followed by a heavy slam that creates a shockwave. Deals massive damage and stuns on hit, but stuns the user if it misses.",
//   "BUFF UP": "Air — Grow larger and gain a massive attack boost for several seconds. Features a visual glow effect and a cooldown penalty.",
//   "WIND PULSE RAY": "Air — Massive wind beam that grows as it travels. Ultimate move that deals massive damage but lowers defense and stuns user after use.",
//   "BREAK DANCE": "Air — A rotating multi-hit spin that starts large and shrinks over time. Stuns and pushes enemies away repeatedly while dealing damage.",
//   FLIGHT: "Air — Grants the user the ability to fly freely in any direction for 5 seconds. Movement is canceled early if the user takes damage.",
//   "POLLEN CLOUD": "Air — Releases a large, bouncing cloud of allergens that travels across the screen. Deals continuous chip damage to any enemy caught inside.",
//   HARDEN: "Plant — Channelled defensive move that heals slightly and grants a temporary defense boost while the user is rooted.",
//   "SHELL BUNKER": "Plant — Hide in a shell for a massive temporary defense spike. The user shrinks and gains high damage resistance for a short duration.",
//   "EXPERIMENTAL CRISIS": "Plant — The user undergoes a volatile transformation, increasing size and speed. Radiates poison to nearby enemies but slowly loses HP.",
//   "ROOT HOOK": "Ground — Extends a subterranean root forward. If it catches an opponent, it pulls them forcefully toward the user for a follow-up strike.",
//   "MUD LAUNCH": "Ground — Track and ram into the enemy, dealing damage and heavy stun. Homes in on the target's position.",
//   BEAM: "Light — Channeled directional beam that extends from the user. Deals continuous Light damage and pushes enemies; effective for area denial.",
//   "FLASH BANG": "Light — Fires a projectile that expands into a blinding burst or detonates on impact. Damages and stuns foes caught in the light.",
//   "ORBITAL STRIKE": "Light — Fires a high-velocity cyan orb that travels across the stage. A reliable, fast-moving projectile used for long-range pressure.",
//   "STAR-PLATE": "Light — Encases the user in a sparkly purple border, granting a significant +20 Defense boost for 5 seconds.",
//   "SPARKLE RUSH": "Light — A multi-hit flashy rush that finishes with a high-velocity dash. Upon impact, the user grabs the target for an aerial slam.",
//   "SHOOTING STAR": "Light — Ultimate move where the user spins and launches as a star. Hits trigger a burst of flares, but missing permanently lowers the user's stats.",
//   "SPIN SNIPE DAMAGE": "Light — Summons 5 flares that orbit the user as a defensive perimeter. Flares hit foes on contact but backfire on the user if they expire without hitting.",
//   CHOMP: "Dark — A short-range bite that deals modest damage and briefly stuns the target. Low raw damage but interrupts enemy actions.",
//   "SHADOW STEP": "Dark — Teleports the user to the arena edges and leaves lingering shadow zones that stun enemies who enter. Good for repositioning.",
//   SNATCH: "Dark — Drops a shadow strike from above that heavily stuns and briefly traps the target on hit. Great punisher for aerial opponents.",
//   "FADE AWAY": "Dark — Temporarily becomes shadowy and semi-invulnerable with increased Defense and Speed. Short duration, high survivability.",
//   "TENTACLE SLASH": "Dark — Summons a descending dark appendage that strikes from above, dealing heavy Dark damage and a long stun.",
//   "VOID PULSE": "Dark — Releases a close-range burst of void energy. Stuns and slows nearby enemies, though the user is briefly vulnerable during the cast.",
//   "SHADOW SNARE": "Dark — Fires a low-reaching shadow whip along the ground. If it connects, it instantly pulls the target close and leaves them heavily stunned.",
//   RADIUS: "Dark — Rotating dark energy marks enemies for an inevitable explosion. If fatal, triggers a cinematic finishing execution.",
//   SULK: "Dark — The user sinks into a shadow puddle, gaining a massive speed boost and semi-invulnerability. Ends if the user stops or takes damage.",
//   "VOID BURST": "Dark — A massive dark explosion centered on the user. Damage and size scale with the user's current health; stuns nearby foes.",
//   "ABYSS SHIELD": "Dark — Shrouds the user in a dark shell for 2 seconds, granting a massive +50 Defense boost. The aura follows the user as they move.",
//   TERROR: "Dark — Emits a haunting scream that creates a large purple zone. Any enemy caught inside is repeatedly stunned and 'Terrified'.",
//   "HORN OF MALICE": "Dark — After a long wind-up, the user launches a massive shadow horn forward. Deals devastating damage with extreme knockback.",
//   CLAMP: "Metal — Powerful crushing grab that drags and suppresses the target while dealing repeated Metal damage. High risk with heavy disruption.",
//   DECONSTRUCT: "Metal — Long channel that periodically heals and boosts HP, speed, and attack while lowering defense. Leaves user vulnerable during use.",
//   "RUSH DRILL": "Metal — High-speed Metal dash that gains momentum. Missing leads to a vaulting slam; connecting deals strong damage and stun.",
//   TRANSPORT: "Metal — First use sets a stationary marker; second use instantly teleports the user back to that marker.",
//   "PISTON STRIKE": "Metal — Fires a mechanical piston that scales with health. At high HP, it has more knockback; at low HP, it deals more damage.",
//   "SINGULARITY PUNCH": "Metal — A magnetic strike that pulls the target inward before delivering a heavy, high-impact punch. High damage with a moderate startup.",
//   "HEAVY ANCHOR": "Metal — Drops a massive iron anchor from the top of the screen onto the target. Deals heavy damage and applies a long stun.",
//   "PROJECT BEAM": "Metal — A multi-stage construction move. The user builds a turret that, once completed, fires a massive, screen-spanning laser beam.",
//   PERMAFROST: "Frost — Icy shield that slows and chips enemies who touch the user. Defensive stance with a heavy slow effect.",
//   "ICICLE SHARD": "Frost — Fires a sharp ice projectile that chills the target on impact. Deals moderate damage and slows enemy movement.",
//   "FLASH FREEZE": "Frost — Instantly creates a solid block of ice in front of the user. Enemies in range are completely frozen and take frost damage.",
//   "VENOMOUS PRICK": "Toxic — A quick toxic stab that applies a poison damage-over-time effect with a chance to convert the user to Toxic type.",
//   "ACID SPIT": "Toxic — Launches a glob of corrosive acid. Deals damage and applies a temporary speed debuff that cuts movement in half.",
//   TELEPORT: "Mind — A near-instant blink directly to the target's current location. Tiny recovery stun to balance aggression.",
//   "TELE SLAM": "Mind — Channels a psychic field that grows around the user. Lifts and slams the enemy for heavy damage; misses cause recoil to the user.",
//   "MIND WARP": "Mind — Instantly teleports the user behind the target and leaves them in a 4-second trance. Excellent for repositioning.",
//   "PSY-SHREDDER": "Mind — Projects a fast-moving psychic blade forward. Deals moderate damage and uses mental force to knock the enemy backward.",
//   "ANCIENT WISDOM": "Mind — The user taps into forbidden knowledge, gaining a temporary +20 Attack boost for 5 seconds.",
//   "VICIOUS RAM": "Fighting — Rush forward with increasing speed, dealing scaled damage on impact. Momentum-based with heavy knockback.",
//   COUNTER: "Fighting — Enter a brief stance to retaliate against incoming strikes. If not triggered, the user suffers a short recovery window.",
//   "CLAW STRIKE": "Fighting — Drop a claw strike from above for quick overhead damage. Fast descending attack with solid damage.",
//   HAYMAKER: "Fighting — Wind up for a devastating punch. Features a heavy wind-up with massive impact damage, knockback, and stun.",
//   "ARM STRIKES": "Fighting — A 4-hit boxing combo. Each hit pauses for impact; the final hit deals massive damage but has a long recovery.",
//   "VILE THRUST": "Fighting — A high-speed forward thrust that pierces through the air. The user becomes a projectile that damages and stuns.",
//   "CLAW SWIPE TITAN": "Fighting — A brutal 3-hit combo. If the first hit connects, the user locks the target into a high-speed sequence ending in an explosion.",
//   SHED: "Bug — Long channel that heals and grants stat boosts to attack and speed while reducing defense; user is vulnerable during use.",
//   INFESTATION: "Bug — Summons a localized swarm of insects on the target's position. Deals damage three times over a short duration.",
//   "VICIOUS BITE": "Beast — Brutal forward attack dealing high Beast damage. Stuns and pulls the target closer for follow-up attacks.",
//   TOTALITY: "Beast — Temporarily transforms the user into a Beast type with large boosts to all stats and increased size.",
//   "HORN DRILL": "Beast — Multi-hit drilling attack that hits three times rapidly after a small forward lunge.",
//   "COSMIC GULP": "Beast — Grab and eat the enemy, dealing huge damage before spitting them out. Uses a pull mechanic.",
//   "SHELL RICOCHET": "Beast — Bounce around the arena damaging enemies on contact. Long duration with wall bounces; cancels if the user takes too much damage.",
//   "TERROR UNLEASHED": "Dark — The user lets out a horrifying scream and transforms into a gargantuan abomination. Peekaboo gains permanent Beast typing and extreme offensive stats, while other users gain a massive 10-second berserk buff.",

//   "GRAVITY WELL": "Mind — The user channels a psychic tether to seize control of the target's gravity. For 2 seconds, the user can forcibly drag the opponent in any direction, leaving them completely helpless.",

//   "CRUSHING WEIGHT": "Metal — The user leaps and falls with terminal velocity. Damage scales drastically based on the distance fallen; if the user lands directly on the target from a great height, it deals massive impact damage.",

//   OVERHEAT: "Fire — The user pushes their internal temperature to the limit, gaining 1.5x movement speed for 5 seconds. This power comes at a cost, dealing constant fire chip damage to the user while active.",

//   "BUG BITE": "Bug — A swift, parasitic bite that deals moderate damage and stuns the user briefly. On a successful hit, the user drains the target's life force to restore their own health.",

//   CONCOCTION: "Plant — The user mashes together forest ingredients to produce one of four random tonics. Effects include temporary boosts to Attack, Defense, or Speed, or an immediate flat HP heal.",

// "PORTAL STRIKE": "Mind — Sends a portal forward from below the user. When the portal hits an opponent, they are pulled beneath the ground and slammed into a block summoned by the user.",
// "SHADOW GLIDE": "Dark — The user creates a controllable shadow portal using directional inputs. The portal can be positioned freely; when time expires or idle, the user teleports to the portal's location.",
// "TALON SWEEP": "Air — The user summons a rising tornado of talons that spirals upward. Objects caught in the vortex are lifted and damaged repeatedly before falling back down.",
// "GRAND DISAPPEARANCE": "Mind — The user gathers all summoned obstacles and sends them through portals, raining them down on the target. With few obstacles, the user instead teleports behind the target and sweeps them into the air with their cape, slamming them back down.",
// 'CLAP' : 'Basic - The user claps their hands and switches places with the opponent!',
// EXPLOSION: "Fire — Burst into a fiery explosion, dealing Fire damage scaled by your missing health. Spawns projectiles that spread outward, each dealing damage on contact. You lose 10 HP and are stunned for 6 seconds. Lower health = stronger explosion, faster projectiles, and more particles. Instant death if used below 15 HP.",
// 'KEY TILT': "Metal — Activates the Key Blade system. On first use, starts in Balance mode. Subsequent uses cycle through different key modes (Attack, Defense, Speed), each granting unique stat changes and move transformations. Only the active key mode can be switched."
// };