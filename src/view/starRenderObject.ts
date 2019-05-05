import { RenderObject } from "../../enc/src/ui/renderObject";
import { Star } from "../models/star";

export class StarRenderObject extends RenderObject {
    mouseDown(ev: MouseEvent): void {
    }
    mouseUp(ev: MouseEvent): void {
    }

    constructor(private star: Star) {
        super();
    }

    public render(ctx: CanvasRenderingContext2D): void {

        var end = this.star.r * 3;
        var grad = ctx.createRadialGradient(this.star.x, this.star.y, this.star.r, this.star.x, this.star.y, end);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.arc(this.star.x, this.star.y, end, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.star.x, this.star.y, this.star.r, 0, Math.PI * 2);
        ctx.fill();
    }
    mouseMove(ev: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
    click(ev: MouseEvent): void {
        throw new Error("Method not implemented.");
    }
}