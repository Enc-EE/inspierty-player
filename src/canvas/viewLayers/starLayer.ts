import { ViewLayer } from "./viewLayerBase"
import { StarLayer } from "../../settings2/types"
import { Star } from "../../models/star"

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
    private starRadiusLowerBorder = 1
    private starRadiusUpperBorder = 2
    private width = 100
    private height = 100
    private speed = 0
    private angle = Math.PI / 4

    public update = (timeDiff: number) => {
        this.x += Math.cos(this.angle) * this.speed * timeDiff
        this.y += Math.sin(this.angle) * this.speed * timeDiff

        if (this.x > this.width) {
            this.x -= this.width
        } else if (this.x < this.width) {
            this.x += this.width
        }
        if (this.y > this.height) {
            this.y -= this.height
        } else if (this.y < this.height) {
            this.y += this.height
        }
    }

    public draw = (ctx: CanvasRenderingContext2D) => {
        ctx.drawImage(this.starsImage, this.x, this.y)
        ctx.drawImage(this.starsImage, this.x - this.width, this.y)
        ctx.drawImage(this.starsImage, this.x - this.width, this.y - this.height)
        ctx.drawImage(this.starsImage, this.x, this.y - this.height)
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
            this.resizeStars(state.starLayer.starRadiusLowerBorder, state.starLayer.starRadiusUpperBorder)
        }
        if (recreateImage) {
            this.createImage()
        }
    }

    private createImage = () => {
        var tempCanvas = document.createElement("canvas")
        tempCanvas.width = this.width
        tempCanvas.height = this.height
        var tempCtx = tempCanvas.getContext("2d")
        if (tempCtx) {
            var endlessBorderGap = 3
            for (const star of this.stars) {
                tempCtx.fillStyle = "white"
                tempCtx.beginPath()

                tempCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
                tempCtx.fill()

                if (star.x >= this.width - endlessBorderGap) {
                    tempCtx.beginPath()
                    tempCtx.arc(star.x - this.width, star.y, star.r, 0, Math.PI * 2)
                    tempCtx.fill()

                    if (star.y >= this.height - endlessBorderGap) {
                        tempCtx.beginPath()
                        tempCtx.arc(star.x - this.width, star.y - this.height, star.r, 0, Math.PI * 2)
                        tempCtx.fill()
                    }
                }

                if (star.y >= this.height - endlessBorderGap) {
                    tempCtx.beginPath()
                    tempCtx.arc(star.x, star.y - this.height, star.r, 0, Math.PI * 2)
                    tempCtx.fill()
                }

                var end = star.r * 3
                var grad = tempCtx.createRadialGradient(star.x, star.y, star.r, star.x, star.y, end)
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
                tempCtx.fillStyle = grad
                tempCtx.arc(star.x, star.y, end, 0, Math.PI * 2)
                tempCtx.fill()
            }

            this.starsImage.src = tempCanvas.toDataURL()
        } else {
            console.error("e201910121240")
        }
    }

    private changeNumberOfStars(newNumberOfStars: number) {
        var difference = newNumberOfStars - this.stars.length
        if (difference > 0) {
            for (let i = 0; i < difference; i++) {
                this.stars.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    r: Math.random() * (this.starRadiusUpperBorder - this.starRadiusLowerBorder) + this.starRadiusLowerBorder
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