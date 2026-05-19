const activeEffects = []
let isGameOver = false; // Toggle this in your endBattle function

function spawnEffect(x, y, width, height, color, duration = 2000, circle = false){
    
    // If the game is over, don't even add the effect to the array
    if (isGameOver) return; 

    activeEffects.push({
        x, y, width, height, color,
        vx: (Math.random() - 0.5) * 4, // Random horizontal speed
        vy: (Math.random() - 0.5) * 4, // Random vertical speed
        expiry: Date.now() + duration,
        circle
    });
    
}

const slidePlayers = (speed, duration, follow, player, target, dash = true) => {
    const dir = player.facingRight ? 1 : -1
    const startTime = Date.now();

    if (dash){
    spawnImage("horizonal_dash", {x:player.x, y:player.y, width:player.width, height:player.height, color:'white', duration: 120}, {
            playAudioOnHit: false, audioName: '', target: target,
            flipX: !player.facingRight, flipY: false, priority: true,
    })
    }
    
    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= duration) {
            clearInterval(interval);
            return;
        }
        target.x += dir * speed;
        if (follow) player.x += dir * speed;

    }, 16);
    
}

    const rslidePlayers = (speed, duration, follow, player, target, dash = true) => {
        const dir = player.facingRight ? -1 : 1
        const startTime = Date.now();

        if (dash){
        spawnImage("horizonal_dash", {x:player.x, y:player.y, width:player.width, height:player.height, color:'white', duration: 120}, {
                playAudioOnHit: false, audioName: '', target: target,
                flipX: player.facingRight, flipY: false, priority: true,
        })
        }
        
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                clearInterval(interval);
                return;
            }
            target.x += dir * speed;
            if (follow) player.x += dir * speed;

        }, 16);
        
    }

const updateCombo = (player) => {
    player.m1Combo = (player.m1Combo || 0) + 1;
    if (player.m1Combo > 3) player.m1Combo = 1; // Loop back after 3 hits

    // Clear existing timer and reset combo if player idles for 1 second
    clearTimeout(player.comboTimer);
    player.comboTimer = setTimeout(() => {
        player.m1Combo = 0;
    }, 1000);
};

function insertEffect(box){
    spawnEffect(box.x, box.y, box.width, box.height, box.color, box.duration, box.circle)
}
function createBox(x, y, width, height, color, stats, duration, circle = false){
    return {x, y, width, height, color, ...stats, duration, life: 0, circle}
}

function determineStatus(attackType, targetType){
    const chart = advancedTypeChart[attackType]
    
    if (chart.sa.includes(targetType)){
        return { typeMod: 1.05, subEntrie: 'It was super very effective!' } //2
        
    }else if (chart.wa.includes(targetType)){
        return { typeMod: 1, subEntrie: 'It was not very effective...' } //0.5
        
    }else {
        return { typeMod: 0.95, subEntrie: 'It was nothing special.' }
    }
}

function dealDamage(user, attack, target) {
    const userAttack = user.stats.atk;
    const attackDamage = attack.dmg;
    const attackType = attack.type;
    const targetDefense = target.stats.def;
    const targetType = target.type;

    const randomFactor = Math.random() * (1.1 - 0.9) + 0.9;
    let { typeMod, subEntrie } = determineStatus(attackType, targetType);

    const defenseMod = 100 / (100 + targetDefense);
    const attackScaling = userAttack / (userAttack + 50);
    const attackPower = attackDamage * (1 + attackScaling);

    const critChance = Math.random() <= 0.15;
    const critMod = 1.5;

    let finalDamage = attackPower * defenseMod * typeMod * randomFactor;

    if (critChance) {
        finalDamage *= critMod;
        subEntrie += ' it was a critical hit!'
    }

    finalDamage = Math.max(1, Math.round(finalDamage));

    // Check if this hit will kill the target
    const isFatal = finalDamage >= target.stats.hp;

    const entrie = `${target.name} took ${finalDamage} damage! ${subEntrie}`;
    return { 
        message: entrie, 
        damage: finalDamage, 
        isCrit: critChance, 
        isFatal: isFatal 
    };
}

