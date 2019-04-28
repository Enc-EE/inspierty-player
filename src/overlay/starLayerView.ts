import { LayoutView } from "../../enc/src/ui/layoutControls/layoutView";
import { Rectangle } from "../../enc/src/geometry/rectangle";
import { StarLayer } from "../models/starLayer";

export class StarLayerView extends LayoutView {
    constructor(private starLayer: StarLayer) {
        super();
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
    }
}