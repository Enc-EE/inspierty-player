import React = require("react");
import * as backgroundPng from "./assets/background.png"

export class App extends React.Component {
    render() {
        return (
            <div style={{ height: '100%', backgroundImage: `url(${backgroundPng})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {backgroundPng}
            </div>
        )
    }
}