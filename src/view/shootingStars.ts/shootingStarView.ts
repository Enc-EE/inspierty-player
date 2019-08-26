import { RenderObject } from "../../../enc/src/ui/renderObject";
import { EEvent } from "../../../enc/src/eEvent";
import { App } from "../../app";
import { Dinject } from "../../../enc/src/dinject";
import { EAnimation } from "../../../enc/src/eAnimation";
import { Helper } from "../../../enc/src/helper";

export class ShootingStarView extends RenderObject {
    public x: number;
    public y: number;
    public angle: number;
    public speed: number;

    public onDone = new EEvent();
    image: HTMLImageElement;
    xImageOffset: number;
    yImageOffset: number;

    constructor(public size: number) {
        super();

        var animation = Dinject.getInstance("animation") as EAnimation;
        animation.addUpdateFunction(this.update);
        this.createImgage();
    }

    private createImgage = () => {
        var border = 2;
        var length = this.size * 20 + Math.random() * 160;
        var r = this.size;
        var thinR = this.size * (Math.random() / 4);
        const height = (border + r) * 2;
        this.xImageOffset = border + length;
        this.yImageOffset = height / 2;

        var tempCanvas = document.createElement("canvas");
        tempCanvas.width = border + length + r + border;
        tempCanvas.height = height;

        var tempCtx = tempCanvas.getContext("2d");

        tempCtx.beginPath();
        tempCtx.moveTo(border, height / 2 - thinR);
        tempCtx.lineTo(border + length, border);
        tempCtx.bezierCurveTo(border + length + r, height / 2 - r, border + length + r, height / 2 + r, border + length, height / 2 + r);
        tempCtx.lineTo(border, height / 2 + thinR);
        tempCtx.closePath();

        tempCtx.fillStyle = "rgba(255, 255, 255, " + (Math.random() / 2 + 0.5) + ")"
        // tempCtx.fillStyle = "rgba(255, 255, 255, 1)"
        tempCtx.fill();

        // var imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

        // var newImageData = Helper.blur(imageData, 1);

        // tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        // tempCtx.putImageData(newImageData, 0, 0);
        this.image = new Image();
        this.image.src = tempCanvas.toDataURL();
    }

    public update = (timeDiff: number) => {
        this.x += Math.cos(this.angle) * timeDiff * this.speed;
        this.y += Math.sin(this.angle) * timeDiff * this.speed;
    }

    public render = (ctx: CanvasRenderingContext2D): void => {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, -this.xImageOffset, -this.yImageOffset);
        ctx.beginPath();
        ctx.restore();
        // let removeIs: number[] = [];
        // ctx.fillStyle = "white";
        // ctx.strokeStyle = "white";
        // ctx.lineCap = "round";

        // for (let j = this.size; j > 0; j -= 0.5) {
        //     this.drawShootingStarPart(ctx, 0.5, this, j * j * j);
        // }

        // ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        // ctx.fill();

        if (this.x > App.visualizationModel.width.get() * 1.5 || this.x < -App.visualizationModel.width.get() / 2 || this.y > App.visualizationModel.height.get() * 1.5 || this.y < -App.visualizationModel.height.get() / 2) {
            this.onDone.dispatchEvent();
        }
    }

    private drawShootingStarPart(ctx: CanvasRenderingContext2D, lineWidth: number, shootingStar: ShootingStarView, length: number) {
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(shootingStar.x - Math.cos(shootingStar.angle) * length, shootingStar.y - Math.sin(shootingStar.angle) * length);
        ctx.stroke();
    }

    mouseDown(ev: MouseEvent): void { }
    mouseUp(ev: MouseEvent): void { }
    mouseMove(ev: MouseEvent): void { }
    click(ev: MouseEvent): void { }
}