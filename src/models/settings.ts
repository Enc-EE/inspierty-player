import { StarLayer } from "./starLayer";

export class Settings {
    constructor(public width: number, public height: number) { }

    public starLayers: StarLayer[] = [];
}
