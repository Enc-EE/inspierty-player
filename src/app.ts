import { Stage } from "../enc/src/ui/stage";
import { InspiertyPlayerView } from "./inspiertyPlayerView";
import { Settings } from "./models/settings";
import { SettingsManager } from "./settings/settingsManager";
import { Dinject } from "../enc/src/dinject";
import { EAnimation } from "../enc/src/eAnimation";
import { ECanvas } from "../enc/src/ui/eCanvas";

export class App {
    public static settings = new Settings(window.innerWidth, window.innerHeight);
    public static settingManager = new SettingsManager();

    public run = () => {
        console.log("hi");

        document.body.style.backgroundColor = "black";

        console.log("injection ready");

        var canvas = ECanvas.createFullScreen();
        var stage = new Stage(canvas);
        var animation = new EAnimation();
        animation.addUpdateFunction(canvas.draw);

        Dinject.addInstance("canvas", canvas);
        Dinject.addInstance("stage", stage);
        Dinject.addInstance("animation", animation);

        var view = new InspiertyPlayerView();
        stage.setView(view);
    }
}