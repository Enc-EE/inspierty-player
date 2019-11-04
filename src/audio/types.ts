export interface SongConfig {
    name: string
    assetPath: string
}

export interface AudioState {
    songs: SongConfig[]
    currentSongId: number
    isPlaying: boolean
}

export const CHANGE_SONG = 'CHANGE_SONG'
interface ChangeSongAction {
    type: typeof CHANGE_SONG
    songId: number
}

export const PLAY_PAUSE = 'PLAY_PAUSE'
interface PlayPauseAction {
    type: typeof PLAY_PAUSE
}

export type AudioActionTypes =
    ChangeSongAction
    | PlayPauseAction

export function changeSong(songId: number): AudioActionTypes {
    return {
        type: CHANGE_SONG,
        songId: songId,
    }
}

export function playPause(): AudioActionTypes {
    return {
        type: PLAY_PAUSE,
    }
}