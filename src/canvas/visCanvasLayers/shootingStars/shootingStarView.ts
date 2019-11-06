export interface Props {
    width: number
    height: number
}

export class ShootingStarView {
    private x = 0
    private y = 0
    private viewHeight: number
    private viewWidth: number
    private image = new Image()
    private xImageOffset = 0
    private yImageOffset = 0

    private angle: number
    private angleRandomness = Math.PI / 16

    private speed: number
    private speedMin = 100
    private speedMax = 800

    private size: number
    private sizeMin = 0.2
    private sizeMax = 1

    private distance: number
    private distanceMin = 1
    private distanceMax = 3

    public isActive = true

    constructor(private state: Props, angle: number) {
        this.size = this.sizeMin + Math.random() * (this.sizeMax - this.sizeMin)
        this.distance = this.distanceMin + Math.random() * (this.distanceMax - this.distanceMin)
        // angle = Math.PI * 5 / 4
        this.angle = angle - this.angleRandomness / 2 + Math.random() * this.angleRandomness
        this.speed = this.speedMin + Math.random() * (this.speedMax - this.speedMin)
        this.viewWidth = state.width
        this.viewHeight = state.height
        this.init()
        this.createImage()
    }

    public update = (timeDiff: number) => {
        this.x += Math.cos(this.angle) * timeDiff * this.speed * (1 / this.distance);
        this.y += Math.sin(this.angle) * timeDiff * this.speed * (1 / this.distance);

        if (this.x > this.viewWidth * 1.5 || this.x < -this.viewWidth / 2 || this.y > this.viewHeight * 1.5 || this.y < -this.viewHeight / 2) {
            this.isActive = false;
        }
    }

    public draw = (ctx: CanvasRenderingContext2D): void => {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (this.image) {
            ctx.drawImage(this.image, -this.xImageOffset, -this.yImageOffset);
        }
        ctx.beginPath();
        ctx.restore();
        if (this.func) {
            this.func(ctx)
        }
    }

    public updateProperties = (state: Props) => {
        var recreateImage = false
        if (state.height != this.viewHeight
            || state.width != this.viewWidth) {
            this.viewWidth = state.width
            this.viewHeight = state.height
            recreateImage = true
        }
        if (recreateImage) {
            this.createImage()
        }
    }

    private func: ((ctx: CanvasRenderingContext2D) => void) | undefined

    private init() {
        var nonHitBorderRatio = 0.2;
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

    private createImage = () => {
        var border = 2;
        var length = this.size * 100 * (1 / this.distance);
        var r = this.size * (1 / this.distance);
        var thinR = this.sizeMin / 2 * (1 / this.distance);
        const height = (border + r) * 2;
        this.xImageOffset = border + length;
        console.log(this.xImageOffset);
        
        this.yImageOffset = height / 2;

        var tempCanvas = document.createElement("canvas");
        tempCanvas.width = border + length + r + border;
        tempCanvas.height = height;

        var tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
            tempCtx.beginPath();
            tempCtx.moveTo(border, height / 2 - thinR);
            tempCtx.lineTo(border + length, border);
            tempCtx.bezierCurveTo(border + length + r, height / 2 - r, border + length + r, height / 2 + r, border + length, height / 2 + r);
            tempCtx.lineTo(border, height / 2 + thinR);
            tempCtx.closePath();

            tempCtx.fillStyle = "rgba(255, 255, 255, 1)"
            tempCtx.fill();

            this.image = new Image();
            this.image.src = tempCanvas.toDataURL();
        }
    }
}