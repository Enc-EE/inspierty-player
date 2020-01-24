import { AngledViewLayerBase } from "../viewLayerBase"
import { AppState } from "../../../globals"
import { StarLayerView } from "./starLayerView"

export class StarLayerManager extends AngledViewLayerBase {
    private starLayers: { [key: string]: StarLayerView } = {}

    public update = (timeDiff: number) => {
        var currentKeys = Object.keys(this.starLayers)
        for (const key of currentKeys) {
            this.starLayers[key].angle = this.angle
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
                this.starLayers[newKey].updateProperties(state, state.settings.starLayers[newKey])
                currentKeys.splice(currentKeyIndex, 1)
            } else {
                this.starLayers[newKey] = new StarLayerView(this.angle, state.settings.starLayers[newKey])
                this.starLayers[newKey].updateProperties(state, state.settings.starLayers[newKey])
            }
        }
        for (const oldKey of currentKeys) {
            delete this.starLayers[oldKey]
        }
    }
}