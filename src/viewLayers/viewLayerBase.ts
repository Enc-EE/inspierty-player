import { Store, AnyAction } from "redux"
import { AppState } from "../globals"

export interface ViewLayer {
    draw: (ctx: CanvasRenderingContext2D) => void
}

export abstract class ViewLayerBase implements ViewLayer {
    constructor(protected store: Store<AppState, AnyAction>) { }

    public initialize = (): ViewLayer => {
        this.store.subscribe(() => this.update(this.store.getState()))
        return this
    }

    abstract update: (state: AppState) => void
    abstract draw: (ctx: CanvasRenderingContext2D) => void
}