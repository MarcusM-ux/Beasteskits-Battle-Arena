// DOM Elements
const mainMenu = document.querySelector('#main-menu');
const buttonScreen = document.querySelector('#button-frames');
const tutorialScreen = document.querySelector('#tutorial-screen');
const creditScreen = document.querySelector('#credit-screen');
const socialsScreen = document.querySelector('#socials-screen');
const updatesScreen = document.querySelector('#updates-screen');
const selectionFrames = document.querySelector('#selection-frames');
const playlistButton = document.querySelector('#playlists')
// const playScreen = document.querySelector('#play-screen')

// Helper function to prevent "null" errors
const setDisplay = (el, value) => { if (el) el.style.display = value; };

const gamemodesScreen = document.querySelector('#gamemodes-screen')
const gamemodeBtn = document.querySelector('#menu-button-gamemodes')
const buttonFrames = document.querySelector('#button-frames')
const cpuPrompt = document.querySelector('#cpu-level-prompt')

const menuLinks = [
    {button: document.querySelector('#menu-button-play'), screen: playScreen, display: 'flex'},
    {button: document.querySelector('#menu-button-tutorial'), screen: tutorialScreen, wrapper: buttonScreen, display: 'block'},
    {button: document.querySelector('#menu-button-credits'), screen: creditScreen, wrapper: buttonScreen, display: 'block'},
    {button: document.querySelector('#menu-button-socials'), screen: socialsScreen, wrapper: buttonScreen, display: 'block'},
    {button: document.querySelector('#menu-button-updates'), screen: updatesScreen, wrapper: buttonScreen, display: 'block'},
    {button: document.querySelector('#menu-button-gamemodes'), screen: gamemodesScreen, wrapper: buttonScreen, display: 'flex'}

];


// Main Menu Navigation
menuLinks.forEach(link => {
    if (link.button) {
        link.button.addEventListener('click', () => {
            setDisplay(mainMenu, 'none');
            
            // Hide all potential sub-screens
            [tutorialScreen, creditScreen, socialsScreen, updatesScreen, gamemodesScreen].forEach(s => setDisplay(s, 'none'));
            
            setDisplay(link.screen, link.display);
            if (link.wrapper) setDisplay(link.wrapper, 'flex');
        });
    }
});

// Global Exit (X) Buttons
document.querySelectorAll('.home-screen-button').forEach(button => {
    button.addEventListener('click', () => {
        setDisplay(mainMenu, 'flex');
        setDisplay(buttonScreen, 'none');
        setDisplay(playScreen, 'none');
        setDisplay(selectionFrames, 'none');
    });
});

// Toggle System (Info Panels)
const csToggles = {
    // typechart: {
    //     button: document.querySelector('#toggleTypeChart'),
    //     screen: document.querySelector('#typeChartDisplay'),
    //     name: 'Type Chart'
    // },
    attacks: {
        button: document.querySelector('#toggleattacksCatalog'),
        screen: document.querySelector('#attacksCatalog'),
        name: 'Attacks Catalog'
    },
    // scoreboard: {
    //     button: document.querySelector('#scoreboardButton'),
    //     screen: document.querySelector('#scoreboardDisplay'),
    //     name: 'Scoreboard'
    // },
    upcoming : {
        button: document.querySelector('#upcomingOpen'),
        screen: document.querySelector('#upcomingDisplay'),
        name: 'Upcoming Features'
    }
};

// Helper to check if any screen is currently open
const anyScreenActive = () => Object.values(csToggles).some(data => data.screen.style.display === 'flex');

Object.entries(csToggles).forEach(([key, data]) => {
    if (!data.button) return; 

    data.button.addEventListener('click', () => {
        // Determine if we are opening or closing based on current display
        const opening = data.screen.style.display !== 'flex';
        
        if (opening) {
            setDisplay(data.screen, 'flex');
            data.button.textContent = `Close ${data.name}`;

            // Close all other screens
            Object.entries(csToggles).forEach(([otherKey, otherData]) => {
                if (key !== otherKey) {
                    setDisplay(otherData.screen, 'none');
                    if (otherData.button) otherData.button.textContent = `Open ${otherData.name}`;
                }
            });

            // Hide the selection buttons
            document.querySelector('#beasteskit-selection-button').style.display = 'none';
            document.querySelector('#map-selection-button').style.display = 'none';
            // document.querySelector('#gameplay-screen-buttons').style.display = 'none'; // or 'block'
            document.querySelector('#playlists').style.display = 'none'
            document.querySelector('#ready-button').style.display = 'none'
            
        } else {
            // Closing the current screen
            setDisplay(data.screen, 'none');
            data.button.textContent = `Open ${data.name}`;

            // If nothing else is open now, show the selection buttons again
            if (!anyScreenActive()) {
            
                document.querySelector('#playlists').style.display = 'block'
                document.querySelector('#ready-button').style.display = 'block'

                document.querySelector('#beasteskit-selection-button').style.display = 'flex'; // or 'block'
                document.querySelector('#map-selection-button').style.display = 'flex';
            }
        }
    });
});

