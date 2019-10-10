import { LayoutView } from "../../../enc/src/ui/layoutControls/layoutView";
import { Button } from "../../../enc/src/ui/controls/button";
import { Style } from "../../view/style";
import { Control } from "../../../enc/src/ui/controls/control";
import { App } from "../../app";
import { StarLayer } from "../../models/starLayer";
import { EEvent } from "../../../enc/src/eEvent";
import { NavigationView } from "./navigationView";
import { ListView } from "../../../enc/src/ui/layoutControls/listView";
import { Rectangle } from "../../../enc/src/geometry/rectangle";
import { VerticalAlignementOption } from "../../../enc/src/ui/alignement/verticalAlignementOption";
import { HorizontalAlignementOption } from "../../../enc/src/ui/alignement/horizontalAlignementOption";
import { StarLayerSettingsView } from "./starLayerSettingsView";

export class StarLayersSettingsView extends NavigationView {

    private addLayerBtn: Button;
    private layerButtons: Button[] = [];
    layerList: ListView;
    subView: StarLayerSettingsView;

    constructor() {
        super("Star Layers");

        this.layerList = new ListView();
        this.layerList.alignement.horizontalAlign = HorizontalAlignementOption.Left;
        this.layerList.alignement.verticalAlign = VerticalAlignementOption.Top;

        // for (const starLayer of App.visualizationModel.starLayers.items) {
        //     this.layerList.addItem(this.createEditLayerBtn(starLayer));
        // }

        var btnNewLayer = new Button();
        btnNewLayer.text = "Add Layer";
        btnNewLayer.properties.fillStyle = Style.fillStyle;
        btnNewLayer.properties.mouseOverFillStyle = Style.mousOver;
        btnNewLayer.clicked.addEventListener((sender: Control) => {
            var newStarLayer = new StarLayer();
            // newStarLayer.name.set("Stars " + (App.visualizationModel.starLayers.items.length + 1));
            // App.visualizationModel.starLayers.add(newStarLayer);
        });
        this.addLayerBtn = btnNewLayer;
        this.layerList.addItem(btnNewLayer);
        this.children.push(this.layerList);

        // App.visualizationModel.starLayers.onAdd.addEventListener((starLayer) => {
        //     this.layerList.removeItem(this.addLayerBtn);
        //     this.layerList.addItem(this.createEditLayerBtn(starLayer));
        //     this.layerList.addItem(this.addLayerBtn);
        // });

        // App.visualizationModel.starLayers.onRemove.addEventListener((starLayer) => {
        //     var layerBtn = this.layerList.items.firstOrDefault(x => x.tag == starLayer);
        //     if (layerBtn) {
        //         this.layerList.removeItem(layerBtn)
        //     }
        // });
    }

    private createEditLayerBtn(starLayer: StarLayer) {
        var editLayerBtn = new Button();
        editLayerBtn.text = starLayer.name.get();
        editLayerBtn.tag = starLayer;
        editLayerBtn.properties.fillStyle = Style.fillStyle;
        editLayerBtn.properties.mouseOverFillStyle = Style.mousOver;
        editLayerBtn.clicked.addEventListener((sender: Control) => {
            this.editLayer(starLayer);
        });
        return editLayerBtn;
    }

    private editLayer(starLayer: StarLayer) {
        this.children.removeItem(this.navigationView);
        this.children.removeItem(this.layerList);
        this.subView = new StarLayerSettingsView(starLayer);
        this.subView.navigationView.onGoBack.addEventListener(() => {
            this.children.removeItem(this.subView);
            this.subView = undefined;
            this.children.push(this.navigationView);
            this.children.push(this.layerList);
        });
        this.children.push(this.subView);
        this.triggerUpdateLayout();
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        super.updateLayout(ctx, bounds);
        this.navigationView.updateLayout(ctx, bounds);
        var space = this.navigationView.dimensions.height * 1.5;
        this.layerList.updateLayout(ctx, new Rectangle(bounds.x, bounds.y + space, bounds.width, bounds.height - space));

        if (this.subView) {
            this.subView.updateLayout(ctx, bounds);
        }
    }
}