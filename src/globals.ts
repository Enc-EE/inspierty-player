import { AudioManager } from "./audio/audioManager"
import { combineReducers, AnyAction, Store } from "redux"
import { audioReducer } from "./audio/reducer"
import { settingsReducer } from "./settings/reducer"
import { AssetManager } from "../enc/src/assetManager"

export const rootReducer = combineReducers({
    audio: audioReducer,
    settings: settingsReducer
})

export type AppState = ReturnType<typeof rootReducer>

export class Globals {
    public static audioManager: AudioManager
    public static store: Store<AppState, AnyAction>
    public static assetManager: AssetManager
}