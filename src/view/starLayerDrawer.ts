import { LayoutView } from "../../enc/src/ui/layoutControls/layoutView";
import { StarRenderObject } from "./starRenderObject";
import { Rectangle } from "../../enc/src/geometry/rectangle";
import { StarLayer } from "../models/starLayer";
import { App } from "../app";
import { SettingOperation } from "../settings/settingOperation";

export class StarLayerDrawer extends LayoutView {
    constructor(public starLayer: StarLayer) {
        super();
        App.settingManager.update.addEventListener(this.settingsUpdated)
        this.disableMouseEvents();
        this.triggerUpdateLayout();
    }

    private settingsUpdated = (operation: SettingOperation) => {
        switch (operation) {
            case SettingOperation.ChangeNumberOfStars:
                this.updateNumberOfStars();
                break;
        }
    }

    private updateNumberOfStars = () => {
        this.triggerUpdateLayout();
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        this.children = [];

        for (const star of this.starLayer.stars) {
            this.children.push(new StarRenderObject(star));
        }
    }


    public mouseMove(ev: MouseEvent) {
    }

    public click(ev: MouseEvent) {
    }
}