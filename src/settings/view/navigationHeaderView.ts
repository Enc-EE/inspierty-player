import { LayoutView } from "../../../enc/src/ui/layoutControls/layoutView";
import { Button } from "../../../enc/src/ui/controls/button";
import { ListView } from "../../../enc/src/ui/layoutControls/listView";
import { VerticalAlignementOption } from "../../../enc/src/ui/alignement/verticalAlignementOption";
import { HorizontalAlignementOption } from "../../../enc/src/ui/alignement/horizontalAlignementOption";
import { Style } from "../../view/style";
import { Label } from "../../../enc/src/ui/controls/label";
import { Orientation } from "../../../enc/src/ui/alignement/orientation";
import { Rectangle } from "../../../enc/src/geometry/rectangle";
import { EEvent } from "../../../enc/src/eEvent";

export class NavigationHeaderView extends LayoutView {
    private goBackBtn: Button;
    private goBackBtnIconText = "\uf060";
    private header: ListView;
    public onGoBack = new EEvent();

    constructor(title: string) {
        super();

        this.goBackBtn = new Button();
        this.goBackBtn.properties.fontPrefix = "900";
        this.goBackBtn.properties.fontFamily = "'Font Awesome 5 Free'";
        this.goBackBtn.text = this.goBackBtnIconText;
        this.goBackBtn.alignement.verticalAlign = VerticalAlignementOption.Top;
        this.goBackBtn.alignement.horizontalAlign = HorizontalAlignementOption.Left;
        this.goBackBtn.properties.fillStyle = Style.fillStyle;
        this.goBackBtn.properties.mouseOverFillStyle = Style.mousOver;
        this.goBackBtn.clicked.addEventListener(this.onGoBack.dispatchEvent);

        var titleLbl = new Label();
        titleLbl.text = title;
        titleLbl.properties.fillStyle = Style.normal;

        this.header = new ListView();
        this.header.alignement.horizontalAlign = HorizontalAlignementOption.Left;
        this.header.alignement.verticalAlign = VerticalAlignementOption.Top;
        this.header.properties.orientation = Orientation.Horizontal;
        this.header.addItem(this.goBackBtn);
        this.header.addItem(titleLbl);
        this.children.push(this.header);
    }

    public updateLayout(ctx: CanvasRenderingContext2D, bounds: Rectangle): void {
        super.updateLayout(ctx, bounds);
        this.header.updateLayout(ctx, bounds);
        this.dimensions = this.header.dimensions;
    }
}