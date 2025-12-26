const activeEffects = []
function spawnEffect(x, y, width, height, color, duration = 2000){
    activeEffects.push({
        x, y, width, height, color,
        expiry: Date.now() + duration
    })
}

function determineStatus(attackType, targetType){
    const chart = typeChart[attackType]
    
    if (chart.strong.includes(targetType)){
        return { typeMod: 2, subEntrie: 'It was super very effective!' }
        
    }else if (chart.weak.includes(targetType)){
        return { typeMod: 0.5, subEntrie: 'It was not very effective...' }
        
    }else {
        return { typeMod: 1, subEntrie: 'It was nothing special.' }
    }
}

function dealDamage(user, attack, target){
    const userAttack = user.stats.atk
    
    const attackDamage = attack.dmg
    const attackType = attack.type
    
    const targetDefense = target.stats.def
    const targetType = target.type

    const minVariance = 0.9
    const maxVariance = 1.1
    let randomFactor = Math.random() * (maxVariance - minVariance) + minVariance

    let entrie = ''

    let {typeMod, subEntrie} = determineStatus(attackType, targetType)

    let defenseMod = 100 / (100 + targetDefense)
    
    const critChance = (Math.random() <= 0.25) ? true : false
    let critMod = 1.9

    const baseDamage = attackDamage * defenseMod
    let finalDamage = baseDamage
    finalDamage *= typeMod
    finalDamage *= randomFactor
    
    if (critChance){
        finalDamage *= critMod
        subEntrie += ' It was a critical hit!'
    }
    
    finalDamage = Math.round(finalDamage)
    finalDamage = Math.max(1, finalDamage)
    
    entrie = `${target.name} took ${finalDamage} damage! ${subEntrie}`
    return {message: entrie, damage: finalDamage}
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
    // 1. Check if they are actually touching
    if (a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y) {

        // 2. Calculate how much they are overlapping on each axis
        // FIXED: Changed 'attackBox.x' to 'a.x'
        const overlapX = Math.min(
            a.x + a.width - b.x,  // distance from 'a' right to 'b' left
            b.x + b.width - a.x   // distance from 'b' right to 'a' left
        );

        const overlapY = Math.min(
            a.y + a.height - b.y, // distance from 'a' bottom to 'b' top
            b.y + b.height - a.y  // distance from 'b' bottom to 'a' top
        );

        // 3. Resolve the collision on the SHORTEST axis (looks more natural)
        if (overlapX < overlapY) {
            if (a.x < b.x) {
                a.x -= overlapX / 2 * rate
                b.x += overlapX / 2 * rate
            } else {
                a.x += overlapX / 2 * rate
                b.x -= overlapX / 2 * rate
            }
        } else {
            if (a.y < b.y) {
                a.y -= overlapY / 2 * rate
                b.y += overlapY / 2 * rate
            } else {
                a.y += overlapY / 2 * rate
                b.y -= overlapY / 2 * rate
            }
        }
    }
}

function pullCollision(a, b, rate) {
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

function attackResults(player, box, target){
    let { message, damage } = dealDamage(player, box, target)
    target.stats.hp -= damage
    if (target.stats.hp <= 0) {
        target.stats.hp = 0

        target.stats.spd = target.baseStats.spd
    }
    target.updateLabel()
    target.indicate(message)
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
            return 'gray'
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
            return '#faff71'
        break
        case 'Metal':
            return '#586363'
        break
        case 'Beast':
            return 'brown'
        break
    }
}