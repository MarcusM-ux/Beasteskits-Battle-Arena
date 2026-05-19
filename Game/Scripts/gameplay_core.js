const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const playerTurnSelection = document.querySelector('#selection-heading')
const playScreen = document.querySelector('#play-screen');

const animatePlayers = []
const obstacles = []

let challengers = {
    player1: null,
    player2: null,
    player1Button: null,
    player2Button: null
}

let canBattle = false
function setCanvas(){
    canvas.width = 500
    canvas.height = 500
    canvas.style.backgroundColor = 'lightgreen'
}
setCanvas()

const readyButton = document.querySelector('#ready-button')
function readyToBattle(){
    if (challengers.player1 && challengers.player2 && selectedMap) {
        readyButton.classList.remove('not-ready')
        readyButton.classList.add('ready')
    } else {
        readyButton.classList.add('not-ready')
        readyButton.classList.remove('ready')
    }
}

class Obstacle {
    constructor(image, x, y){
        this.image = new Image()
        this.image.onload = () => {}
        this.image.src = image

        this.x = x
        this.y = y
        this.width = 64
        this.height = 64
    }

    draw(){
        if (this.image.complete && this.image.naturalWidth !== 0) {
            ctx.drawImage(
                this.image,
                this.x,
                this.y,
                this.width,
                this.height
            )
        }
    }
   
}


class Player{
    constructor(data, value, name){
        this.isCPU = false
        this.cpuDifficulty = 0
        this.ultimateActive = false
        
        this.image = new Image()
        this.opacity = 1
        this.hit = false

        this.isDodging = false
        
        this.rotation = 0
        this.spriteOffset = (data.spriteOffset || 0) * (Math.PI / 180);
        this.isPlayer1 = (value === 1) ? true : false

        this.stats = JSON.parse(JSON.stringify(data.stats))
        this.baseStats = JSON.parse(JSON.stringify(data.stats))

        // this.stats.spd *= 1.8
       
        this.moveset = data.moveset
        this.type = data.type
        this.value = value

        this.base = {
            width: 64,
            height: 64
        }
        
        this.y = 200
        this.x = (this.isPlayer1) ? 25 : 400

        this.vx = 0
        this.vy = 0

        this.transportMarker = null

        this.isClashing = false

        this.maxSpeed = this.stats.spd
        this.originalVelocity = this.stats.spd
        this.stunTimer = null
       
        this.friction = 0.9 
       
        this.image.onload = () => {}
        this.image.src = data.image

        this.width = creatures[name].custom ? creatures[name].custom.width : 74
        this.height = 64

        this.widthSave = creatures[name].custom ? creatures[name].custom.width : 74
        this.heightSave = 64
        
        this.facingRight = (value === 1)
        this.blocking = false

        this.asyncActive = false;
        this.asyncTimeout = null;

        this.spawnedObstacles = []

        this.name = name

        if (this.isPlayer1){
            this.keysToAttack = {
                q: {name: '', stats: ''},
                e: {name: '', stats: ''},
                x: {name: '', stats: ''},
                z: {name: '', stats: ''},
                r: {name: 'BLANK', stats: JSON.parse(JSON.stringify(attackFunctions['BLANK'].stats))}
            }
        }else {
            this.keysToAttack = {
                o: {name: '', stats: ''},
                p: {name: '', stats: ''},
                k: {name: '', stats: ''},
                l: {name: '', stats: ''},
                m: {name: 'BLANK', stats: JSON.parse(JSON.stringify(attackFunctions['BLANK'].stats))}
            }
        }
        
        this.damageTaken = 0
        
        this.isStunned = function() {
            return !!this.stunTimer;
        };

        this.flicker = false
        this.flickerTime = 0
        this.healthSave = JSON.parse(JSON.stringify(data.stats.hp))

        // Assign each key to a move
        const attackKeys = Object.keys(this.keysToAttack)
        
        this.moveset.forEach((move, index) => {
            const key = attackKeys[index]
            
            // if (this.moveset.length > 3) {
            //     if (this.isPlayer1){
            //         this.keysToAttack.r = {name: '', stats: ''}
            //     }else{
            //         this.keysToAttack.m = {name: '', stats: ''}
            //     }
            // }
            
            if (key) {
                this.keysToAttack[key].name = move
                this.keysToAttack[key].stats = JSON.parse(JSON.stringify(attackFunctions[move].stats))}
        })
        
    }


    drawNameTag() {
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillStyle = this.isPlayer1 ? '#4aa3ff' : '#ff4a4a'
        if (this.stunTimer) {
            ctx.fillText(
                'STUNNED',
                this.x + this.width / 2,
                this.y - 6
            )
        }else {
            ctx.fillText(
                (this.isPlayer1) ? 'Player One' : 'Player Two',
                this.x + this.width / 2,
                this.y - 6
            )
        }
    }

    checkHealth() {
        // Check if current hp is less than the saved 'last known' hp
        if (this.stats.hp < this.healthSave) {
            this.flicker = true;
            this.healthSave = this.stats.hp; // Update the save so it doesn't trigger again immediately
    
            // Flicker effect: turn off after 1 second
            setTimeout(() => {
                this.flicker = false;
            }, 1000); 
        }
    }
    
    draw() {
        ctx.save();
        this.checkHealth();
        
        this.drawNameTag();
        
        // Move to player position
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Rotation logic
        if (this.stunTimer && this.rotation !== 0) {
            ctx.rotate(this.rotation - this.spriteOffset);
        }
    
        // Face the correct way
        if (this.facingRight) {
            ctx.scale(-1, 1);
        }
    
        ctx.globalAlpha = this.opacity;
    
        // Use this.flicker instead of global flicker
        // Adding a modulo check makes it "blink" rather than just disappear
        if (!this.flicker || Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        }
        
        ctx.restore();
    }
        
    borders(){
        if (this.x <= 0) this.x = 0
        if (this.x + this.width >= canvas.width) this.x = canvas.width - this.width


        if (this.y <= 0) this.y = 0
        if (this.y + this.height >= canvas.height) this.y = canvas.height - this.height
    }


    updateLabel() {
        // 1. Determine which elements to target
        const side = this.isPlayer1 ? '1' : '2';  
        const healthLabel = document.querySelector(`#player${side}-hp`);
        
        // 2. Get Max HP from the global creatures object
        const maxHp = creatures[this.name].stats.hp;
        let currentHp = Math.ceil(this.stats.hp);
        currentHp = Math.min(this.baseStats.hp, this.stats.hp)
        
        // 3. Calculate percentage (0 to 100)
        const healthPercent = Math.max(0, (currentHp / maxHp) * 100);
    
        // 4. Update the text display
        healthLabel.textContent = `${this.name}: HP ${currentHp} / ${maxHp}`;
    
        // 5. Update the bar width using a CSS Variable
        healthLabel.style.setProperty('--hp-width', `${healthPercent}%`);
        
        // Optional: Change color based on health status
        if (healthPercent < 25) {
            healthLabel.style.setProperty('--hp-color', 'linear-gradient(90deg, #ff0000, #a80000)');
        } else if (healthPercent < 50) {
            healthLabel.style.setProperty('--hp-color', 'linear-gradient(90deg, #ffcc00, #f1c40f)');
        } else {
            // Reset to default colors based on player side
            const defaultColor = this.isPlayer1 
                ? 'linear-gradient(90deg, #00d2ff, #3a7bd5)'  // Red for P1
                : 'linear-gradient(90deg, #ff4b2b, #ff416c)'; // Blue for P2
            healthLabel.style.setProperty('--hp-color', defaultColor);
        }

        if (this.stats.hp > this.baseStats.hp) {
            healthLabel.style.setProperty('--hp-color', '#f5cb42')
        }
    }

    indicate(message){
        if (this.isPlayer1){
            const podDisplay = document.querySelector('#player1-label')
            podDisplay.textContent = message
        }else {
            const ptdDisplay = document.querySelector('#player2-label')
            ptdDisplay.textContent = message
        }
    }
}

function updatePlayerList(player, stateCooldowns = true){
    if (player.isPlayer1){
        const plrOneList = document.querySelector('#list-attacks-player1')
        plrOneList.replaceChildren()
        
        const player1AttackKeys = Object.keys(player.keysToAttack)
        player1AttackKeys.forEach((key, index) => {
            const keyStats = player.keysToAttack[key]
            if (!keyStats.name || !keyStats.stats) return
    
            function determineString(){
                if (keyStats.stats.heal && keyStats.stats.dmg){
                    return `Heal: ${keyStats.stats.heal} | Damage: ${keyStats.stats.dmg}`
                }else if (keyStats.stats.heal && !keyStats.stats.dmg){
                    return `Heal: ${keyStats.stats.heal}`
                }else if (keyStats.stats.dmg && !keyStats.stats.heal){
                    return `Damage: ${keyStats.stats.dmg}`
                }else {
                    return 'Support'
                }
            }
           
            const li = document.createElement('li')
            
            // Check if attack is on cooldown
            const isOnCooldown = keyStats.stats.cooldown?.switch
            
            if (isOnCooldown && stateCooldowns) {
                // Display cooldown info instead
                const cooldownTime = keyStats.stats.cooldown.time * 0.001
                li.textContent = `Keybind ${key.toUpperCase()} | ${keyStats.name.toUpperCase()} | COOLDOWN (${cooldownTime}s)`
                // li.style.opacity = '0.5'  // Make it look disabled
            } else {
                // Normal display
                li.textContent = `Keybind ${key.toUpperCase()} | ${keyStats.name.toUpperCase()} | ${determineString()} | Type ${keyStats.stats.type}`
                // li.style.opacity = '1'
            }
            
            plrOneList.appendChild(li)
    
            li.style.color = colorFromType(keyStats.stats.type)
            li.id = `${key}-attack`
            li.classList.add('attack-list')

            const timeOut = setTimeout(() => {
                    player.keysToAttack[key].stats.cooldown.switch = false
                li.textContent = `Keybind ${key.toUpperCase()} | ${keyStats.name.toUpperCase()} | ${determineString()} | Type ${keyStats.stats.type}`
                    clearTimeout(timeOut)
            }, player.keysToAttack[key].stats.cooldown.time)
            
        })
    }else {
        const plrTwoList = document.querySelector('#list-attacks-player2')
        plrTwoList.replaceChildren()
        const player2AttackKeys = Object.keys(player.keysToAttack)
        player2AttackKeys.forEach((key, index) => {
            const keyStats = player.keysToAttack[key]
            if (!keyStats.name || !keyStats.stats) return
           
            function determineString(){
                if (keyStats.stats.heal && keyStats.stats.dmg){
                    return `Heal: ${keyStats.stats.heal} | Damage: ${keyStats.stats.dmg}`
                }else if (keyStats.stats.heal && !keyStats.stats.dmg){
                    return `Heal: ${keyStats.stats.heal}`
                }else if (keyStats.stats.dmg && !keyStats.stats.heal){
                    return `Damage: ${keyStats.stats.dmg}`
                }else {
                    return 'Movement'
                }
            }
           
            const li = document.createElement('li')
            
            // Check if attack is on cooldown
            const isOnCooldown = keyStats.stats.cooldown?.switch
            
            if (isOnCooldown) {
                // Display cooldown info instead
                const cooldownTime = keyStats.stats.cooldown.time * 0.001
                li.textContent = `Keybind ${key.toUpperCase()} | ${keyStats.name.toUpperCase()} | COOLDOWN (${cooldownTime}s)`
                // li.style.opacity = '0.5'  // Make it look disabled
            } else {
                // Normal display
                li.textContent = `Keybind ${key.toUpperCase()} | ${keyStats.name.toUpperCase()} | ${determineString()} | Type ${keyStats.stats.type}`
                li.style.opacity = '1'
            }

            plrTwoList.appendChild(li)
            li.style.color = colorFromType(keyStats.stats.type)
            li.id = `${key}-attack`
            li.classList.add('attack-list')

            const timeOut = setTimeout(() => {
                    player.keysToAttack[key].stats.cooldown.switch = false
                li.textContent = `Keybind ${key.toUpperCase()} | ${keyStats.name.toUpperCase()} | ${determineString()} | Type ${keyStats.stats.type}`
                    clearTimeout(timeOut)
            }, player.keysToAttack[key].stats.cooldown.time)
        })
    }
}

