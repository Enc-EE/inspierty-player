import React = require("react")
import { ConnectedVisCanvas } from "./canvas/visCanvas"
import { ConnectedAudioComponent } from "./audio/audioComponent"

interface Props { }

export class App extends React.Component<Props> {
    private appVersion = "2020-02-02 16:12"
    render() {
        return (
            <div>
                <ConnectedVisCanvas />
                <ConnectedAudioComponent />
                <span style={{ position: "absolute", left: 0, bottom: 0 }}>{this.appVersion}</span>
            </div>
        )
    }
}