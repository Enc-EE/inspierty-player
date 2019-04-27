import { App } from "./app";
import "../enc/src/extensions";

document.addEventListener('DOMContentLoaded', main, false);

function main() {
    var app = new App();
    app.run();
}