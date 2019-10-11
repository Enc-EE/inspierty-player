import React = require("react")
import { AppState, Globals } from "./globals"
import { connect } from "react-redux"
import { ViewLayer } from "./viewLayers/viewLayerBase"
import { StarLayer } from "./viewLayers/starLayer"

export interface StateProps {
    width: number
    height: number
}

export interface DispatchProps { }

type Props = StateProps & DispatchProps

class VisCanvas extends React.Component<Props> {
    private canvasRef: HTMLCanvasElement | null
    private layers: ViewLayer[] = []

    constructor(props: Props) {
        super(props)

        this.canvasRef = null
    }

    componentDidMount() {
        if (this.canvasRef) {
            this.canvasRef.width = window.innerWidth
            this.canvasRef.height = window.innerHeight

            this.layers.push(new StarLayer(Globals.store).initialize())
            this.draw()
        }
    }

    private draw = () => {
        if (this.canvasRef) {
            requestAnimationFrame(this.draw)
            var ctx = this.canvasRef.getContext("2d")
            if (ctx) {
                ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
                for (const layer of this.layers) {
                    layer.draw(ctx);
                }
            }
        }
    }

    render() {
        return (
            <canvas ref={c => this.canvasRef = c} style={{ position: 'absolute', left: '0', right: '0', top: '0', bottom: '0' }} />
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