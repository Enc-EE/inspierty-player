import { AngledViewLayerBase } from "../viewLayerBase"
import { ShootingStarView } from "./shootingStarView"
import { AppState, Globals } from "../../../globals"
import { AnyAction, Store } from "redux";
import { AudioGraphNodeAnalyser } from "../../../../enc/src/audio/audioGraphNodeAnalyser";
import { ShootingStarSettings } from "./state/types";
import { ShootingStarImageProvider } from "./shootingStarImageProvider";


export class ShootingStarManager extends AngledViewLayerBase {
    private static shootingStarId = 1
    private shootingStars: { [key: string]: ShootingStarView } = {}

    analyser: AudioGraphNodeAnalyser;
    shootingStarImageProvider: ShootingStarImageProvider;

    constructor(store: Store<AppState, AnyAction>, angle: number) {
        super(store, angle)
        this.analyser = Globals.audioManager.getAnalyser()
        this.shootingStarImageProvider = new ShootingStarImageProvider()
    }


    public get settings(): ShootingStarSettings {
        return this.store.getState().settings.shootingStarSettings
    }


    public update = (timeDiff: number) => {
        var currentKeys = Object.keys(this.shootingStars)
        for (const key of currentKeys) {
            this.shootingStars[key].update(timeDiff)
            if (!this.shootingStars[key].isActive) {
                delete this.shootingStars[key]
            }
        }

        var limit = 50;
        if (Object.keys(this.shootingStars).length <= limit && this.settings.audioInteractionSettings.waitSecondsForNextSpawn <= 0) {
            var data = this.analyser.getSpectrum();
            var relDataValue = this.calculateRelDataValue(data[this.settings.audioInteractionSettings.frequencyIndex]);
            if (Math.random() * relDataValue > 0.685) {
                // if (Math.random() > 0.98) {

                var size = this.settings.spawnSettings.sizeMin + Math.random() * (this.settings.spawnSettings.sizeMax - this.settings.spawnSettings.sizeMin)
                var flatten = this.settings.spawnSettings.flattenMinPercent + Math.random() * (this.settings.spawnSettings.flattenMaxPercent - this.settings.spawnSettings.flattenMinPercent)
                // var distance = this.settings.spawnSettings.distanceMin + Math.random() * (this.settings.spawnSettings.distanceMax - this.settings.spawnSettings.distanceMin)
                var shootingStarAngle = this.angle - this.settings.spawnSettings.angleRandomnes / 2 + Math.random() * this.settings.spawnSettings.angleRandomnes
                var speed = this.settings.spawnSettings.speedMin + Math.random() * (this.settings.spawnSettings.speedMax - this.settings.spawnSettings.speedMin)

                this.shootingStars[ShootingStarManager.shootingStarId] = new ShootingStarView(this.store.getState(), this.shootingStarImageProvider.getImage(size, flatten), shootingStarAngle, speed)

                ShootingStarManager.shootingStarId++
                this.settings.audioInteractionSettings.waitSecondsForNextSpawn = 0.2;
            }
        } else {
            this.settings.audioInteractionSettings.waitSecondsForNextSpawn -= timeDiff;
        }
    }

    public draw = (ctx: CanvasRenderingContext2D) => {
        var currentKeys = Object.keys(this.shootingStars)
        for (const key of currentKeys) {
            this.shootingStars[key].draw(ctx)
        }
    }

    public updateProperties = (state: AppState) => {
        var currentKeys = Object.keys(this.shootingStars)
        for (const key of currentKeys) {
            this.shootingStars[key].updateProperties({
                height: state.settings.height,
                width: state.settings.width
            })
        }
    }

    private calculateRelDataValue(dataValue: number) {
        var relDataValue = dataValue / 255;
        if (relDataValue < this.settings.audioInteractionSettings.lowerBorder) {
            relDataValue = this.settings.audioInteractionSettings.lowerBorder;
        }
        if (relDataValue > this.settings.audioInteractionSettings.upperBorder) {
            relDataValue = this.settings.audioInteractionSettings.upperBorder;
        }
        var finalRelDataValue = (relDataValue - this.settings.audioInteractionSettings.lowerBorder) / (this.settings.audioInteractionSettings.upperBorder - this.settings.audioInteractionSettings.lowerBorder);
        return finalRelDataValue;
    }
}