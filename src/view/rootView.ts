import { LayoutView } from "../../enc/src/ui/layoutControls/layoutView";
import { Rectangle } from "../../enc/src/geometry/rectangle";
import { StarLayerDrawer } from "./starLayerDrawer";
import { SettingsOverlayView } from "./overlay/settingsOverlayView";
import { App } from "../app";
import { StarLayerAnimator } from "./starLayerAnimator";
import { EAnimation } from "../../enc/src/eAnimation";
import { SettingOperation } from "../settings/settingOperation";
import { Dinject } from "../../enc/src/dinject";
import { PlayerControlsView } from "./playerControlsView";
import { MainView } from "./mainView";
import { AssetManager } from "../../enc/src/assetManager";
import { EImage } from "../../enc/src/ui/controls/image";
import { ImageScalingMode } from "../../enc/src/ui/controls/imageScalingMode";

export class RootView extends LayoutView {
    private starLayers: StarLayerDrawer[] = [];
    private starAnimators: StarLayerAnimator[] = [];

    private animation: EAnimation;

    constructor() {
        super();

        this.animation = Dinject.getInstance("animation");
        this.animation.lowPerformance.addEventListener(this.onLowPerformance);
        App.settingManager.update.addEventListener(this.appSettingsUpdated);

        this.loadBackground();

        var front = new MainView();
        this.children.push(front);

        var playerView = new PlayerControlsView();
        this.children.push(playerView);

        var settingsOverlay = new SettingsOverlayView();
        this.children.push(settingsOverlay);

        this.triggerUpdateLayout();
    }

    private onLowPerformance = () => {
        for (const starLayer of this.starLayers) {
            App.settingManager.changeNumberOfStars(starLayer.starLayer, Math.round(starLayer.starLayer.stars.length * 0.9));
        }
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
                this.children.splice(1, 0, layer);
                this.triggerUpdateLayout();

                var animator = new StarLayerAnimator(starLayer);
                this.animation.addUpdateFunction(animator.update);
                this.starAnimators.push(animator);
                break;
            }
        }
    }

    public removeStarLayer = () => {
        for (const starLayerDraws of this.starLayers) {
            if (App.settings.starLayers.firstOrDefault(x => x == starLayerDraws.starLayer) == null) {
                var animator = this.starAnimators.first(x => x.starLayer == starLayerDraws.starLayer);
                this.animation.removeUpdateFunction(animator.update);
                this.starAnimators.removeItem(animator);

                this.children.remove(x => x == starLayerDraws);
                this.starLayers.remove(x => x == starLayerDraws);
                this.triggerUpdateLayout();
            }
        }
    }

    private loadBackground() {
        var assetManager = Dinject.getInstance("assets") as AssetManager;
        var background = assetManager.getImage("background");
        var backgroundImage = new EImage(background);
        backgroundImage.disableMouseEvents();
        backgroundImage.properties.imageScalingMode = ImageScalingMode.FitAndOverfill;
        this.children.push(backgroundImage);
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        super.updateLayout(ctx, bounds);
        for (const child of this.children) {
            child.updateLayout(ctx, bounds);
        }
    }
}