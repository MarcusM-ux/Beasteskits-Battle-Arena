const versionDate = document.querySelector('#versionDate')
const lastUpdated = document.querySelector('#lastUpdated')

const updates = [

{
    title: 'Version 1.3.8',
    content : [
        'heading-NEW: ',
        'Improved Beasteskit Kits!',
        'More attack reworks!',
        'Attacks with better CPU alignment!',
        'All attack descriptions have been added!',
        'Removed Cornickelle, Buffed Thornspire!',
        'New Moves e.g QUICK PUNCH, SWIPE, UPSWIPE, IRON PIERCE, etc'
    ]
},
{
    title: 'Version 1.3.5',
    content : [
        'heading-NEW: ',
        'ULTIMATE MOVES with ULTIMATE CLASHING!',
        'Attack reworks',
        'Abysmouth Rework!',
        'Hint Feature in Compare!',
        'New E.A.B.O.R.N design!',
        
    ]
},

{
  title: 'Version 1.3.1',
  content: [
    'heading-NEW: ',
    'New Moves (EXPLOSION, Key)',
    'CHAOTIBOOM New Move - EXPLOSION',
  ]
},
{
  title: 'Version 1.3.0',
  content: [
    'heading-NEW: ',
    'New Beasteskit - Riftwing (Mind)',
    'New Moves (CLAP, PORTAL STRIKE, SHADOW GLIDE, TALON SWEEP, GRAND DISAPPEARANCE)',
    'New Sound Effects!',
    "New Map! - Skeleton's Lava Lake",
    'New Transformation - Clawbuster Form (Hankclaw)',
    'Activated by using hitting 3 CLAW STRIKES, Using DECONSTRUCT, Then Successfully hitting CLAW SWIPE TITAN!',
    '',
    'heading-GAMEPLAY: ',
    'Todoboid (Beasteskit) - Replaced DASH with CLAP!',
    'Minor Type Chart Changes (Metal is no longer weak to Fighting)',
    'SNAP now deals stun and more knockback!',
    'Beaskeskit Stat Changes...',
    'Improved CPU Behavoir!',
    'Fixed Obstacle Collision!!',
    'Fixed Bugs',
    'Changed Pigment (AGAIN) Tank => Damage',
    'Minor nerfs / buffs to Zobirdee',
    'Renamed WRAP => DRAG'
  ]
}

]

// Function to create a hash of the updates array
function hashUpdates(updatesArray) {
    return JSON.stringify(updatesArray)
}

// Function to update the date
function updateDateDisplay() {
    const today = new Date()
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    const formattedDate = today.toLocaleDateString('en-US', options)
    lastUpdated.textContent = `LAST UPDATED: ${formattedDate}`
}

// Check if updates have changed
function checkForUpdates() {
    const storedUpdatesHash = localStorage.getItem('updatesHash')
    const currentUpdatesHash = hashUpdates(updates)
    
    if (storedUpdatesHash !== currentUpdatesHash) {
        // Updates have changed, update localStorage and date
        localStorage.setItem('updatesHash', currentUpdatesHash)
        updateDateDisplay()
    } else if (!lastUpdated.textContent || lastUpdated.textContent === 'LAST UPDATED: ') {
        // First time loading, set the date
        updateDateDisplay()
    }
}

// Run on page load
window.addEventListener('load', (event) => {
    checkForUpdates()
});

const updatesContainer = document.querySelector('#updates-screen')

updates.forEach((tab, index) => {
    if (index === 0 ){
        versionDate.textContent = tab.title
    }
  const container = document.createElement('div')
  container.classList.add('content')

  const heading = document.createElement('h2')
  heading.textContent = tab.title

  const ul = document.createElement('ul')

  tab.content.forEach(item => {
    const li = document.createElement('li')
    
    // Check if item starts with 'heading-'
    if (item.includes('heading-')) {
      // Remove the 'heading-' prefix
      const headingText = item.replace('heading-', '')
      
      // Create a heading element instead of a list item
      const subHeading = document.createElement('h3')
      subHeading.textContent = headingText
      ul.appendChild(subHeading)
    } else if (item === '') {
      // Empty break
      li.classList.add('break')
      ul.appendChild(li)
    } else {
      // Normal list item
      li.textContent = item
      ul.appendChild(li)
    }
  })

  container.appendChild(heading)
  container.appendChild(ul)

  updatesContainer.appendChild(container)
})

const upcomingContainer = document.querySelector('#upcoming-list')
const features = [
    'Beasteskit Mastery - The more you play with a certain character the better it gets (stronger attacks, different moves, etc)',
    'Arena Fort Shop - A shop where you spend your hard earned Beasteskit Fragments to buy skins or custom abilities for characters.',
    'Beasteskit Fragments - Earned from fighting in a match with an opponent!',
    'Accounts with IDs to save specific player progress.',
    '"Revolutionary Moves" - Moves that change the map entirely!',
    'Voicelines For Beasteskits!',
    'Intro Screens / Winner Screens',
    'More Finishers',
    'NIGHTMARE VEIL - A dark type attack that encloses the entire area in a shadowy realm that gives the user boosts in speed and the ability to create shadow copies of itself that attack the enemy. The veil takes a while to activate and can only be activated if all the other moves the user has are on cooldown.',
]

features.forEach(feature => {
    const li = document.createElement('li')
    li.textContent = "* " + feature

    upcomingContainer.appendChild(li)
})
