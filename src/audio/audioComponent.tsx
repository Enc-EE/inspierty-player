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
        return (<div style={{ position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center" }}>
            {this.props.isPlaying
                ? <button onClick={e => this.audioManager.pause()}><i className="fas fa-pause"></i></button>
                : <button onClick={e => this.audioManager.play()}><i className="fas fa-play"></i></button>
            }
            <button onClick={e => this.audioManager.stop()}><i className="fas fa-stop"></i></button>
            <button onClick={e => this.audioManager.previous()}><i className="fas fa-step-backward"></i></button>
            <button onClick={e => this.audioManager.next()}><i className="fas fa-step-forward"></i></button>
        </div>)
    }
}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        isPlaying: state.audio.isPlaying
    }
}

export const ConnectedAudioComponent = connect(mapStateToProps)(AudioComponent)