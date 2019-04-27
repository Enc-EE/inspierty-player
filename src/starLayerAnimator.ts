import { App } from "./app";
import { StarLayer } from "./models/starLayer";
import { EAnimation } from "../enc/src/eAnimation";

export class StarLayerAnimator {
    constructor(public starLayer: StarLayer) {
    }

    public update = (timeDiff: number) => {
        for (const star of this.starLayer.stars) {
            star.x += this.starLayer.speed * timeDiff;
            if (star.x > App.settings.width) {
                star.x -= App.settings.width;
            }
        }
    }
}