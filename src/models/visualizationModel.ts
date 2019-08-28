import { StarLayer } from "./starLayer";
import { ObservableArray } from "../../enc/src/ui/observableArray";
import { ObservableProperty } from "../../enc/src/ui/observableProperty";
import { ShootingStarConfig } from "./shootingStarConfig";

export class VisualizationModel {
    constructor(size: Size) {
        this.size = new ObservableProperty(size);
        this.size.onChangedDelay.delayTime = 0.5;
    }
    public size: ObservableProperty<Size>
    public starLayers = new ObservableArray<StarLayer>();
    public shootingStars = new ShootingStarConfig();
}

export class Size {
    readonly width: number;
    readonly height: number;
}