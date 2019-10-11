import React = require("react")
import * as backgroundPng from "./assets/background.png"
import { AppState, Globals } from "./globals"
import { connect } from "react-redux"

export interface StateProps {
    width: number
    height: number
}

export interface DispatchProps { }

type Props = StateProps & DispatchProps

class BackgroundImage extends React.Component<Props> {
    private computeStyles = (): React.CSSProperties => {
        var windowScale = this.props.width / this.props.height
        var image = Globals.assetManager.getImage("background")
        var imageScale = image.naturalWidth / image.naturalHeight
        var isWider = windowScale > imageScale
        return {
            width: isWider ? this.props.width : 'auto',
            height: isWider ? 'auto' : this.props.height,
        }
    }

    render() {
        return (
            <img src={backgroundPng} style={this.computeStyles()} />
        )
    }
}


const mapStateToProps = (state: AppState): StateProps => {
    return {
        height: state.settings.height,
        width: state.settings.width,
    }
}

export const ConnectedBackgroundImage = connect(mapStateToProps)(BackgroundImage)