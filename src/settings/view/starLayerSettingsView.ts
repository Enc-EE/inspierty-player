import { LayoutView } from "../../../enc/src/ui/layoutControls/layoutView";
import { Rectangle } from "../../../enc/src/geometry/rectangle";
import { ListView } from "../../../enc/src/ui/layoutControls/listView";
import { Button } from "../../../enc/src/ui/controls/button";
import { Control } from "../../../enc/src/ui/controls/control";
import { App } from "../../app";
import { HorizontalAlignementOption } from "../../../enc/src/ui/alignement/horizontalAlignementOption";
import { VerticalAlignementOption } from "../../../enc/src/ui/alignement/verticalAlignementOption";
import { Slider } from "../../../enc/src/ui/controls/slider";
import { RangeSlider } from "../../../enc/src/ui/controls/rangeSlider";
import { NavigationView } from "./navigationView";
import { StarLayer } from "../../models/starLayer";
import { Style } from "../../view/style";
import { Label } from "../../../enc/src/ui/controls/label";
import { Orientation } from "../../../enc/src/ui/alignement/orientation";

export class StarLayerSettingsView extends NavigationView {
    private settingsList: ListView;

    constructor(public starLayer: StarLayer) {
        super(starLayer.name.get());

        this.settingsList = new ListView();
        this.settingsList.alignement.horizontalAlign = HorizontalAlignementOption.Left;
        this.settingsList.alignement.verticalAlign = VerticalAlignementOption.Top;

        var numberOfStarsValueLbl = new Label();
        var numberOfStarsHead = this.createHead("Number of Stars", numberOfStarsValueLbl, Math.round(starLayer.numberOfStars.get()).toString());
        this.settingsList.addItem(numberOfStarsHead);
        var numberOfStarsSldr = new Slider();
        numberOfStarsSldr.minValue = 50;
        numberOfStarsSldr.maxValue = 800;
        numberOfStarsSldr.properties.color1 = Style.fillStyle;
        numberOfStarsSldr.properties.color2 = Style.mousOver;
        numberOfStarsSldr.currentValue = starLayer.numberOfStars.get();
        this.settingsList.addItem(numberOfStarsSldr);
        numberOfStarsSldr.valueChanged.addEventListener((value) => { this.starLayer.numberOfStars.set(Math.round(value)); });
        starLayer.numberOfStars.onChanged.addEventListener((oldValue: number, newValue: number) => { numberOfStarsValueLbl.text = Math.round(newValue).toString(); })

        var speedValueLbl = new Label();
        var speedHead = this.createHead("Speed", speedValueLbl, this.round(starLayer.speed.get()).toString());
        this.settingsList.addItem(speedHead);
        var speedSldr = new Slider();
        speedSldr.minValue = 0;
        speedSldr.maxValue = 20;
        speedSldr.properties.color1 = Style.fillStyle;
        speedSldr.properties.color2 = Style.mousOver;
        speedSldr.currentValue = starLayer.speed.get();
        this.settingsList.addItem(speedSldr);
        speedSldr.valueChanged.addEventListener((value) => { starLayer.speed.set(value) });
        starLayer.speed.onChanged.addEventListener((oldValue: number, newValue: number) => { speedValueLbl.text = this.round(newValue).toString(); })
        
        var sizeValueLbl = new Label();
        var sizeHead = this.createHead("Size", sizeValueLbl, this.round(starLayer.starRadiusLowerBorder.get()) + " - " + this.round(starLayer.starRadiusUpperBorder.get()));
        this.settingsList.addItem(sizeHead);
        var sizeSldr = new RangeSlider();
        sizeSldr.minValue = 0.25;
        sizeSldr.maxValue = 1.5;
        sizeSldr.currentValueLow = starLayer.starRadiusLowerBorder.get();
        sizeSldr.currentValueHigh = starLayer.starRadiusUpperBorder.get();
        sizeSldr.properties.color1 = Style.fillStyle;
        sizeSldr.properties.color2 = Style.mousOver;
        this.settingsList.addItem(sizeSldr);
        sizeSldr.valuesChanged.addEventListener((v1, v2) => {
            if (starLayer.starRadiusLowerBorder.get() != v1) {
                starLayer.starRadiusLowerBorder.set(v1);
            }
            if (starLayer.starRadiusUpperBorder.get() != v2) {
                starLayer.starRadiusUpperBorder.set(v2);
            }
        });
        starLayer.starRadiusLowerBorder.onChanged.addEventListener((oldValue: number, newValue: number) => { sizeValueLbl.text = this.round(newValue) + " - " + this.round(starLayer.starRadiusUpperBorder.get()) });
        starLayer.starRadiusUpperBorder.onChanged.addEventListener((oldValue: number, newValue: number) => { sizeValueLbl.text = this.round(starLayer.starRadiusLowerBorder.get()) + " - " + this.round(newValue) });

        var removeLayerBtn = new Button();
        removeLayerBtn.text = "Remove Layer";
        removeLayerBtn.properties.fillStyle = Style.fillStyle;
        removeLayerBtn.properties.mouseOverFillStyle = Style.mousOver;
        this.settingsList.addItem(removeLayerBtn);
        removeLayerBtn.clicked.addEventListener((sender: Control) => {
            App.visualizationModel.starLayers.remove(this.starLayer);
            this.navigationView.onGoBack.dispatchEvent();
        });

        this.children.push(this.settingsList);
    }

    private round = (value: number) => {
        return Math.round(value * 100) / 100;
    }

    private createHead(settingName: string, numberOfStarsValueLbl: Label, valueText: string) {
        var numberOfStarsLbl = new Label();
        numberOfStarsLbl.text = settingName;
        numberOfStarsLbl.properties.fillStyle = Style.light2;
        numberOfStarsLbl.properties.fontSize = 22;
        numberOfStarsLbl.alignement.horizontalAlign = HorizontalAlignementOption.Center;
        numberOfStarsLbl.alignement.verticalAlign = VerticalAlignementOption.Center;
        numberOfStarsValueLbl.text = valueText;
        numberOfStarsValueLbl.properties.fillStyle = Style.light2;
        numberOfStarsValueLbl.properties.fontSize = 22;
        var numberOfStarsHead = new ListView();
        numberOfStarsHead.properties.orientation = Orientation.Horizontal;
        numberOfStarsHead.addItem(numberOfStarsLbl);
        numberOfStarsHead.addItem(numberOfStarsValueLbl);
        return numberOfStarsHead;
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        this.navigationView.updateLayout(ctx, bounds);
        var space = this.navigationView.dimensions.height * 1.5;
        this.settingsList.updateLayout(ctx, new Rectangle(bounds.x, bounds.y + space, bounds.width, bounds.height - space));
    }
}