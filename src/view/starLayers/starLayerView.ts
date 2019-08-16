import { RenderObject } from "../../../enc/src/ui/renderObject";
import { StarLayer } from "../../models/starLayer";
import { Star } from "../../models/star";
import { App } from "../../app";
import { EAnimation } from "../../../enc/src/eAnimation";
import { Dinject } from "../../../enc/src/dinject";

export class StarLayerView extends RenderObject {
    private stars: Star[] = [];
    private animation: EAnimation;
    image: HTMLImageElement;
    private x = 0;
    private y = 0;

    constructor(private starLayer: StarLayer) {
        super();
        this.tag = starLayer;
        this.animation = Dinject.getInstance("animation");
        this.animation.addUpdateFunction(this.update);

        this.image = new Image();

        for (let i = 0; i < starLayer.numberOfStars.get(); i++) {
            this.addStar();
        }

        starLayer.numberOfStars.OnChanged.addEventListener(this.numberOfStarsChanged);
        starLayer.starRadiusLowerBorder.OnChanged.addEventListener((oldValue, newValue) => { this.sizeChanged(oldValue, this.starLayer.starRadiusUpperBorder.get()) });
        starLayer.starRadiusUpperBorder.OnChanged.addEventListener((oldValue, newValue) => { this.sizeChanged(this.starLayer.starRadiusLowerBorder.get(), oldValue) });
        this.createImgage();
    }

    private createImgage = () => {
        var tempCanvas = document.createElement("canvas");
        tempCanvas.width = App.visualizationModel.width.get();
        tempCanvas.height = App.visualizationModel.height.get();
        var tempCtx = tempCanvas.getContext("2d");
        var endlessBorderGap = 3;
        for (const star of this.stars) {
            tempCtx.fillStyle = "white";
            tempCtx.beginPath();
            tempCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            tempCtx.fill();

            if (star.x >= App.visualizationModel.width.get() - endlessBorderGap) {
                tempCtx.beginPath();
                tempCtx.arc(star.x - App.visualizationModel.width.get(), star.y, star.r, 0, Math.PI * 2);
                tempCtx.fill();

                if (star.y >= App.visualizationModel.height.get() - endlessBorderGap) {
                    tempCtx.beginPath();
                    tempCtx.arc(star.x - App.visualizationModel.width.get(), star.y - App.visualizationModel.height.get(), star.r, 0, Math.PI * 2);
                    tempCtx.fill();
                }
            }

            if (star.y >= App.visualizationModel.height.get() - endlessBorderGap) {
                tempCtx.beginPath();
                tempCtx.arc(star.x, star.y - App.visualizationModel.height.get(), star.r, 0, Math.PI * 2);
                tempCtx.fill();
            }

            var end = star.r * 3;
            var grad = tempCtx.createRadialGradient(star.x, star.y, star.r, star.x, star.y, end);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            tempCtx.fillStyle = grad;
            tempCtx.arc(star.x, star.y, end, 0, Math.PI * 2);
            tempCtx.fill();
        }

        this.image.src = tempCanvas.toDataURL();
    }

    private sizeChanged = (lowerValue: number, upperValue: number) => {
        var currentValueLow = lowerValue;
        var currentValueHigh = upperValue;
        
        var minFix = (currentValueHigh - currentValueLow);
        if (minFix <= 0) {
            minFix = 0.0001
        }
        var ratio = (this.starLayer.starRadiusUpperBorder.get() - this.starLayer.starRadiusLowerBorder.get()) / minFix;
        for (const star of this.stars) {
            star.r = (star.r - currentValueLow) * ratio + this.starLayer.starRadiusLowerBorder.get();
        }
        this.createImgage();
    }

    private numberOfStarsChanged = (oldValue: number, newValue: number) => {
        var diff = newValue - this.stars.length;
        if (diff > 0) {
            for (let i = 0; i < diff; i++) {
                this.addStar();
            }
        } else {
            for (let i = 0; i < -diff; i++) {
                var index = Math.floor(Math.random() * this.stars.length);
                this.stars.removeItem(this.stars[index]);
            }
        }
        this.createImgage();
    }

    public update = (timeDiff: number) => {
        this.x += this.starLayer.speed.get() * timeDiff;
        this.y += this.starLayer.speed.get() * timeDiff;
        if (this.x > App.visualizationModel.width.get()) {
            this.x -= App.visualizationModel.width.get();
        }
        if (this.y > App.visualizationModel.height.get()) {
            this.y -= App.visualizationModel.height.get();
        }
    }

    public render = (ctx: CanvasRenderingContext2D): void => {
        ctx.drawImage(this.image, this.x, this.y);
        ctx.drawImage(this.image, this.x - App.visualizationModel.width.get(), this.y);
        ctx.drawImage(this.image, this.x - App.visualizationModel.width.get(), this.y - App.visualizationModel.height.get());
        ctx.drawImage(this.image, this.x, this.y - App.visualizationModel.height.get());
    }

    private addStar() {
        this.stars.push({
            x: Math.random() * App.visualizationModel.width.get(),
            y: Math.random() * App.visualizationModel.height.get(),
            r: Math.random() * (this.starLayer.starRadiusUpperBorder.get() - this.starLayer.starRadiusLowerBorder.get()) + this.starLayer.starRadiusLowerBorder.get()
        });
    }

    mouseDown(ev: MouseEvent): void {
    }
    mouseUp(ev: MouseEvent): void {
    }
    mouseMove(ev: MouseEvent): void {
    }
    click(ev: MouseEvent): void {
    }
}