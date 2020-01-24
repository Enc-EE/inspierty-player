import { AngledViewLayerBase } from "../viewLayerBase"
import { ShootingStarView } from "./shootingStarView"
import { AppState, Globals } from "../../../globals"
import { AnyAction, Store } from "redux";
import { AudioGraphNodeAnalyser } from "../../../../enc/src/audio/audioGraphNodeAnalyser";
import { ShootingStarSettings } from "./state/types";


export class ShootingStarManager extends AngledViewLayerBase {
    private static shootingStarId = 1
    private shootingStars: { [key: string]: ShootingStarView } = {}

    analyser: AudioGraphNodeAnalyser;

    constructor(store: Store<AppState, AnyAction>, angle: number) {
        super(store, angle)
        this.analyser = Globals.audioManager.getAnalyser()
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
            if (Math.random() * relDataValue > 0.62) {
                // if (Math.random() > 0.98) {
                this.shootingStars[ShootingStarManager.shootingStarId] = new ShootingStarView(this.store.getState(), this.angle)
                ShootingStarManager.shootingStarId++
                this.settings.audioInteractionSettings.waitSecondsForNextSpawn = 0.1;
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