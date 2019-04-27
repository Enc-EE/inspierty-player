import { RenderObject } from "../enc/src/ui/renderObject";
import { Star } from "./models/star";

export class StarRenderObject extends RenderObject {

    constructor(private star: Star) {
        super();
    }

    public render(ctx: CanvasRenderingContext2D): void {
        // console.log("drawing");
        
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