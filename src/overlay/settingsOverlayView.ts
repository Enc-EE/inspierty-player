import { LayoutView } from "../../enc/src/ui/layoutControls/layoutView";
import { Rectangle } from "../../enc/src/geometry/rectangle";
import { SettingsOverlayViewModel } from "./settingsOverlayViewModel";
import { SettingsOverlayViewModelState } from "./settingsOverlayViewModelState";
import { Button } from "../../enc/src/ui/controls/button";
import { Point } from "../../enc/src/geometry/point";
import { Control } from "../../enc/src/ui/controls/control";
import { ListView } from "../../enc/src/ui/layoutControls/listView";
import { StarLayer } from "../models/starLayer";
import { App } from "../app";

export class SettingsOverlayView extends LayoutView {
    private viewModel: SettingsOverlayViewModel = new SettingsOverlayViewModel();
    private lastMoved = Date.now();
    private inactivityTimeout = 2000;
    private showOverLayerButton: Button;
    private settingsList: ListView;

    constructor() {
        super();
        this.showOverLayerButton = new Button();
        this.showOverLayerButton.text = "Show/Hide Settings";
        this.showOverLayerButton.properties.fillStyle = "green";
        this.showOverLayerButton.verticalAlign = "top";
        this.showOverLayerButton.horizontalAlign = "left";
        this.showOverLayerButton.clicked.addEventListener(this.showHideOverlayClicked);
        this.showOverLayerButton.properties.backgroundFillStyle = "rgba(0, 0, 0, 0.5)";
        this.children.push(this.showOverLayerButton);
        this.settingsList = new ListView();
        var btn1 = new Button();
        btn1.properties.fillStyle = "white";
        this.settingsList.items.push(btn1);
        App.settings.onAddStarLayer.addEventListener(this.addStarLayer);
        App.settings.onRemoveStarLayer.addEventListener(this.removeStarLayer);
    }

    public addStarLayer = (starLayer: StarLayer) => {
        this.updateSettings();
    }

    public removeStarLayer = (starLayer: StarLayer) => {
        this.updateSettings();
    }

    private showHideOverlayClicked = (sender: Control) => {
        if (this.viewModel.state == SettingsOverlayViewModelState.visible) {
            this.setState(SettingsOverlayViewModelState.beforeVisible);
        } else {
            this.setState(SettingsOverlayViewModelState.visible);
        }
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        this.showOverLayerButton.align(ctx, new Point(bounds.x, bounds.y));
        this.settingsList.updateLayout(ctx, new Rectangle(100, 100, 400, 400));

    }

    public mouseMove = (ev: MouseEvent) => {
        if (this.viewModel.state == SettingsOverlayViewModelState.hidden || this.viewModel.state == SettingsOverlayViewModelState.beforeVisible) {
            this.setState(SettingsOverlayViewModelState.beforeVisible);
        }
        super.mouseMove(ev);
    }

    public mouseInactivityHandler = () => {
        if (Date.now() - this.lastMoved >= this.inactivityTimeout) {
            if (this.viewModel.state == SettingsOverlayViewModelState.beforeVisible) {
                this.setState(SettingsOverlayViewModelState.hidden);
            }
        } else {
            setTimeout(this.mouseInactivityHandler, this.inactivityTimeout - (Date.now() - this.lastMoved));
        }
    }

    private setState = (state: SettingsOverlayViewModelState) => {
        switch (state) {
            case SettingsOverlayViewModelState.hidden:
                this.showOverLayerButton.isVisible = false;
                this.viewModel.state = SettingsOverlayViewModelState.hidden;
                break;
            case SettingsOverlayViewModelState.beforeVisible:
                this.lastMoved = Date.now();
                if (this.viewModel.state == SettingsOverlayViewModelState.hidden) {
                    setTimeout(this.mouseInactivityHandler, this.inactivityTimeout);
                    this.showOverLayerButton.isVisible = true;
                }
                if (this.viewModel.state == SettingsOverlayViewModelState.visible) {
                    setTimeout(this.mouseInactivityHandler, this.inactivityTimeout);
                    this.children.removeItemIfExists(this.settingsList);
                }
                this.viewModel.state = SettingsOverlayViewModelState.beforeVisible;
                break;
            case SettingsOverlayViewModelState.visible:
                if (this.viewModel.state == SettingsOverlayViewModelState.beforeVisible) {
                    this.children.push(this.settingsList);
                    this.updateSettings();
                }
                this.viewModel.state = SettingsOverlayViewModelState.visible;
                break;
        }
    }

    private updateSettings() {
        this.settingsList.items = [];
        for (const layer of App.settings.starLayers) {
            var btnForLayer = new Button();
            btnForLayer.text = "Remove Layer";
            btnForLayer.tag = layer;
            btnForLayer.properties.fillStyle = "white";
            this.settingsList.items.push(btnForLayer);
            btnForLayer.clicked.addEventListener((sender: Control) => {
                App.settings.removeStarLayer(layer);
            });
        }
        var btnForNewLayer = new Button();
        btnForNewLayer.text = "Add Layer";
        btnForNewLayer.properties.fillStyle = "white";
        this.settingsList.items.push(btnForNewLayer);
        btnForNewLayer.clicked.addEventListener((sender: Control) => {
            App.settings.addStarLayer();
        });
        this.triggerUpdateLayout();
    }
}