function updateKeys(player, attackToReplace, attackToAdd){
    const key = Object.keys(player.keysToAttack).find(k => player.keysToAttack[k].name === attackToReplace)
    
    if (!key || !attackFunctions[attackToAdd]) return

    player.keysToAttack[key].name = attackToAdd
    player.keysToAttack[key].stats = JSON.parse(JSON.stringify(attackFunctions[attackToAdd].stats))
    
    updatePlayerList(player)
    player.updateLabel()
}

// PAGES
const pageContainer = document.querySelector('#beasteskits-content')
const maxPerPage = 6

const totalCreatures = Object.keys(creatures).length
const maxPages = Math.ceil(totalCreatures / maxPerPage)

let currentPageIndex = 0
let pageIndex = 1

for (let index = 0; index < maxPages; index++ ){
    const newPage = document.createElement('div')
    newPage.classList.add('page')
    pageContainer.appendChild(newPage)


    newPage.id = `selection-page${pageIndex}`
    if (pageIndex === 1) {
        newPage.style.display = 'flex'
        newPage.classList.add('flex-status')
    }else {
         newPage.style.display = 'none'   
    }
    pageIndex++
}


const pageLabel = document.querySelector('#page-count')
pageLabel.textContent = `< 1 of ${maxPages} >`

function managePage(value) {
    const allPages = document.querySelectorAll('.page');
    let oldIndex = currentPageIndex;
    
    // Calculate potential new index
    let newIndex = currentPageIndex + value;

    // --- WRAP AROUND LOGIC ---
    if (newIndex < 0) {
        // If below 0, jump to the last page
        newIndex = allPages.length - 1;
    } else if (newIndex >= allPages.length) {
        // If above the max, jump back to the first page
        newIndex = 0;
    }

    if (oldIndex !== newIndex) {
        currentPageIndex = newIndex; // Update the global state

        // Hide the old page
        allPages[oldIndex].style.display = 'none';
        allPages[oldIndex].classList.remove('flex-status');

        // Show the new page
        allPages[newIndex].style.display = 'flex';
        allPages[newIndex].classList.add('flex-status');
        
        // Update label
        pageLabel.textContent = `< ${newIndex + 1} of ${maxPages} >`;
        popupContainer.style.display = 'none'
    }
}

// const lastPageButton = document.querySelector('#last-page')
// const nextPageButton = document.querySelector('#next-page')

// lastPageButton.addEventListener('click', () => managePage(-1))
// nextPageButton.addEventListener('click', () => managePage(1))
// addEventListener('keydown', (e)=>{
//     const key = e.key
//     if (key === 'ArrowLeft' && document.querySelector('#beasteskits-content-container').style.display !== 'none') {
//         managePage(-1)
//     }else if (key === 'ArrowRight' && document.querySelector('#beasteskits-content-container').style.display !== 'none') {
//         managePage(1)
//     }
// })


// FILTER PAGES
const filterBtn = document.querySelector('#page-filter')
const filterPage = document.querySelector('#filter-page')

let filterOpen = false
filterBtn.addEventListener('click', ()=>{
    if (filterOpen) {
        filterOpen = false
        filterPage.style.display = 'none'
    }else {
        filterOpen = true
        filterPage.style.display = 'flex'
    }
})

// ============================================
// UTILITY FUNCTION
// ============================================
function id(elementId) {
    return document.getElementById(elementId);
}

let activePopup = false
let activeElement = null

const popupElement = document.querySelector('#popup-description')
const popupImage = document.querySelector('#popup-image')
// const popupExit = document.querySelector('#popup-exit')
const popupContainer = document.querySelector('#popup-content')


// ============================================
// FILTER STATE MANAGEMENT
// ============================================
let filteredCreatures = null;
let originalCreatures = null;
let maxPagesGlobal = 0;

// ============================================
// POPULATE FILTER OPTIONS
// ============================================
function populateFilterOptions() {
    // Populate TYPE filter
    const typeSelect = document.querySelector('#filter-type-select');
    typeSelect.innerHTML = '<option value="">All Types</option>';
    
    const types = Object.keys(advancedTypeChart);
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeSelect.appendChild(option);
    });

    // Populate CLASS filter
    const classSelect = document.querySelector('#filter-class-select');
    classSelect.innerHTML = '<option value="">All Classes</option>';
    
    const classes = ['Tank', 'Utility', 'Damage', 'Harasser', 'Sniper', 'Bruiser', 'Balanced', 'Controller'];
    classes.forEach(classType => {
        const option = document.createElement('option');
        option.value = classType;
        option.textContent = classType;
        classSelect.appendChild(option);
    });

    // Populate STATS filter
    const statsSelect = document.querySelector('#filter-stats-select');
    statsSelect.innerHTML = '<option value="">Select Stat</option>';
    
    const stats = ['hp', 'atk', 'def', 'spd'];
    const statLabels = {
        'hp': 'Health (HP)',
        'atk': 'Attack (ATK)',
        'def': 'Defense (DEF)',
        'spd': 'Speed (SPD)'
    };
    
    stats.forEach(stat => {
        const option = document.createElement('option');
        option.value = stat;
        option.textContent = statLabels[stat];
        statsSelect.appendChild(option);
    });
}

// ============================================
// APPLY FILTERS
// ============================================
function applyFilters() {
    const typeFilter = document.querySelector('#filter-type-select').value;
    const classFilter = document.querySelector('#filter-class-select').value;
    const ultFilter = document.querySelector('#filter-ult-select').checked
    
    const statFilter = document.querySelector('#filter-stats-select').value;
    const statStyle = document.querySelector('#filter-style-select').value;
    const statValue = parseInt(document.querySelector('#stat-greater-ds').value) || 0;

    // Store original creatures if not already stored
    if (!originalCreatures) {
        originalCreatures = { ...creatures };
    }

    // Start with all creatures
    let filtered = { ...originalCreatures };

    // Apply TYPE filter
    if (typeFilter && typeFilter !== '') {
        filtered = Object.fromEntries(
            Object.entries(filtered).filter(([name, data]) => data.type === typeFilter)
        );
    }

    // Apply CLASS filter
    if (classFilter && classFilter !== '') {
        filtered = Object.fromEntries(
            Object.entries(filtered).filter(([name, data]) => data.class === classFilter)
        );
    }

    if (ultFilter && ultFilter !== '') {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([name, data]) => {
          // Check if at least one move is 'ultimate'
          return data.moveset.some(move => attackData[move] === 'ultimate');
        })
      );
    }


    // Apply STATS filter
    if (statFilter && statFilter !== '') {
        filtered = Object.fromEntries(
            Object.entries(filtered).filter(([name, data]) => {
                const statVal = data.stats[statFilter];
                if (statStyle === 'greater') {
                    return statVal > statValue;
                } else if (statStyle === 'less') {
                    return statVal < statValue;
                }
                return true;
            })
        );
    }

    // Check if any filters are applied
    const hasFilters = typeFilter || classFilter || statFilter || ultFilter;
    
    if (hasFilters) {
        filteredCreatures = filtered;
        console.log(`✅ Filters applied - ${Object.keys(filtered).length} creatures found`);
    } else {
        filteredCreatures = null;
        console.log('✅ No filters applied - showing all creatures');
    }
    
    rebuildPages();
}

// ============================================
// RESET FILTERS
// ============================================
function resetFilters() {
    // Reset all select values
    document.querySelector('#filter-type-select').value = '';
    document.querySelector('#filter-class-select').value = '';
    document.querySelector('#filter-stats-select').value = '';
    document.querySelector('#filter-ult-select').checked = false
    document.querySelector('#filter-style-select').value = 'greater';
    ultimateFilter('#stat-greater-ds').value = '';
    
    
    // Clear filtered creatures
    filteredCreatures = null;
    
    // Rebuild pages with all creatures
    rebuildPages();
    
    console.log('✅ Filters reset - showing all creatures');
}

