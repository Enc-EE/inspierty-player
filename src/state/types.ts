import { ShootingStarSettings } from "../canvas/visCanvasLayers/shootingStars/state/types"
import { LogoLayerSettings } from "../canvas/visCanvasLayers/logoLayer/state/types"
import { StarLayerSettings } from "../canvas/visCanvasLayers/starLayers/state/types"

export interface Settings {
    width: number
    height: number
    starLayers: { [key: string]: StarLayerSettings }
    shootingStarSettings: ShootingStarSettings
    logoLayerSettings: LogoLayerSettings
}
