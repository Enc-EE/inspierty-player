import { Star } from "./star";

export class StarLayer {
    public stars: Star[] = [];
    public speed = Math.random() * 1 + 0.1;
}