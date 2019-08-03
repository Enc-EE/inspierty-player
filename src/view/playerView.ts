import { LayoutView } from "../../enc/src/ui/layoutControls/layoutView";

import { Button } from "../../enc/src/ui/controls/button";
import { VerticalAlignementOption } from "../../enc/src/ui/alignement/verticalAlignementOption";
import { Rectangle } from "../../enc/src/geometry/rectangle";
import { ListView } from "../../enc/src/ui/layoutControls/listView";
import { Orientation } from "../../enc/src/ui/alignement/orientation";
import { Dinject } from "../../enc/src/dinject";
import { AudioManager } from "../audioManager";
import { Style } from "./style";

export class PlayerView extends LayoutView {

    private playIconText = "\uf04b"
    private pauseIconText = "\uf04c"
    private stopIconText = "\uf04d"
    private nextIconText = "\uf051"
    private previousIconText = "\uf048"

    // private playIconText = "play"
    // private pauseIconText = "pause"
    // private stopIconText = "stop"
    // private nextIconText = "next"
    // private previousIconText = "previous"

    constructor() {
        super();

        var audioManager: AudioManager = Dinject.getInstance("audio");

        var listView = new ListView();
        listView.alignement.verticalAlign = VerticalAlignementOption.Bottom;
        listView.alignement.margin.bottom = 20;
        listView.properties.orientation = Orientation.Horizontal;
        this.children.push(listView);

        var playPauseBtn = new Button();
        playPauseBtn.properties.fontPrefix = "900"
        playPauseBtn.properties.fontFamily = "'Font Awesome 5 Free'"
        playPauseBtn.text = this.playIconText;
        playPauseBtn.properties.fillStyle = Style.fillStyle;
        playPauseBtn.properties.mouseOverFillStyle = Style.mousOver;
        playPauseBtn.clicked.addEventListener(() => {
            if (playPauseBtn.text == this.playIconText) {
                audioManager.play();
                playPauseBtn.text = this.pauseIconText;
            } else {
                audioManager.pause();
                playPauseBtn.text = this.playIconText;
            }
            this.triggerUpdateLayout();
        });
        listView.addItem(playPauseBtn);

        var stopBtn = new Button();
        stopBtn.properties.fontPrefix = "900"
        stopBtn.properties.fontFamily = "'Font Awesome 5 Free'"
        stopBtn.text = this.stopIconText;
        stopBtn.properties.fillStyle = Style.fillStyle;
        stopBtn.properties.mouseOverFillStyle = Style.mousOver;
        stopBtn.clicked.addEventListener(() => {
            audioManager.stop();
            if (playPauseBtn.text == this.pauseIconText) {
                playPauseBtn.text = this.playIconText;
            }
            this.triggerUpdateLayout();
        });
        listView.addItem(stopBtn);

        var previousBtn = new Button();
        previousBtn.properties.fontPrefix = "900"
        previousBtn.properties.fontFamily = "'Font Awesome 5 Free'"
        previousBtn.text = this.previousIconText;
        previousBtn.properties.fillStyle = Style.fillStyle;
        previousBtn.properties.mouseOverFillStyle = Style.mousOver;
        previousBtn.clicked.addEventListener(() => {
            audioManager.previous();
        });
        listView.addItem(previousBtn);

        var nextBtn = new Button();
        nextBtn.properties.fontPrefix = "900"
        nextBtn.properties.fontFamily = "'Font Awesome 5 Free'"
        nextBtn.text = this.nextIconText;
        nextBtn.properties.fillStyle = Style.fillStyle;
        nextBtn.properties.mouseOverFillStyle = Style.mousOver;
        nextBtn.clicked.addEventListener(() => {
            audioManager.next();
        });
        listView.addItem(nextBtn);
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle) {
        super.updateLayout(ctx, bounds);
        for (const child of this.children) {
            child.updateLayout(ctx, this.bounds);
        }
    }
}