import { Settings } from "./types"

export const SET_SETTINGS = 'SET_SETTINGS'
interface SetSettingsAction {
    type: typeof SET_SETTINGS
    settings: Settings
}

export const RESIZE = 'RESIZE'
interface ResizeAction {
    type: typeof RESIZE
    width: number
    height: number
}

export type SettingsActionTypes = SetSettingsAction | ResizeAction

export function setSettings(settings: Settings): SettingsActionTypes {
    return {
        type: SET_SETTINGS,
        settings,
    }
}

export function resize(width: number, height: number): SettingsActionTypes {
    return {
        type: RESIZE,
        width: width,
        height: height,
    }
}