// Selection Frame Logic
const selectionFrameButtons = [
    {button: document.querySelector('#map-selection-button'), screen: document.querySelector('#map-selection-frame')},
    {button: document.querySelector('#beasteskit-selection-button'), screen: document.querySelector('#beasteskit-selection-frame')},
    {button: document.querySelector('#playlists'), screen: document.querySelector('#playlist-frame')},
    {button: document.querySelector('#settings-btn'), screen: document.querySelector('#settings-frame')},
    {button: document.querySelector('#compare-btn'), screen: document.querySelector('#compare-screen')},
    {button: document.querySelector('#note-btn'), screen: document.querySelector('#typeChartDisplay')},
    {button: document.querySelector('#fun-btn'), screen: document.querySelector('#fun-screen')},
    
];

function hideAllSelectionFrames() {
    selectionFrameButtons.forEach(link => setDisplay(link.screen, 'none'));
    setDisplay(selectionFrames, 'none');
}

selectionFrameButtons.forEach(link => {
    if (link.button) {
        link.button.addEventListener('click', () => {
            hideAllSelectionFrames()
            setDisplay(playScreen, 'none');
            setDisplay(selectionFrames, 'block');
            setDisplay(link.screen, 'flex');
        });
    }
});

document.querySelectorAll('.return-to-playscreen').forEach(btn => {
    btn.addEventListener('click', () => {
        hideAllSelectionFrames();
        setDisplay(playScreen, 'flex');
        // setDisplay(playlistScreen, 'none');
        document.querySelector('#popup-description').style.display = 'none'
        document.querySelector('#popup-player-choose').style.display = 'none'
        
    });
});

// LOADING SCREEN
// Simple loading screen controller
setTimeout(()=>{

(function () {
  const loadingScreen = document.getElementById('loading-screen');
  const progressFill = document.getElementById('progress-fill');
  const loadingText = document.getElementById('loading-text');

  // Example: list of "assets" to wait for (images, audio, etc.)
  const assets = [
    './Images/pure-card.png',
    './Images/pure-button-card.png',
    './Images/logo.png',
    './Images/card.png',
    './Images/button-card.png',
    './Images/bottom_decores.png',
    './Images/beasteskit-card.png',
    './Images/background.png',
    './Images/beasteskit-card.png',
  ];

  let loaded = 0;
  const total = assets.length;

  function setProgress(percentage) {
    progressFill.style.width = percentage + '%';
    loadingText.textContent = 'Loading... ' + Math.round(percentage) + '%';
  }

  // Load images (and treat non-image as instant for simplicity)
  function loadAsset(src) {
    return new Promise((resolve) => {
      if (src.match(/\.(png|jpe?g|gif|webp|svg)$/i)) {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(src); // resolve even on error
        img.src = src;
      } else {
        // Non-image (scripts handled by <script> tags already) — simulate small delay
        setTimeout(() => resolve(src), 120);
      }
    });
  }

  // Progress updater
  function tick() {
    loaded++;
    const pct = (loaded / total) * 100;
    setProgress(pct);
    if (loaded >= total) {
      // short delay so player sees 100%
      setTimeout(hideLoader, 4000);
    }
  }

  function hideLoader() {
    loadingScreen.classList.add('loading-hidden');
    // Optionally remove from DOM
    setTimeout(()=> loadingScreen.remove(), 400);
  }

  // Start loading
  Promise.all(assets.map(src => loadAsset(src).then(tick)))
    .catch(() => {
      // if something fails, still hide after a timeout
      setTimeout(hideLoader, 1500);
    });

  // Fallback: max waiting time so loader never hangs
  setTimeout(hideLoader, 10000);
})();

scoreboard()
}, 5000)



