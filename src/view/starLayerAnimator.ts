import { App } from "../app";
import { StarLayer } from "../models/starLayer";

export class StarLayerAnimator {
    constructor(public starLayer: StarLayer) {
    }

    public update = (timeDiff: number) => {
        for (const star of this.starLayer.stars) {
            star.x += this.starLayer.speed * timeDiff;
            star.y += this.starLayer.speed * timeDiff;
            if (star.x > App.settings.width) {
                star.x -= App.settings.width;
            }
            if (star.y > App.settings.height) {
                star.y -= App.settings.height;
            }
        }
    }
}