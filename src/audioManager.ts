import { AudioGraph } from "../enc/src/audio/audioGraph";
import { AudioGraphNodeElementSource } from "../enc/src/audio/audioGraphNodeElementSource";
import { AudioGraphNodeAnalyser } from "../enc/src/audio/audioGraphNodeAnalyser";

// import FaintAssetMP3 from "./assets/mp3-demo/demo_1_faint_color.mp3"
// import PrismAssetMP3 from "./assets/mp3-demo/demo_2_prism.mp3"
// import HopefulAssetMP3 from "./assets/mp3-demo/demo_3_hopeful.mp3"
// import DeepAssetMP3 from "./assets/mp3-demo/demo_4_deep_field.mp3"
// import GravityAssetMP3 from "./assets/mp3-demo/demo_5_gravity.mp3"
// import JourneyAssetMP3 from "./assets/mp3-demo/demo_6_journey_to_the_planets.mp3"
// import DriftingAssetMP3 from "./assets/mp3-demo/demo_7_drifting_into_the_atmosphere.mp3"

import FaintAssetMP3 from "./assets/Trailer_Constellation.ogg"
import PrismAssetMP3 from "./assets/Trailer_Constellation.ogg"
import HopefulAssetMP3 from "./assets/Trailer_Constellation.ogg"
import DeepAssetMP3 from "./assets/Trailer_Constellation.ogg"
import GravityAssetMP3 from "./assets/Trailer_Constellation.ogg"
import JourneyAssetMP3 from "./assets/Trailer_Constellation.ogg"
import DriftingAssetMP3 from "./assets/Trailer_Constellation.ogg"

export class AudioManager {
    private audioGraph: AudioGraph;
    private source: AudioGraphNodeElementSource;
    private analyser: AudioGraphNodeAnalyser;

    private songs = [
        FaintAssetMP3,
        PrismAssetMP3,
        HopefulAssetMP3,
        DeepAssetMP3,
        GravityAssetMP3,
        JourneyAssetMP3,
        DriftingAssetMP3
    ]

    constructor() {
        this.audioGraph = new AudioGraph();
        this.source = this.audioGraph.addMediaElementSource("source", this.songs[0])
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
        var currentSongIndex = this.songs.indexOf(this.source.url);
        var nextSongIndex = currentSongIndex + 1;
        if (nextSongIndex == this.songs.length) {
            nextSongIndex = 0;
        }

        this.source.setUrl(this.songs[nextSongIndex]);
    }

    public previous = () => {
        var currentSongIndex = this.songs.indexOf(this.source.url);
        var previousSongIndex = currentSongIndex - 1;
        if (previousSongIndex == -1) {
            previousSongIndex = this.songs.length - 1;
        }
        
        this.source.setUrl(this.songs[previousSongIndex]);
    }

    public stop = () => {
        this.source.stop();
    }
}