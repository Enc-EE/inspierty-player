import { experienceLoad } from "./loading/experienceLoad"
import { Globals, rootReducer } from "./globals"
import { createStore } from "redux"
import { AudioManager } from "./audio/audioManager"
import { AssetManager } from "../enc/src/assetManager"
import * as backgroundPng from "./assets/background.png"
import * as logoFrontPng from "./assets/logo-front.png"
import * as logoNovaPng from "./assets/logo-nova.png"
import ReactDOM = require("react-dom")
import { Provider } from "react-redux"
import React = require("react")
import { App } from "./app"
import "../enc/src/extensions"
import { resize } from "./settings2/types"

document.addEventListener('DOMContentLoaded', main, false)

function main() {
    // todo
    // - change direction
    // - sparkle effect
    // - shooting stars -> smaller and stuff

    console.log("loading app")
    experienceLoad([
        {
            name: "store",
            func: async () => {
                Globals.store = createStore(rootReducer)
            },
        },
        {
            dependentItemNames: ["store"],
            name: "audioManager",
            func: async () => {
                var audioManager = new AudioManager(Globals.store)
                await audioManager.reload()
                Globals.audioManager = audioManager
            },
        },
        {
            name: "assets",
            func: async () => {
                var assetManager = new AssetManager()
                assetManager.addImage("background", backgroundPng)
                assetManager.addImage("logo", logoFrontPng)
                assetManager.addImage("logo-nova", logoNovaPng)
                await assetManager.load()
                Globals.assetManager = assetManager
            },
        },
        {
            dependentItemNames: ["store", "audioManager", "assets"],
            name: "events",
            func: async () => {
                console.log("resizes in");
                window.addEventListener("resize", (x: UIEvent) => {
                    Globals.store.dispatch(resize(window.innerWidth, window.innerHeight))
                })
            },
        },
        {
            dependentItemNames: ["store", "audioManager", "assets", "events"],
            name: "init",
            func: async () => {
                ReactDOM.render(<Provider store={Globals.store}> <App /></Provider >, document.getElementById('root'))
            },
        },
    ])
}

if (process.env.NODE_ENV === 'production') {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js')
                .then(registration => {
                    console.log('SW registered: ', registration)
                }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError)
                })
        })
    }
}
