import { Store, AnyAction } from "redux"
import { AppState } from "../../globals"

export interface ViewLayer {
    update: (timeDiff: number) => void
    draw: (ctx: CanvasRenderingContext2D) => void
}

export abstract class ViewLayerBase implements ViewLayer {
    constructor(protected store: Store<AppState, AnyAction>) { }

    public initialize = (): ViewLayer => {
        this.store.subscribe(() => this.updateProperties(this.store.getState()))
        return this
    }

    public abstract updateProperties: (state: AppState) => void
    public abstract update: (timeDiff: number) => void
    public abstract draw: (ctx: CanvasRenderingContext2D) => void
}

export abstract class AngledViewLayerBase extends ViewLayerBase {
    constructor(protected store: Store<AppState, AnyAction>, public angle: number) {
        super(store)
    }
}