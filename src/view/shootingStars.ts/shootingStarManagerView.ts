import { LayoutView } from "../../../enc/src/ui/layoutControls/layoutView";
import { ShootingStarView } from "./shootingStarView";
import { App } from "../../app";
import { Dinject } from "../../../enc/src/dinject";
import { AudioManager } from "../../audioManager";
import { AudioGraphNodeAnalyser } from "../../../enc/src/audio/audioGraphNodeAnalyser";
import { EAnimation } from "../../../enc/src/eAnimation";

export class ShootingStarManager extends LayoutView {
    private shootingStarViews: ShootingStarView[] = [];
    analyser: AudioGraphNodeAnalyser;
    animation: EAnimation;
    waitSecondsForNextSpawn: number = 0;

    constructor() {
        super();
        this.disableMouseEvents();

        var audioManager = Dinject.getInstance("audio") as AudioManager;
        this.analyser = audioManager.getAnalyser();


        this.animation = Dinject.getInstance("animation") as EAnimation;
        this.animation.addUpdateFunction(this.update);
    }

    update = (timeDiff: number) => {
        var limit = 5;
        if (this.shootingStarViews.length <= limit && this.waitSecondsForNextSpawn <= 0) {
            var data = this.analyser.getSpectrum();
            var relDataValue = this.calculateRelDataValue(data[this.frequencyIndex]);
            if (Math.random() * relDataValue > 0.2) {
                var angle = Math.PI / 4;
                var x = App.visualizationModel.width.get() / 2 - Math.cos(angle) * App.visualizationModel.width.get() / 1.5 + (App.visualizationModel.width.get() * Math.random() - App.visualizationModel.width.get() / 2);
                var y = App.visualizationModel.height.get() / 2 - Math.sin(angle) * App.visualizationModel.width.get() / 1.5 + (App.visualizationModel.height.get() * Math.random() - App.visualizationModel.height.get() / 2);

                var shootingStarView = new ShootingStarView();
                shootingStarView.x = x;
                shootingStarView.y = y;
                shootingStarView.angle = angle + Math.PI / 16 * Math.random() - Math.PI / 32;
                shootingStarView.speed = 600 + Math.random() * 200;
                shootingStarView.size = Math.round(Math.random() * 2) + 3;
                shootingStarView.onDone.addEventListener(() => this.removeShootingStar(shootingStarView));
                this.shootingStarViews.push(shootingStarView);
                this.children.push(shootingStarView);

                this.waitSecondsForNextSpawn = 1;
            }
        } else {
            this.waitSecondsForNextSpawn -= timeDiff;
        }
    }

    private removeShootingStar = (shootingStarView: ShootingStarView) => {
        this.children.removeItem(shootingStarView);
        this.shootingStarViews.removeItem(shootingStarView);
    }

    private frequencyIndex = 7;
    private lowerBorder = 0.4;
    private upperBorder = 0.9;

    private calculateRelDataValue(dataValue: number) {
        var relDataValue = dataValue / 255;
        if (relDataValue < this.lowerBorder) {
            relDataValue = this.lowerBorder;
        }
        if (relDataValue > this.upperBorder) {
            relDataValue = this.upperBorder;
        }
        var finalRelDataValue = (relDataValue - this.lowerBorder) / (this.upperBorder - this.lowerBorder);
        return finalRelDataValue;
    }
}