import * as React from "react";
import { Globals, AppState } from "../globals";
import { AudioManager } from "./audioManager";
import { connect } from "react-redux";

export interface StateProps {
    isPlaying: boolean,
}

export interface DispatchProps {
}

type Props = StateProps & DispatchProps

class AudioComponent extends React.Component<Props>{
    private audioManager: AudioManager;

    constructor(props: Props) {
        super(props)
        this.audioManager = Globals.audioManager;
    }

    render() {
        return (<div style={{position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center"}}>
            <button onClick={e => this.audioManager.playPause()}>{this.props.isPlaying ? "Pause" : "Play"}</button>
            <button onClick={e => this.audioManager.stop()}>Stop</button>
            <button onClick={e => this.audioManager.previous()}>Previous</button>
            <button onClick={e => this.audioManager.next()}>Next</button>
        </div>)
    }
}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        isPlaying: state.audio.isPlaying
    }
}

export const ConnectedAudioComponent = connect(mapStateToProps)(AudioComponent)