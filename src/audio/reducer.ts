import { AudioState, CHANGE_SONG, PLAY_PAUSE, AudioActionTypes } from "./types"

var initialState: AudioState = {
    currentSongId: 0,
    isPlaying: false,
    songs: [],
}

export function audioReducer(
    state = initialState,
    action: AudioActionTypes
): AudioState {
    switch (action.type) {
        case CHANGE_SONG:
            return {
                ...state,
                currentSongId: action.songId,
            }
        case PLAY_PAUSE:
            return {
                ...state,
                isPlaying: !state.isPlaying,
            }
        default:
            return state
    }
}