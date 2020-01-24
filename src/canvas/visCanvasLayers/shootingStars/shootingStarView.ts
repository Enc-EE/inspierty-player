import { AppState } from "../../../globals"
import { ShootingStarImage } from "./shootingStarImageProvider"

export interface Props {
    width: number
    height: number
}

export class ShootingStarView {
    private x = 0
    private y = 0
    private viewHeight: number
    private viewWidth: number

    public isActive = true

    constructor(private state: AppState, private shootingStarImage: ShootingStarImage, private angle: number, private speed: number) {
        this.viewWidth = state.settings.width
        this.viewHeight = state.settings.height
        this.init()
    }

    public update = (timeDiff: number) => {
        this.x += Math.cos(this.angle) * timeDiff * this.speed;
        this.y += Math.sin(this.angle) * timeDiff * this.speed;

        if (this.x > this.viewWidth * 1.5 || this.x < -this.viewWidth / 2 || this.y > this.viewHeight * 1.5 || this.y < -this.viewHeight / 2) {
            this.isActive = false;
        }
    }

    public draw = (ctx: CanvasRenderingContext2D): void => {
        ctx.save()
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (this.shootingStarImage) {
            ctx.drawImage(
                this.shootingStarImage.image,
                -this.shootingStarImage.offsetX * this.shootingStarImage.sizeFactor,
                -this.shootingStarImage.offsetY * this.shootingStarImage.sizeFactor * this.shootingStarImage.heightFactor,
                this.shootingStarImage.image.width * this.shootingStarImage.sizeFactor,
                this.shootingStarImage.image.height * this.shootingStarImage.sizeFactor * this.shootingStarImage.heightFactor);
        }
        ctx.beginPath();
        ctx.restore();
        if (this.func) {
            this.func(ctx)
        }
    }

    public updateProperties = (state: Props) => {
        console.error("Not supported! x202001241920")
    }

    private func: ((ctx: CanvasRenderingContext2D) => void) | undefined

    private init() {
        var nonHitBorderRatio = 0.1;
        var spawnOuterBorder = 5;
        var screenWidth = this.viewWidth + spawnOuterBorder * 2;
        var screenHeight = this.viewHeight + spawnOuterBorder * 2;
        var hitPointX = Math.random() * (screenWidth * (1 - nonHitBorderRatio * 2)) + screenWidth * nonHitBorderRatio;
        var hitPointY = Math.random() * (screenHeight * (1 - nonHitBorderRatio * 2)) + screenHeight * nonHitBorderRatio;

        var calcAngle = this.angle
        var calcWidth = hitPointX;
        var calcHeight = hitPointY;

        var isBottom = true;
        var isFirstHalfPi = true;
        if (calcAngle > Math.PI) {
            isBottom = false;
            calcAngle = calcAngle - Math.PI;
            calcHeight = screenHeight - hitPointY;
            calcWidth = screenWidth - hitPointX;
        }
        if (calcAngle >= Math.PI / 2) {
            isFirstHalfPi = false;
            calcAngle = Math.PI / 2 - (calcAngle - Math.PI / 2);
            if (isBottom) {
                calcWidth = screenWidth - hitPointX;
            } else {
                calcWidth = hitPointX;
            }
        }

        var cutX = Math.tan(Math.PI / 2 - calcAngle) * calcHeight;
        var cutY = Math.tan(calcAngle) * calcWidth;

        var spawnX = 0;
        var spawnY = 0
        if (Math.abs(cutX) > calcWidth) {
            spawnX = calcWidth;
            spawnY = cutY;
        } else {
            spawnX = cutX;
            spawnY = calcHeight;
        }

        if (isBottom) {
            spawnY = -spawnY;
            spawnX = -spawnX;
        }
        if (!isFirstHalfPi) {
            spawnX = -spawnX;
        }

        spawnX = spawnX + hitPointX;
        spawnY = spawnY + hitPointY;

        this.x = spawnX - spawnOuterBorder;
        this.y = spawnY - spawnOuterBorder;
    }
}