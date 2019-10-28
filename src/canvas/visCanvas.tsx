import React = require("react")
import { AppState, Globals } from "../globals"
import { connect } from "react-redux"
import { ViewLayer } from "./viewLayers/viewLayerBase"
import { StarLayerManager } from "./viewLayers/starLayerManager"
import { InspiertyLayer } from "./viewLayers/inspiertyLayer"

export interface StateProps {
    width: number
    height: number
}

export interface DispatchProps { }

type Props = StateProps & DispatchProps

class VisCanvas extends React.Component<Props> {
    private canvasRef: HTMLCanvasElement | null
    private layers: ViewLayer[] = []
    private lastFrameTime: number = Date.now()

    constructor(props: Props) {
        super(props)

        this.canvasRef = null
    }

    componentDidMount() {
        if (this.canvasRef) {
            // this.layers.push(new StarLayerManager(Globals.store).initialize())
            this.layers.push(new InspiertyLayer(Globals.store).initialize())
            this.draw()
            this.lastFrameTime = Date.now()
        }
    }

    private draw = () => {
        if (this.canvasRef) {
            var currentDate = Date.now()
            var timeDiff = (this.lastFrameTime - currentDate) / 1000
            requestAnimationFrame(this.draw)
            var ctx = this.canvasRef.getContext("2d")
            if (ctx) {
                ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height)
                for (const layer of this.layers) {
                    layer.update(timeDiff)
                }
                for (const layer of this.layers) {
                    layer.draw(ctx)
                }
            }
            this.lastFrameTime = currentDate
        }
    }

    private getBackground(): string {
        var x = Globals.assetManager.getImage("background")
        if (x) {
            console.log(x.src);

            return 'url(' + x.src + ') no-repeat center'
        }
        return ''
    }

    private getBackgroundSize(): string {
        var img = Globals.assetManager.getImage("background");
        return img
            && (window.innerWidth > img.naturalWidth
                || window.innerHeight > img.naturalHeight)
            ? 'cover'
            : 'auto'
    }

    render() {
        return (
            <canvas ref={c => this.canvasRef = c} style={{ height: '100%', width: '100%', background: this.getBackground(), backgroundSize: this.getBackgroundSize() }} />
        )
    }
}


const mapStateToProps = (state: AppState): StateProps => {
    return {
        height: state.settings.height,
        width: state.settings.width,
    }
}

export const ConnectedVisCanvas = connect(mapStateToProps)(VisCanvas)