import { ViewLayerBase } from "./viewLayerBase"
import { Store, AnyAction } from "redux"
import { AppState } from "../globals"

export class StarLayer extends ViewLayerBase {
    update = (state: AppState) => {
    }

    draw = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = "white"
        ctx.fillRect(100, 200, 300, 400)
        ctx.fillText("HALLO", 500, 600)
    }
}