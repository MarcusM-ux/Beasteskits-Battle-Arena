let selectedMap = ''
let mapImage = null;

const creaturebattleframe = document.querySelector('#creature-battle-frame')

function setSelectedMap(url) {
  if (!url) return;
  mapImage = new Image();
  mapImage.src = url;
  creaturebattleframe.style.backgroundImage = `url('${selectedMap}')`;
}

const mapImgIcon = document.querySelector('#map-ds-image')

// ALL MAPS
const mapSelectedHeading = id('map-selected-heading')
const maps = {
    "Random Map": {
        image: returnMap('random_map')
    },
    "Grassy Medows" : {
        image: returnMap('grassy_medows')
    },
    Celestial : {
        image: returnMap('celestial')
    },
    "Cracked Earth" : {
         image: returnMap('cracked_earth')   
    },
    "Ice Castle" : {
         image: returnMap('ice_castle')   
    },
    "Deep Waters" : {
         image: returnMap('deep_waters')   
    },
    "Mountain Tops Peak" : {
         image: returnMap('mountain_tops')   
    },
    "Classy Forest" : {
         image: returnMap('classy_forest')   
    },
    "Candy Monster Island" : {
         image: returnMap('candy_monster_island')   
    },
    "Battlefield Skyland" : {
         image: returnMap('battlefield_skyland')   
    },
    "Stadium" : {
        image: returnMap('stadium')
    },
    "Skeleton\'s Lava Lake" : {
        image: returnMap("Skeleton_s Lava Lake")
    },
    "Luxary Mines" : {
        image: returnMap("mines")
    },
    // "White Residence" : {
    //     image: returnMap("whiteroom")
    // },
    // "Night Room Security" : {
    //     image: returnMap("nightroom")
    // }
}


const mapCatalog = id('map-catalog')
const allMapButtons = []

for (const [name, data] of Object.entries(maps)){
    const div = document.createElement('div')
    const h2 = document.createElement('h2')
    const button = document.createElement('button')
    const img = document.createElement('img')


    div.classList.add('map-display')
    div.appendChild(h2)
    div.appendChild(button)
    div.appendChild(img)
   
    img.src = data.image
    h2.textContent = name
    button.textContent = 'Select'


    img.width = '300'
    img.height = '300'


    mapCatalog.appendChild(div)

    allMapButtons.push(button)

    button.addEventListener('click', () => {
        allMapButtons.forEach(button => {
            button.style.color = 'black'
        })
        selectedMap = ''
        button.style.color = 'green'
        
        if (name == 'Random Map') {
            const allMaps = Object.keys(maps)
            const mapObjects = allMaps.filter(item => item !== "Random Map")
            const randomMap = mapObjects[Math.floor(Math.random() * mapObjects.length)]
            const map = maps[randomMap]
            selectedMap = map
            
            selectedMap = map.image
            mapImgIcon.src = map.image
            setSelectedMap(selectedMap)
        }else {
            selectedMap = img.src
            setSelectedMap(selectedMap);
            mapImgIcon.src = selectedMap
        }
        readyToBattle()
        
        mapSelectedHeading.textContent = `Map Selected: ${name}`
        mapSelectedHeading.style.color = 'green'
    })
}