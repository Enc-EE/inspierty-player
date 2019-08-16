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
        var limit = 20;
        if (this.shootingStarViews.length <= limit && this.waitSecondsForNextSpawn <= 0) {
            var data = this.analyser.getSpectrum();
            var relDataValue = this.calculateRelDataValue(data[this.frequencyIndex]);
            if (Math.random() * relDataValue > 0.6) {
                var angle = Math.PI / 4;
                angle = angle + Math.PI / 16 * Math.random() - Math.PI / 32;

                var shootingStarView = new ShootingStarView(Math.random() * 1.3 + 0.7);
                shootingStarView.angle = angle;

                var nonHitBorderRatio = 0.2;
                var spawnOuterBorder = 5;
                var screenWidth = App.visualizationModel.width.get() + spawnOuterBorder * 2;
                var screenHeight = App.visualizationModel.height.get() + spawnOuterBorder * 2;
                var hitPointX = Math.random() * (screenWidth * (1 - nonHitBorderRatio * 2)) + screenWidth * nonHitBorderRatio;
                var hitPointY = Math.random() * (screenHeight * (1 - nonHitBorderRatio * 2)) + screenHeight * nonHitBorderRatio;

                var calcAngle = angle
                var calcWidth = hitPointX;
                var calcHeight = hitPointY;

                var isBottom = true;
                var isFirstHalfPi = true;
                if (calcAngle > Math.PI) {
                    isBottom = false;
                    calcAngle = calcAngle - Math.PI;
                    calcHeight = screenHeight - hitPointY;
                    calcWidth = screenWidth - hitPointX;
                }
                if (calcAngle >= Math.PI / 2) {
                    isFirstHalfPi = false;
                    calcAngle = Math.PI / 2 - (calcAngle - Math.PI / 2);
                    if (isBottom) {
                        calcWidth = screenWidth - hitPointX;
                    } else {
                        calcWidth = hitPointX;
                    }
                }

                var cutX = Math.tan(Math.PI / 2 - calcAngle) * calcHeight;
                var cutY = Math.tan(calcAngle) * calcWidth;

                var spawnX = 0;
                var spawnY = 0
                if (Math.abs(cutX) > calcWidth) {
                    spawnX = calcWidth;
                    spawnY = cutY;
                } else {
                    spawnX = cutX;
                    spawnY = calcHeight;
                }

                if (isBottom) {
                    spawnY = -spawnY;
                    spawnX = -spawnX;
                }
                if (!isFirstHalfPi) {
                    spawnX = -spawnX;
                }

                spawnX = spawnX + hitPointX;
                spawnY = spawnY + hitPointY;

                shootingStarView.x = spawnX - spawnOuterBorder;
                shootingStarView.y = spawnY - spawnOuterBorder;

                shootingStarView.speed = 50 + shootingStarView.size * 150 + Math.random() * 300;
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