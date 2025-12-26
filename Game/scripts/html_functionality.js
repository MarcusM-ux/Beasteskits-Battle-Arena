const mainMenu = document.querySelector('#main-menu')

const creatureFrame = document.querySelector('#creature-frame')
const buttonScreen = document.querySelector('#button-frames')

const tutorialScreen = document.querySelector('#tutorial-screen')
const creditScreen = document.querySelector('#credit-screen')
const attacksCatalog = document.querySelector('#attacksCatalog')

const wrappers = [creatureFrame, buttonScreen]

const menuLinks = [
    {button: document.querySelector('#menu-button-selection'), screen: creatureFrame, display: 'flex'},
    {button: document.querySelector('#menu-button-tutorial'), screen: tutorialScreen, wrapper: buttonScreen, display: 'block'},
    {button: document.querySelector('#menu-button-credits'), screen: creditScreen, wrapper: buttonScreen, display: 'block'},
]

menuLinks.forEach(link => {
    if (link.button) {
        link.button.addEventListener('click', () => {
            mainMenu.style.display = 'none'
            const allScreens = [tutorialScreen, creditScreen, creatureFrame]
            allScreens.forEach(s => {
                if (s) s.style.display = 'none'
            })
            
            link.screen.style.display = link.display
            if (link.wrapper) {
                link.wrapper.style.display = 'block'
            }
        })
    }
})

const allExitButtons = document.querySelectorAll('.home-screen-button')
allExitButtons.forEach(button => {
    button.addEventListener('click', ()=>{
        mainMenu.style.display = 'flex'

        buttonScreen.style.display = 'none'
        creatureFrame.style.display = 'none'
    })
})


const csToggles = {
    typechart: {
        button: document.querySelector('#toggleTypeChart'),
        screen: document.querySelector('#typeChartDisplay'),
        toggle: false,
        name: 'Type Chart'
    },
    beasteskit: {
        button: document.querySelector('#toggleBeastStatus'),
        screen: document.querySelector('#beasteskitStatusDisplay'),
        toggle: false,
        name: 'Beasteskit Status'
    },
    attacks : {
        button: document.querySelector('#toggleattacksCatalog'),
        screen: document.querySelector('#attacksCatalog'),
        toggle: false,
        name: 'Attacks Description'
    }
}

Object.entries(csToggles).forEach(([key, data]) => {
    data.button.addEventListener('click', () => {
        if (!data.toggle) {
            data.toggle = true
            data.screen.style.display = 'flex'
            data.button.textContent = `Close ${data.name}`

            Object.entries(csToggles).forEach(([otherKey, otherData]) => {
                if (key !== otherKey) {
                    otherData.toggle = false
                    otherData.screen.style.display = 'none'
                    otherData.button.textContent = `Open ${otherData.name}`
                }
            })

            document.querySelectorAll('.home-screen-button').forEach(btn => {
                btn.style.display = 'none'
            })
        } else {
            data.toggle = false
            data.screen.style.display = 'none'
            data.button.textContent = `Open ${data.name}`
            document.querySelectorAll('.home-screen-button').forEach(btn => {
                btn.style.display = 'block'
            })
        }
    })
})    