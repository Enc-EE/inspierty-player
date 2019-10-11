import React = require("react")
import { ConnectedBackgroundImage } from "./backgroundImage"
import { ConnectedVisCanvas } from "./visCanvas"

interface Props { }

export class App extends React.Component<Props> {
    render() {
        return (
            <div style={{ height: '100%' }}>
                <ConnectedBackgroundImage />
                <ConnectedVisCanvas />
            </div>
        )
    }
}