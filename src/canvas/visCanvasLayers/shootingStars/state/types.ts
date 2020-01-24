export interface ShootingStarAudioInteractionSettings {
    frequencyIndex: number
    lowerBorder: number
    upperBorder: number
    waitSecondsForNextSpawn: number
}

export interface ShootingStarSpawnSettings {
    speedMin: number
    speedMax: number
    sizeMin: number
    sizeMax: number
    flattenMinPercent: number
    flattenMaxPercent: number
    distanceMin: number
    distanceMax: number
    angleRandomnes: number
}

export interface ShootingStarSettings {
    audioInteractionSettings: ShootingStarAudioInteractionSettings
    spawnSettings: ShootingStarSpawnSettings
}