// // SCOREBOARD
function scoreboard() {
  const STORAGE_KEY = 'beasteskits_scoreboard_v1';
  const container = document.getElementById('scoreboardContent');
  if (!container) return console.warn('Scoreboard: container #scoreboardContent not found.');

  let players = []; // { id, name, wins }

  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(players)); }
    catch (e) { console.warn('Scoreboard save failed', e); }
  };
  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      players = raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Scoreboard load failed', e);
      players = [];
    }
  };
  const uid = () => 'p_' + Math.random().toString(36).slice(2, 9);

  const computeRanks = (list) => {
    const sorted = [...list].sort((a, b) => b.wins - a.wins);
    const ranks = {};
    let currentRank = 0;
    let prevWins = null;
    let itemsSeen = 0;
    for (const p of sorted) {
      itemsSeen++;
      if (p.wins !== prevWins) {
        currentRank = itemsSeen;
        prevWins = p.wins;
      }
      ranks[p.id] = currentRank;
    }
    return ranks;
  };

  // Create persistent controlBar once so it isn't wiped by render()
  const controlBar = document.createElement('div');
  controlBar.className = 'scoreboard-controlbar';
  controlBar.style.margin = '1rem 0';
  const input = document.createElement('input');
  input.placeholder = 'Player name';
  input.type = 'text';
  input.style.flex = '1';
  const addBtn = document.createElement('button');
    addBtn.style.backgroundColor = 'purple'
  addBtn.textContent = 'Add Player';
  addBtn.addEventListener('click', () => {
    if (input.value) { addPlayer(input.value); input.value = ''; input.focus(); }
  });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addBtn.click(); });
  controlBar.appendChild(input);
  controlBar.appendChild(addBtn);

  // insert controlBar now (or once after load)
  container.insertBefore(controlBar, container.firstChild);

  const clearContainerExceptControl = () => {
    // remove all children except the first (controlBar)
    while (container.children.length > 1) container.removeChild(container.lastChild);
  };

  const createPlayerCard = (player, rank) => {
    const card = document.createElement('div');
    card.className = 'score';

    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.flexDirection = 'column';
    left.style.gap = '0.25rem';

    const hRank = document.createElement('h1');
    hRank.textContent = `Rank: ${rank}`;
    left.appendChild(hRank);

    const hName = document.createElement('h2');
    hName.textContent = player.name;
    left.appendChild(hName);

    const hWins = document.createElement('h3');
    hWins.textContent = `Total Wins: ${player.wins}`;
    left.appendChild(hWins);

    card.appendChild(left);

    const btns = document.createElement('div');
    btns.style.display = 'flex';
    btns.style.gap = '0.5rem';
    btns.style.alignItems = 'center';

    const addBtn = document.createElement('button');
    addBtn.className = 'addWin';
    addBtn.textContent = '+ Win';
    addBtn.addEventListener('click', () => modifyWins(player.id, 1));
    btns.appendChild(addBtn);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'removeWin';
    removeBtn.textContent = '- Win';
    removeBtn.addEventListener('click', () => modifyWins(player.id, -1));
    btns.appendChild(removeBtn);

    const removePlayerBtn = document.createElement('button');
    removePlayerBtn.textContent = 'Remove Player';
    removePlayerBtn.addEventListener('click', () => removePlayer(player.id));
    btns.appendChild(removePlayerBtn);

    card.appendChild(btns);
    return card;
  };

  const render = () => {
    // preserve controlBar, clear rest
    clearContainerExceptControl();

    if (players.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'No players yet. Use addPlayer(name) to create players.';
      container.appendChild(p);
      return;
    }

    const ranks = computeRanks(players);
    const sorted = [...players].sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name));
    for (const p of sorted) {
      const card = createPlayerCard(p, ranks[p.id]);
      container.appendChild(card);
    }
  };

  const addPlayer = (name) => {
    if (!name || typeof name !== 'string') return;
    const cleanName = name.trim();
    if (!cleanName) return;
    if (players.some(pl => pl.name.toLowerCase() === cleanName.toLowerCase())) {
      console.warn('Scoreboard: Player with that name already exists.');
      return;
    }
    players.push({ id: uid(), name: cleanName, wins: 0 });
    save();
    render();
  };

  const removePlayer = (id) => {
    players = players.filter(p => p.id !== id);
    save();
    render();
  };

  const modifyWins = (id, delta) => {
    const p = players.find(x => x.id === id);
    if (!p) return;
    p.wins = Math.max(0, p.wins + Math.trunc(delta));
    save();
    render();
  };

  const setWins = (id, wins) => {
    const p = players.find(x => x.id === id);
    if (!p) return;
    p.wins = Math.max(0, Math.trunc(wins));
    save();
    render();
  };

  const reset = () => { players = []; save(); render(); };

  window.Scoreboard = {
    addPlayer, removePlayer, addWin: (id) => modifyWins(id, 1),
    removeWin: (id) => modifyWins(id, -1), modifyWins, setWins,
    getPlayers: () => JSON.parse(JSON.stringify(players)),
    reset, findByName: (name) => players.find(p => p.name.toLowerCase() === String(name).toLowerCase()) || null
  };

  load();
  render();
}

