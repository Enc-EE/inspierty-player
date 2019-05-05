import { LayoutView } from "../../../enc/src/ui/layoutControls/layoutView";
import { Rectangle } from "../../../enc/src/geometry/rectangle";
import { StarLayer } from "../../models/starLayer";
import { ListView } from "../../../enc/src/ui/layoutControls/listView";
import { Button } from "../../../enc/src/ui/controls/button";
import { Control } from "../../../enc/src/ui/controls/control";
import { App } from "../../app";
import { HorizontalAlignementOption } from "../../../enc/src/ui/alignement/horizontalAlignementOption";
import { VerticalAlignementOption } from "../../../enc/src/ui/alignement/verticalAlignementOption";
import { Slider } from "../../../enc/src/ui/controls/slider";
import { RangeSlider } from "../../../enc/src/ui/controls/rangeSlider";

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
        this.settingsList.addItem(btnForLayer);
        this.children.push(btnForLayer);
        btnForLayer.clicked.addEventListener((sender: Control) => {
            App.settingManager.removeStarLayer(this.starLayer);
        });

        var slider = new Slider();
        slider.minValue = 10;
        slider.maxValue = 1000;
        slider.currentValue = starLayer.stars.length;
        this.children.push(slider);
        this.settingsList.addItem(slider);
        slider.valueChanged.addEventListener(this.numberOfStarsChanged);

        var sliderSpeed = new Slider();
        sliderSpeed.minValue = 0;
        sliderSpeed.maxValue = 20;
        sliderSpeed.currentValue = starLayer.speed;
        this.children.push(sliderSpeed);
        this.settingsList.addItem(sliderSpeed);
        sliderSpeed.valueChanged.addEventListener(this.speedChanged);

        var sliderSize = new RangeSlider();
        var sizes = this.starLayer.stars.map(x => x.r);
        sliderSize.minValue = 0.001;
        sliderSize.maxValue = 2;
        sliderSize.currentValueLow = Math.min(...sizes);
        sliderSize.currentValueHigh = Math.max(...sizes);
        this.children.push(sliderSize);
        this.settingsList.addItem(sliderSize);
        sliderSize.valuesChanged.addEventListener(this.sizesChanged);
    }

    public numberOfStarsChanged = (numberOfStars: number) => {
        App.settingManager.changeNumberOfStars(this.starLayer, Math.round(numberOfStars));
    }

    public speedChanged = (speed: number) => {
        App.settingManager.changeSpeed(this.starLayer, speed);
    }

    public sizesChanged = (lowBorder: number, highBorder: number) => {
        App.settingManager.changeSizes(this.starLayer, lowBorder, highBorder);
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        this.settingsList.updateLayout(ctx, new Rectangle(bounds.x, bounds.y, 0, 0));
    }
}