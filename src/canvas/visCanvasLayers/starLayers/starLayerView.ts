import { ViewLayer } from "../viewLayerBase"
import { StarLayer } from "../../../settings/types"
import { Star } from "./star"

export interface Props {
    width: number
    height: number
    starLayer: StarLayer
}

export class StarLayerView implements ViewLayer {
    private stars: Star[] = []
    private starsImage = new Image()
    private x = 0
    private y = 0
    private borderGap = 40
    private starRadiusLowerBorder = 0.35
    private starRadiusUpperBorder = 0.6
    private width = 100
    private height = 100
    private speed = 1

    constructor(public angle: number) { }

    public update = (timeDiff: number) => {
        this.x += Math.cos(this.angle) * this.speed * timeDiff
        this.y += Math.sin(this.angle) * this.speed * timeDiff

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
    }

    public draw = (ctx: CanvasRenderingContext2D) => {
        // texture image strategy
        ctx.drawImage(this.starsImage, this.x, this.y)
        var textureWidth = this.width + this.borderGap
        var textureHeight = this.height + this.borderGap
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

    public updateProperties = (state: Props) => {
        var recreateImage = false
        if (state.starLayer.speed != this.speed) {
            this.speed = state.starLayer.speed
        }
        if (state.height != this.height
            || state.width != this.width) {
            this.width = state.width
            this.height = state.height
            recreateImage = true
        }
        if (state.starLayer.numberOfStars != this.stars.length) {
            recreateImage = true
            this.changeNumberOfStars(state.starLayer.numberOfStars)
        }
        if (state.starLayer.starRadiusLowerBorder != this.starRadiusLowerBorder
            || state.starLayer.starRadiusUpperBorder != this.starRadiusUpperBorder) {
            recreateImage = true
            this.starRadiusLowerBorder = state.starLayer.starRadiusLowerBorder
            this.starRadiusUpperBorder = state.starLayer.starRadiusUpperBorder
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
                const starR = this.starRadiusLowerBorder + star.r * (this.starRadiusUpperBorder - this.starRadiusLowerBorder)

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

    private resizeStars(newLowerBorder: number, newUpperBorder: number) {
        var currentRange = this.starRadiusUpperBorder - this.starRadiusLowerBorder
        var newRange = newUpperBorder - newLowerBorder
        for (const star of this.stars) {
            star.r = (star.r - this.starRadiusLowerBorder) / currentRange * newRange + newUpperBorder
        }
        this.starRadiusLowerBorder = newLowerBorder
        this.starRadiusUpperBorder = newUpperBorder
    }
}