// GAMEMODE SELECTION
// ensure elements exist
// if (gamemodesScreen && gamemodeBtn) {
//   // show gamemodes
//   gamemodeBtn.addEventListener('click', () => {
//     // setDisplay(mainMenu, 'none')
//     // hide other frames
//     setDisplay(buttonScreen, 'block')
//     // hide all frames inside wrapper then show gamemodes
//     document.querySelectorAll('#button-frames .button-frame').forEach(f => setDisplay(f, 'none'))
//     setDisplay(gamemodesScreen, 'flex')
//   })

//   // quick helpers
//   const selectHighlight = (btn) => {
//     document.querySelectorAll('#gamemodes-screen button').forEach(b => {
//       b.classList.remove('gamemode-selected')
//     })
//     if (btn) btn.classList.add('gamemode-selected')
//   }

//   // default selection to Player Vs. Player
//   const pvpBtn = document.querySelector('#player-vs-player')
//   const pvcBtn = document.querySelector('#player-vs-cpu')
//   const cvcBtn = document.querySelector('#cpu-vs-cpu')
//   if (pvpBtn) selectHighlight(pvpBtn)

//   // selection handlers
//   if (pvpBtn) pvpBtn.addEventListener('click', () => {
//     selectHighlight(pvpBtn)
//     // set game mode state
//     window.GameMode = { mode: 'pvp', cpuLevel: null }
//     // close frames and return to main menu or play screen
//     setDisplay(buttonScreen, 'none')
//     setDisplay(mainMenu, 'flex')
//   })

//   if (pvcBtn) pvcBtn.addEventListener('click', () => {
//     selectHighlight(pvcBtn)
//     // show CPU difficulty prompt
//     document.querySelectorAll('#button-frames .button-frame').forEach(f => setDisplay(f, 'none'))
//     setDisplay(cpuPrompt, 'flex')
//     // store interim mode
//     window.GameMode = { mode: 'pvc', cpuLevel: null }
//   })

//   if (cvcBtn) cvcBtn.addEventListener('click', () => {
//     selectHighlight(cvcBtn)
//     window.GameMode = { mode: 'cvc', cpuLevel: null }
//     setDisplay(buttonScreen, 'none')
//     setDisplay(mainMenu, 'flex')
//   })

//   // CPU difficulty buttons inside cpu-level-prompt
//   if (cpuPrompt) {
//     cpuPrompt.querySelectorAll('button').forEach(btn => {
//       btn.addEventListener('click', (e) => {
//         const level = e.target.textContent.trim().toLowerCase()
//         // map to internal difficulty
//         const normalized = (level.startsWith('a') && 'advanced') ||
//                            (level.startsWith('i') && 'intermediate') ||
//                            (level.startsWith('n') && 'novice') || level

//         if (!window.GameMode) window.GameMode = { mode: 'pvc', cpuLevel: normalized }
//         else window.GameMode.cpuLevel = normalized

//         // Feedback — highlight selected cpu button
//         cpuPrompt.querySelectorAll('button').forEach(b => b.classList.remove('cpu-selected'))
//         e.target.classList.add('cpu-selected')

//         // After choosing difficulty, close prompt and go back to main flow
//         setTimeout(() => {
//           setDisplay(buttonScreen, 'none')
//           setDisplay(mainMenu, 'flex')
//         }, 250) // tiny delay for visual feedback
//       })
//     })
//   }
// }


