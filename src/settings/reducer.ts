import { Settings, SettingsActionTypes, UPDATE_STARLAYER_NUMBEROFSTARS, UPDATE_STARLAYER_SPEED, UPDATE_STARLAYER_STARRADIUSLOWERBORDER, UPDATE_STARLAYER_STARRADIUSUPPERBORDER, ADD_STARLAYER, DELETE_STARLAYER, RESIZE } from "./types";

var initialState: Settings = {
    height: window.innerHeight,
    width: window.innerWidth,
    starLayers: {}
}

export function settingsReducer(
    state = initialState,
    action: SettingsActionTypes
): Settings {
    switch (action.type) {
        case RESIZE:
            return {
                ...state,
                width: action.width,
                height: action.height,
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