// ============================================
// REBUILD PAGES WITH FILTERED CREATURES
// ============================================
function rebuildPages() {
    const pageContainer = document.querySelector('#beasteskits-content');
    const creaturesData = filteredCreatures || originalCreatures || creatures;
    
    // Remove all old pages
    pageContainer.replaceChildren();

    // Recalculate max pages
    const totalCreatures = Object.keys(creaturesData).length;
    const newMaxPages = Math.ceil(totalCreatures / maxPerPage);
    maxPagesGlobal = newMaxPages;

    // Create new pages
    let pageIndex = 1;
    for (let index = 0; index < newMaxPages; index++) {
        const newPage = document.createElement('div');
        newPage.classList.add('page');
        pageContainer.appendChild(newPage);

        newPage.id = `selection-page${pageIndex}`;
        if (pageIndex === 1) {
            newPage.style.display = 'flex';
            newPage.classList.add('flex-status');
        } else {
            newPage.style.display = 'none';
        }
        pageIndex++;
    }

    // Update page label
    const pageLabel = document.querySelector('#page-count');
    pageLabel.textContent = `< 1 of ${newMaxPages} >`;

    // Reset current page index
    currentPageIndex = 0;

    // Populate pages with filtered creatures
    let currentFillingPage = 0;
    for (const [name, data] of Object.entries(creaturesData)) {
        const container = document.createElement('div');
        const button = document.createElement('button');
        const h2 = document.createElement('h2');
        const img = document.createElement('img');
        const p = document.createElement('p');

        const allPages = document.querySelectorAll('.page');
        let targetPage = allPages[currentFillingPage];
        
        if (targetPage && targetPage.children.length >= maxPerPage) {
            currentFillingPage++;
            targetPage = allPages[currentFillingPage];
        }
        
        if (targetPage) {
            targetPage.appendChild(container);
        }

        container.appendChild(button);
        container.appendChild(h2);
        container.appendChild(img);
        container.appendChild(p);

        img.src = data.image;
        button.textContent = 'Select';
        h2.textContent = name;
        p.textContent = `Type: ${data.type}`;

        container.classList.add('beasteskit-display');
        p.style.color = colorFromType(data.type);

        // Add click listener for stats display
        container.addEventListener('click', () => {
            displayCreatureStats(name, data);
        });

        // Add select button listener
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            selectCreature(name, button);
        });
    }
}

// ============================================
// DISPLAY CREATURE STATS
// ============================================
function displayCreatureStats(name, data) {
    const nameDisplay = document.querySelector('#name-display');
    const imageDisplay = document.querySelector('#image-display');
    const statusDisplay = document.querySelector('#status-display');
    const attacksDisplay = document.querySelector('#attacks-display');
    const typeDisplay = document.querySelector('#type-display');
    const titleDisplay = id('title-display');
    const classDisplay = id('class-display');
    const beasteskitStatsRevealer = id('beasteskit-stats-revealer');

    classDisplay.textContent = `Class: ${data.class}`;
    beasteskitStatsRevealer.style.backgroundColor = colorFromType(data.type);
    nameDisplay.textContent = name;
    titleDisplay.textContent = `Title: The ${data.title} Beasteskit`;
    imageDisplay.src = data.image;
    typeDisplay.textContent = `Type: ${data.type}`;
    
    statusDisplay.replaceChildren();
    attacksDisplay.replaceChildren();

    const typeImg = id('type-img')
    typeImg.src = retreiveType(data.type.toLowerCase())

    const strongVSDisplay = id('strongVS-display')
        const weakAgainstDisplay = id('weakAGANIST-display')
        strongVSDisplay.replaceChildren()
        weakAgainstDisplay.replaceChildren()
        const creatureType = data.type
        const typeConfigures = advancedTypeChart[creatureType]


        // if (!typeConfigures) return
        const { sa, wa, s } = typeConfigures


        // // Strong Against (attacking)
        sa.forEach(type => {
            if (type){
                const li = document.createElement('li')
                
                li.textContent = `${type} types`
                li.style.color = colorFromType(type)
                
                strongVSDisplay.appendChild(li)
            }
        })


        // // Weak When Attacking
        // wa.forEach(type => {
        //     if (type){
        //     const li = document.createElement('li')
        //     li.textContent = `${type} types`
        //     li.style.color = colorFromType(type)
        //     weakVSDisplay.appendChild(li)
        //     }
        // })


        // // Sensitive To (defensive weakness)
        s.forEach(type => {
            if (type) {
                const li = document.createElement('li')
                li.textContent = `${type} type attacks`
                li.style.color = colorFromType(type)
                weakAgainstDisplay.appendChild(li)
            }
        })

    for (const [statName, statValue] of Object.entries(data.stats)) {
        const li = document.createElement('li');
        li.className = 'status-list';
        let statLabel;
        switch (statName) {
            case 'hp':
                statLabel = 'Health';
                break;
            case 'atk':
                statLabel = 'Attack';
                break;
            case 'def':
                statLabel = 'Defense';
                break;
            case 'spd':
                statLabel = 'Speed';
                break;
            default:
                statLabel = statName;
        }

        li.textContent = `${statLabel}: ${statValue}`;
        statusDisplay.appendChild(li);
    }

    data.moveset.forEach(attackName => {
        const li = document.createElement('button');
        li.className = 'status-list';

        const attributes = attackFunctions[attackName].stats;
        const color = colorFromType(attributes.type);
        li.style.border = `solid ${color} 0.5rem`;

        if (!attackFunctions[attackName]) {
            console.warn(`⚠️ Attack "${attackName}" not found in attackFunctions!`);
            li.textContent = `${attackName} | ❌ NOT FOUND`;
            li.style.color = 'red';
            attacksDisplay.appendChild(li);
            return;
        }

        let displayText = `${attackName} | Type: ${attributes.type} | Cooldown: ${attributes.cooldown.time / 1000}s`

        if (attributes.dmg > 0 && attributes.heal > 0) {
            displayText += ` | Power: ${attributes.dmg} | Heal: ${attributes.heal}`;
        } else if (attributes.dmg > 0) {
            displayText += ` | Power: ${attributes.dmg}`;
        } else if (attributes.heal > 0) {
            displayText += ` | Heal: ${attributes.heal}`;
        } else {
            displayText += ` | Support`;
        }

        li.textContent = displayText;
        li.style.color = colorFromType(attributes.type);
        attacksDisplay.appendChild(li);

        li.addEventListener('click', () => {
            // const popupContainer = document.querySelector('#popup-content');
            // const popupElement = document.querySelector('#popup-description');
            popupContainer.style.display = 'flex';
            popupElement.style.display = 'flex';
            popupElement.innerHTML = `<div style='display: inline; color: inherit;'>${attackDescriptions[attackName]}</div>`
            
            popupImage.src = retreiveType(attackFunctions[attackName].stats.type.toLowerCase())
        })
    });
}

// ============================================
// SELECT CREATURE
// ============================================

// ============================================
// PAGE MANAGEMENT WITH FILTER SUPPORT
// ============================================
function managePageFilter(value) {
    const allPages = document.querySelectorAll('.page');
    let oldIndex = currentPageIndex;
    
    // Calculate potential new index
    let newIndex = currentPageIndex + value;

    // --- WRAP AROUND LOGIC ---
    if (newIndex < 0) {
        newIndex = allPages.length - 1;
    } else if (newIndex >= allPages.length) {
        newIndex = 0;
    }

    if (oldIndex !== newIndex) {
        currentPageIndex = newIndex;

        // Hide the old page
        allPages[oldIndex].style.display = 'none';
        allPages[oldIndex].classList.remove('flex-status');

        // Show the new page
        allPages[newIndex].style.display = 'flex';
        allPages[newIndex].classList.add('flex-status');
        
        // Update label
        const pageLabel = document.querySelector('#page-count');
        pageLabel.textContent = `< ${newIndex + 1} of ${allPages.length} >`;
        
        const popupContainer = document.querySelector('#popup-content');
        if (popupContainer) {
            popupContainer.style.display = 'none';
        }
    }
}

function initializeCreatures() {
    const pageContainer = document.querySelector('#beasteskits-content');
    
    const totalCreatures = Object.keys(creatures).length;
    const maxPages = Math.ceil(totalCreatures / maxPerPage);

    let currentPageIndex = 0;
    let pageIndex = 1;

    // Create initial pages
    for (let index = 0; index < maxPages; index++) {
        const newPage = document.createElement('div');
        newPage.classList.add('page');
        pageContainer.appendChild(newPage);

        newPage.id = `selection-page${pageIndex}`;
        if (pageIndex === 1) {
            newPage.style.display = 'flex';
            newPage.classList.add('flex-status');
        } else {
            newPage.style.display = 'none';
        }
        pageIndex++;
    }

    const pageLabel = document.querySelector('#page-count');
    pageLabel.textContent = `< 1 of ${maxPages} >`;

    // Populate creatures
    let currentFillingPage = 0;
    for (const [name, data] of Object.entries(creatures)) {
        const container = document.createElement('div');
        const button = document.createElement('button');
        const h2 = document.createElement('h2');
        const img = document.createElement('img');
        const p = document.createElement('p');

        const allPages = document.querySelectorAll('.page');
        let targetPage = allPages[currentFillingPage];
        
        if (targetPage && targetPage.children.length >= maxPerPage) {
            currentFillingPage++;
            targetPage = allPages[currentFillingPage];
        }
        
        if (targetPage) {
            targetPage.appendChild(container);
        }

        // const typeImage = document.createElement('img')
        // typeImage.classList.add('type-image')
        // typeImage.src = retreiveType(data.type)
        // container.appendChild(typeImage)
        
        container.appendChild(button);
        container.appendChild(h2);
        container.appendChild(img);
        container.appendChild(p);

        img.src = data.image;
        button.textContent = 'Select';
        h2.textContent = name;
        p.textContent = `Type: ${data.type}`;

        container.classList.add('beasteskit-display');
        p.style.color = colorFromType(data.type);

        // Click to view stats
        container.addEventListener('click', () => {
            displayCreatureStats(name, data);
        });

        // Click to select
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            selectCreature(name, button);
        });
    }
}

// ============================================
// EVENT LISTENERS - INITIALIZATION
// ============================================

// Wait for DOM to be ready
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => {
//         populateFilterOptions();
//         initializeCreatures();
//         setupFilterEventListeners();
//     });
// } else {
//     populateFilterOptions();
//     initializeCreatures();
//     setupFilterEventListeners();
// }


// ============================================
// SETUP FILTER EVENT LISTENERS
// ============================================
function setupFilterEventListeners() {
    // Apply Filters Button
    const applyFilterBtn = document.querySelector('#apply-filter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', () => {
            applyFilters();
            const filterPage = document.querySelector('#filter-page');
            filterPage.style.display = 'none';
        });
    }

    // Reset Filters Button
    const resetFilterBtn = document.querySelector('#reset-filter');
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            resetFilters();
        });
    }

    // Filter Page Toggle Button (FILTER PAGES button)
    const filterBtn = document.querySelector('#page-filter');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            const filterPage = document.querySelector('#filter-page');
            filterPage.style.display = filterPage.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Page Navigation
    const lastPageButton = document.querySelector('#last-page');
    const nextPageButton = document.querySelector('#next-page');

    if (lastPageButton) {
        lastPageButton.addEventListener('click', () => managePage(-1));
    }

    if (nextPageButton) {
        nextPageButton.addEventListener('click', () => managePage(1));
    }

    // Arrow key navigation
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const beasteskitContainer = document.querySelector('#beasteskits-content-container');
        
        if (beasteskitContainer && beasteskitContainer.style.display !== 'none') {
            if (key === 'ArrowLeft') {
                managePage(-1);
            } else if (key === 'ArrowRight') {
                managePage(1);
            }
        }
    });

    // Popup Exit Listener
    const popupExit = document.querySelector('#popup-exit');
    if (popupExit) {
        popupExit.addEventListener('click', () => {
            const popupContainer = document.querySelector('#popup-content');
            popupContainer.style.display = 'none';
        });
    }
}

