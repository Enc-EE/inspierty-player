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

export const UPDATE_WIDTH = 'UPDATE_WIDTH'
interface UpdateWidthAction {
    type: typeof UPDATE_WIDTH
    value: number
}

export const UPDATE_HEIGHT = 'UPDATE_HEIGHT'
interface UpdateHeightAction {
    type: typeof UPDATE_HEIGHT
    value: number
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
    UpdateWidthAction
    | UpdateHeightAction
    | UpdateStarLayerNumberOfStarsAction
    | UpdateStarLayerSpeedAction
    | UpdateStarLayerStarRadiusLowerBorderAction
    | UpdateStarLayerStarRadiusUpperBorderAction
    | AddStarLayerAction
    | DeleteStarLayerAction

export function UpdateWidth(value: number): SettingsActionTypes {
    return {
        type: UPDATE_WIDTH,
        value
    }
}

export function UpdateHeight(value: number): SettingsActionTypes {
    return {
        type: UPDATE_HEIGHT,
        value
    }
}

export function UpdateStarLayerNumberOfStars(starLayerId: string, value: number): SettingsActionTypes {
    return {
        type: UPDATE_STARLAYER_NUMBEROFSTARS,
        starLayerId,
        value
    }
}

export function UpdateStarLayerSpeed(starLayerId: string, value: number): SettingsActionTypes {
    return {
        type: UPDATE_STARLAYER_SPEED,
        starLayerId,
        value
    }
}

export function UpdateStarLayerStarRadiusLowerBorder(starLayerId: string, value: number): SettingsActionTypes {
    return {
        type: UPDATE_STARLAYER_STARRADIUSLOWERBORDER,
        starLayerId,
        value
    }
}

export function UpdateStarLayerStarRadiusUpperBorder(starLayerId: string, value: number): SettingsActionTypes {
    return {
        type: UPDATE_STARLAYER_STARRADIUSUPPERBORDER,
        starLayerId,
        value
    }
}

export function AddStarLayer(starLayerId: string, starLayer: StarLayer): SettingsActionTypes {
    return {
        type: ADD_STARLAYER,
        starLayerId,
        starLayer
    }
}

export function DeleteStarLayer(starLayerId: string): SettingsActionTypes {
    return {
        type: DELETE_STARLAYER,
        starLayerId
    }
}
