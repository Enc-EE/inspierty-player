import { RenderObject } from "../../../enc/src/ui/renderObject";
import { EEvent } from "../../../enc/src/eEvent";
import { App } from "../../app";
import { Dinject } from "../../../enc/src/dinject";
import { EAnimation } from "../../../enc/src/eAnimation";

export class ShootingStarView extends RenderObject {
    public x: number;
    public y: number;
    public angle: number;
    public speed: number;
    public size: number;

    public onDone = new EEvent();

    constructor() {
        super();

        var animation = Dinject.getInstance("animation") as EAnimation;
        animation.addUpdateFunction(this.update);
    }

    public update = (timeDiff: number) => {
        this.x += Math.cos(this.angle) * timeDiff * this.speed;
        this.y += Math.sin(this.angle) * timeDiff * this.speed;
    }

    public render = (ctx: CanvasRenderingContext2D): void => {

        let removeIs: number[] = [];
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        ctx.lineCap = "round";

        for (let j = this.size; j > 0; j -= 0.5) {
            this.drawShootingStarPart(ctx, 0.5, this, j * j * j);
        }

        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fill();

        if (this.x > App.visualizationModel.width.get() * 3 || this.x < -App.visualizationModel.width.get() * 2 || this.y > App.visualizationModel.height.get() * 3 || this.y < -App.visualizationModel.height.get() * 2) {
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