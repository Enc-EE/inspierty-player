import { Stage } from "../enc/src/ui/stage";
import { RootView } from "./view/rootView";
import { Dinject } from "../enc/src/dinject";
import { EAnimation } from "../enc/src/eAnimation";
import { ECanvas } from "../enc/src/ui/eCanvas";
import { CanvasHelper } from "../enc/src/ui/canvasHelper";
import { AudioManager } from "./audioManager";
import { AssetManager } from "../enc/src/assetManager";

import backgroundPng from "./assets/background.png"
import logoFrontPng from "./assets/logo-front.png"
import logoNovaPng from "./assets/logo-nova.png"
import { LoadingView } from "./view/loadingView";
import { VisualizationModel } from "./models/visualizationModel";
import { StarLayer } from "./models/starLayer";

export class App {
    public static visualizationModel = new VisualizationModel(window.innerWidth, window.innerHeight);

    public run = () => {
        document.body.style.backgroundColor = "black";

        var canvas = ECanvas.createFullScreen();
        var stage = new Stage(canvas);
        var animation = new EAnimation();
        animation.addUpdateFunction(canvas.draw);

        Dinject.addInstance("canvas", canvas);
        Dinject.addInstance("stage", stage);
        Dinject.addInstance("animation", animation);

        var loadingView = new LoadingView();
        loadingView.deactivated();
        stage.setView(loadingView);
        loadingView.activate(0.7);

        var inspiertyPlayerView: RootView;

        console.log("loading app");
        Promise.all([
            new CanvasHelper().loadFontawesomeFree(),
            new Promise((resolve, reject) => {
                var audioManager = new AudioManager();
                audioManager.reload()
                Dinject.addInstance("audio", audioManager);
                resolve();
            }),
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            }),
            new Promise((resolve, reject) => {
                var assetManager = new AssetManager();
                Dinject.addInstance("assets", assetManager);
                assetManager.addImage("background", backgroundPng);
                assetManager.addImage("logo", logoFrontPng);
                assetManager.addImage("logo-nova", logoNovaPng);
                assetManager.load()
                    .then(() => {

                        inspiertyPlayerView = new RootView();
                        inspiertyPlayerView.deactivated();

                        for (let i = 0; i < 4; i++) {
                            var starLayer = new StarLayer();
                            starLayer.name.set("Stars " + (i + 1));
                            App.visualizationModel.starLayers.add(starLayer);

                        }
                        resolve();
                    })
            })
        ]).then(() => {
            loadingView.deactivate(0.7);
            setTimeout(() => {
                stage.setView(inspiertyPlayerView);
                inspiertyPlayerView.activate(0.7);
            }, 800);
        }).catch((error) => {
            console.log(error);
            alert(error);
        });
    }
}