function checkCollision(attackBox, target){
    if (attackBox.x < target.x + target.width &&
   attackBox.x + attackBox.width > target.x &&
   attackBox.y < target.y + target.height &&
   attackBox.y + attackBox.height > target.y){
        return true
   }else{
        return false
   }
}

function noCollision(a, b) {
    // 1. AABB Collision Check (Are they overlapping?)
    if (a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y) {

        // rebukeCollision(a, b)

        // 2. Calculate overlap on both axes
        const overlapX = Math.min(
            a.x + a.width - b.x, 
            b.x + b.width - a.x
        );

        const overlapY = Math.min(
            a.y + a.height - b.y, 
            b.y + b.height - a.y
        );

        // 3. Resolve collision by moving 'a' out of 'b' on the shortest axis
        if (overlapX < overlapY) {
            // Horizontal resolution
            if (a.x < b.x) {
                a.x -= overlapX; // Push left
            } else {
                a.x += overlapX; // Push right
            }
        } else {
            // Vertical resolution
            if (a.y < b.y) {
                a.y -= overlapY; // Push up
            } else {
                a.y += overlapY; // Push down
            }
        }
    }
}

function rebukeCollision(a, b, rate = 1) {    
    // Calculate direction from a to b
    const centerAX = a.x + a.width / 2
    const centerAY = a.y + a.height / 2
    const centerBX = b.x + b.width / 2
    const centerBY = b.y + b.height / 2
    
    const distX = centerBX - centerAX
    const distY = centerBY - centerAY
    const distance = Math.sqrt(distX * distX + distY * distY)
    
    // Avoid division by zero
    if (distance === 0) return
    
    // Normalize direction
    const dirX = distX / distance
    const dirY = distY / distance
    
    // Push b away from a
    const pushForce = 15 * rate
    b.x += dirX * pushForce
    b.y += dirY * pushForce
    
    // Optional: swap velocities if they exist
    if (a.vx !== undefined && b.vx !== undefined) {
        let tempVx = a.vx
        let tempVy = a.vy
        a.vx = b.vx
        a.vy = b.vy
        b.vx = tempVx
        b.vy = tempVy
    }
}

function pull(a, b, rate = 1){
    // 2. Calculate centers
    const aCenterX = a.x + a.width / 2
    const aCenterY = a.y + a.height / 2
    const bCenterX = b.x + b.width / 2
    const bCenterY = b.y + b.height / 2

    // 3. Calculate distance between centers
    const diffX = aCenterX - bCenterX
    const diffY = aCenterY - bCenterY

    // 4. Move b toward a by the rate
    // This creates a smooth "magnetic" pull to the center
    b.x += diffX * rate;
    b.y += diffY * rate;
    if (Math.abs(diffX) < 1 && Math.abs(diffY) < 1) {
        b.x = aCenterX - b.width / 2
        b.y = aCenterY - b.height / 2
    }
}
function pullCollision(a, b, rate = 1) {
    // 1. AABB Collision Check (Only pull if touching)
    if (a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y) {

        // 2. Calculate centers
        const aCenterX = a.x + a.width / 2
        const aCenterY = a.y + a.height / 2
        const bCenterX = b.x + b.width / 2
        const bCenterY = b.y + b.height / 2

        // 3. Calculate distance between centers
        const diffX = aCenterX - bCenterX
        const diffY = aCenterY - bCenterY

        // 4. Move b toward a by the rate
        // This creates a smooth "magnetic" pull to the center
        b.x += diffX * rate;
        b.y += diffY * rate;
        if (Math.abs(diffX) < 1 && Math.abs(diffY) < 1) {
            b.x = aCenterX - b.width / 2
            b.y = aCenterY - b.height / 2
        }
    }
}

function stun(target, duration){
    target.maxSpeed = 0
    target.vy = 0
    target.vx = 0

    if (target.stunTimer) clearTimeout(target.stunTimer)
    
    target.stunTimer = setTimeout(() => {
        target.maxSpeed = target.stats.spd
        target.stunTimer = null
    }, duration)    
}

function retreiveImage(name){
    return `./PixelArt/BeasteskitsCatalog/${name}.png`
}

