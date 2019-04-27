import { LayoutView } from "../enc/src/ui/layoutControls/layoutView";
import { Rectangle } from "../enc/src/geometry/rectangle";
import { QuickDrawView } from "../enc/src/ui/quickDrawView";
import { StarLayerDrawer } from "./starLayerDrawer";
import { SettingsOverlayView } from "./overlay/settingsOverlayView";
import { StarLayer } from "./models/starLayer";
import { App } from "./app";
import { StarLayerAnimator } from "./starLayerAnimator";
import { EAnimation } from "../enc/src/eAnimation";

export class InspiertyPlayerView extends LayoutView {
    private starLayers: StarLayerDrawer[] = [];
    private starAnimators: StarLayerAnimator[] = [];
    private settingsOverlay: SettingsOverlayView;
    anim: EAnimation;

    constructor() {
        super();

        this.settingsOverlay = new SettingsOverlayView();
        this.children.push(this.settingsOverlay);
        this.anim = new EAnimation();
        App.settings.onAddStarLayer.addEventListener(this.addStarLayer);
        App.settings.onRemoveStarLayer.addEventListener(this.removeStarLayer);
    }

    public addStarLayer = (starLayer: StarLayer) => {
        var layer = new StarLayerDrawer(starLayer);
        this.starLayers.push(layer);
        this.children.splice(0, 0, layer);
        this.triggerUpdateLayout();

        var animator = new StarLayerAnimator(starLayer);
        this.anim.addUpdateFunction(animator.update);
        this.starAnimators.push(animator);
    }

    public removeStarLayer = (starLayer: StarLayer) => {
        var layer = this.starLayers.first(x => x.starLayer == starLayer);
        this.children.remove(x => x == layer);
        this.starLayers.remove(x => x == layer);

        var animator = this.starAnimators.first(x => x.starLayer == starLayer);
        this.anim.removeUpdateFunction(animator.update);
        this.starAnimators.removeItem(animator);

        this.triggerUpdateLayout();
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        for (const layer of this.starLayers) {
            layer.updateLayout(ctx, bounds);
        }
        this.settingsOverlay.updateLayout(ctx, bounds);
    }
}