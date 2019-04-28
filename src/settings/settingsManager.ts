import { SettingOperation } from "./settingOperation";
import { EEventT } from "../../enc/src/eEvent";
import { App } from "../app";
import { StarLayer } from "../models/starLayer";

export class SettingsManager {
    public update = new EEventT<SettingOperation>();

    public addStarLayer = () => {
        var layer = new StarLayer();

        for (let i = 0; i < 100; i++) {
            layer.stars.push({
                x: Math.random() * App.settings.width,
                y: Math.random() * App.settings.height,
                r: Math.random() * 2 + 0.05
            })
        }

        App.settings.starLayers.push(layer);
        this.update.dispatchEvent(SettingOperation.AddStarLayer);
    }

    public removeStarLayer = (starLayer: StarLayer) => {
        App.settings.starLayers.removeItem(starLayer);
        this.update.dispatchEvent(SettingOperation.RemoveStarLayer);
    }

    public changeNumberOfStars = (starLayer: StarLayer, numberOfStars: number) => {
        if (numberOfStars > 0) {
            var diff = numberOfStars - starLayer.stars.length;
            if (diff > 0) {
                for (let i = 0; i < diff; i++) {
                    starLayer.stars.push({
                        x: Math.random() * App.settings.width,
                        y: Math.random() * App.settings.height,
                        r: Math.random() * 2 + 0.05
                    })
                }
            } else if (diff < 0) {
                for (let i = 0; i < diff; i++) {
                    starLayer.stars.splice(Math.floor(Math.random() * starLayer.stars.length), 1);
                }
            }
            this.update.dispatchEvent(SettingOperation.ChangeNumberOfStars);
        }
    }
}