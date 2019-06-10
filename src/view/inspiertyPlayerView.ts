import { LayoutView } from "../../enc/src/ui/layoutControls/layoutView";
import { Rectangle } from "../../enc/src/geometry/rectangle";
import { StarLayerDrawer } from "./starLayerDrawer";
import { SettingsOverlayView } from "./overlay/settingsOverlayView";
import { App } from "../app";
import { StarLayerAnimator } from "./starLayerAnimator";
import { EAnimation } from "../../enc/src/eAnimation";
import { SettingOperation } from "../settings/settingOperation";
import { Dinject } from "../../enc/src/dinject";
import { PlayerView } from "./playerView";
import { BackgroundImageView } from "./backgroundImageView";
import { FrontView } from "./frontView";
import { LoadingView } from "./loadingView";

export class InspiertyPlayerView extends LayoutView {
    private starLayers: StarLayerDrawer[] = [];
    private starAnimators: StarLayerAnimator[] = [];

    private animation: EAnimation;

    private loadingView: LoadingView;

    constructor() {
        super();

        this.animation = Dinject.getInstance("animation");

        this.loadingView = new LoadingView();
        this.children.push(this.loadingView);
    }

    public start = () => {
        this.children.removeItem(this.loadingView);
        var background = new BackgroundImageView();
        this.children.push(background);
        background.activate();
        (document as any).testit = background;
        this.children.push(new PlayerView());
        var front = new FrontView();
        this.children.push(front);
        front.activate();
        this.children.push(new SettingsOverlayView());
        App.settingManager.update.addEventListener(this.appSettingsUpdated);
        this.triggerUpdateLayout();
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

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        super.updateLayout(ctx, bounds);
        for (const child of this.children) {
            child.updateLayout(ctx, bounds);
        }
    }
}