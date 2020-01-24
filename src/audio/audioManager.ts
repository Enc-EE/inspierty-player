import { AudioGraph } from "../../enc/src/audio/audioGraph";
import { AudioGraphNodeElementSource } from "../../enc/src/audio/audioGraphNodeElementSource";
import { AudioGraphNodeAnalyser } from "../../enc/src/audio/audioGraphNodeAnalyser";
import { Store, AnyAction } from "redux";
import { AudioState, playPause, changeSong } from "./state/types";
import { Settings } from "../state/types";
import * as AudioConfig from "./audioConfig"
import { AppState } from "../globals";

export class AudioManager {
    private audioGraph: AudioGraph;
    private source: AudioGraphNodeElementSource;
    private analyser: AudioGraphNodeAnalyser;

    constructor(private store: Store<AppState, AnyAction>) {
        this.audioGraph = new AudioGraph();
        this.source = this.audioGraph.addMediaElementSource("source", AudioConfig.songs[0].assetPath);
        this.source.audioEnded.addEventListener(this.endedNext());
        this.analyser = this.audioGraph.addAnalyzer("analyser");
    }

    public reload = (): Promise<void> => {
        return this.audioGraph.reload();
    }

    public playPause = () => {
        this.store.getState().audio.isPlaying ? this.pause() : this.play()
    }

    public play = () => {
        if (!this.store.getState().audio.isPlaying) {
            this.store.dispatch(playPause())
            this.source.play()
        }
    }

    public pause = () => {
        if (this.store.getState().audio.isPlaying) {
            this.store.dispatch(playPause())
            this.source.pause()
        }
    }

    public stop = () => {
        this.pause();
        this.source.stop()
    }

    public next = () => {
        var currentSongIndex = this.store.getState().audio.currentSongId;
        var nextSongIndex = currentSongIndex + 1;
        if (nextSongIndex == AudioConfig.songs.length) {
            nextSongIndex = 0;
        }

        this.source.setUrl(AudioConfig.songs[nextSongIndex].assetPath);
        this.store.dispatch(changeSong(nextSongIndex));
    }

    public previous = () => {
        var currentSongIndex = this.store.getState().audio.currentSongId;
        var previousSongIndex = currentSongIndex - 1;
        if (previousSongIndex == -1) {
            previousSongIndex = AudioConfig.songs.length - 1;
        }

        this.source.setUrl(AudioConfig.songs[previousSongIndex].assetPath);
        this.store.dispatch(changeSong(previousSongIndex));
    }

    public getAnalyser = () => {
        return this.analyser;
    }

    private endedNext(): () => void {
        return () => {
            this.next();
            this.source.play();
        };
    }
}