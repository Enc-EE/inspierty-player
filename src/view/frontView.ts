import { LayoutView } from "../../enc/src/ui/layoutControls/layoutView";
import { Dinject } from "../../enc/src/dinject";
import { AssetManager } from "../../enc/src/assetManager";
import { EImage } from "../../enc/src/ui/controls/image";
import { Rectangle } from "../../enc/src/geometry/rectangle";
import { ImageScalingMode } from "../../enc/src/ui/controls/imageScalingMode";
import { EAnimation } from "../../enc/src/eAnimation";
import { AudioManager } from "../audioManager";
import { AudioGraphNodeAnalyser } from "../../enc/src/audio/audioGraphNodeAnalyser";
import { Label } from "../../enc/src/ui/controls/label";
import { VerticalAlignementOption } from "../../enc/src/ui/alignement/verticalAlignementOption";
import { HorizontalAlignementOption } from "../../enc/src/ui/alignement/horizontalAlignementOption";

export class FrontView extends LayoutView {
    analyser: AudioGraphNodeAnalyser;

    private frequencyIndex = 7;
    private lowerBorder = 0.4;
    private upperBorder = 0.9;
    songName: Label;

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
        this.children.push(logoNovaEImage);

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

        audioManager.songChanged.addEventListener(this.songChanged);
        this.songName = new Label();
        this.songName.text = audioManager.currentSongName;
        this.songName.properties.fillStyle = "blue"
        this.songName.properties.fontFamily = "Operetta";
        this.songName.alignement.verticalAlignmentRatio = 0.6;
        this.children.push(this.songName);
    }

    private songChanged = (songName: string) => {
        this.songName.text = songName;
        this.triggerUpdateLayout();
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