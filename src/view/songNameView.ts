import { RenderObject } from "../../enc/src/ui/renderObject";
import { Dinject } from "../../enc/src/dinject";

export class SongNameView extends RenderObject {
    private nextSongName: string;
    private nextNextSongName: string;
    private isAnimating = false;

    private animationTime = 5;
    private animationSwitch = 1.5;
    private currentAnimationTime = this.animationTime;

    private blurMax = 20;
    tempCanvas: HTMLCanvasElement;
    tempCtx: CanvasRenderingContext2D;
    animation: any;

    constructor(private currentSongName: string, public x: number, public y: number, public fontSize: number) {
        super();
        this.tempCanvas = document.createElement("canvas");
        this.tempCanvas.width = window.innerWidth;
        this.tempCanvas.height = window.innerHeight;
        document.body.append(this.tempCanvas);
        this.tempCanvas.style.letterSpacing = "8px";
        this.tempCtx = this.tempCanvas.getContext("2d");
        this.tempCtx.textAlign = "center";
        this.tempCtx.textBaseline = "top";

        this.animation = Dinject.getInstance("animation");
        this.animation.addUpdateFunction(this.update);
    }

    update = (timeDiff: number) => {
        if (this.isAnimating) {
            if (this.currentAnimationTime < this.animationSwitch && this.currentAnimationTime + timeDiff > this.animationSwitch) {
                this.currentSongName = this.nextSongName;
                this.nextSongName = undefined;
            }
            this.currentAnimationTime += timeDiff;
            if (this.currentAnimationTime >= this.animationTime) {
                this.currentAnimationTime = this.animationTime;
                this.isAnimating = false;
            }
        }
    }

    public render = (ctx: CanvasRenderingContext2D) => {
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        this.tempCtx.font = this.fontSize + "px dejavu serif italic";

        this.tempCtx.save()
        this.tempCtx.translate(this.x, this.y)
        if (this.isAnimating) {
            var isFirstStep = this.currentAnimationTime < this.animationSwitch
            var progress = isFirstStep
                ? this.currentAnimationTime / this.animationSwitch
                : 1 - (this.currentAnimationTime - this.animationSwitch) / (this.animationTime - this.animationSwitch);
            this.tempCtx.filter = "blur(" + (progress * this.blurMax) + "px)";

            var alpha = 1 - progress;

            var ms = this.tempCtx.measureText("test");
            var gradient = this.tempCtx.createLinearGradient(-20, 0, -20, 40);
            gradient.addColorStop(0, "rgba(43, 250, 253, " + alpha + ")");
            gradient.addColorStop(0.2, "rgba(43, 250, 253, " + alpha + ")");
            gradient.addColorStop(0.5, "rgba(15, 100, 145, " + alpha + ")");
            gradient.addColorStop(0.8, "rgba(43, 250, 253, " + alpha + ")");
            gradient.addColorStop(1.0, "rgba(43, 250, 253, " + alpha + ")");
            this.tempCtx.fillStyle = gradient;
            this.tempCtx.fillText(this.currentSongName, 0, 0);
        } else {
            var gradient = this.tempCtx.createLinearGradient(0, 0, 0, 40);
            gradient.addColorStop(0, "rgb(43, 250, 253)");
            gradient.addColorStop(0.2, "rgb(43, 250, 253)");
            gradient.addColorStop(0.5, "rgb(15, 100, 145)");
            gradient.addColorStop(0.8, "rgb(43, 250, 253)");
            gradient.addColorStop(1.0, "rgb(43, 250, 253)");
            this.tempCtx.fillStyle = gradient;
            this.tempCtx.fillText(this.currentSongName, 0, 0);
        }
        ctx.drawImage(this.tempCanvas, 0, 0);
        this.tempCtx.restore()
    }

    public changeSongName = (songName: string) => {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.nextSongName = songName;
            this.nextNextSongName = undefined;
            this.currentAnimationTime = 0;
        } else {
            if (this.currentAnimationTime <= this.animationSwitch) {
                this.nextSongName = songName;
            } else {
                if (!this.nextNextSongName) {
                    setTimeout(() => {
                        this.changeSongName(this.nextNextSongName);
                    }, (this.animationTime - this.currentAnimationTime) * 1000 + 200);
                }
                this.nextNextSongName = songName;
            }
        }
    }

    mouseDown(ev: MouseEvent): void { }
    mouseUp(ev: MouseEvent): void { }
    mouseMove(ev: MouseEvent): void { }
    click(ev: MouseEvent): void { }
}