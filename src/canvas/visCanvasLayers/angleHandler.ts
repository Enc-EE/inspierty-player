export class AngleHandler {
    public angle = Math.PI * 1 / 4
    private angleTarget = this.angle
    private angleTargetLowerBound = - Math.PI * 1 / 4
    private angleTargetUpperBound = Math.PI * 5 / 4

    private angleChangingSpeed = Math.PI * 2 / 1800
    private angleChangingSpeedTarget = this.angleChangingSpeed
    private angleChangingSpeedChangingValue = Math.PI * 2 / 3600
    private angleChangingSpeedTargetLowerBound = Math.PI * 2 / 1800
    private angleChangingSpeedTargetUpperBound = Math.PI * 2 / 900

    public update = (timeDiff: number) => {
        if (this.angle == this.angleTarget) {
            this.angleTarget = this.angleTargetLowerBound + Math.random() * (this.angleTargetUpperBound - this.angleTargetLowerBound)
        }

        if (this.angleChangingSpeed == this.angleChangingSpeedTarget) {
            this.angleChangingSpeedTarget = this.angleChangingSpeedTargetLowerBound + Math.random() * (this.angleChangingSpeedTargetUpperBound - this.angleChangingSpeedTargetLowerBound)
        }

        var angleChangingSpeedDiff = this.angleChangingSpeedTarget - this.angleChangingSpeed
        if (angleChangingSpeedDiff > 0) {
            this.angleChangingSpeed += this.angleChangingSpeedChangingValue * timeDiff
            if (this.angleChangingSpeed > this.angleChangingSpeedTarget) {
                this.angleChangingSpeed = this.angleChangingSpeedTarget
            }
        } else {
            this.angleChangingSpeed -= this.angleChangingSpeedChangingValue * timeDiff
            if (this.angleChangingSpeed < this.angleChangingSpeedTarget) {
                this.angleChangingSpeed = this.angleChangingSpeedTarget
            }
        }

        var angleDiff = this.angleTarget - this.angle
        if (angleDiff > 0) {
            this.angle += this.angleChangingSpeed * timeDiff
            if (this.angle > this.angleTarget) {
                this.angle = this.angleTarget
            }
        } else {
            this.angle -= this.angleChangingSpeed * timeDiff
            if (this.angle < this.angleTarget) {
                this.angle = this.angleTarget
            }
        }
    }
}