populateFilterOptions();
setupFilterEventListeners();

readyButton.addEventListener('click', () => {
  // console.log('Ready button clicked');
  // console.log('Current GameMode:', window.GameMode);
  // console.log('Player1:', challengers.player1);
  // console.log('Player2:', challengers.player2);
  
  ensureGamemodePlayersBeforeStart();
  
  // console.log('After ensure - Player1:', challengers.player1);
  // console.log('After ensure - Player2:', challengers.player2);
  
  if (!selectedMap || !challengers.player1 || !challengers.player2) {
    console.log('Missing requirements - Map:', selectedMap, 'P1:', challengers.player1, 'P2:', challengers.player2);
    return;
  }
  
  if ((challengers.player1 && challengers.player1.isCPU) || (challengers.player2 && challengers.player2.isCPU)) {
    // console.log('Starting CPU controllers');
    startCPUControllers();
  }
  startBattle();
});

const player1HeadingDs = document.querySelector('#player1-heading-ds')
const player2HeadingDs = document.querySelector('#player2-heading-ds')

const player1Image = document.querySelector('#player1-ds-image')
const player2Image = document.querySelector('#player2-ds-image')

function updatePlayerHeading() {
    const p1 = challengers.player1 ? challengers.player1.name : 'Not Selected'
    const p2 = challengers.player2 ? challengers.player2.name : 'Not Selected'

    const cpu = window.CONFIG.cpu
    if (challengers.player1) {
        if (cpu.p1.active) {
            player1HeadingDs.innerHTML = `CPU 1: <br> ${p1}`
        }else {
            player1HeadingDs.innerHTML = `Player 1: <br> ${p1}`
        }
        
        player1Image.src = "./PixelArt/BeasteskitsCatalog/" + p1 + ".png"
        player1HeadingDs.style.color = 'blue'
    }else {
        player1HeadingDs.style.color = 'black'
    }
    
    if (challengers.player2) {
        if (cpu.p2.active) {
            player2HeadingDs.innerHTML = `CPU 2: <br> ${p2}`
        }else {
            player2HeadingDs.innerHTML = `Player 2: <br> ${p2}`
        }

        player2Image.src  = "./PixelArt/BeasteskitsCatalog/" + p2 + ".png"
        player2HeadingDs.style.color = 'red'
    }else {
        player2HeadingDs.style.color = 'black'
    }
}
updatePlayerHeading()

const typeContainer = document.querySelector('#typeChartDisplay')
const contentTypeContainer = document.querySelector('#content-type-container')
for (const type in advancedTypeChart) {
    const li = document.createElement('li')
    
    // const img = new Image()
    // img.src = retreiveType(type.toLowerCase())
    
    const chart = advancedTypeChart[type]

    // contentTypeContainer.appendChild(img)
    // img.classList.add('types')
    
    li.innerHTML = `<div style=' background-color: white; height: 12vh; overflow: hidden; display: flex; justify-content: space-evenly; align-items: center; gap: 2rem;'> <p style='color: ${colorFromType(type)}; font-size: 3vw;'>${type}:  </p> <img src='${retreiveType(type.toLowerCase())}' style=' margin-top: 3rem;'></div> 
    <p class='lightcoral-color'>Strong vs. ${chart.sa} (1.05x) </p> <br>
    <p class='lightblue-color'>Weak vs. ${chart.s} (0.95x) </p> <br>`

    li.classList.add('type-element')
    contentTypeContainer.appendChild(li) 
}

// const typeSelectContainer = document.querySelector('#type-select-container')
// typeSelectContainer.addEventListener('change', () => {
//     contentTypeContainer.replaceChildren()
//     if (typeSelectContainer.value === 'attacking') {

//         for (const type in advancedTypeChart) {
//             const li = document.createElement('li')
//             const chart = advancedTypeChart[type]

//             li.innerHTML = `<p style='color: ${colorFromType(type)}; background-color: black;' >${type}:</p> <br> 
//             <p class='lightcoral-color'>Strong vs. ${chart.sa} (1.15x) </p> <br>
//             <p class='lightblue-color'>Weak vs. ${chart.wa} (0.85x) </p> <br>`

//             li.classList.add('type-element')
//             contentTypeContainer.appendChild(li) 
//         }
//     } else {
//         for (const type in advancedTypeChart) {
//             const li = document.createElement('li')
//             const chart = advancedTypeChart[type]

//             li.innerHTML = `<p style='color: ${colorFromType(type)}; background-color: black;' >${type}:</p> <br> 
//             <p class='lightcoral-color'>Resistance To. ${chart.r} (0.85x) </p> <br>
//             <p class='lightblue-color'>Sensitive To. ${chart.s} (1.15x) </p> <br>`

//             li.classList.add('type-element')
//             contentTypeContainer.appendChild(li) 
//         }
//     }
// })

let selected = {
    button : id('')
}
let nextSlot = 1
let currentFillingPage = 0

// const creatureNames = Object.keys(creatures);
for (const [name, data] of Object.entries(creatures)){
    const container = document.createElement('div')
    const button = document.createElement('button')
    const h2 = document.createElement('h2')
    const img = document.createElement('img')
    const p = document.createElement('p')

    const allPages = document.querySelectorAll('.page')
    let targetPage = allPages[currentFillingPage]
    if (targetPage.children.length >= maxPerPage) {
        currentFillingPage++
        targetPage = allPages[currentFillingPage]
    }
    targetPage.appendChild(container)
    
    // const allPages = document.querySelectorAll('.page')
    // // let targetPage = allPages[currentFillingPage]
    
    // // if (targetPage.children.length >= maxPerPage) {
    // //     currentFillingPage++
    // //     targetPage = allPages[currentFillingPage]
    // // }else {
    // //     targetPage.appendChild(container)
    // // }
    //   const idx = creatureNames.indexOf(name); // fast and simple
    //   const pageIndexForThisCreature = Math.floor(idx / maxPerPage);
    //   const targetPage = allPages[pageIndexForThisCreature] || allPages[allPages.length - 1];
    
    //   targetPage.appendChild(container);

    container.appendChild(button)
    container.appendChild(h2)
    container.appendChild(img)
    container.appendChild(p)

    img.src = data.image
    button.textContent = 'Select'
    h2.textContent = name
    p.textContent = `Type: ${data.type}`
   
    container.classList.add('beasteskit-display')
    p.style.color = colorFromType(data.type)

//mouseenter
    container.addEventListener('click', () => {
        const nameDisplay = document.querySelector('#name-display')
        const imageDisplay = document.querySelector('#image-display')
        const statusDisplay = document.querySelector('#status-display')
        const attacksDisplay = document.querySelector('#attacks-display')
        const typeDisplay = document.querySelector('#type-display')
        const titleDisplay = id('title-display')
        const classDisplay = id('class-display')

        const strongVSDisplay = id('strongVS-display')
        // const weakVSDisplay = id('weakVS-display')
        const weakAgainstDisplay = id('weakAGANIST-display')


        const beasteskitStatsRevealer = id('beasteskit-stats-revealer')

        classDisplay.textContent = `Class: ${data.class}`
        beasteskitStatsRevealer.style.backgroundColor = colorFromType(data.type)
        nameDisplay.textContent = name
        titleDisplay.textContent = `Title: The ${data.title} Beasteskit`
        imageDisplay.src = img.src

        const typeImg = id('type-img')
        typeImg.src = retreiveType(data.type.toLowerCase())
        typeDisplay.textContent =  `Type: ${data.type}`
       
        statusDisplay.replaceChildren()
        strongVSDisplay.replaceChildren()
        attacksDisplay.replaceChildren()
        // weakVSDisplay.replaceChildren()
        weakAgainstDisplay.replaceChildren()
   
        for (const [statName, statValue] of Object.entries(data.stats)) {
            const li = document.createElement('li')
            li.className = 'status-list'
            let name
            switch(statName) {
                    case 'hp':
                       name = 'Health' 
                    break
                    case 'atk':
                       name = 'Attack' 
                    break
                    case 'def':
                        name = 'Defense' 
                    break
                    case 'spd':
                        name = 'Speed' 
                    break

            }
            
            li.textContent = `${name}: ${statValue}`
            statusDisplay.appendChild(li)
        }


        const creatureType = data.type
        const typeConfigures = advancedTypeChart[creatureType]


        // if (!typeConfigures) return
        const { sa, wa, s } = typeConfigures


        // // Strong Against (attacking)
        sa.forEach(type => {
            if (type){
                const li = document.createElement('li')
                
                li.textContent = `${type} types`
                li.style.color = colorFromType(type)
                
                strongVSDisplay.appendChild(li)
            }
        })


        // // Weak When Attacking
        // wa.forEach(type => {
        //     if (type){
        //     const li = document.createElement('li')
        //     li.textContent = `${type} types`
        //     li.style.color = colorFromType(type)
        //     weakVSDisplay.appendChild(li)
        //     }
        // })


        // // Sensitive To (defensive weakness)
        s.forEach(type => {
            if (type) {
                const li = document.createElement('li')
                li.textContent = `${type} type attacks`
                li.style.color = colorFromType(type)
                weakAgainstDisplay.appendChild(li)
            }
        })
        

        data.moveset.forEach(attackName => {
            const li = document.createElement('button')
            li.className = 'status-list'
            
            const attributes = attackFunctions[attackName].stats
            const color = colorFromType(attributes.type)
            li.style.border = `solid ${color} 0.5rem`
            
            if (!attackFunctions[attackName]) {
                console.warn(`⚠️ Attack "${attackName}" not found in attackFunctions!`);
                li.textContent = `${attackName} | ❌ NOT FOUND`;
                li.style.color = 'red';
                attacksDisplay.appendChild(li);
                return; // Skip this attack
            }

            let displayText = `${attackName} | Type: ${attributes.type} | Cooldown: ${attributes.cooldown.time / 1000}s`
       
            if (attributes.dmg > 0 && attributes.heal > 0) {
                displayText += ` | Power: ${attributes.dmg} | Heal: ${attributes.heal}`
            } else if (attributes.dmg > 0) {
                displayText += ` | Power: ${attributes.dmg}`
            } else if (attributes.heal > 0) {
                displayText += ` | Heal: ${attributes.heal}`
            } else {
                displayText += ` | Support`
            }
       
            li.textContent = displayText
            li.style.color = colorFromType(attributes.type)
            attacksDisplay.appendChild(li)

            li.addEventListener('click', ()=>{
                // if (activeElement !== li ) {
                //     activeElement = li
                    popupContainer.style.display = 'flex'
                    popupElement.style.display = 'flex'
                    popupElement.innerHTML = `<div style='display: inline; color: inherit;'>${attackDescriptions[attackName]}</div>`
                popupImage.src = retreiveType(attackFunctions[attackName].stats.type.toLowerCase())
                // }else {
                //     if (!activePopup){
                //         popupElement.style.display = 'flex'
                //         popupElement.textContent = attackDescriptions[attackName]
                //         activePopup = true
                //     }else{
                //         popupElement.style.display = 'none'
                //         activePopup = false
                //     }
                // }
                
                // if (!activePopup){
                //     popupElement.style.display = 'none'
                //     popupElement.textContent = ''
                //     popupElement.textContent = attackDescriptions[attackName]
                //     popupElement.style.display = 'flex'
                //     activePopup = true
                // }else {
                //     popupElement.style.display = 'none'
                //     activePopup = false
                // }
            })
            
        })
    })


    button.addEventListener('click', () => {
        // Remove old player if replacing
        selectCreature(name,button)
        
        
        // if (nextSlot === 1 && challengers.player1) {
        //     animatePlayers.splice(animatePlayers.indexOf(challengers.player1), 1)


        //     if (challengers.player1Button) {
        //         challengers.player1Button.style.color = 'black'
        //     }
        // }


        // if (nextSlot === 2 && challengers.player2) {
        //     animatePlayers.splice(animatePlayers.indexOf(challengers.player2), 1)


        //     if (challengers.player2Button) {
        //         challengers.player2Button.style.color = 'black'
        //     }
        // }


        // let  player
        // if (name === 'Random') {
        //     const allCreatures = Object.keys(creatures)
        //     const selectedName = allCreatures[Math.floor(Math.random() * allCreatures.length)];
        //     const selectedData = creatures[selectedName];
            
        //     player = new Player(selectedData, nextSlot, selectedName);
        // } else {
        //   player = new Player(creatures[name], nextSlot, name);
        // }
        
        // animatePlayers.push(player);

        // // Assign slot
        // if (nextSlot === 1) {
        //     challengers.player1 = player
        //     challengers.player1Button = button
        //     button.style.color = 'blue'
        //     nextSlot = 2
        // } else {
        //     challengers.player2 = player
        //     challengers.player2Button = button
        //     button.style.color = 'red'
        //     nextSlot = 1
        // }


        // if (challengers.player1) {
        //     playerTurnSelection.textContent = 'Player 2: Select Your Beasteskit'
        //     playerTurnSelection.style.color = 'rgb(238, 80, 80)'
        // }
        // if (challengers.player1 && challengers.player2) {
        //     playerTurnSelection.textContent = 'PLAYERS SELECTED!'
        //     playerTurnSelection.style.color = 'rgba(80, 238, 93, 1)'
        // }

        // updatePlayerHeading()
        // readyToBattle()
    })
}

