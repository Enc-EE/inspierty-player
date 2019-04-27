import { Stage } from "../enc/src/ui/stage";
import { InspiertyPlayerView } from "./inspiertyPlayerView";
import { Settings } from "./models/settings";

export class App {
    public static settings = new Settings(window.innerWidth, window.innerHeight);

    public run = () => {
        console.log("hi");

        document.body.style.backgroundColor = "black";
        var stage = Stage.create();

        var view = new InspiertyPlayerView();
        stage.setView(view);
    }
}