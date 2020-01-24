import { Star } from "./star"
import { SparkleImage } from "./sparkleImageProvider"

export class Sparkling {
    private progress = 0
    private isMinusWidth = false
    private isMinusHeight = false

    public isActive = true

    constructor(private star: Star, private sparkleImage: SparkleImage, private duration: number, private width: number, private height: number, offsetX: number, offsetY: number) {
        this.isMinusWidth = star.x * width + offsetX > width
        this.isMinusHeight = star.y * height + offsetY > height
    }

    public update = (timeDiff: number) => {
        this.progress += timeDiff / this.duration
        if (this.progress > 1) {
            this.progress = 1
            this.isActive = false
        }
    }

    public draw = (ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) => {
        var starX = this.star.x * this.width + offsetX
        if (this.isMinusWidth) {
            starX -= this.width
        }
        var starY = this.star.y * this.height + offsetY
        if (this.isMinusHeight) {
            starY -= this.height
        }

        ctx.save()
        ctx.translate(starX, starY)
        var scale = -Math.abs(((this.progress) - 0.5) * 2) + 1
        ctx.scale(scale, scale)

        ctx.drawImage(
            this.sparkleImage.image,
            -this.sparkleImage.offsetX * this.sparkleImage.sizeFactor,
            -this.sparkleImage.offsetY * this.sparkleImage.sizeFactor,
            this.sparkleImage.image.width * this.sparkleImage.sizeFactor,
            this.sparkleImage.image.height * this.sparkleImage.sizeFactor)

        ctx.restore()
    }
}