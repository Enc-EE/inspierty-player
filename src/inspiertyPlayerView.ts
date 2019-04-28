import { LayoutView } from "../enc/src/ui/layoutControls/layoutView";
import { Rectangle } from "../enc/src/geometry/rectangle";
import { QuickDrawView } from "../enc/src/ui/quickDrawView";
import { StarLayerDrawer } from "./starLayerDrawer";
import { SettingsOverlayView } from "./overlay/settingsOverlayView";
import { StarLayer } from "./models/starLayer";
import { App } from "./app";
import { StarLayerAnimator } from "./starLayerAnimator";
import { EAnimation } from "../enc/src/eAnimation";
import { SettingOperation } from "./settings/settingOperation";

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
        App.settingManager.update.addEventListener(this.appSettingsUpdated);
    }

    private appSettingsUpdated = (operation: SettingOperation) => {
        switch (operation) {
            case SettingOperation.AddStarLayer:
                this.addStarLayer();
                break;
            case SettingOperation.RemoveStarLayer:
                this.removeStarLayer();
                break;
        }
    }

    public addStarLayer = () => {
        for (const starLayer of App.settings.starLayers) {
            if (this.starLayers.firstOrDefault(x => x.starLayer == starLayer) == null) {
                var layer = new StarLayerDrawer(starLayer);
                this.starLayers.push(layer);
                this.children.splice(0, 0, layer);
                this.triggerUpdateLayout();

                var animator = new StarLayerAnimator(starLayer);
                this.anim.addUpdateFunction(animator.update);
                this.starAnimators.push(animator);
                break;
            }
        }
    }

    public removeStarLayer = () => {
        for (const starLayer of App.settings.starLayers) {
            if (this.starLayers.firstOrDefault(x => x.starLayer == starLayer) == null) {
                var layer = this.starLayers.first(x => x.starLayer == starLayer);
                this.children.remove(x => x == layer);
                this.starLayers.remove(x => x == layer);
                this.triggerUpdateLayout();

                var animator = this.starAnimators.first(x => x.starLayer == starLayer);
                this.anim.removeUpdateFunction(animator.update);
                this.starAnimators.removeItem(animator);
            }
        }
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        for (const layer of this.starLayers) {
            layer.updateLayout(ctx, bounds);
        }
        this.settingsOverlay.updateLayout(ctx, bounds);
    }
}