import { LayoutView } from "../../enc/src/ui/layoutControls/layoutView";
import { Rectangle } from "../../enc/src/geometry/rectangle";
import { StarLayer } from "../models/starLayer";
import { ListView } from "../../enc/src/ui/layoutControls/listView";
import { Button } from "../../enc/src/ui/controls/button";
import { Control } from "../../enc/src/ui/controls/control";
import { App } from "../app";
import { HorizontalAlignementOption } from "../../enc/src/ui/alignement/horizontalAlignementOption";
import { VerticalAlignementOption } from "../../enc/src/ui/alignement/verticalAlignementOption";
import { Slider } from "../../enc/src/ui/controls/slider";

export class StarLayerView extends LayoutView {
    private settingsList: ListView;

    constructor(public starLayer: StarLayer) {
        super();
        this.settingsList = new ListView();
        this.settingsList.alignement.horizontalAlign = HorizontalAlignementOption.Left;
        this.settingsList.alignement.verticalAlign = VerticalAlignementOption.Top;
        var btnForLayer = new Button();
        btnForLayer.text = "Remove Layer";
        btnForLayer.properties.fillStyle = "white";
        this.settingsList.addControl(btnForLayer);
        this.children.push(btnForLayer);
        btnForLayer.clicked.addEventListener((sender: Control) => {
            App.settingManager.removeStarLayer(this.starLayer);
        });

        var slider = new Slider();
        slider.minValue = 10;
        slider.maxValue = 1000;
        slider.currentValue = starLayer.stars.length;
        this.children.push(slider);
        this.settingsList.addControl(slider);
        slider.valueChanged.addEventListener(this.numberOfStarsChanged);
    }

    public numberOfStarsChanged = (numberOfStars: number) => {
        App.settingManager.changeNumberOfStars(this.starLayer, Math.round(numberOfStars));
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        this.settingsList.updateLayout(ctx, new Rectangle(bounds.x, bounds.y, 0, 0));
    }
}