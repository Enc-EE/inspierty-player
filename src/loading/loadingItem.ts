export interface LoadingItem {
    dependentItemNames?: string[]
    name: string
    func: () => Promise<void>
}