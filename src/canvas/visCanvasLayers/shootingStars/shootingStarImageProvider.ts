export interface ShootingStarImage {
    image: HTMLImageElement
    offsetX: number
    offsetY: number
    sizeFactor: number
    heightFactor: number
}

export class ShootingStarImageProvider {
    private image: ShootingStarImage

    constructor() {
        // 100 * 20
        var border = 5
        var length = 90
        var r = 5
        var thinR = 0
        const height = (border + r) * 2
        var xImageOffset = border + length
        var yImageOffset = height / 2

        var tempCanvas = document.createElement("canvas")
        tempCanvas.width = border + length + r + border
        tempCanvas.height = height

        var tempCtx = tempCanvas.getContext("2d")
        if (!tempCtx) {
            throw "err202001241917"
        }

        tempCtx.beginPath()
        tempCtx.moveTo(border, height / 2 - thinR)
        tempCtx.lineTo(border + length, border)
        tempCtx.bezierCurveTo(border + length + r, height / 2 - r, border + length + r, height / 2 + r, border + length, height / 2 + r)
        tempCtx.lineTo(border, height / 2 + thinR)
        tempCtx.closePath()

        tempCtx.fillStyle = "rgba(255, 255, 255, 1)"
        tempCtx.fill()

        var image = new Image()
        image.src = tempCanvas.toDataURL()

        this.image = {
            image: image,
            offsetX: xImageOffset,
            offsetY: yImageOffset,
            heightFactor: 1,
            sizeFactor: 1,
        }
    }

    public getImage100 = () => {
        return this.image
    }

    public getImage = (sizePointRadius: number, flattenPercent: number): ShootingStarImage => {
        return {
            ...this.image,
            sizeFactor: sizePointRadius / 10,
            heightFactor: 1 - (flattenPercent / 100),
        }
    }
}