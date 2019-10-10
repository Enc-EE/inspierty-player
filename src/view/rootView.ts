import { LayoutView } from "../../enc/src/ui/layoutControls/layoutView";
import { Rectangle } from "../../enc/src/geometry/rectangle";
import { SettingsView } from "../settings/view/settingsView";
import { EAnimation } from "../../enc/src/eAnimation";
import { Dinject } from "../../enc/src/dinject";
import { PlayerControlsView } from "./playerControlsView";
import { MainView } from "./mainView";
import { AssetManager } from "../../enc/src/assetManager";
import { EImage } from "../../enc/src/ui/controls/image";
import { ImageScalingMode } from "../../enc/src/ui/controls/imageScalingMode";
import { StarLayerManagerView } from "./starLayers/starLayerManagerView";
import { App } from "../app";
import { ShootingStarManager as ShootingStarManagerView } from "./shootingStars.ts/shootingStarManagerView";
import { FpsView } from "../../enc/src/ui/fpsView";
import { HorizontalAlignementOption } from "../../enc/src/ui/alignement/horizontalAlignementOption";

export class RootView extends LayoutView {
    private animation: EAnimation;

    constructor() {
        super();

        this.animation = Dinject.getInstance("animation");
        this.animation.lowPerformance.addEventListener(this.onLowPerformance);
        // App.settingManager.update.addEventListener(this.appSettingsUpdated);

        this.loadBackground();

        var starLayerManagerView = new StarLayerManagerView();
        this.children.push(starLayerManagerView);

        var shootingStarManagerView = new ShootingStarManagerView();
        this.children.push(shootingStarManagerView);

        var front = new MainView();
        this.children.push(front);

        var playerView = new PlayerControlsView();
        this.children.push(playerView);

        var settingsOverlay = new SettingsView();
        this.children.push(settingsOverlay);

        if (process.env.NODE_ENV !== 'production') {
            var fpsView = new FpsView(this.animation)
            fpsView.bounds = new Rectangle(0, 0, window.innerWidth, window.innerHeight);
            fpsView.alignement.horizontalAlign = HorizontalAlignementOption.Right;
            this.children.push(fpsView);
        }

        this.triggerUpdateLayout();
    }

    private onLowPerformance = () => {
        // for (const starLayer of App.visualizationModel.starLayers.items) {
        //     starLayer.numberOfStars.set(starLayer.numberOfStars.get() * 0.9);
        // }
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