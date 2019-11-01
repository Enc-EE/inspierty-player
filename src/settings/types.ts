export interface Settings {
    width: number
    height: number
    starLayers: { [key: string]: StarLayer }
}

export interface StarLayer {
    numberOfStars: number
    speed: number
    starRadiusLowerBorder: number
    starRadiusUpperBorder: number
}

export const RESIZE = 'RESIZE'
interface ResizeAction {
    type: typeof RESIZE
    width: number
    height: number
}

export const UPDATE_STARLAYER_NUMBEROFSTARS = 'UPDATE_STARLAYER_NUMBEROFSTARS'
interface UpdateStarLayerNumberOfStarsAction {
    type: typeof UPDATE_STARLAYER_NUMBEROFSTARS
    starLayerId: string
    value: number
}

export const UPDATE_STARLAYER_SPEED = 'UPDATE_STARLAYER_SPEED'
interface UpdateStarLayerSpeedAction {
    type: typeof UPDATE_STARLAYER_SPEED
    starLayerId: string
    value: number
}

export const UPDATE_STARLAYER_STARRADIUSLOWERBORDER = 'UPDATE_STARLAYER_STARRADIUSLOWERBORDER'
interface UpdateStarLayerStarRadiusLowerBorderAction {
    type: typeof UPDATE_STARLAYER_STARRADIUSLOWERBORDER
    starLayerId: string
    value: number
}

export const UPDATE_STARLAYER_STARRADIUSUPPERBORDER = 'UPDATE_STARLAYER_STARRADIUSUPPERBORDER'
interface UpdateStarLayerStarRadiusUpperBorderAction {
    type: typeof UPDATE_STARLAYER_STARRADIUSUPPERBORDER
    starLayerId: string
    value: number
}

export const ADD_STARLAYER = 'ADD_STARLAYER'
interface AddStarLayerAction {
    type: typeof ADD_STARLAYER
    starLayerId: string
    starLayer: StarLayer
}

export const DELETE_STARLAYER = 'DELETE_STARLAYER'
interface DeleteStarLayerAction {
    type: typeof DELETE_STARLAYER
    starLayerId: string
}

export type SettingsActionTypes =
    ResizeAction
    | UpdateStarLayerNumberOfStarsAction
    | UpdateStarLayerSpeedAction
    | UpdateStarLayerStarRadiusLowerBorderAction
    | UpdateStarLayerStarRadiusUpperBorderAction
    | AddStarLayerAction
    | DeleteStarLayerAction

export function resize(width: number, height: number): SettingsActionTypes {
    return {
        type: RESIZE,
        width: width,
        height: height,
    }
}

export function updateStarLayerNumberOfStars(starLayerId: string, value: number): SettingsActionTypes {
    return {
        type: UPDATE_STARLAYER_NUMBEROFSTARS,
        starLayerId,
        value
    }
}

export function updateStarLayerSpeed(starLayerId: string, value: number): SettingsActionTypes {
    return {
        type: UPDATE_STARLAYER_SPEED,
        starLayerId,
        value
    }
}

export function updateStarLayerStarRadiusLowerBorder(starLayerId: string, value: number): SettingsActionTypes {
    return {
        type: UPDATE_STARLAYER_STARRADIUSLOWERBORDER,
        starLayerId,
        value
    }
}

export function updateStarLayerStarRadiusUpperBorder(starLayerId: string, value: number): SettingsActionTypes {
    return {
        type: UPDATE_STARLAYER_STARRADIUSUPPERBORDER,
        starLayerId,
        value
    }
}

export function addStarLayer(starLayerId: string, starLayer: StarLayer): SettingsActionTypes {
    return {
        type: ADD_STARLAYER,
        starLayerId,
        starLayer
    }
}

export function deleteStarLayer(starLayerId: string): SettingsActionTypes {
    return {
        type: DELETE_STARLAYER,
        starLayerId
    }
}
