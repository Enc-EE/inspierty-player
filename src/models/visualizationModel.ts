import { StarLayer } from "./starLayer";
import { ObservableArray } from "../../enc/src/ui/observableArray";
import { ObservableProperty } from "../../enc/src/ui/observableProperty";

export class VisualizationModel {
    public width: ObservableProperty<number>;
    public height: ObservableProperty<number>;
    constructor(width: number, height: number) {
        this.width = new ObservableProperty<number>(width);
        this.height = new ObservableProperty<number>(height);
    }
    public starLayers = new ObservableArray<StarLayer>();
}