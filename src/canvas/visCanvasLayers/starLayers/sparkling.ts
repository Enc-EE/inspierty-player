import { Star } from "./star"

interface SparkleSpike {
    radius: number
    angle: number
}

export class Sparkling {
    private progress = 0
    private innerRadius = 0.5
    private outerRadiusMax = 30
    private outerRadiusMin = 10
    private numberOfSpikes = 5
    private spikes: SparkleSpike[] = []
    private isMinusWidth = false
    private isMinusHeight = false
    private image = new Image()

    public isActive = true

    constructor(private star: Star, private duration: number, private width: number, private height: number, offsetX: number, offsetY: number) {
        this.isMinusWidth = star.x * width + offsetX > width
        this.isMinusHeight = star.y * height + offsetY > height
        this.numberOfSpikes = Math.floor(Math.random() * 17) + 3
        for (let i = 0; i < this.numberOfSpikes; i++) {
            this.spikes.push({
                angle: Math.PI * 2 * Math.random(),
                radius: this.outerRadiusMin + (this.outerRadiusMax - this.outerRadiusMin) * Math.random(),
            })
            this.spikes.sort((a, b) => a.angle - b.angle)
        }
        this.createImage()
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
        // ctx.fillRect(0, 0, 10, 10)
        var scale = -Math.abs(((this.progress) - 0.5) * 2) + 1
        ctx.scale(scale, scale)

        // this.drawStar(ctx)
        ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2)

        ctx.restore()
    }

    private drawStar = (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath()

        var x = Math.cos(this.spikes[0].angle) * this.spikes[0].radius
        var y = Math.sin(this.spikes[0].angle) * this.spikes[0].radius
        ctx.moveTo(x, y)

        for (let i = 0; i < this.spikes.length; i++) {
            const spike = this.spikes[i]
            x = Math.cos(spike.angle) * spike.radius
            y = Math.sin(spike.angle) * spike.radius
            ctx.lineTo(x, y)

            var nextSpike = this.spikes[i + 1 == this.spikes.length ? 0 : i + 1]
            var innerAngle = i + 1 == this.spikes.length
                ? (nextSpike.angle + Math.PI * 2 - spike.angle) / 2 + spike.angle
                : (nextSpike.angle - spike.angle) / 2 + spike.angle

            x = Math.cos(innerAngle) * this.innerRadius
            y = Math.sin(innerAngle) * this.innerRadius
            ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fillStyle = "white"
        ctx.fill()
    }

    private createImage = () => {
        var tempCanvas = document.createElement("canvas")
        var gap = 3
        tempCanvas.width = this.width + gap
        tempCanvas.height = this.height + gap

        var tempCtx = tempCanvas.getContext("2d")
        if (tempCtx) {
            tempCtx.save()
            tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2)
            this.drawStar(tempCtx)
        }
        this.image.src = tempCanvas.toDataURL()
    }
}