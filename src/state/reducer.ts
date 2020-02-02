import { Settings } from "./types"
import { SettingsActionTypes, SET_SETTINGS, RESIZE } from "./actions"

var initialState: Settings = {
    height: window.innerHeight,
    width: window.innerWidth,
    logoLayerSettings: {
        frequencyIndex: 7,
        lowerBorder: 0.4,
        upperBorder: 0.9,
    },
    shootingStarSettings: {
        audioInteractionSettings: {
            frequencyIndex: 28,
            lowerBorder: 0.6,
            upperBorder: 0.75,
            waitSecondsForNextSpawn: 0,
        },
        spawnSettings: {
            angleRandomnes: Math.PI / 2,
            distanceMin: 1,
            distanceMax: 3,
            sizeMin: 3.5,
            sizeMax: 5.5,
            flattenMinPercent: 65,
            flattenMaxPercent: 95,
            speedMin: 350,
            speedMax: 800,
        },
    },
    starLayers: {
        "stars1": {
            numberOfStars: 350,
            speed: Math.random() * 1 + 0.1,
            starRadiusLowerBorder: 0.35,
            starRadiusUpperBorder: 0.5,
        },
        "stars2": {
            numberOfStars: 350,
            speed: Math.random() * 1 + 0.1,
            starRadiusLowerBorder: 0.35,
            starRadiusUpperBorder: 0.5,
        },
        "stars3": {
            numberOfStars: 350,
            speed: Math.random() * 1 + 0.1,
            starRadiusLowerBorder: 0.35,
            starRadiusUpperBorder: 0.5,
        },
    },
}

export function settingsReducer(
    state = initialState,
    action: SettingsActionTypes
): Settings {
    switch (action.type) {
        case SET_SETTINGS:
            return action.settings
        case RESIZE:
            return {
                ...state,
                width: action.width,
                height: action.height,
            }
        default:
            return state
    }
}