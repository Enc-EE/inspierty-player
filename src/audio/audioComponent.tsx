import * as React from "react";
import { Globals } from "../globals";
import { AudioManager } from "./audioManager";

export interface StateProps {
    isPlaying: boolean,
}

export interface DispatchProps {
}

type Props = StateProps & DispatchProps

export class AudioComponent extends React.Component<Props>{
    private audioManager: AudioManager;

    constructor(props: Props) {
        super(props)
        this.audioManager = Globals.audioManager;
    }

    render() {
        return (<div>
            <button onClick={e => this.audioManager.playPause()}>{this.props.isPlaying ? "Play" : "Pause"}</button>
            <button onClick={e => this.audioManager.stop()}>Stop</button>
            <button onClick={e => this.audioManager.previous()}>Previous</button>
            <button onClick={e => this.audioManager.next()}>Next</button>
        </div>)
    }
}