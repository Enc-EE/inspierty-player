import { LayoutView } from "../../enc/src/ui/layoutControls/layoutView";
import { Label } from "../../enc/src/ui/controls/label";
import { Rectangle } from "../../enc/src/geometry/rectangle";

export class LoadingView extends LayoutView {
    constructor() {
        super();
        var loadingLabel = new Label();
        loadingLabel.text = "Loading...";
        loadingLabel.properties.fillStyle = "white"
        this.children.push(loadingLabel);
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle) {
        super.updateLayout(ctx, bounds);
        for (const child of this.children) {
            child.updateLayout(ctx, this.bounds);
        }
    }
}