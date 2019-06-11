import { App } from "./app";
import "../enc/src/extensions";

document.addEventListener('DOMContentLoaded', main, false);

function main() {
    var app = new App();
    app.run();
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
