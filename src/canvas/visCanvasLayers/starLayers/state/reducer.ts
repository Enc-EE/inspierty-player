import { StarLayerSettings } from "./types"
import { UPDATESTARLAYERSETTINGS, StarLayersSettingsActionTypes } from "./actions"

var initialState: StarLayerSettings = {
    numberOfStars: 10,
    speed: 1,
    starRadiusLowerBorder: 0.35, 
    starRadiusUpperBorder: 0.6
}

export function shootingStarsSettingsReducer(
    state = initialState,
    action: StarLayersSettingsActionTypes
): StarLayerSettings {
    switch (action.type) {
        case UPDATESTARLAYERSETTINGS:
            return {
                ...action.settings,
            }
        default:
            return state
    }
}