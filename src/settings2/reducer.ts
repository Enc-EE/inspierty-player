import { Settings, SettingsActionTypes, UPDATE_WIDTH, UPDATE_HEIGHT, UPDATE_STARLAYER_NUMBEROFSTARS, UPDATE_STARLAYER_SPEED, UPDATE_STARLAYER_STARRADIUSLOWERBORDER, UPDATE_STARLAYER_STARRADIUSUPPERBORDER, ADD_STARLAYER, DELETE_STARLAYER } from "./types";

var initialState: Settings = {
    height: 0,
    width: 0,
    starLayers: {}
}

export function settingsReducer(
    state = initialState,
    action: SettingsActionTypes
): Settings {
    switch (action.type) {
        case UPDATE_WIDTH:
            return {
                ...state,
                width: action.value
            }
        case UPDATE_HEIGHT:
            return {
                ...state,
                height: action.value
            }
        case UPDATE_STARLAYER_NUMBEROFSTARS:
            return {
                ...state,
                starLayers: {
                    ...state.starLayers,
                    [action.starLayerId]: {
                        ...state.starLayers[action.starLayerId],
                        numberOfStars: action.value
                    }
                }
            }
        case UPDATE_STARLAYER_SPEED:
            return {
                ...state,
                starLayers: {
                    ...state.starLayers,
                    [action.starLayerId]: {
                        ...state.starLayers[action.starLayerId],
                        speed: action.value
                    }
                }
            }
        case UPDATE_STARLAYER_STARRADIUSLOWERBORDER:
            return {
                ...state,
                starLayers: {
                    ...state.starLayers,
                    [action.starLayerId]: {
                        ...state.starLayers[action.starLayerId],
                        starRadiusLowerBorder: action.value
                    }
                }
            }
        case UPDATE_STARLAYER_STARRADIUSUPPERBORDER:
            return {
                ...state,
                starLayers: {
                    ...state.starLayers,
                    [action.starLayerId]: {
                        ...state.starLayers[action.starLayerId],
                        starRadiusUpperBorder: action.value
                    }
                }
            }
        case ADD_STARLAYER:
            return {
                ...state,
                starLayers: {
                    ...state.starLayers,
                    [action.starLayerId]: action.starLayer
                }
            }
        case DELETE_STARLAYER:
            const { [action.starLayerId]: _, ...starLayers } = state.starLayers;
            return {
                ...state,
                starLayers
            }
        default:
            return state
    }
}