import { LayoutView } from "../../enc/src/ui/layoutControls/layoutView";
import { Dinject } from "../../enc/src/dinject";
import { AssetManager } from "../../enc/src/assetManager";
import { EImage } from "../../enc/src/ui/controls/image";
import { Rectangle } from "../../enc/src/geometry/rectangle";
import { ImageScalingMode } from "../../enc/src/ui/controls/imageScalingMode";

export class BackgroundImageView extends LayoutView {
    constructor() {
        super();
        var assetManager = Dinject.getInstance("assets") as AssetManager;
        var background = assetManager.getImage("background");

        var image = new EImage(background)
        image.disableMouseMove();
        image.properties.imageScalingMode = ImageScalingMode.FitAndOverfill;
        this.children.push(image);
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        super.updateLayout(ctx, bounds);
        for (const child of this.children) {
            child.updateLayout(ctx, bounds);
        }
    }
}