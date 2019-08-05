import { LayoutView } from "../../../enc/src/ui/layoutControls/layoutView";
import { NavigationHeaderView } from "./navigationHeaderView";
import { HorizontalAlignementOption } from "../../../enc/src/ui/alignement/horizontalAlignementOption";
import { VerticalAlignementOption } from "../../../enc/src/ui/alignement/verticalAlignementOption";

export class NavigationView extends LayoutView {
    public navigationView: NavigationHeaderView;

    constructor(title: string) {
        super();
        this.navigationView = new NavigationHeaderView(title);
        this.navigationView.alignement.horizontalAlign = HorizontalAlignementOption.Left;
        this.navigationView.alignement.verticalAlign = VerticalAlignementOption.Top;
        this.children.push(this.navigationView);
    }
}