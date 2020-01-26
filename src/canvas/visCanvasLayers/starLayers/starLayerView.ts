import { ViewLayer } from "../viewLayerBase"
import { Star } from "./star"
import { Sparkling } from "./sparkling"
import { Globals, AppState } from "../../../globals"
import { StarLayerSettings } from "./state/types"
import { SparkleImageProvider } from "./sparkleImageProvider"

export class StarLayerView implements ViewLayer {
    private sparkles: Sparkling[] = []
    private frequencyIndex = 7
    private lowerBorder = 0.4
    private upperBorder = 0.9
    private limit = 20
    waitSecondsForNextSpawn: number = 0;

    private stars: Star[] = []
    private starsImage = new Image()
    private x = 0
    private y = 0
    private borderGap = 40
    private width = 100
    private height = 100
    analyser: any
    sparkleImageProvider: SparkleImageProvider

    constructor(public angle: number, private settings: StarLayerSettings) {
        this.analyser = Globals.audioManager.getAnalyser()
        this.sparkleImageProvider = new SparkleImageProvider()
    }

    public update = (timeDiff: number) => {
        this.x += Math.cos(this.angle) * this.settings.speed * timeDiff
        this.y += Math.sin(this.angle) * this.settings.speed * timeDiff

        if (this.x > this.width) {
            this.x -= this.width
        } else if (this.x < -this.width) {
            this.x += this.width
        }
        if (this.y > this.height) {
            this.y -= this.height
        } else if (this.y < -this.height) {
            this.y += this.height
        }

        for (const sparkle of this.sparkles) {
            sparkle.update(timeDiff)
        }

        var removeIndices = this.sparkles.filter(x => !x.isActive).map(x => this.sparkles.indexOf(x))
        for (const removeIndex of removeIndices.sort((a, b) => b - a)) {
            this.sparkles.splice(removeIndex, 1)
        }
        if (this.sparkles.length < this.limit && this.waitSecondsForNextSpawn <= 0) {
            var data = this.analyser.getSpectrum();
            var relDataValue = this.calculateRelDataValue(data[this.frequencyIndex]);
            if (Math.random() * relDataValue > 0.75) {
                var sparkle = new Sparkling(
                    this.stars[Math.floor(Math.random() * this.stars.length)],
                    this.sparkleImageProvider.getSparkleImage(15),
                    0.7,
                    this.width + this.borderGap,
                    this.height + this.borderGap,
                    this.x,
                    this.y)
                this.sparkles.push(sparkle)
                this.waitSecondsForNextSpawn = 0.5;
            }
        } else {
            this.waitSecondsForNextSpawn -= timeDiff;
        }
    }

    private calculateRelDataValue(dataValue: number) {
        var relDataValue = dataValue / 255;
        if (relDataValue < this.lowerBorder) {
            relDataValue = this.lowerBorder;
        }
        if (relDataValue > this.upperBorder) {
            relDataValue = this.upperBorder;
        }
        var finalRelDataValue = (relDataValue - this.lowerBorder) / (this.upperBorder - this.lowerBorder);
        return finalRelDataValue;
    }

    public draw = (ctx: CanvasRenderingContext2D) => {
        // texture image strategy
        ctx.drawImage(this.starsImage, this.x, this.y)
        var textureWidth = this.width + this.borderGap
        var textureHeight = this.height + this.borderGap
        for (const sparkle of this.sparkles) {
            sparkle.draw(ctx, this.x, this.y)
        }
        if (this.x < 0) {
            ctx.drawImage(this.starsImage, this.x + textureWidth, this.y)
            if (this.y < 0) {
                ctx.drawImage(this.starsImage, this.x, this.y + textureHeight)
                ctx.drawImage(this.starsImage, this.x + textureWidth, this.y + textureHeight)
            } else {
                ctx.drawImage(this.starsImage, this.x, this.y - textureHeight)
                ctx.drawImage(this.starsImage, this.x + textureWidth, this.y - textureHeight)
            }
        } else {
            ctx.drawImage(this.starsImage, this.x - textureWidth, this.y)
            if (this.y < 0) {
                ctx.drawImage(this.starsImage, this.x, this.y + textureHeight)
                ctx.drawImage(this.starsImage, this.x - textureWidth, this.y + textureHeight)
            } else {
                ctx.drawImage(this.starsImage, this.x, this.y - textureHeight)
                ctx.drawImage(this.starsImage, this.x - textureWidth, this.y - textureHeight)
            }
        }
    }

