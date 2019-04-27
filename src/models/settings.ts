import { StarLayer } from "./starLayer";
import { EEventT, EEvent } from "../../enc/src/eEvent";

export class Settings {

    constructor(public width: number, public height: number) { }

    public onAddStarLayer = new EEventT<StarLayer>();
    public onRemoveStarLayer = new EEventT<StarLayer>();
    public starLayers: StarLayer[] = [];

    public addStarLayer = () => {
        var starLayer = new StarLayer();

        for (let i = 0; i < 100; i++) {
            starLayer.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                r: Math.random() * 2 + 0.05
            })
        }

        this.starLayers.push(starLayer);
        this.onAddStarLayer.dispatchEvent(starLayer);
    }

    public removeStarLayer = (starLayer: StarLayer) => {
        this.starLayers.removeItem(starLayer);
        this.onRemoveStarLayer.dispatchEvent(starLayer);
    }
}
