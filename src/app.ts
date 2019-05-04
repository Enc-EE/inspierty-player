import { Stage } from "../enc/src/ui/stage";
import { InspiertyPlayerView } from "./inspiertyPlayerView";
import { Settings } from "./models/settings";
import { SettingsManager } from "./settings/settingsManager";
import { Dinject } from "../enc/src/dinject";
import { EAnimation } from "../enc/src/eAnimation";
import { ECanvas } from "../enc/src/ui/eCanvas";
import { CanvasHelper } from "../enc/src/ui/canvasHelper";
import { AudioManager } from "./audioManager";

export class App {
    public static settings = new Settings(window.innerWidth, window.innerHeight);
    public static settingManager = new SettingsManager();

    public run = () => {
        document.body.style.backgroundColor = "black";

        var audioManager = new AudioManager();

        console.log("loading app");

        Promise.all([
            new CanvasHelper().loadFontawesomeFree(),
            audioManager.reload()
        ]).then(() => {
            console.log("loaded app");

            var canvas = ECanvas.createFullScreen();
            var stage = new Stage(canvas);
            var animation = new EAnimation();
            animation.addUpdateFunction(canvas.draw);

            Dinject.addInstance("audio", audioManager);
            Dinject.addInstance("canvas", canvas);
            Dinject.addInstance("stage", stage);
            Dinject.addInstance("animation", animation);

            var view = new InspiertyPlayerView();
            stage.setView(view);

            App.settingManager.addStarLayer();
            App.settingManager.addStarLayer();
        });
    }
}