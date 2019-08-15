import { LayoutView } from "../../enc/src/ui/layoutControls/layoutView";

import { Button } from "../../enc/src/ui/controls/button";
import { VerticalAlignementOption } from "../../enc/src/ui/alignement/verticalAlignementOption";
import { Rectangle } from "../../enc/src/geometry/rectangle";
import { ListView } from "../../enc/src/ui/layoutControls/listView";
import { Orientation } from "../../enc/src/ui/alignement/orientation";
import { Dinject } from "../../enc/src/dinject";
import { AudioManager } from "../audioManager";
import { Style } from "./style";

export class PlayerControlsView extends LayoutView {

    private playIconText = "\uf04b" // "play"
    private pauseIconText = "\uf04c" // "pause"
    private stopIconText = "\uf04d" // "stop"
    private nextIconText = "\uf051" // "next"
    private previousIconText = "\uf048" // "previous"

    constructor() {
        super();

        var audioManager: AudioManager = Dinject.getInstance("audio");

        var listView = new ListView();
        listView.alignement.verticalAlign = VerticalAlignementOption.Bottom;
        listView.alignement.margin.bottom = 20;
        listView.properties.orientation = Orientation.Horizontal;
        this.children.push(listView);

        var playPauseBtn = this.createBtn(this.playIconText, () => {
            this.playPause(playPauseBtn, audioManager);
        });
        listView.addItem(playPauseBtn);

        var stopBtn = this.createBtn(this.stopIconText, () => {
            audioManager.stop();
            if (playPauseBtn.text == this.pauseIconText) {
                playPauseBtn.text = this.playIconText;
            }
            this.triggerUpdateLayout();
        });
        listView.addItem(stopBtn);
        
        var previousBtn = this.createBtn(this.previousIconText, () => {
            audioManager.previous();
        });
        listView.addItem(previousBtn);
        
        var nextBtn = this.createBtn(this.nextIconText, () => {
            audioManager.next();
        });
        listView.addItem(nextBtn);

        
        document.addEventListener('keyup', (event) => {
            if (event.keyCode == 32) { // space
                this.playPause(playPauseBtn, audioManager);
            }
        });
    }

    private playPause(playPauseBtn: Button, audioManager: AudioManager) {
        if (playPauseBtn.text == this.playIconText) {
            audioManager.play();
            playPauseBtn.text = this.pauseIconText;
        }
        else {
            audioManager.pause();
            playPauseBtn.text = this.playIconText;
        }
        this.triggerUpdateLayout();
    }

    private createBtn(iconText: string, event: () => void) {
        var playPauseBtn = new Button();
        playPauseBtn.properties.fontPrefix = "900";
        playPauseBtn.properties.fontFamily = "'Font Awesome 5 Free'";
        playPauseBtn.text = iconText;
        playPauseBtn.properties.fillStyle = Style.fillStyle;
        playPauseBtn.properties.mouseOverFillStyle = Style.mousOver;
        playPauseBtn.clicked.addEventListener(event);
        return playPauseBtn;
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle) {
        super.updateLayout(ctx, bounds);
        for (const child of this.children) {
            child.updateLayout(ctx, this.bounds);
        }
    }
}