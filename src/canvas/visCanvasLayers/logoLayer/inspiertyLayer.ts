import { ViewLayerBase } from "../viewLayerBase"
import { AudioState } from "../../../audio/state/types"
import { Settings } from "../../../state/types"
import { AppState, Globals } from "../../../globals"
import { Store, AnyAction } from "redux"
import { AudioGraphNodeAnalyser } from "../../../../enc/src/audio/audioGraphNodeAnalyser"

export class InspiertyLayer extends ViewLayerBase {
    private logo: HTMLImageElement
    private logoNova: HTMLImageElement
    private imageX = 0
    private imageY = 0
    private viewWidth = 100
    private viewHeight = 100
    private imageWidth = 100
    private imageHeight = 100
    
    private frequencyIndex = 7
    private lowerBorder = 0.45
    private upperBorder = 0.9

    private analyser: AudioGraphNodeAnalyser
    private relDataValue = 0

    constructor(store: Store<AppState, AnyAction>) {
        super(store)
        var assetManager = Globals.assetManager
        this.analyser = Globals.audioManager.getAnalyser()

        var logoImage = assetManager.getImage("logo")
        this.logo = logoImage ? logoImage : new Image()
        var logoNovaImage = assetManager.getImage("logo-nova")
        this.logoNova = logoNovaImage ? logoNovaImage : new Image()
        var initialState = store.getState();
        this.updateProperties(initialState);
    }

    public updateProperties = (state: AppState) => {
        if (state.settings.width != this.viewWidth || state.settings.height != this.viewHeight) {
            this.resizeImage(state.settings.width, state.settings.height)
        }
    }

    public update = (timeDiff: number) => {
        var data = this.analyser.getSpectrum()
        this.relDataValue = this.calculateRelDataValue(data[this.frequencyIndex])
    }

    private resizeImage(newWidth: number, newHeight: number) {
        this.viewWidth = newWidth
        this.viewHeight = newHeight
        this.imageHeight = this.viewHeight
        this.imageWidth = this.imageHeight / this.logo.naturalHeight * this.logo.naturalWidth
        this.imageX = this.viewWidth / 2 - this.imageWidth / 2
    }

    public draw = (ctx: CanvasRenderingContext2D) => {
        if (this.logoNova || this.logo) {
            ctx.save()
            ctx.globalAlpha = 0.25 + this.relDataValue * 0.75 / 1
            ctx.drawImage(this.logoNova, this.imageX, this.imageY, this.imageWidth, this.imageHeight)
            ctx.restore()
            ctx.drawImage(this.logo, this.imageX, this.imageY, this.imageWidth, this.imageHeight)
        }
    }

    private calculateRelDataValue(dataValue: number) {
        var relDataValue = dataValue / 255
        if (relDataValue < this.lowerBorder) {
            relDataValue = this.lowerBorder
        }
        if (relDataValue > this.upperBorder) {
            relDataValue = this.upperBorder
        }
        var finalRelDataValue = (relDataValue - this.lowerBorder) / (this.upperBorder - this.lowerBorder)
        return finalRelDataValue
    }
}