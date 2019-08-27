import { ObservableProperty } from "../../enc/src/ui/observableProperty";

export class StarLayer {
    public name = new ObservableProperty<string>("Star Layer X");
    public speed = new ObservableProperty<number>(Math.random() * 1 + 0.1);
    public starRadiusLowerBorder = new ObservableProperty<number>(0.35);
    public starRadiusUpperBorder = new ObservableProperty<number>(0.6);
    public numberOfStars = new ObservableProperty<number>(300);
}