import { ViewLayerBase } from "./viewLayerBase"
import { AudioState } from "../../audio/types"
import { Settings } from "../../settings2/types"
import { AppState, Globals } from "../../globals"
import { Store, AnyAction } from "redux"

export class InspiertyLayer extends ViewLayerBase {
    private logo: HTMLImageElement
    private logoNova: HTMLImageElement
    private x: number = 100
    private y: number = 100
    private width: number = 100
    private height: number = 100
    private frequencyIndex = 7
    private lowerBorder = 0.4
    private upperBorder = 0.9

    constructor(store: Store<AppState, AnyAction>) {
        super(store)
        var assetManager = Globals.assetManager;

        // var audioManager = Dinject.getInstance("audio") as AudioManager;
        // this.analyser = audioManager.getAnalyser();

        var logoImage = assetManager.getImage("logo")
        this.logo = logoImage ? logoImage : new Image();
        var logoNovaImage = assetManager.getImage("logo-nova")
        this.logoNova = logoNovaImage ? logoNovaImage : new Image();
        // this.songNameView = new SongNameView(audioManager.currentSongName);
        // audioManager.songChanged.addEventListener(this.songNameView.changeSongName);
        // this.children.push(this.songNameView);
    }

    public updateProperties = (state: AppState) => {

    }

    public update = (timeDiff: number) => {

    }

    public draw = (ctx: CanvasRenderingContext2D) => {
        if (this.logoNova || this.logo) {
            // var data = this.analyser.getSpectrum();
            // var relDataValue = this.calculateRelDataValue(data[this.frequencyIndex]);
            ctx.save();
            // ctx.globalAlpha = relDataValue;
            ctx.drawImage(this.logoNova, this.x, this.y, this.width, this.height);
            ctx.restore();
            ctx.drawImage(this.logo, this.x, this.y, this.width, this.height);
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