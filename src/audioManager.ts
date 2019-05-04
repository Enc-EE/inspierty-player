import { AudioGraph } from "../enc/src/audio/audioGraph";
import { AudioGraphNodeElementSource } from "../enc/src/audio/audioGraphNodeElementSource";
import { AudioGraphNodeAnalyser } from "../enc/src/audio/audioGraphNodeAnalyser";

// import faintAssetMP3 from "./assets/mp3-demo/demo_1_faint_color.mp3"
// import prismAssetMP3 from "./assets/mp3-demo/demo_2_prism.mp3"
// import hopefulAssetMP3 from "./assets/mp3-demo/demo_3_hopeful.mp3"
// import deepAssetMP3 from "./assets/mp3-demo/demo_4_deep_field.mp3"
// import gravityAssetMP3 from "./assets/mp3-demo/demo_5_gravity.mp3"
// import journeyAssetMP3 from "./assets/mp3-demo/demo_6_journey_to_the_planets.mp3"
// import driftingAssetMP3 from "./assets/mp3-demo/demo_7_drifting_into_the_atmosphere.mp3"

import faintAssetMP3 from "./assets/Trailer_Constellation.ogg"
import prismAssetMP3 from "./assets/Trailer_Constellation.ogg"
import hopefulAssetMP3 from "./assets/Trailer_Constellation.ogg"
import deepAssetMP3 from "./assets/Trailer_Constellation.ogg"
import gravityAssetMP3 from "./assets/Trailer_Constellation.ogg"
import journeyAssetMP3 from "./assets/Trailer_Constellation.ogg"
import driftingAssetMP3 from "./assets/Trailer_Constellation.ogg"

export class AudioManager {
    private audioGraph: AudioGraph;
    private source: AudioGraphNodeElementSource;
    private analyser: AudioGraphNodeAnalyser;

    private songs = [
        faintAssetMP3,
        prismAssetMP3,
        hopefulAssetMP3,
        deepAssetMP3,
        gravityAssetMP3,
        journeyAssetMP3,
        driftingAssetMP3
    ]

    constructor() {
        this.audioGraph = new AudioGraph();
        console.log(this.songs);

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