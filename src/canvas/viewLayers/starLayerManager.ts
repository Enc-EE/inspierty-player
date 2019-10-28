import { ViewLayerBase } from "./viewLayerBase"
import { AppState } from "../../globals"
import { StarLayerView } from "./starLayer"

export class StarLayerManager extends ViewLayerBase {
    private starLayers: { [key: string]: StarLayerView } = {}

    public update = (timeDiff: number) => {
        var currentKeys = Object.keys(this.starLayers)
        for (const key of currentKeys) {
            this.starLayers[key].update(timeDiff)
        }
    }

    public draw = (ctx: CanvasRenderingContext2D) => {
        var currentKeys = Object.keys(this.starLayers)
        for (const key of currentKeys) {
            this.starLayers[key].draw(ctx)
        }
    }

    public updateProperties = (state: AppState) => {
        var currentKeys = Object.keys(this.starLayers)
        var newKeys = Object.keys(state.settings.starLayers)

        for (const newKey of newKeys) {
            var currentKeyIndex = currentKeys.indexOf(newKey)
            if (currentKeyIndex >= 0) {
                this.starLayers[newKey].updateProperties({
                    height: state.settings.height,
                    starLayer: state.settings.starLayers[newKey],
                    width: state.settings.width
                })
                currentKeys.splice(currentKeyIndex, 1)
            } else {
                this.starLayers[newKey] = new StarLayerView()
                this.starLayers[newKey].updateProperties({
                    height: state.settings.height,
                    starLayer: state.settings.starLayers[newKey],
                    width: state.settings.width
                })
            }
        }
        for (const oldKey of currentKeys) {
            delete this.starLayers[oldKey]
        }
    }
}