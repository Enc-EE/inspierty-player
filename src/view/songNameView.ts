import { RenderObject } from "../../enc/src/ui/renderObject";
import { Dinject } from "../../enc/src/dinject";
import { App } from "../app";

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
    public fontSize: number = 2.5;

    public x: number;
    public y: number;

    private textBorder = 0.85;
    private textAnimationBorder = 0.75

    constructor(private currentSongName: string) {
        super();
        this.animation = Dinject.getInstance("animation");
        this.animation.addUpdateFunction(this.update);

        // App.visualizationModel.size.onChanged.addEventListener(this.reset);
        this.reset();
    }

    private reset = () => {
        // // var width = App.visualizationModel.size.get().width;
        // // var height = App.visualizationModel.size.get().height;

        // this.resetCanvas(width, height);

        // var oldWidth = 0;
        // var fms = this.tempCtx.measureText(this.currentSongName);
        // var oldLargeText = this.isLargeText;
        // this.isLargeText = fms.width > App.visualizationModel.size.get().width * this.textBorder;
        // while (this.isLargeText && oldWidth < fms.width) {
        //     var oldWidth = fms.width;
        //     this.resetCanvas(fms.width * 1.1, height);
        //     var fms = this.tempCtx.measureText(this.currentSongName);
        // }

        // this.x = this.tempCanvas.width / 2;
        // this.y = App.visualizationModel.size.get().height / 5 * 3;

        // if (this.isLargeText && !oldLargeText) {
        //     this.isTextAnimationGoingLeft = true;
        //     var diff = fms.width - App.visualizationModel.size.get().width * this.textAnimationBorder
        //     this.offsetX = diff / 2;
        // } else if (!this.isLargeText && oldLargeText) {
        //     this.offsetX = 0;
        // }
        // this.mustRedraw = true;
    }

    private isLargeText = false;
    private isTextAnimationGoingLeft = true;
    private offsetX = 0;

    update = (timeDiff: number) => {
        if (this.isAnimating) {
            if (this.currentAnimationTime < this.animationSwitch && this.currentAnimationTime + timeDiff > this.animationSwitch) {
                this.currentSongName = this.nextSongName;
                this.nextSongName = undefined;

                var fms = this.tempCtx.measureText(this.currentSongName);
                // this.isLargeText = fms.width > App.visualizationModel.size.get().width * this.textBorder;
                if (this.isLargeText) {
                    this.isTextAnimationGoingLeft = true;
                    // var diff = fms.width - App.visualizationModel.size.get().width * this.textAnimationBorder
                    // this.offsetX = diff / 2;
                } else {
                    this.offsetX = 0;
                }
            }
            this.currentAnimationTime += timeDiff;
            if (this.currentAnimationTime >= this.animationTime) {
                this.currentAnimationTime = this.animationTime;
                this.isAnimating = false;
            }
        }

        if (this.isLargeText && !this.isAnimating) {
            var fms = this.tempCtx.measureText(this.currentSongName);
            // var diff = fms.width - App.visualizationModel.size.get().width * this.textAnimationBorder

            // if (this.isTextAnimationGoingLeft) {
            //     this.offsetX -= timeDiff * 14;
            //     if (this.offsetX <= -diff / 2) {
            //         this.offsetX = -diff / 2;
            //         this.isTextAnimationGoingLeft = false;
            //     }
            // } else {
            //     this.offsetX += timeDiff * 14;
            //     if (this.offsetX >= diff / 2) {
            //         this.offsetX = diff / 2;
            //         this.isTextAnimationGoingLeft = true;
            //     }
            // }
        }
    }

    private mustRedraw = true;

    public render = (ctx: CanvasRenderingContext2D) => {
        if (this.isAnimating) {
            this.mustRedraw = true;
            this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
            this.tempCtx.save()
            this.tempCtx.translate(this.x, this.y)
            var isFirstStep = this.currentAnimationTime < this.animationSwitch
            var progress = isFirstStep
                ? this.currentAnimationTime / this.animationSwitch
                : 1 - (this.currentAnimationTime - this.animationSwitch) / (this.animationTime - this.animationSwitch);
            this.tempCtx.filter = "blur(" + (progress * this.blurMax) + "px)";

            var alpha = 1 - progress;

            var gradient = this.tempCtx.createLinearGradient(0, 0, 0, 40);
            gradient.addColorStop(0, "rgba(43, 250, 253, " + alpha + ")");
            gradient.addColorStop(0.2, "rgba(43, 250, 253, " + alpha + ")");
            gradient.addColorStop(0.5, "rgba(15, 100, 145, " + alpha + ")");
            gradient.addColorStop(0.8, "rgba(43, 250, 253, " + alpha + ")");
            gradient.addColorStop(1.0, "rgba(43, 250, 253, " + alpha + ")");
            this.tempCtx.fillStyle = gradient;
            this.tempCtx.fillText(this.currentSongName, 0, 0);
            ctx.drawImage(this.tempCanvas, this.offsetX, 0);
            this.tempCtx.restore()
        } else if (this.mustRedraw || this.isLargeText) {
            this.mustRedraw = false;
            this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
            this.tempCtx.save()
            this.tempCtx.translate(this.x, this.y)
            var gradient = this.tempCtx.createLinearGradient(0, 0, 0, 40);
            gradient.addColorStop(0, "rgb(43, 250, 253)");
            gradient.addColorStop(0.2, "rgb(43, 250, 253)");
            gradient.addColorStop(0.5, "rgb(15, 100, 145)");
            gradient.addColorStop(0.8, "rgb(43, 250, 253)");
            gradient.addColorStop(1.0, "rgb(43, 250, 253)");
            this.tempCtx.fillStyle = gradient;
            this.tempCtx.fillText(this.currentSongName, 0, 0);
            ctx.drawImage(this.tempCanvas, this.offsetX, 0);
            this.tempCtx.restore()
        } else {
            ctx.drawImage(this.tempCanvas, 0, 0);
        }
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

    private resetCanvas(width: number, height: number) {
        if (this.tempCanvas) {
            this.tempCanvas.parentNode.removeChild(this.tempCanvas);
        }
        this.tempCanvas = document.createElement("canvas");
        this.tempCanvas.style.display = "none";
        document.body.append(this.tempCanvas);
        this.tempCanvas.width = width;
        this.tempCanvas.height = height;
        this.tempCtx = this.tempCanvas.getContext("2d");
        if (width < 1000) {
            this.tempCanvas.style.letterSpacing = "5px";
            this.tempCtx.font = "28px dejavu serif italic";
        }
        else {
            this.tempCanvas.style.letterSpacing = "8px";
            this.tempCtx.font = "2.6vw dejavu serif italic";
        }
        this.tempCtx.textAlign = "center";
        this.tempCtx.textBaseline = "top";
    }

    mouseDown(ev: MouseEvent): void { }
    mouseUp(ev: MouseEvent): void { }
    mouseMove(ev: MouseEvent): void { }
    click(ev: MouseEvent): void { }
}