currentPageIndex = 0

const popupPlayerChoose = id('popup-player-choose')
const player1Select = id('player1-select')
const player2Select = id('player2-select')
const playerSelect = id('player-select')
const closeSelect = id('close-select')

let currentCreatureName = null  // Track which creature was selected
let currentButton = null         // Track which button was clicked

closeSelect.addEventListener('click', ()=>{
    popupPlayerChoose.style.display = 'none'
})

// Attach these listeners ONCE
player1Select.addEventListener('click', () => {
    if (!currentCreatureName || !currentButton) return

    if (challengers.player1){
        animatePlayers.splice(animatePlayers.indexOf(challengers.player1), 1)
        if (challengers.player1Button && challengers.player1Button !== challengers.player2Button) {
            challengers.player1Button.style.color = 'black'
        }else {
            challengers.player1Button.style.color = 'red'   
        }
    }

    let player
    if (currentCreatureName === 'Random') {
        const allCreatures = Object.keys(creatures)
        const selectedName = allCreatures[Math.floor(Math.random() * allCreatures.length)]
        const selectedData = creatures[selectedName]
        player = new Player(selectedData, 1, selectedName)
    } else {
        player = new Player(creatures[currentCreatureName], 1, currentCreatureName)
    }

    animatePlayers.push(player)
    challengers.player1 = player
    challengers.player1Button = currentButton
    currentButton.style.color = 'blue'

    updatePlayerHeading()
    readyToBattle()
    popupPlayerChoose.style.display = 'none'
})

player2Select.addEventListener('click', () => {
    if (!currentCreatureName || !currentButton) return

    if (challengers.player2){
        animatePlayers.splice(animatePlayers.indexOf(challengers.player2), 1)
        if (challengers.player2Button && challengers.player2Button !== challengers.player1Button) {
            challengers.player2Button.style.color = 'black'
        }else {
            challengers.player2Button.style.color = 'blue'
        }
    }

    let player
    if (currentCreatureName === 'Random') {
        const allCreatures = Object.keys(creatures)
        const selectedName = allCreatures[Math.floor(Math.random() * allCreatures.length)]
        const selectedData = creatures[selectedName]
        player = new Player(selectedData, 2, selectedName)
    } else {
        player = new Player(creatures[currentCreatureName], 2, currentCreatureName)
    }

    animatePlayers.push(player)
    challengers.player2 = player
    challengers.player2Button = currentButton
    currentButton.style.color = 'red'

    updatePlayerHeading()
    readyToBattle()
    popupPlayerChoose.style.display = 'none'
})

playerSelect.addEventListener('click', () => {
    if (!currentCreatureName || !currentButton) return

    if (challengers.player1){
        animatePlayers.splice(animatePlayers.indexOf(challengers.player1), 1)
        if (challengers.player1Button) {
            challengers.player1Button.style.color = 'black'
        }
    }

    let player1
    if (currentCreatureName === 'Random') {
        const allCreatures = Object.keys(creatures)
        const selectedName = allCreatures[Math.floor(Math.random() * allCreatures.length)]
        const selectedData = creatures[selectedName]
        player1 = new Player(selectedData, 1, selectedName)
    } else {
        player1 = new Player(creatures[currentCreatureName], 1, currentCreatureName)
    }

    animatePlayers.push(player1)
    challengers.player1 = player1
    challengers.player1Button = currentButton
    currentButton.style.color = 'purple'
    

    if (challengers.player2){
        animatePlayers.splice(animatePlayers.indexOf(challengers.player2), 1)
        if (challengers.player2Button) {
            challengers.player2Button.style.color = 'black'
        }
    }

    let player2
    if (currentCreatureName === 'Random') {
        const allCreatures = Object.keys(creatures)
        const selectedName = allCreatures[Math.floor(Math.random() * allCreatures.length)]
        const selectedData = creatures[selectedName]
        player2 = new Player(selectedData, 2, selectedName)
    } else {
        player2 = new Player(creatures[currentCreatureName], 2, currentCreatureName)
    }

    animatePlayers.push(player2)
    challengers.player2 = player2
    challengers.player2Button = currentButton
    currentButton.style.color = 'purple'

    updatePlayerHeading()
    readyToBattle()
    popupPlayerChoose.style.display = 'none'
    
})

// SIMPLIFIED selectCreature function
function selectCreature(name, button) {
    currentCreatureName = name
    currentButton = button
    popupPlayerChoose.style.display = 'flex'
}


// const creaturebattleframe = document.querySelector('#creature-battle-frame')

const suddenDeathTimer = document.querySelector('#sudden-death-timer')
let totalTime = 2 * 60 * 1000 // 2 minutes
let sdTimer = null
let sdActive = false


function timerFormat(ms, sdStart) {
    const totalSeconds = Math.ceil(ms / 1000)
    
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    const mm = String(minutes).padStart(2, '0')
    const ss = String(seconds).padStart(2, '0')

    if (!sdStart) {
        return `Time Until Sudden Death: ${mm}:${ss}`
    }else {
        return `Game Ends In: ${mm}:${ss}`
    }
}

function activateSuddenDeath() {
    sdActive = true;

    // Remove ".creature" - challengers.player1 IS the player object
    const p1 = challengers.player1;
    const p2 = challengers.player2;

    if (!p1 || !p2) return;

    [p1, p2].forEach(p => {
        // Set HP to half of base stats
        p.stats.hp = Math.ceil(p.baseStats.hp / 2);
        p.updateLabel();
        
        // Reset positions to center-ish
        p.x = p.isPlayer1 ? 25 : 400;
        p.y = 200;
        p.vx = 0; // Reset velocity so they don't slide instantly
        p.vy = 0;
    });

    // Reset totalTime for the final 1-minute round
    totalTime = 60 * 1000; // 1 minute (Change to 1000 for testing)
    startSuddenDeathTimer(true);
}

function resolveSuddenDeath() {
    const p1 = challengers.player1;
    const p2 = challengers.player2;

    if (!p1 || !p2) return;

    if (window.CONFIG.match.type !== 'quickmatch') {
        if (window.CONFIG.match.p1Wins > window.CONFIG.match.p2Wins){
            endBattle(false);
        }else if (window.CONFIG.match.p1Wins < window.CONFIG.match.p2Wins) {
            endBattle(true);
        }else {
            endBattle(true);  // P1 has less health (true = player 1 lost)
        }
    }
    
    if (p1.stats.hp === p2.stats.hp) {
        console.log('⚖️ DRAW — Player 1 wins by default');
        endBattle(false); // Player 1 (false = player 1 didn't lose)
    } else if (p1.stats.hp > p2.stats.hp) {
        endBattle(false); // P1 has more health
    } else {
        endBattle(true);  // P1 has less health (true = player 1 lost)
    }
}

function startSuddenDeathTimer(sdStart) {
    if (sdTimer) return // prevent duplicates
    creaturebattleframe.style.backgroundColor = 'red'
    suddenDeathTimer.style.color = 'black'    

    suddenDeathTimer.textContent = timerFormat(totalTime, sdStart)

    sdTimer = setInterval(() => {
        totalTime -= 1000

        if (totalTime <= 0) {
            clearInterval(sdTimer)
            sdTimer = null
            suddenDeathTimer.textContent = '00:00'

            if (!sdActive) {
                activateSuddenDeath()
            } else {
                resolveSuddenDeath()
            }
            return
        }


    suddenDeathTimer.textContent = timerFormat(totalTime, sdStart)
    }, 1000)
}

