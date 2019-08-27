import { AudioGraph } from "../enc/src/audio/audioGraph";
import { AudioGraphNodeElementSource } from "../enc/src/audio/audioGraphNodeElementSource";
import { AudioGraphNodeAnalyser } from "../enc/src/audio/audioGraphNodeAnalyser";
import { EEventT } from "../enc/src/eEvent";

// import FaintAssetMP3 from "./assets/mp3-demo/demo_1_faint_color.mp3"
// import PrismAssetMP3 from "./assets/mp3-demo/demo_2_prism.mp3"
// import HopefulAssetMP3 from "./assets/mp3-demo/demo_3_hopeful.mp3"
// import DeepAssetMP3 from "./assets/mp3-demo/demo_4_deep_field.mp3"
// import GravityAssetMP3 from "./assets/mp3-demo/demo_5_gravity.mp3"
// import JourneyAssetMP3 from "./assets/mp3-demo/demo_6_journey_to_the_planets.mp3"
// import DriftingAssetMP3 from "./assets/mp3-demo/demo_7_drifting_into_the_atmosphere.mp3"

import FaintAssetMP3 from "./assets/demo/Trailer_faintColor.mp3"
import DeepAssetMP3 from "./assets/demo/Trailer_DeepField.mp3"
import DriftingAssetMP3 from "./assets/demo/Trailer_DriftingIntoTheAtmosphere.mp3"

export class AudioManager {
    private audioGraph: AudioGraph;
    private source: AudioGraphNodeElementSource;
    private analyser: AudioGraphNodeAnalyser;

    private songs = [
        ["Faint Color", FaintAssetMP3],
        // ["PrismAsset", PrismAssetMP3],
        // ["HopefulAsset", HopefulAssetMP3],
        ["Deep field", DeepAssetMP3],
        // ["GravityAsset", GravityAssetMP3],
        // ["JourneyAsset", JourneyAssetMP3],
        ["Drifting into the Atmosphere", DriftingAssetMP3]
    ]

    public songChanged = new EEventT<string>();

    
    public get currentSongName() : string {
        var currentSongIndex = this.songs.map(x => x[1]).indexOf(this.source.url);
        return this.songs[currentSongIndex][0];
    }
    

    constructor() {
        this.audioGraph = new AudioGraph();
        this.source = this.audioGraph.addMediaElementSource("source", this.songs[0][1]);
        this.source.audioEnded.addEventListener(this.endedNext());
        this.analyser = this.audioGraph.addAnalyzer("analyser");
    }

    public reload = () => {
        return this.audioGraph.reload();
    }

    public play = () => {
        this.source.play();
    }

    public pause = () => {
        this.source.pause();
    }

    public next = () => {
        var currentSongIndex = this.songs.map(x => x[1]).indexOf(this.source.url);
        var nextSongIndex = currentSongIndex + 1;
        if (nextSongIndex == this.songs.length) {
            nextSongIndex = 0;
        }

        this.source.setUrl(this.songs[nextSongIndex][1]);
        this.songChanged.dispatchEvent(this.songs[nextSongIndex][0]);
    }

    public previous = () => {
        var currentSongIndex = this.songs.map(x => x[1]).indexOf(this.source.url);
        var previousSongIndex = currentSongIndex - 1;
        if (previousSongIndex == -1) {
            previousSongIndex = this.songs.length - 1;
        }

        this.source.setUrl(this.songs[previousSongIndex][1]);
        this.songChanged.dispatchEvent(this.songs[previousSongIndex][0]);
    }

    public getAnalyser = () => {
        return this.analyser;
    }

    public stop = () => {
        this.source.stop();
    }

    private endedNext(): () => void {
        return () => {
            this.next();
            this.source.play();
        };
    }
}