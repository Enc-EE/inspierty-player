import { LayoutView } from "../../../enc/src/ui/layoutControls/layoutView";
import { Rectangle } from "../../../enc/src/geometry/rectangle";
import { SettingsOverlayViewModel } from "./settingsOverlayViewModel";
import { SettingsOverlayViewModelState } from "./settingsOverlayViewModelState";
import { Button } from "../../../enc/src/ui/controls/button";
import { Control } from "../../../enc/src/ui/controls/control";
import { ListView } from "../../../enc/src/ui/layoutControls/listView";
import { StarLayer } from "../../models/starLayer";
import { App } from "../../app";
import { SettingOperation } from "../../settings/settingOperation";
import { VerticalAlignementOption } from "../../../enc/src/ui/alignement/verticalAlignementOption";
import { HorizontalAlignementOption } from "../../../enc/src/ui/alignement/horizontalAlignementOption";
import { StarLayerView } from "./starLayerView";

export class SettingsOverlayView extends LayoutView {
    private viewModel: SettingsOverlayViewModel = new SettingsOverlayViewModel();
    private lastMoved = Date.now();
    private inactivityTimeout = 2000;
    private showOverLayerButton: Button;
    private settingsList: ListView;

    private layerButtons: Button[] = [];
    private addLayerBtn: Button;
    private detailedStarLayerView: StarLayerView;

    constructor() {
        super(false);
        this.showOverLayerButton = new Button();
        this.showOverLayerButton.text = "Show/Hide Settings";
        this.showOverLayerButton.properties.fillStyle = "green";
        this.showOverLayerButton.alignement.verticalAlign = VerticalAlignementOption.Top;
        this.showOverLayerButton.alignement.horizontalAlign = HorizontalAlignementOption.Left;
        this.showOverLayerButton.clicked.addEventListener(this.showHideOverlayClicked);
        this.showOverLayerButton.properties.backgroundFillStyle = "rgba(0, 0, 0, 0.5)";
        this.children.push(this.showOverLayerButton);
        this.settingsList = new ListView();
        this.settingsList.alignement.horizontalAlign = HorizontalAlignementOption.Left;
        this.settingsList.alignement.verticalAlign = VerticalAlignementOption.Top;

        var btnForNewLayer = new Button();
        btnForNewLayer.text = "Add Layer";
        btnForNewLayer.properties.fillStyle = "white";
        this.settingsList.addItem(btnForNewLayer);
        btnForNewLayer.clicked.addEventListener((sender: Control) => {
            App.settingManager.addStarLayer();
        });
        this.addLayerBtn = btnForNewLayer;


        App.settingManager.update.addEventListener(this.settingsUpdated);


    }

    private settingsUpdated = (operation: SettingOperation) => {
        switch (operation) {
            case SettingOperation.AddStarLayer:
                for (const starLayer of App.settings.starLayers) {
                    if (!this.layerButtons.map(x => x.tag).contains(starLayer)) {
                        this.settingsList.removeItem(this.addLayerBtn);
                        var btnForLayer = new Button();
                        btnForLayer.text = "Edit Layer";
                        btnForLayer.tag = starLayer;
                        btnForLayer.properties.fillStyle = "white";
                        this.settingsList.addItem(btnForLayer);
                        this.layerButtons.push(btnForLayer);
                        btnForLayer.clicked.addEventListener((sender: Control) => {
                            this.toggleShowHideStarLayerView(starLayer);
                        });
                        this.settingsList.addItem(this.addLayerBtn);
                        break;
                    }
                }
                break;
            case SettingOperation.RemoveStarLayer:
                for (const settingsLayer of this.layerButtons) {
                    if (!App.settings.starLayers.contains(settingsLayer.tag)) {
                        this.settingsList.removeItem(settingsLayer);
                        this.layerButtons.removeItem(settingsLayer);
                        break;
                    }
                }
                this.children.removeItem(this.detailedStarLayerView);
                this.detailedStarLayerView = undefined;
                break;
        }
    }
    private toggleShowHideStarLayerView = (starLayer: StarLayer) => {
        if (!this.detailedStarLayerView) {
            var view = new StarLayerView(starLayer);
            this.detailedStarLayerView = view;
            this.children.push(this.detailedStarLayerView);
            this.triggerUpdateLayout();
        }
        else if (this.detailedStarLayerView.starLayer != starLayer) {
            this.children.removeItem(this.detailedStarLayerView);
            this.detailedStarLayerView = undefined;
            var view = new StarLayerView(starLayer);
            this.detailedStarLayerView = view;
            this.children.push(this.detailedStarLayerView);
            this.triggerUpdateLayout();
        }
        else {
            this.children.removeItem(this.detailedStarLayerView);
            this.detailedStarLayerView = undefined;
        }
    }

    private showHideOverlayClicked = (sender: Control) => {
        if (this.viewModel.state == SettingsOverlayViewModelState.visible) {
            this.setState(SettingsOverlayViewModelState.beforeVisible);
        } else {
            this.setState(SettingsOverlayViewModelState.visible);
        }
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        super.updateLayout(ctx, bounds);
        this.showOverLayerButton.updateLayout(ctx, bounds);
        var space = this.showOverLayerButton.dimensions.height * 2;
        this.settingsList.updateLayout(ctx, new Rectangle(bounds.x, bounds.y + space, bounds.width, bounds.height - space));
        if (this.detailedStarLayerView) {
            this.detailedStarLayerView.updateLayout(ctx, new Rectangle(bounds.x + this.settingsList.dimensions.width, bounds.y + space, bounds.width, bounds.height - space));
        }
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
                this.children.removeItem(this.showOverLayerButton);
                this.viewModel.state = SettingsOverlayViewModelState.hidden;
                break;
            case SettingsOverlayViewModelState.beforeVisible:
                this.lastMoved = Date.now();
                if (this.viewModel.state == SettingsOverlayViewModelState.hidden) {
                    setTimeout(this.mouseInactivityHandler, this.inactivityTimeout);
                    this.children.addItemIfNotExists(this.showOverLayerButton);
                }
                if (this.viewModel.state == SettingsOverlayViewModelState.visible) {
                    setTimeout(this.mouseInactivityHandler, this.inactivityTimeout);
                    this.children.removeItemIfExists(this.settingsList);
                    this.children.removeItemIfExists(this.detailedStarLayerView);
                    this.detailedStarLayerView = undefined;
                }
                this.viewModel.state = SettingsOverlayViewModelState.beforeVisible;
                break;
            case SettingsOverlayViewModelState.visible:
                if (this.viewModel.state == SettingsOverlayViewModelState.beforeVisible) {
                    this.children.push(this.settingsList);
                }
                this.viewModel.state = SettingsOverlayViewModelState.visible;
                break;
        }
    }
}