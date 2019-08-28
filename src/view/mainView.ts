import { LayoutView } from "../../enc/src/ui/layoutControls/layoutView";
import { Dinject } from "../../enc/src/dinject";
import { AssetManager } from "../../enc/src/assetManager";
import { EImage } from "../../enc/src/ui/controls/image";
import { Rectangle } from "../../enc/src/geometry/rectangle";
import { ImageScalingMode } from "../../enc/src/ui/controls/imageScalingMode";
import { AudioManager } from "../audioManager";
import { AudioGraphNodeAnalyser } from "../../enc/src/audio/audioGraphNodeAnalyser";
import { Label } from "../../enc/src/ui/controls/label";
import { SongNameView } from "./songNameView";

export class MainView extends LayoutView {
    analyser: AudioGraphNodeAnalyser;

    private frequencyIndex = 7;
    private lowerBorder = 0.4;
    private upperBorder = 0.9;
    songName: Label;
    songNameView: SongNameView;

    constructor() {
        super();
        var assetManager = Dinject.getInstance("assets") as AssetManager;

        var audioManager = Dinject.getInstance("audio") as AudioManager;
        this.analyser = audioManager.getAnalyser();

        var logo = assetManager.getImage("logo");
        var logoNova = assetManager.getImage("logo-nova");

        this.disableMouseEvents();

        var logoNovaEImage = new EImage(logoNova);
        logoNovaEImage.properties.imageScalingMode = ImageScalingMode.FitAndSpace;

        var func = logoNovaEImage.render

        logoNovaEImage.render = (ctx: CanvasRenderingContext2D) => {
            var data = this.analyser.getSpectrum();
            var relDataValue = this.calculateRelDataValue(data[this.frequencyIndex]);

            ctx.save();
            ctx.globalAlpha = relDataValue;
            func(ctx);
            ctx.restore();
        }

        var logoFront = new EImage(logo);
        logoFront.properties.imageScalingMode = ImageScalingMode.FitAndSpace;
        this.children.push(logoFront);
        this.children.push(logoNovaEImage);

        this.songNameView = new SongNameView(audioManager.currentSongName);
        audioManager.songChanged.addEventListener(this.songNameView.changeSongName);
        this.children.push(this.songNameView);
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

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        super.updateLayout(ctx, bounds);
        for (const child of this.children) {
            child.updateLayout(ctx, bounds);
        }
    }
}