    public updateProperties = (state: AppState, starLayer: StarLayerSettings) => {
        var recreateImage = false
        if (starLayer.speed != this.settings.speed) {
            this.settings.speed = starLayer.speed
        }
        if (state.settings.height != this.height
            || state.settings.width != this.width) {
            this.width = state.settings.width
            this.height = state.settings.height
            recreateImage = true
        }
        if (starLayer.numberOfStars != this.stars.length) {
            recreateImage = true
            this.changeNumberOfStars(starLayer.numberOfStars)
        }
        if (starLayer.starRadiusLowerBorder != this.settings.starRadiusLowerBorder
            || starLayer.starRadiusUpperBorder != this.settings.starRadiusUpperBorder) {
            recreateImage = true
            this.settings.starRadiusLowerBorder = starLayer.starRadiusLowerBorder
            this.settings.starRadiusUpperBorder = starLayer.starRadiusUpperBorder
        }
        if (recreateImage) {
            this.createImage()
        }
    }

    private createImage = () => {
        var tempCanvas = document.createElement("canvas")
        // add border gap to avoid having same star multiple times because of texture image strategy
        var textureImageWidth = this.width + this.borderGap
        var textureImageHeight = this.height + this.borderGap
        tempCanvas.width = textureImageWidth
        tempCanvas.height = textureImageHeight
        var tempCtx = tempCanvas.getContext("2d")
        if (tempCtx) {
            for (const star of this.stars) {
                tempCtx.fillStyle = "white"
                tempCtx.beginPath()

                const starX = star.x * textureImageWidth
                const starY = star.y * textureImageHeight
                const starR = this.settings.starRadiusLowerBorder + star.r * (this.settings.starRadiusUpperBorder - this.settings.starRadiusLowerBorder)

                this.drawStarOnCanvas(tempCtx, starX, starY, starR)

                // draw stars in range of gap on other side of the texture to make it a texture
                var xTexture1 = starX <= this.borderGap ? starX + textureImageWidth : null
                var xTexture2 = starX >= textureImageWidth - this.borderGap ? starX - textureImageWidth : null
                var yTexture1 = starY <= this.borderGap ? starY + textureImageHeight : null
                var yTexture2 = starY >= textureImageHeight - this.borderGap ? starY - textureImageHeight : null

                if (xTexture1) {
                    this.drawStarOnCanvas(tempCtx, xTexture1, starY, starR)
                    if (yTexture1) {
                        this.drawStarOnCanvas(tempCtx, starX, yTexture1, starR)
                        this.drawStarOnCanvas(tempCtx, xTexture1, yTexture1, starR)
                    } else if (yTexture2) {
                        this.drawStarOnCanvas(tempCtx, starX, yTexture2, starR)
                        this.drawStarOnCanvas(tempCtx, xTexture1, yTexture2, starR)
                    }
                } else if (xTexture2) {
                    this.drawStarOnCanvas(tempCtx, xTexture2, starY, starR)
                    if (yTexture1) {
                        this.drawStarOnCanvas(tempCtx, starX, yTexture1, starR)
                        this.drawStarOnCanvas(tempCtx, xTexture2, yTexture1, starR)
                    } else if (yTexture2) {
                        this.drawStarOnCanvas(tempCtx, starX, yTexture2, starR)
                        this.drawStarOnCanvas(tempCtx, xTexture2, yTexture2, starR)
                    }
                } else if (yTexture1) {
                    this.drawStarOnCanvas(tempCtx, starX, yTexture1, starR)
                } else if (yTexture2) {
                    this.drawStarOnCanvas(tempCtx, starX, yTexture2, starR)
                }
            }

            this.starsImage.src = tempCanvas.toDataURL()
        } else {
            console.error("e201910121240")
        }
    }

    private drawStarOnCanvas(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
        var glowSize = 3
        var end = r * glowSize
        var grad = ctx.createRadialGradient(x, y, 0, x, y, end)
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
        grad.addColorStop(1 / glowSize, 'rgba(255, 255, 255, 1)')
        grad.addColorStop(1 / (glowSize / 2), 'rgba(255, 255, 255, 0.2)')
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x, y, end, 0, Math.PI * 2)
        ctx.fill()
    }

    private changeNumberOfStars(newNumberOfStars: number) {
        var difference = newNumberOfStars - this.stars.length
        if (difference > 0) {
            for (let i = 0; i < difference; i++) {
                this.stars.push({
                    x: Math.random(),
                    y: Math.random(),
                    r: Math.random(),
                })
            }
        }
        else {
            for (let i = 0; i > difference; i--) {
                this.stars.splice(Math.floor(Math.random() * this.stars.length), 1)
            }
        }
    }

    // private resizeStars(newLowerBorder: number, newUpperBorder: number) {
    //     var currentRange = this.starRadiusUpperBorder - this.starRadiusLowerBorder
    //     var newRange = newUpperBorder - newLowerBorder
    //     for (const star of this.stars) {
    //         star.r = (star.r - this.starRadiusLowerBorder) / currentRange * newRange + newUpperBorder
    //     }
    //     this.starRadiusLowerBorder = newLowerBorder
    //     this.starRadiusUpperBorder = newUpperBorder
    // }
}