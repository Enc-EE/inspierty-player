import { RenderObject } from "../enc/src/ui/renderObject";
import { LayoutView } from "../enc/src/ui/layoutControls/layoutView";
import { StarRenderObject } from "./starRenderObject";
import { Rectangle } from "../enc/src/geometry/rectangle";
import { StarLayer } from "./models/starLayer";

export class StarLayerDrawer extends LayoutView {
    constructor(public starLayer: StarLayer) {
        super();
        this.triggerUpdateLayout();
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        for (const star of this.starLayer.stars) {
            this.children.push(new StarRenderObject(star));
        }
    }


    public mouseMove(ev: MouseEvent) {
    }

    public click(ev: MouseEvent) {
    }
}