const quitButton = id('quit-button')
quitButton.addEventListener('click', ()=>{
    endBattle(true, true)
})

function startBattle(){
    isGameOver = false
    startSuddenDeathTimer(false)

    document.querySelector('body').style.background = 'rgba(0, 0, 0, 0.6)'
    document.querySelectorAll('.home-screen-button').forEach(element => {
        element.style.display = 'none'
    })

    document.querySelector('#play-screen').style.display = 'none'
    creaturebattleframe.classList.remove('slideToMiddle')
    creaturebattleframe.classList.add('slideToMiddle')
    creaturebattleframe.style.opacity = 0
    creaturebattleframe.style.display = 'flex'
    
    // creaturebattleframe.style.background = 'transparent'
    suddenDeathTimer.style.color = 'red'

    const attackDisplays = document.querySelectorAll('.attack-display')
    attackDisplays.forEach(el => {
        el.style.display = 'flex'
    })

    // OBSTACLES
    if (window.CONFIG.obstacles.on) {
        let AMOUNT = 0
        const MAX_AMOUNT = window.CONFIG.obstacles.max

        const MIN_DISTANCE = 90   
        const MAX_ATTEMPTS = 50
        
        if (window.CONFIG.obstacles.randomize) {
             AMOUNT = Math.floor(Math.random() * MAX_AMOUNT) + 1
        }else {
            AMOUNT = MAX_AMOUNT
        }
        
        for (let i = 0; i < AMOUNT; i++) {
            let placed = false
    
            for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
                const x = Math.random() * (canvas.width - 64)
                const y = Math.random() * (canvas.height - 64)
    
    
                if (isPositionValid(x, y, obstacles, MIN_DISTANCE)) {
                    const obj = new Obstacle('./Obstacles/block.png', x, y)
                    obstacles.push(obj)
                    challengers.player1.spawnedObstacles.push(obj)
                    challengers.player2.spawnedObstacles.push(obj)
                    placed = true
                    break
                }
            }
    
    
            if (!placed) {
                console.warn('Could not place obstacle without overlap')
            }
        }
    }
    
    const plrOneList = document.querySelector('#list-attacks-player1')
    const plrTwoList = document.querySelector('#list-attacks-player2')

    plrOneList.replaceChildren()
    plrTwoList.replaceChildren()
    
    if (challengers.player1 && challengers.player2){
       
        challengers.player1.updateLabel()
        challengers.player2.updateLabel()

        challengers.player1.x = 25
        challengers.player2.x = 400

        challengers.player1.y = 200
        challengers.player2.y = 200
        
        const player1AttackKeys = Object.keys(challengers.player1.keysToAttack)
        player1AttackKeys.forEach((key, index) => {
            const keyStats = challengers.player1.keysToAttack[key]
            if (!keyStats.name || !keyStats.stats) return


            function determineString(){
                if (keyStats.stats.heal && keyStats.stats.dmg){
                    return `Heal: ${keyStats.stats.heal} | Damage: ${keyStats.stats.dmg}`
                }else if (keyStats.stats.heal && !keyStats.stats.dmg){
                    return `Heal: ${keyStats.stats.heal}`
                }else if (keyStats.stats.dmg && !keyStats.stats.heal){
                    return `Damage: ${keyStats.stats.dmg}`
                }else {
                    return 'Support'
                }
            }
           
            const li = document.createElement('li')
            li.textContent = `Keybind ${key.toUpperCase()} | ${keyStats.name.toUpperCase()} | ${determineString()} | Type ${keyStats.stats.type}`
            plrOneList.appendChild(li)


            li.style.color = colorFromType(keyStats.stats.type)
            li.id = `${key}-attack`
            li.classList.add('attack-list')
        })
       
        const player2AttackKeys = Object.keys(challengers.player2.keysToAttack)
        player2AttackKeys.forEach((key, index) => {
            const keyStats = challengers.player2.keysToAttack[key]
            if (!keyStats.name || !keyStats.stats) return
           
            function determineString(){
                if (keyStats.stats.heal && keyStats.stats.dmg){
                    return `Heal: ${keyStats.stats.heal} | Damage: ${keyStats.stats.dmg}`
                }else if (keyStats.stats.heal && !keyStats.stats.dmg){
                    return `Heal: ${keyStats.stats.heal}`
                }else if (keyStats.stats.dmg && !keyStats.stats.heal){
                    return `Damage: ${keyStats.stats.dmg}`
                }else {
                    return 'Movement'
                }
            }
           
            const li = document.createElement('li')
            li.textContent = `Keybind ${key.toUpperCase()} | ${keyStats.name.toUpperCase()} | ${determineString()} | Type ${keyStats.stats.type}`


            plrTwoList.appendChild(li)
            li.style.color = colorFromType(keyStats.stats.type)
            li.id = `${key}-attack`
            li.classList.add('attack-list')
        })
    }


    challengers.player1.indicate('')
    challengers.player2.indicate('')

    // resetPlayerState(challengers.player1, false)
    // resetPlayerState(challengers.player2, false)

    toggleTHEMES(false)
    setMatch()

    if (window.CONFIG.gameplay.ultcooldown){
        for (const key in challengers.player1.keysToAttack) {
            if (challengers.player1.keysToAttack[key].stats && attackData[challengers.player1.keysToAttack[key].name] !== 'ultimate') {
                challengers.player1.keysToAttack[key].stats.cooldown.switch = false;
            }else {
                challengers.player1.keysToAttack[key].stats.cooldown.switch = true;
            }
        }

        updatePlayerList(challengers.player1)

        for (const key in challengers.player2.keysToAttack) {
            if (challengers.player2.keysToAttack[key].stats && attackData[challengers.player2.keysToAttack[key].name] !== 'ultimate') {
                challengers.player2.keysToAttack[key].stats.cooldown.switch = false;
            }else {
                challengers.player2.keysToAttack[key].stats.cooldown.switch = true;
            }
        }

        updatePlayerList(challengers.player2)
    }

}

const roundInfo = id('round-info')
const roundDisplay = id('rounds-display')
const matchType = id('match-type-display')

function setMatch(){
    let match = window.CONFIG.match

    switch (match.type){
        case 'bestOf3':
            setDisplay(roundInfo, 'block')
            roundDisplay.textContent = `Player 1 Wins: ${match.p1Wins} | Player 2 Wins: ${match.p2Wins}`
            matchType.textContent = `Best Out Of 3 | Round ${match.round}`
        break
        case 'tourney3':
            setDisplay(roundInfo, 'block')
            roundDisplay.textContent = `Player 1 Wins: ${match.p1Wins} | Player 2 Wins: ${match.p2Wins}`
            matchType.textContent = `First To 3 Wins | Round ${match.round}`
        break
    }
}

let stopAnimation = false
let battleEndProcessing = false; // Add this at the top with other global vars
let animationId

function manageEndBattle(player1Lost) {
    let match = window.CONFIG.match

    if (player1Lost) {
        match.p2Wins += 1
    } else {
        match.p1Wins += 1
    }
    match.round += 1
    setMatch()

    // ✅ RESET GLOBAL BATTLE STATE BEFORE RESTARTING
    if (match.type === 'quickmatch') {
        if (match.p1Wins > match.p2Wins){
            endBattle(false)
        }else {
            endBattle(true)
        }
        
    } else if (match.type === 'tourney3') {
        if (match.p1Wins >= 3) {
            endBattle(false)
        } else if (match.p2Wins >= 3) {
            endBattle(true)
        } else {
            // ✅ RESET STATE BEFORE RESTARTING
            resetBattleState()
            startBattle()
        }
    
    } else if (match.type === 'bestOf3') {
        if (match.round > match.maxRounds) {
            endBattle(match.p1Wins < match.p2Wins)
        } else {
            // ✅ RESET STATE BEFORE RESTARTING
            resetBattleState()
            startBattle()
        }
    }
}

