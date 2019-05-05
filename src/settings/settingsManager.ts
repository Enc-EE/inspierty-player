import { SettingOperation } from "./settingOperation";
import { EEventT } from "../../enc/src/eEvent";
import { App } from "../app";
import { StarLayer } from "../models/starLayer";

export class SettingsManager {
    public update = new EEventT<SettingOperation>();

    public addStarLayer = () => {
        var layer = new StarLayer();

        for (let i = 0; i < 300; i++) {
            layer.stars.push({
                x: Math.random() * App.settings.width,
                y: Math.random() * App.settings.height,
                r: Math.random() * 0.5 + 0.05
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
            }
            else if (diff < 0) {
                for (let i = 0; i < -diff; i++) {
                    starLayer.stars.splice(Math.floor(Math.random() * starLayer.stars.length), 1);
                }
            }
            this.update.dispatchEvent(SettingOperation.ChangeNumberOfStars);
        }
    }

    public changeSpeed = (starLayer: StarLayer, speed: number) => {
        starLayer.speed = speed;
        this.update.dispatchEvent(SettingOperation.ChangeSpeed);
    }

    public changeSizes = (starLayer: StarLayer, lowBorder: number, highBorder: number) => {
        var sizes = starLayer.stars.map(x => x.r);
        var currentValueLow = Math.min(...sizes);
        var currentValueHigh = Math.max(...sizes);

        var minFix = (currentValueHigh - currentValueLow);
        if (minFix <= 0) {
            minFix = 0.0001
        }
        for (const star of starLayer.stars) {
            star.r = ((star.r - currentValueLow) / minFix * (highBorder - lowBorder)) + lowBorder;
        }
        this.update.dispatchEvent(SettingOperation.ChangeSpeed);
    }
}