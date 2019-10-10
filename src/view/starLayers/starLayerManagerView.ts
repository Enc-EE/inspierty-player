import { App } from "../../app";
import { StarLayer } from "../../models/starLayer";
import { StarLayerView } from "./starLayerView";
import { LayoutView } from "../../../enc/src/ui/layoutControls/layoutView";

export class StarLayerManagerView extends LayoutView {
    private starLayerViews: StarLayerView[] = [];

    constructor() {
        super();
        this.disableMouseEvents();
        // App.visualizationModel.starLayers.onAdd.addEventListener(this.addStarLayer);
        // App.visualizationModel.starLayers.onRemove.addEventListener(this.removeStarLayer);
    }

    private addStarLayer = (starLayer: StarLayer) => {
        var starLayerView = new StarLayerView(starLayer);
        this.starLayerViews.push(starLayerView);
        this.children.push(starLayerView);
    }

    private removeStarLayer = (starLayer: StarLayer) => {
        var starLayerView = this.starLayerViews.firstOrDefault(x => x.tag == starLayer);
        if (starLayerView) {
            this.starLayerViews.removeItem(starLayerView);
            this.children.removeItem(starLayerView);
        }
    }
}