const setCompareButton = document.querySelector('#compare-btn')

// improvements
// higher number highlighted in color
// practical hints for each player to deal with opponent
// acknowledge type advantage
function getHints(player, opponent) {
const hints = [];

const p = player.stats;
const o = opponent.stats;

const pRole = getRole(player);
const oRole = getRole(opponent);

const pMoves = player.moveset;
const oMoves = opponent.moveset;

// 🔹 CATEGORY COUNTS
const getCounts = (moves) => {
let ranged = 0, mobility = 0, utility = 0;

moves.forEach(move => {
  const data = attackFunctions[move];
  if (!data) return;

  if (data.category === "projectile") ranged++;
  if (data.category === "mobility") mobility++;
  if (["support", "area"].includes(data.category)) utility++;
});

return { ranged, mobility, utility };

};

const pCounts = getCounts(pMoves);
const oCounts = getCounts(oMoves);

// ⚡ SPEED
if (p.spd > o.spd + 0.5)
hints.push("⚡ You are faster - strike first and apply pressure");

else if (p.spd < o.spd - 0.5)
hints.push("⚠️ Opponent is faster - play defensive and wait for mistakes");

// 💥 ATTACK
if (p.atk > o.atk + 10)
hints.push("🔥 You deal more damage - look for aggressive trades");

else if (p.atk < o.atk - 10)
hints.push("⚠️ Opponent hits harder - avoid direct fights");

// 🛡️ DEFENSE / HP
const pBulk = (p.hp + p.def) / 2;
const oBulk = (o.hp + o.def) / 2;

if (pBulk > oBulk + 10)
hints.push("🛡️ You are more durable - you can outlast them");

else if (pBulk < oBulk - 10)
hints.push("⚠️ Opponent is tankier - don’t rely on long fights");

// 🎯 RANGE
if (pCounts.ranged > oCounts.ranged)
hints.push("🎯 You have range advantage - keep distance");

else if (pCounts.ranged < oCounts.ranged)
hints.push("⚠️ Opponent controls range - close the gap");

// ⚡ MOBILITY
if (pCounts.mobility > oCounts.mobility)
hints.push("💨 You are more mobile - reposition often");

else if (pCounts.mobility < oCounts.mobility)
hints.push("⚠️ Opponent is more mobile - predict their movement");

// 🧠 UTILITY
if (pCounts.utility > oCounts.utility)
hints.push("🧠 You have more control tools - disrupt their flow");

// 🧩 ROLE MATCHUPS (THIS IS HUGE)
if (pRole === "Sniper" && oRole !== "Sniper")
hints.push("🎯 Play at distance - don’t let them get close");

if (pRole === "Tank" && oRole === "Damage")
hints.push("🛡️ You can absorb hits - wear them down");

if (pRole === "Harasser" && oRole === "Sniper")
hints.push("⚡ Stay aggressive - don’t let them aim freely");

if (pRole === "Damage" && oRole === "Tank")
hints.push("🔥 Burst them quickly - don’t drag the fight");

// 🧠 FALLBACK
if (hints.length === 0)
hints.push("⚖️ Even matchup - skill and timing will decide");

return hints;
}

setCompareButton.addEventListener('click', ()=>{
    for (let i = 1; i <= 2; i++) {
        let challenger = (i > 1) ? challengers.player2 : challengers.player1
        let opponent = (i > 1) ? challengers.player1 : challengers.player2
        
        id(`comp${i}-beast-name`).textContent = (challenger) ? challenger.name : 'NOT SELECTED'
        id(`comp${i}-class-name`).textContent = (challenger) ? creatures[challenger.name].labels : 'N/A'
        id(`player-comp${i}-img`).src = (challenger) ? retreiveImage(challenger.name) : retreiveImage('Random')

        const list = id(`comp${i}-hint-list`)
        list.replaceChildren()

        const hints = getHints(challenger, opponent)
        hints.forEach(hint => {
            const li = document.createElement('li')
            list.appendChild(li)

            li.textContent = hint
        })
    }    

    ['type', 'hp', 'def', 'spd', 'atk'].forEach(trait => {
        const element = id(`comp-${trait}`)
        let p1, p2 = 0
        
        switch(trait){
            case 'type':
                if (challengers.player1) p1 = challengers.player1.type
                else p1 = "N/A"
                
                if (challengers.player2) p2 = challengers.player2.type
                else p2 = "N/A"

                if (p1 !== 'N/A' && p2 !== 'N/A') {
                    const chart = advancedTypeChart[challengers.player1.type]
                    
                    if (chart.wa.includes(p2)) {
                        element.style.color = 'red'
                        
                    }else if (chart.sa.includes(p2)) {
                        element.style.color = 'blue'
                    }else {
                        element.style.color = 'lavender'
                    }
                }
            break

            case 'hp':
            case 'def':
            case 'spd':
            case 'atk':

                if (challengers.player1) p1 = challengers.player1.stats[trait]
                else p1 = 0
                if (challengers.player2) p2 = challengers.player2.stats[trait]
                else p2 = 0

                if (p1 > p2) {
                    element.style.color = 'blue'
                }else if (p1 < p2) {
                    element.style.color = 'red'
                }else {
                    element.style.color = 'lavender'
                }

            break
        }

        element.textContent = `${p1} | ${p2}`
    }) 

    // const playerOneHintList = id('')
})