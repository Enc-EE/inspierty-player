export interface SparkleImage {
    image: HTMLImageElement
    offsetX: number
    offsetY: number
    sizeFactor: number
}

interface SparkleSpike {
    radius: number
    angle: number
}

export class SparkleImageProvider {
    private sparkleImages: SparkleImage[] = []

    constructor() {
        for (let i = 0; i < 200; i++) {
            this.sparkleImages.push(this.createSparkleImage())
        }
    }

    public getSparkleImage = (sizeRadius: number): SparkleImage => {
        var sparkleImage = this.sparkleImages[Math.floor(Math.random() * this.sparkleImages.length)]
        return {
            ...sparkleImage,
            sizeFactor: sizeRadius / 45
        }
    }

    private createSparkleImage = (): SparkleImage => {
        var numberOfSpikes = Math.floor(Math.random() * 17) + 3
        var spikes: SparkleSpike[] = []
        const outerRadiusMax = 45
        const outerRadiusMin = 20
        const innerRadius = 0.75

        const gap = 5
        const size = (outerRadiusMax + gap) * 2

        for (let i = 0; i < numberOfSpikes; i++) {
            spikes.push({
                angle: Math.PI * 2 * Math.random(),
                radius: outerRadiusMin + (outerRadiusMax - outerRadiusMin) * Math.random(),
            })
            spikes.sort((a, b) => a.angle - b.angle)
        }
        var tempCanvas = document.createElement("canvas")
        tempCanvas.width = size
        tempCanvas.height = size

        var tempCtx = tempCanvas.getContext("2d")
        if (tempCtx) {
            tempCtx.save()
            tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2)
            this.drawStar(tempCtx, spikes, innerRadius)
        }
        var image = new Image()
        image.src = tempCanvas.toDataURL()

        return {
            image: image,
            offsetX: size / 2,
            offsetY: size / 2,
            sizeFactor: 1,
        }
    }

    private drawStar = (ctx: CanvasRenderingContext2D, spikes: SparkleSpike[], innerRadius: number) => {
        ctx.beginPath()

        var x = Math.cos(spikes[0].angle) * spikes[0].radius
        var y = Math.sin(spikes[0].angle) * spikes[0].radius
        ctx.moveTo(x, y)

        for (let i = 0; i < spikes.length; i++) {
            const spike = spikes[i]
            x = Math.cos(spike.angle) * spike.radius
            y = Math.sin(spike.angle) * spike.radius
            ctx.lineTo(x, y)

            var nextSpike = spikes[i + 1 == spikes.length ? 0 : i + 1]
            var innerAngle = i + 1 == spikes.length
                ? (nextSpike.angle + Math.PI * 2 - spike.angle) / 2 + spike.angle
                : (nextSpike.angle - spike.angle) / 2 + spike.angle

            x = Math.cos(innerAngle) * innerRadius
            y = Math.sin(innerAngle) * innerRadius
            ctx.lineTo(x, y)
        }
        ctx.closePath()

        //0-50 170-240 350-10
        // 50 120 130
        var h = Math.round(Math.random() * 130);
        if (h > 120) {
            h += 130
        } else if (h > 50) {
            h += 120
        }
        const l = Math.round(Math.random() * 40) + 50

        ctx.fillStyle = "hsl(" + h + ", 100%, " + l + "%)";
        ctx.fill()
    }
}