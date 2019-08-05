import { LayoutView } from "../../../enc/src/ui/layoutControls/layoutView";
import { Rectangle } from "../../../enc/src/geometry/rectangle";
import { SettingsVisibilityState } from "../models/settingsVisibilityState";
import { Button } from "../../../enc/src/ui/controls/button";
import { Control } from "../../../enc/src/ui/controls/control";
import { ListView } from "../../../enc/src/ui/layoutControls/listView";
import { VerticalAlignementOption } from "../../../enc/src/ui/alignement/verticalAlignementOption";
import { HorizontalAlignementOption } from "../../../enc/src/ui/alignement/horizontalAlignementOption";
import { Style } from "../../view/style";
import { StarLayersSettingsView } from "./starLayersSettingsView";
import { NavigationView } from "./navigationView";

export class SettingsView extends LayoutView {
    private settingsList: ListView;
    private subView: NavigationView;
    starLayersBtn: Button;

    constructor() {
        super();
        this.createShowHideSettingsBtn();

        this.settingsList = new ListView();
        this.settingsList.alignement.horizontalAlign = HorizontalAlignementOption.Left;
        this.settingsList.alignement.verticalAlign = VerticalAlignementOption.Top;

        this.starLayersBtn = new Button();
        this.starLayersBtn.text = "Star Layers";
        this.starLayersBtn.properties.fillStyle = Style.fillStyle;
        this.starLayersBtn.properties.mouseOverFillStyle = Style.mousOver;
        this.starLayersBtn.clicked.addEventListener((sender: Control) => {
            this.settingsList.removeItem(this.starLayersBtn);
            this.subView = new StarLayersSettingsView();
            this.subView.navigationView.onGoBack.addEventListener(() => {
                this.settingsList.removeItem(this.subView);
                this.subView = undefined;
                this.settingsList.addItem(this.starLayersBtn);
            });
            this.settingsList.addItem(this.subView);
        });
        this.settingsList.addItem(this.starLayersBtn);
    }

    // #region --- show hide settings

    private lastMoved = Date.now();
    private inactivityTimeout = 2000;
    private showHideSettingsBtn: Button;
    private settingsIconText = "\uf013"
    private settingsCloseIconText = "\uf00d"
    private settingsVisibilityState: SettingsVisibilityState = SettingsVisibilityState.hidden;

    private createShowHideSettingsBtn() {
        this.showHideSettingsBtn = new Button();
        this.showHideSettingsBtn.properties.fontPrefix = "900";
        this.showHideSettingsBtn.properties.fontFamily = "'Font Awesome 5 Free'";
        this.showHideSettingsBtn.text = this.settingsIconText;
        this.showHideSettingsBtn.alignement.verticalAlign = VerticalAlignementOption.Top;
        this.showHideSettingsBtn.alignement.horizontalAlign = HorizontalAlignementOption.Left;
        this.showHideSettingsBtn.properties.fillStyle = Style.fillStyle;
        this.showHideSettingsBtn.properties.mouseOverFillStyle = Style.mousOver;
        this.showHideSettingsBtn.clicked.addEventListener(this.showHideOverlayClicked);
        this.children.push(this.showHideSettingsBtn);
    }

    private showHideOverlayClicked = (sender: Control) => {
        if (this.settingsVisibilityState == SettingsVisibilityState.visible) {
            this.setSettingsVisibilityState(SettingsVisibilityState.beforeVisible);
        } else {
            this.setSettingsVisibilityState(SettingsVisibilityState.visible);
        }
    }

    public mouseInactivityHandler = () => {
        if (Date.now() - this.lastMoved >= this.inactivityTimeout) {
            if (this.settingsVisibilityState == SettingsVisibilityState.beforeVisible) {
                this.setSettingsVisibilityState(SettingsVisibilityState.hidden);
            }
        } else {
            setTimeout(this.mouseInactivityHandler, this.inactivityTimeout - (Date.now() - this.lastMoved));
        }
    }

    private setSettingsVisibilityState = (state: SettingsVisibilityState) => {
        switch (state) {
            case SettingsVisibilityState.hidden:
                this.showHideSettingsBtn.text = this.settingsIconText;
                this.children.removeItem(this.showHideSettingsBtn);
                this.settingsVisibilityState = SettingsVisibilityState.hidden;
                break;
            case SettingsVisibilityState.beforeVisible:
                this.showHideSettingsBtn.text = this.settingsIconText;
                this.lastMoved = Date.now();
                if (this.settingsVisibilityState == SettingsVisibilityState.hidden) {
                    setTimeout(this.mouseInactivityHandler, this.inactivityTimeout);
                    this.children.addItemIfNotExists(this.showHideSettingsBtn);
                }
                if (this.settingsVisibilityState == SettingsVisibilityState.visible) {
                    setTimeout(this.mouseInactivityHandler, this.inactivityTimeout);
                    if (this.subView) {
                        this.settingsList.removeItem(this.subView);
                        this.subView = null;
                        this.settingsList.addItem(this.starLayersBtn);
                    }
                    this.children.removeItemIfExists(this.settingsList);
                }
                this.settingsVisibilityState = SettingsVisibilityState.beforeVisible;
                break;
            case SettingsVisibilityState.visible:
                if (this.settingsVisibilityState == SettingsVisibilityState.beforeVisible) {
                    this.children.push(this.settingsList);
                }
                this.showHideSettingsBtn.text = this.settingsCloseIconText;
                this.settingsVisibilityState = SettingsVisibilityState.visible;
                break;
        }
    }

    private mouseClickShowHideSettings() {
        if (this.settingsVisibilityState == SettingsVisibilityState.hidden || this.settingsVisibilityState == SettingsVisibilityState.beforeVisible) {
            this.setSettingsVisibilityState(SettingsVisibilityState.beforeVisible);
        }
    }

    private mouseMoveShowHideSettings() {
        if (this.settingsVisibilityState == SettingsVisibilityState.hidden || this.settingsVisibilityState == SettingsVisibilityState.beforeVisible) {
            this.setSettingsVisibilityState(SettingsVisibilityState.beforeVisible);
        }
    }

    // #endregion

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        super.updateLayout(ctx, bounds);
        this.showHideSettingsBtn.updateLayout(ctx, bounds);
        var space = this.showHideSettingsBtn.dimensions.height * 2;
        if (this.settingsList) {
            this.settingsList.updateLayout(ctx, new Rectangle(bounds.x, bounds.y + space, bounds.width, bounds.height - space));
        }
        if (this.subView) {
            this.subView.updateLayout(ctx, new Rectangle(bounds.x, bounds.y + space, bounds.width, bounds.height - space));
        }
    }

    public mouseMove = (ev: MouseEvent) => {
        this.mouseMoveShowHideSettings();
        super.mouseMove(ev);
    }

    public click = (ev: MouseEvent) => {
        this.mouseClickShowHideSettings();
        super.click(ev);
    }
}