import React = require("react")
import { AppState } from "../../globals"
import { connect } from "react-redux"
import './songNameView.css'

export interface StateProps {
    width: number
    height: number
    songName: string
}

type Props = StateProps

export interface State {
    isAnimating: boolean
    songName: string
    nextSongName: string | null
}

class SongNameComponent extends React.Component<Props, State> {
    private songNameDomElement: HTMLSpanElement | null

    constructor(props: Props) {
        super(props)
        this.songNameDomElement = null
        this.state = {
            isAnimating: false,
            nextSongName: null,
            songName: props.songName
        }
    }

    private animationEnded = (ev: TransitionEvent) => {
        if (this.state.isAnimating && this.songNameDomElement && this.songNameDomElement.classList.contains('animate')) {
            this.setState({
                ...this.state,
                songName: this.state.nextSongName ? this.state.nextSongName : "",
                isAnimating: false,
                nextSongName: null,
            })
        }
    }

    componentDidMount() {
        if (this.songNameDomElement) {
            this.songNameDomElement.addEventListener('transitionend', this.animationEnded)
        }
    }

    componentDidUpdate(prevProps: StateProps) {
        if (this.state.isAnimating) {
            if (this.props.songName != this.state.nextSongName) {
                this.setState({
                    ...this.state,
                    nextSongName: this.props.songName,
                })
            }
        } else if (this.state.songName != this.props.songName) {
            this.setState({
                ...this.state,
                isAnimating: true,
                nextSongName: this.props.songName,
            })
        }
    }

    render() {
        var className = "song-name"

        if (this.state.isAnimating) {
            className += " animate"
        }

        return (
            <span style={{ top: this.props.height * 0.6 + "px" }} ref={c => this.songNameDomElement = c} className={className}>{this.state.songName}</span>
        )
    }
}

const mapStateToProps = (state: AppState): StateProps => {
    return {
        width: state.settings.width,
        height: state.settings.height,
        songName: state.audio.songs[state.audio.currentSongId].name
    }
}

export const ConnectedSongNameComponent = connect(mapStateToProps)(SongNameComponent)