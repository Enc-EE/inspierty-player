import { LoadingItem } from "./loadingItem"

export const experienceLoad = async (items: LoadingItem[]) => {
    console.log("experienceLoad started")
    var loadingItemNames: string[] = []
    var loadedItemNames: string[] = []

    var loadingDiv = document.createElement("div")
    loadingDiv.style.position = "absolute"
    loadingDiv.style.left = "0"
    loadingDiv.style.right = "0"
    loadingDiv.style.top = "0"
    loadingDiv.style.bottom = "0"
    loadingDiv.style.backgroundColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')
    loadingDiv.style.color = document.body.style.color
    loadingDiv.style.display = "flex"
    loadingDiv.style.alignItems = "center"
    loadingDiv.style.justifyContent = "center"
    loadingDiv.style.opacity = "1"
    loadingDiv.style.transition = "opacity 1.5s"

    var h1Element = document.createElement("h1")
    h1Element.textContent = "Loading..."
    h1Element.style.opacity = "0"
    h1Element.style.transition = "opacity 2s"
    loadingDiv.append(h1Element)
    document.body.append(loadingDiv)

    await wait(0)
    h1Element.style.opacity = "1"

    var loadItems = async () => {
        var todoItems = items.filter(x => !loadedItemNames.contains(x.name) && !loadingItemNames.contains(x.name))
        if (todoItems.length > 0) {
            var stepItems = todoItems.filter(x =>
                !x.dependentItemNames
                || x.dependentItemNames.map(y => loadedItemNames.contains(y)).reduce((a, b) => a && b))

            await Promise.all(stepItems.map(async x => {
                loadingItemNames.push(x.name)
                return new Promise(async (resolve, reject) => {
                    console.log("loading " + x.name)
                    try {
                        await x.func()
                        console.log("loaded " + x.name)
                        loadedItemNames.push(x.name)
                        await loadItems()
                        resolve()
                    } catch (error) {
                        console.error("error loading " + x.name)
                        console.error(error)
                        reject()
                    }
                })
            }))
        }
    }

    await loadItems()
    console.log("loaded")

    h1Element.style.transition = "opacity 1.5s"
    await wait(0)
    h1Element.style.opacity = "0"
    await wait(500)
    loadingDiv.style.opacity = "0"
    await wait(1000)
    document.body.removeChild(loadingDiv)
    console.log("experienceLoad finished")
}

const wait = (timeout: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, timeout)
    })
}

const timeoutPromise = (func: () => void, timeout: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            func()
            resolve()
        }, timeout)
    })
}