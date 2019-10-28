import React = require("react")
import { ConnectedVisCanvas } from "./canvas/visCanvas"
import { ConnectedAudioComponent } from "./audio/audioComponent"

interface Props { }

export class App extends React.Component<Props> {
    render() {
        return (
            <div>
                <ConnectedVisCanvas />
                <ConnectedAudioComponent />
            </div>
        )
    }
}