function retreiveAudio(name){
    return `./Music/SFX/${name}.mp3`
}

function retreiveEffect(name){
    return `./Effects/${name}.png`
}

function retreiveType(name){
    return `./Images/Types/${name}.png`
}


const priorityImages = []
const secondaryImages = []
function imageEffect(
    image,
    x,
    y,
    width,
    height,
    duration = 2000,
    flipX = false,
    flipY = false,
    priority = true,
    // tint = '',
    // opacity = 1,
    // rotation = 0
) {

    const effect = {
        image, x, y, width, height,
        flipX, flipY, 
        expiry: Date.now() + duration,
        // opacity
    }

    if (priority) {
        priorityImages.push(effect)
    } else {
        secondaryImages.push(effect)
    }
}

function spawnImage(
    imageName,
    box,
    {
        playAudioOnHit = false,
        audioName = null,
        target = null,
        flipX = false,
        flipY = false,
        priority = true,
        // tint = '',
        // rotation = 0,
        // opacity = 1,
        playerName = false
    } = {}
) {
    const image = new Image()
    image.src = (!playerName) ? retreiveEffect(imageName) : retreiveImage(imageName)

    image.onload = () => {
        imageEffect(
            image,
            box.x,
            box.y,
            box.width,
            box.height,
            box.duration,
            flipX,
            flipY,
            priority,
            // tint,
            // rotation,
            // opacity
        )
    }

    if (audioName) {
        const audio = new Audio(retreiveAudio(audioName))

        if (!playAudioOnHit || (target && checkCollision(box, target))) {
            audio.play()
        } else if (!playAudioOnHit) {
            audio.play()
        }
    }
}

function attackResults(player, box, target){
    if (target.isDodging) {
        target.indicate(`${target.name} dodged the attack!`)
        // rebukeCollision(box, target, 3)
        return
    }
    target.hit = true
    let { message, damage, isFatal } = dealDamage(player, box, target)
    if (isFatal){
        target.indicate(`${target.name} has died!`)
        setTimeout(()=>{
            target.stats.hp -= damage
            target.stats.hp = 0
            target.stats.spd = target.baseStats.spd
            target.updateLabel()
            target.hit = false
            
        }, 1000)
    }else {
        target.indicate(message)
        target.stats.hp -= damage
        target.updateLabel()
        setTimeout(()=>{
            target.hit = false
        }, 1000)
    }
    
    // let obj = {
    //     x: target.x,
    //     y: target.y,
    //     width: target.width,
    //     height: target.height,
    //     color: 'brown',
    //     dmg: 0,
    //     type: 'Beast', 
    //     duration: 500
    // }

    // spawnImage('static', obj, {
    //     playAudioOnHit: false,
    //     audioName: 'bite',
    //     target: target,
    //     flipX : !player.facingRight,
    //     flipY: false,
    //     priority: true
    // })
}

function isPositionValid(x, y, obstacles, minDistance) {
    for (const obstacle of obstacles) {
        const dx = x - obstacle.x
        const dy = y - obstacle.y
        const distance = Math.hypot(dx, dy)

        if (distance < minDistance) {
            return false
        }
    }
    return true
}

function colorFromType(type){
    switch(type){
        case 'Electric':
            return '#cdd328'
        break
        case 'Dark':
            return 'rgba(39, 38, 38, 1)'
        break
        case 'Water':
            return 'blue'
        break
        case 'Fire':
            return 'red'
        break
        case 'Plant':
            return 'green'
        break
        case 'Basic':
            return 'lightgray'
        break
        case 'Air':
            return '#adb3b3'
        break
        case 'Light':
            return 'tan'
        break
        case 'Metal':
            return '#586363'
        break
        case 'Beast':
            return 'brown'
        break
        case 'Mind':
            return 'pink'
        break
        case 'Fighting':
            return 'orange'
        break
        case 'Bug':
            return '#5b922c'
        break
        case 'Ground':
            return '#9d4f39'
        break
        case 'Toxic':
            return 'purple'
        break
        case 'Frost':
            return '#2f93a9'
        break

        case 'Ancient':
            return '#3e0151'
        break
    }
}