// ✅ NEW FUNCTION: Reset all battle-related state
function resetBattleState() {    
    // Clear obstacles
    obstacles.length = 0
    challengers.player1.spawnedObstacles = []
    challengers.player2.spawnedObstacles = []
    
    
    // Reset timers
    if (sdTimer) {
        clearInterval(sdTimer)
    }
    totalTime = 2 * 60 * 1000
    sdTimer = null
    sdActive = false
    
    // Clear effects and animations
    activeEffects.length = 0
    if (typeof secondaryImages !== 'undefined') secondaryImages.length = 0
    if (typeof priorityImages !== 'undefined') priorityImages.length = 0
    if (typeof activeAnimations !== 'undefined') activeAnimations.length = 0
    
    // Reset player positions (important!)
    if (challengers.player1) {
        challengers.player1.x = 25
        challengers.player1.y = 200
        challengers.player1.vx = 0
        challengers.player1.vy = 0
        challengers.player1.ultimateActive = false
        // challengers.player1.height = challengers.player1c.heightSave
        // challengers.player1.image.src = creatures[challengers.player1.name].image
        
    }
    if (challengers.player2) {
        challengers.player2.x = 400
        challengers.player2.y = 200
        challengers.player2.vx = 0
        challengers.player2.vy = 0
        challengers.player2.ultimateActive = false
        // challengers.player2.width = challengers.player2.widthSave
        // challengers.player2.height = challengers.player2.heightSave
        // challengers.player2.image.src = creatures[challengers.player2.name].image
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Stop any lingering animations
    stopAnimation = false
    isGameOver = false

    stun(challengers.player1, 2000)
    stun(challengers.player2, 2000)

    clashing = false

    window.CLASH_CONFIG = {
        player1: null,
        player2: null,
        player1Action: null,
        player2Action: null,
    }

    ultimateTimeDisplay.style.display = 'none'
    
    setTimeout(()=>{
        battleEndProcessing = false        

        challengers.player1.stats = JSON.parse(JSON.stringify(challengers.player1.baseStats));
        challengers.player1.updateLabel()

        challengers.player2.stats = JSON.parse(JSON.stringify(challengers.player2.baseStats));
        challengers.player2.updateLabel()
    }, 2000)
}

function endBattle(player1Lost, forfeit = false){
    isGameOver = true
    stopAnimation = true
    battleEndProcessing = false
    cancelAnimationFrame(animationId)

    stopCPUControllers();
    clearInterval(sdTimer)
    totalTime = 2 * 60 * 1000
    sdTimer = null
    sdActive = false
    obstacles.length = 0

    readyButton.disabled = true
    
    const winnerHeading = document.querySelector('#winner-heading')
    winnerHeading.classList.add('bounceIn')
    winnerHeading.style.display = 'block'
    let winnerImage
    
    if (player1Lost) {
        winnerHeading.textContent = `Player Two's ${challengers.player2.name} Wins!`
        winnerImage = challengers.player2.image.src
    } else {
        winnerHeading.textContent = `Player One's ${challengers.player1.name} Wins!`
        winnerImage = challengers.player1.image.src
    }

    if (forfeit) {
        if (window.CONFIG.match.p1Wins > window.CONFIG.match.p2Wins) {
            winnerHeading.textContent = `Player One's ${challengers.player1.name} Wins!`
            winnerImage = challengers.player1.image.src
        }else if (window.CONFIG.match.p1Wins < window.CONFIG.match.p2Wins) {
            winnerHeading.textContent = `Player Two's ${challengers.player2.name} Wins!`
            winnerImage = challengers.player2.image.src
        }else {
            if (challengers.player1.stats.hp > challengers.player2.stats.hp) {
                 winnerHeading.textContent = `Player One's ${challengers.player1.name} Wins!`
                winnerImage = challengers.player1.image.src
            }else if (challengers.player1.stats.hp < challengers.player2.stats.hp){
                winnerHeading.textContent = `Player Two's ${challengers.player2.name} Wins!`
                winnerImage = challengers.player2.image.src

            }else {
                winnerHeading.textContent = `Its A Tie...`
                winnerImage = retreiveImage("Random")
            }
        }
    }

    window.CONFIG.match.round = 1
    window.CONFIG.match.p1Wins = 0
    window.CONFIG.match.p2Wins = 0
    
    toggleTHEMES(true)

    const darkTransition = document.querySelector('#dark-transition')
    const image = document.querySelector('#transition-image')

    image.src = winnerImage
   
    darkTransition.classList.add('slideToMiddle')
    darkTransition.style.display = 'flex'
   
    const pause = setTimeout(()=>{
        stopAnimation = true
        cancelAnimationFrame(animationId)
       
        const plrOneList = document.querySelector('#list-attacks-player1')
        const plrTwoList = document.querySelector('#list-attacks-player2')
   
        plrOneList.replaceChildren()
        plrTwoList.replaceChildren()
   
        creaturebattleframe.style.display = 'none'
        playScreen.style.display = 'flex'
       
        const attackDisplays = document.querySelectorAll('.attack-display')
        attackDisplays.forEach(el => {
            el.style.display = 'none'
        })
       
        document.querySelectorAll('.home-screen-button').forEach(element => {
            element.style.display = 'block'
        })
       
        document.querySelector('body').style.backgroundColor = '#9e55bd'
       
        window.dispatchEvent(new Event('restartGame'))
        clearTimeout(pause)
       
    }, 4050)

    const pause2 = setTimeout(()=>{
        darkTransition.classList.remove('slideToMiddle')
        darkTransition.classList.add('slideToTop')
    
        const pause3 = setTimeout(()=>{
            darkTransition.style.display = 'none'
            darkTransition.classList.remove('slideToTop')
            winnerHeading.classList.remove('bounceIn')
            winnerHeading.style.display = 'none'
            clearTimeout(pause3)
        }, 3000)
    
        // ✅ RESET PLAYER STATE (but keep the selection)
        if (challengers.player1) {
            resetPlayerState(challengers.player1);
        }
        if (challengers.player2) {
            resetPlayerState(challengers.player2);
        }
        
        // ✅ RE-ADD PLAYERS TO ANIMATE ARRAY
        animatePlayers.length = 0;
        if (challengers.player1) animatePlayers.push(challengers.player1);
        if (challengers.player2) animatePlayers.push(challengers.player2);
        
        updatePlayerHeading()
        readyToBattle();
        readyButton.disabled = false
        
        clearTimeout(pause2)
    }, 4000)
}

function resetPlayerState(player, cpuReset = true) {
    // Reset health & stats
    player.stats = JSON.parse(JSON.stringify(player.baseStats));
    player.healthSave = JSON.parse(JSON.stringify(player.baseStats.hp));
    player.spawnedObstacles = []

    player.updateLabel()
    clashing = false
    
    // Reset position
    player.x = player.isPlayer1 ? 25 : 400;
    player.y = 200;
    player.vx = 0;
    player.vy = 0;

    player.width = player.widthSave
    player.height = player.heightSave
    player.image.src = creatures[player.name].image
    
    // Reset status effects
    player.stunTimer = null;
    player.rotation = 0;
    player.opacity = 1;
    player.flicker = false;
    player.flickerTime = 0;
    player.isClashing = false;
    player.lockedDown = false
    player.ultimateActive = false
    player.transportMarker = null

    player.activeKeyBlade = ''
    player.lastMoves = []
    player.targetHealthOnSequenceStart = null
    player.sequenceInProgress = false
    player.keyActive = false
    
    // Reset all cooldowns
    for (const key in player.keysToAttack) {
        if (player.keysToAttack[key].stats) {
            player.keysToAttack[key].stats.cooldown.switch = false;
        }
    }
    
    // Reset AI state if CPU
    if (player.isCPU && cpuReset) {
        player.aiState.strategy = 'balanced';
        player.aiState.lastStrategyChange = Date.now();
        player.aiState.dodgeUntil = 0;
        player.aiState.consecutiveMisses = 0;
        player.aiState.comboSystem.isComboActive = false;
        player.aiState.comboSystem.comboStep = 0;
        player.aiState.counterPlay.revengeMode = false;
        player.aiState.counterPlay.justGotHit = false;
    }
}


function player1Checks(playerOne, target){
    const movement = (playerOne.isCPU ? cpuIntent.player1.movement : keybinds.movement);
    const attacks = (playerOne.isCPU ? cpuIntent.player1.attacks : keybinds.attacks);
    const maxSpeed = playerOne.stats.spd
    
    if (movement.w) {
        playerOne.vy = -maxSpeed
    } else if (movement.s) {
        playerOne.vy = maxSpeed
    } else {
        playerOne.vy *= playerOne.friction
    }
    
    if (movement.d) {
        playerOne.vx = maxSpeed
        if (!playerOne.stunTimer) playerOne.facingRight = true
    } else if (movement.a) {
        playerOne.vx = -maxSpeed
        if (!playerOne.stunTimer) playerOne.facingRight = false
    } else {
        playerOne.vx *= playerOne.friction
    }
    
    if (Math.abs(playerOne.vx) < 0.1) playerOne.vx = 0
    if (Math.abs(playerOne.vy) < 0.1) playerOne.vy = 0
    
    for (const attackKey of Object.keys(playerOne.keysToAttack)){
        if (attacks[attackKey] === true && playerOne && !playerOne.isStunned()){
            if (attackFunctions[playerOne.keysToAttack[attackKey].name] &&
                playerOne.keysToAttack[attackKey].stats.cooldown.switch == false){
    
                const attackName = playerOne.keysToAttack[attackKey].name
                attackFunctions[attackName].action(playerOne, target)
                if (!attackFunctions[attackName].stats.untrackable) {
                    playerOne.lastMove = attackName
                }
    
                // ── KEY TILT move tracking ─────────────────────────────
                if (playerOne.keyActive && Array.isArray(playerOne.lastMoves)) {
                    playerOne.lastMoves.push(attackName)
                    // Snapshot target HP at the start of each new sequence window
                    if (playerOne.lastMoves.length === 1) {
                        playerOne.targetHealthOnSequenceStart = target.stats.hp
                    }
                }
                // ──────────────────────────────────────────────────────
    
                playerOne.keysToAttack[attackKey].stats.cooldown.switch = true
    
                const desiredElement = document.querySelector(`#${attackKey}-attack`)
                const originalText = desiredElement.textContent
    
                desiredElement.innerHTML = `${attackName} | Cooldown <br>(${playerOne.keysToAttack[attackKey].stats.cooldown.time * 0.001} seconds)`
    
                const timeOut = setTimeout(() => {
                    playerOne.keysToAttack[attackKey].stats.cooldown.switch = false
                    desiredElement.textContent = originalText
                    playerOne.indicate('')
                    clearTimeout(timeOut)
                }, playerOne.keysToAttack[attackKey].stats.cooldown.time)
            }
        }
    }

    if (playerOne.stunTimer) return
    playerOne.x += playerOne.vx
    playerOne.y += playerOne.vy
}

function player2Checks(playerTwo, target){
    const movement = (playerTwo.isCPU ? cpuIntent.player2.movement : keybinds.movement);
    const attacks = (playerTwo.isCPU ? cpuIntent.player2.attacks : keybinds.attacks);
    const maxSpeed = playerTwo.stats.spd
    
    if (movement.arrowup) {
        playerTwo.vy = -maxSpeed
    } else if (movement.arrowdown) {
        playerTwo.vy = maxSpeed
    } else {
        playerTwo.vy *= playerTwo.friction
    }
    
    if (movement.arrowright) {
        playerTwo.vx = maxSpeed
        if (!playerTwo.stunTimer) playerTwo.facingRight = true
    } else if (movement.arrowleft) {
        playerTwo.vx = -maxSpeed
        if (!playerTwo.stunTimer) playerTwo.facingRight = false
    } else {
        playerTwo.vx *= playerTwo.friction
    }
    
    if (Math.abs(playerTwo.vx) < 0.1) playerTwo.vx = 0
    if (Math.abs(playerTwo.vy) < 0.1) playerTwo.vy = 0
    
    for (const attackKey of Object.keys(playerTwo.keysToAttack)){
        if (attacks[attackKey] === true && playerTwo && !playerTwo.isStunned()){
            if (attackFunctions[playerTwo.keysToAttack[attackKey].name] &&
                playerTwo.keysToAttack[attackKey].stats.cooldown.switch == false){
    
                const attackName = playerTwo.keysToAttack[attackKey].name
                attackFunctions[attackName].action(playerTwo, target)
                if (!attackFunctions[attackName].stats.untrackable) {
                    playerTwo.lastMove = attackName
                }
    
                // ── KEY TILT move tracking ─────────────────────────────
                if (playerTwo.keyActive && Array.isArray(playerTwo.lastMoves)) {
                    playerTwo.lastMoves.push(attackName)
                    if (playerTwo.lastMoves.length === 1) {
                        playerTwo.targetHealthOnSequenceStart = target.stats.hp
                    }
                }
                // ──────────────────────────────────────────────────────
    
                playerTwo.keysToAttack[attackKey].stats.cooldown.switch = true
    
                const desiredElement = document.querySelector(`#${attackKey}-attack`)
                const originalText = desiredElement.textContent
    
                desiredElement.innerHTML = `${attackName} | Cooldown <br>(${playerTwo.keysToAttack[attackKey].stats.cooldown.time * 0.001} seconds)`
    
                const timeOut = setTimeout(() => {
                    playerTwo.keysToAttack[attackKey].stats.cooldown.switch = false
                    desiredElement.textContent = originalText
                    playerTwo.indicate('')
                    clearTimeout(timeOut)
                }, playerTwo.keysToAttack[attackKey].stats.cooldown.time)
            }
        }
    }
    
    if (playerTwo.stunTimer) return
    playerTwo.x += playerTwo.vx
    playerTwo.y += playerTwo.vy
}


function drawImageEffect(effect) {
    ctx.save()


    // Move origin to center of image
    ctx.translate(
        effect.x + effect.width / 2,
        effect.y + effect.height / 2
    )


    // Apply flips
    const scaleX = effect.flipX ? -1 : 1
    const scaleY = effect.flipY ? -1 : 1
    ctx.scale(scaleX, scaleY)
    
    // if (effect.tint) {
    //     ctx.globalCompositeOperation = 'source-atop';
    //     ctx.fillStyle = effect.tint;
    //     // Draw relative to the new translated origin (the center)
    //     ctx.fillRect(
    //         -effect.width / 2, 
    //         -effect.height / 2, 
    //         effect.width, 
    //         effect.height
    //     );
    // }

    // Draw image centered
    if (effect.image.complete && effect.image.naturalWidth !== 0) {
        ctx.drawImage(
            effect.image,
            -effect.width / 2,
            -effect.height / 2,
            effect.width,
            effect.height
        )
    }

    // if (effect.rotation !== 0) {
    //     const radians = (effect.rotation * Math.PI) / 180;
    //     ctx.rotate(radians)
    // }

    // effect.opacity = effect.opacity

    ctx.globalCompositeOperation = 'source-over'
    ctx.restore()
}


function drawEffect (now, array){
    for (let i = array.length - 1; i >= 0; i--) {
        const effect = array[i]


        if (now > effect.expiry) {
            array.splice(i, 1)
        } else {
            drawImageEffect(effect)
        }
    }
}

function drawAnimations(now) {
    for (let i = activeAnimations.length - 1; i >= 0; i--) {
        const anim = activeAnimations[i];

        if (now > anim.expiry) {
            activeAnimations.splice(i, 1);
            continue;
        }

        // **HANDLE PAUSE LOGIC**
        if (anim.isPaused) {
            // Check if pause duration expired
            if (anim.pauseStartTime && (now - anim.pauseStartTime) > anim.pauseDuration) {
                resumeAnimation(anim);
            } else {
                // Stay on paused frame
                anim.currentFrame = anim.pausedFrame;
            }
        } else {
            // Normal animation logic
            const timeElapsed = now - anim.startTime;
            const frameIndex = Math.floor(timeElapsed / anim.frameDuration);
            anim.currentFrame = Math.min(frameIndex, anim.frameCount - 1);
        }

        // Draw the current frame
        ctx.save();
        ctx.translate(anim.x + anim.width / 2, anim.y + anim.height / 2);

        if (anim.flipX) {
            ctx.scale(-1, 1);
        }

        if (anim.image.complete && anim.image.naturalWidth !== 0) {
            ctx.drawImage(
                anim.image,
                anim.currentFrame * anim.frameWidth,
                0,
                anim.frameWidth,
                anim.frameHeight,
                -anim.width / 2,
                -anim.height / 2,
                anim.width,
                anim.height
            );
        }

        ctx.restore();
    }
}

function drawMap() {
  if (!mapImage || !mapImage.complete) return;
  // Cover whole canvas while preserving aspect or stretching:
  ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
}

   
// ── WATER LEVEL DRAW ────────────────────────────────────────────────────────
// Call this inside your animation() loop after drawing players
function drawWaterLevels() {
for (const slot of ['player1', 'player2']) {
const p = challengers[slot]
if (!p || p.waterLevel === undefined) continue

    const barW      = 8
    const maxBarH   = 50
    const fillH     = Math.round((p.waterLevel / 15) * maxBarH)
    const barX      = p.isPlayer1 ? p.x - 14 : p.x + p.width + 6
    const barY      = p.y + (p.height - maxBarH) / 2

    // Empty bar background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.fillRect(barX, barY, barW, maxBarH)

    // Water fill (grows upward)
    if (p.waterLevel <= 5) ctx.fillStyle = 'rgba(0, 150, 255, 0.85)'
    else if (p.waterLevel <= 10) ctx.fillStyle = 'rgba(0, 201, 226, 0.85)'
    else ctx.fillStyle = 'rgba(0, 255, 226, 0.85)'
    
    ctx.fillRect(barX, barY + (maxBarH - fillH), barW, fillH)

    // Outline
    ctx.strokeStyle = 'rgba(0, 100, 200, 1)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(barX, barY, barW, maxBarH)

    // Level number
    ctx.fillStyle   = 'white'
    ctx.font        = '8px Arial'
    ctx.textAlign   = 'center'
    ctx.fillText(p.waterLevel, barX + barW / 2, barY - 3)
}

}

function animation(){
    if (stopAnimation){
    activeEffects.length = 0;
    if (typeof activeImages !== 'undefined') activeImages.length = 0;
    stopAnimation = false
    cancelAnimationFrame(animationId)
    return
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    
    const now = Date.now()
    const deltaTime = now - (window.lastFrameTime || now);
    window.lastFrameTime = now;
    
    if (clashing) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }else {
        drawMap()
    }
    
    drawEffect(now, secondaryImages)
    
    for (let i = activeEffects.length - 1; i >= 0; i--) {
        const effect = activeEffects[i]
        
        if (now > effect.expiry || effect.end) {
            activeEffects.splice(i, 1)
        } else {
            if (effect.circle) {
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.width / 2, 0, 2 * Math.PI); 
                ctx.fillStyle = effect.color
                ctx.fill()
            } else {
                ctx.fillStyle = effect.color
                ctx.fillRect(effect.x, effect.y, effect.width, effect.height)
            }
        }
    }

    // checkProjectileCollisions(now)
    
    animatePlayers.forEach(player => {
        player.draw()
        player.borders()
        if (player.stats.hp <= 0 && !isGameOver && !battleEndProcessing){
            isGameOver = true;
            stopAnimation = true
            battleEndProcessing = true
            manageEndBattle(player.isPlayer1)
            return
        }
    })

    drawWaterLevels()
    
    // --- Draw Persistent Project Blocks ---
    animatePlayers.forEach(p => {
        if (p.currentProject && p.currentProject.parts.length > 0) {
            p.currentProject.parts.forEach(part => {
                ctx.drawImage(part.img, part.x, part.y, 64, 64)
            })
        }

        if (p.clone) {
            p.clone.draw()
        }

        // if (p.weaponry) {
        //     switch(p.weaponry){
        //         case 'pulseRay':
        //             ctx.fillStyle = '#70746b'
        //             ctx.fillRect(p.x, p.y + p.height / 2, p.width, p.height / 2)
        //         break
        //         case 'gauntlet':
        //             ctx.fillStyle = 'gray'
        //             ctx.fillRect(p.x, p.y + p.height / 2, p.width, p.height / 2)
        //         break
        //         case 'gernadeLauncher':
        //             ctx.fillStyle = '#c1ae1c'
        //             ctx.fillRect(p.x, p.y + p.height / 2, p.width, p.height / 2)
        //         break
        //     }
        // }
    
        // ── KEY BLADE DRAWING ──────────────────────────────────────────
        if (p.keyActive && p.activeKeyBlade && p.keyBlades) {
            const activeBlade = p.keyBlades[p.activeKeyBlade]
            if (activeBlade && activeBlade.cachedImage && activeBlade.cachedImage.complete && activeBlade.cachedImage.naturalWidth !== 0) {
            ctx.save()
            
                if (!p.facingRight) {
                    // Flip horizontally around the center of the image
                    ctx.translate(p.x + p.width, p.y)
                    ctx.scale(-1, 1)
                    ctx.drawImage(activeBlade.cachedImage, 0, 0, p.width, p.height)
                } else {
                    ctx.drawImage(activeBlade.cachedImage, p.x, p.y + (p.height / 6), p.width, p.height)
                }
            
                ctx.restore()
            }
        }
        
        // ──────────────────────────────────────────────────────────────
    })
    
    obstacles.forEach(object => {
        object.draw()
        animatePlayers.forEach(player => {
            noCollision(player, object)
        })
    })
    
    drawAnimations(now);
    drawEffect(now, priorityImages)
    
    const playerOne = challengers.player1
    const playerTwo = challengers.player2
    if (playerOne && playerTwo){
        player1Checks(playerOne, playerTwo)
        player2Checks(playerTwo, playerOne)
    }
    animationId = requestAnimationFrame(animation)
}
animation()

