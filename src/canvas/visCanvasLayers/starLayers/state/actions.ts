import { StarLayerSettings } from "./types"

export const UPDATESTARLAYERSETTINGS = 'UPDATESTARLAYERSETTINGS'
interface UpdateStarLayerSettingsAction {
    type: typeof UPDATESTARLAYERSETTINGS
    settings: StarLayerSettings
}

export type StarLayersSettingsActionTypes =
    UpdateStarLayerSettingsAction

export function updateUpdateStarLayerSettings(settings: StarLayerSettings): UpdateStarLayerSettingsAction {
    return {
        type: UPDATESTARLAYERSETTINGS,
        settings
    }
}