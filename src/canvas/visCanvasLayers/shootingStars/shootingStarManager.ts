import { AngledViewLayerBase } from "../viewLayerBase"
import { ShootingStarView } from "./shootingStarView"
import { AppState, Globals } from "../../../globals"
import { AnyAction, Store } from "redux";
import { AudioGraphNodeAnalyser } from "../../../../enc/src/audio/audioGraphNodeAnalyser";


export class ShootingStarManager extends AngledViewLayerBase {
    private static shootingStarId = 1
    private shootingStars: { [key: string]: ShootingStarView } = {}

    private frequencyIndex = 7;
    private lowerBorder = 0.4;
    private upperBorder = 0.9;
    analyser: AudioGraphNodeAnalyser;
    waitSecondsForNextSpawn: number = 0;

    private viewWidth: number
    private viewHeight: number

    constructor(store: Store<AppState, AnyAction>, angle: number) {
        super(store, angle)
        this.viewWidth = store.getState().settings.width
        this.viewHeight = store.getState().settings.height
        this.analyser = Globals.audioManager.getAnalyser()
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
        if (Object.keys(this.shootingStars).length <= limit && this.waitSecondsForNextSpawn <= 0) {
            var data = this.analyser.getSpectrum();
            var relDataValue = this.calculateRelDataValue(data[this.frequencyIndex]);
            if (Math.random() * relDataValue > 0.62) {
                this.shootingStars[ShootingStarManager.shootingStarId] = new ShootingStarView({ height: this.viewHeight, width: this.viewWidth }, this.angle)
                ShootingStarManager.shootingStarId++
                this.waitSecondsForNextSpawn = 0.1;
            }
        } else {
            this.waitSecondsForNextSpawn -= timeDiff;
        }
    }

    public draw = (ctx: CanvasRenderingContext2D) => {
        var currentKeys = Object.keys(this.shootingStars)
        for (const key of currentKeys) {
            this.shootingStars[key].draw(ctx)
        }
    }

    public updateProperties = (state: AppState) => {
        this.viewWidth = state.settings.width
        this.viewHeight = state.settings.height
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