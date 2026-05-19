registerAttack('BLITZ', {
stats: { dmg: 15, type: 'Electric', cooldown: { time: 25000, switch: false } },

action: (player, target) => {
    if (player.ultimateActive) return
    
    const stats = attackFunctions['BLITZ'].stats
    const dir = player.facingRight ? 1 : -1

    let speed = 15
    let duration = 0
    let hit = false
    
    let bonus = (target.stats.hp < target.baseStats.hp * 0.5) ? 10 : 0

    player.indicate(`${player.name} is charging BLITZ!`)

    playRetreivedAudio('lighting-whip')
    const dash = setInterval(() => {
        duration += 100

        stun(player, 100)
        player.x += dir * speed
        speed += 2

        spawnEffect(player.x, player.y, player.width, player.height, 'yellow', 100)

        // ❌ Miss
        if (
            player.x <= 0 ||
            player.x >= canvas.width
        ) {
            clearInterval(dash)

            if (!hit) {
                player.indicate("MISSED BLITZ!")
                stun(player, 1200)
            }

            return
        }

        if (duration < 200 && checkCollision(player, target)) {
            player.indicate(`${player.name} was too close to use BLITZ!`)
            stun(target, 1500)
            stun(player, 1500)
            clearInterval(dash)
            return
        }

        // ✅ HIT
        if (checkCollision(player, target)) {
            hit = true
            clearInterval(dash)

            stun(player, 400)
            stun(target, 400)

            // 🔥 ULTIMATE TRIGGER
            if (!player.ultimateActive) {
                player.ultimateActive = true

                FillUltimate(
                    player,
                    'yellow',
                    'white',
                    'SPEED <br> OF <br> FURY!',
                    'beam',
                    () => startBlitzCombo(player, target, stats)
                )
            } else {
                startBlitzCombo(player, target, stats)
            }
        }

    }, 100)

    
}

})

function startBlitzCombo(player, target, stats) {
let step = 0

const sequence = [
    () => slash(player, target, -60, 0),
    () => slash(player, target, 60, 0),
    () => slash(player, target, 0, -60),
    () => slash(player, target, 0, 60),
    () => slash(player, target, -40, -40),
]

player.indicate("BLITZ COMBO!")

const combo = setInterval(() => {
    if (step >= sequence.length) {
        clearInterval(combo)
        finishBlitz(player, target, stats)
        playRetreivedAudio('body-thud')
        return
    }

    if (step === 2) {
        stun(target, 50)
    }
    if (step === 3 && Math.random() > 0.7) {
        target.indicate(`${target.name} BROKE OUT!`)
        clearInterval(combo)
        return
    } 
    playRetreivedAudio('thunder')
    sequence[step]()
    step++

}, 180)

}

let comboMult = 1
function slash(player, target, offsetX, offsetY) {
player.x = target.x + offsetX
player.y = target.y + offsetY

spawnEffect(player.x, player.y, player.width, player.height, 'yellow', 120)

if (checkCollision(player, target)) {
    attackResults(player, { dmg: 5 * comboMult, type: 'Electric' }, target)
    comboMult *= 0.85
}

}

function finishBlitz(player, target, stats) {
player.x = target.x - 50

spawnEffect(target.x, target.y, target.width, target.height, 'white', 300)

attackResults(player, stats, target)

rebukeCollision(player, target, 6)
stun(target, 1500)

player.indicate("BLITZ FINISHED!")

player.ultimateActive = false

stun(player, 2500)
stats.dmg += bonus

attackResults(player, stats, player)
}