function retreiveImage(name){
    return `./PixelArt/BeasteskitsCatalog/${name}.png`
}

function retreiveAudio(name){
    return `./Music/SFX/${name}.mp3`
}

function retreiveEffect(name){
    return `./Effects/${name}.png`
}

// function clashCollision(a, b, duration = 1500) {
//     // 1. Check for collision
//     if (a.x < b.x + b.width &&
//         a.x + a.width > b.x &&
//         a.y < b.y + b.height &&
//         a.y + a.height > b.y) {

//             if (a.clashAble && b.clashAble){

//         // Only start a clash if neither is already clashing
//         // if (!a.isClashing && !b.isClashing) {
            
//         //     // 2. Lock them in place
//         //     a.isClashing = true;
//         //     b.isClashing = true;
            
//             // 3. Set the "Face-off" position
//             // We align them to the midpoint of the collision

//             const i = setInterval(()=>{
//                 const midX = (a.x + b.x) / 2;
//                 a.x = midX - a.width / 2;
//                 b.x = midX - b.width / 2;
//             }, 20)

//             // 4. Set a timer to resolve the duel
//             setTimeout(() => {
//                 // Randomly pick a winner
//                     a.expiry = 0; // Destroy A (or use your splice logic)
//                     b.isClashing = false; // B is free!
//                     b.expiry = 0; // Destroy B
//                     a.isClashing = false; // A is free!
//             }, duration);
//         // }
//         }
//     }
// }

const audioCache = {}
function playRetreivedAudio(name) {
    if (!audioCache[name]) {
        const audio = new Audio(retreiveAudio(name))
        audio.volume = 0.5
        audioCache[name] = audio
    }

    const audio = audioCache[name]
    audio.currentTime = 0 // optional: restart
    audio.play()
}

function cancelAudio(name) {
    const audio = audioCache[name]
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
}

function handleHealth(player, amount){
    player.stats.hp += amount
    if (player.stats.hp > player.baseStats.hp) player.stats.hp = player.baseStats.hp
    player.updateLabel()
}

function determineHealthBarColor(og, current){
    const value = (current * 100) / og
    
    if (value >= 80){
        return 'lightgreen'
    }
    if (value >= 60){
        return 'yellow'
    }
    
    if (value >= 45){
        return 'orange'
    }
    if (value >= 0){
        return 'red'
    }
}

function id(name) {
    return document.getElementById(name)
}
function all(className) {
    return document.querySelectorAll(`.${className}`)
}
function returnMap(name){
    return `./Maps/${name}.png`
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const activeAnimations = [];
function spawnAnimation(
    imageSrc,
    x,
    y,
    width,
    height,
    frameWidth,
    frameHeight,
    frameCount,
    frameDuration = 80,
    duration = 2000,
    flipX = false
) {
    if (isGameOver) return;

    const image = new Image();
    const animationObj = {
        image,
        x,
        y,
        width,
        height,
        frameWidth,
        frameHeight,
        frameCount,
        frameDuration,
        flipX,
        currentFrame: 0,
        previousFrame: -1,
        startTime: Date.now(),
        expiry: Date.now() + duration,
        isActive: false,
        isPaused: false,  // **NEW: Pause flag**
        pausedFrame: null,  // **NEW: Which frame to pause on**
        pauseStartTime: null  // **NEW: When pause started**
    };
    
    image.onload = () => {
        animationObj.isActive = true;
        activeAnimations.push(animationObj);
    };
    
    image.src = imageSrc;
    
    return animationObj;
}

function pauseAnimation(animationObj, pauseDuration = 300) {
    animationObj.isPaused = true;
    animationObj.pausedFrame = animationObj.currentFrame;
    animationObj.pauseStartTime = Date.now();
    animationObj.pauseDuration = pauseDuration;
    
    console.log(`⏸️ Animation paused on frame ${animationObj.pausedFrame}`);
}

function resumeAnimation(animationObj) {
    if (!animationObj.isPaused) return;
    
    animationObj.isPaused = false;
    animationObj.pauseStartTime = null;
    
    console.log(`▶️ Animation resumed`);
}