addEventListener('restartGame', () => {
    isGameOver = false
    stopAnimation = false
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animation()
})
   
addEventListener('keydown', (e) => {
  const key = String(e.key).toLowerCase();
  const p1 = challengers.player1;
  const p2 = challengers.player2;
  const p1IsCPU = !!(p1 && p1.isCPU);
  const p2IsCPU = !!(p2 && p2.isCPU);

  // Player1: WASD + QERF
  if (!p1IsCPU) {
    if (['w','a','s','d'].includes(key) && key in keybinds.movement) keybinds.movement[key] = true;
    if (['q','e','z','x', 'r'].includes(key) && key in keybinds.attacks) keybinds.attacks[key] = true;
  }

  // Player2: Arrow keys + JKLH
  // Normalize Arrow names (browser gives "ArrowLeft" etc.) — compare lowercase
  if (!p2IsCPU) {
    if (['arrowup','arrowdown','arrowleft','arrowright'].includes(key) && key in keybinds.movement) keybinds.movement[key] = true;
    if (['o','p','k','l', 'm'].includes(key) && key in keybinds.attacks) keybinds.attacks[key] = true;
  }
});

addEventListener('keyup', (e) => {
  const key = String(e.key).toLowerCase();
  const p1 = challengers.player1;
  const p2 = challengers.player2;
  const p1IsCPU = !!(p1 && p1.isCPU);
  const p2IsCPU = !!(p2 && p2.isCPU);

  if (!p1IsCPU) {
    if (['w','a','s','d'].includes(key) && key in keybinds.movement) keybinds.movement[key] = false;
    if (['q','e','z','x', 'r'].includes(key) && key in keybinds.attacks) keybinds.attacks[key] = false;
  }

  if (!p2IsCPU) {
    if (['arrowup','arrowdown','arrowleft','arrowright'].includes(key) && key in keybinds.movement) keybinds.movement[key] = false;
    if (['o','p','k','l', 'm'].includes(key) && key in keybinds.attacks) keybinds.attacks[key] = false;
  }
});
