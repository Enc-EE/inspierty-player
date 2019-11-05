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
    isFadeOut: boolean
    songName1: string | null
    songName2: string | null
    isShowingSongName1: boolean
}

class SongNameComponent extends React.Component<Props, State> {
    private songNameDomElement1: HTMLSpanElement | null
    private songNameDomElement2: HTMLSpanElement | null

    constructor(props: Props) {
        super(props)
        this.songNameDomElement1 = null
        this.songNameDomElement2 = null
        this.state = {
            isFadeOut: false,
            songName1: this.props.songName,
            songName2: null,
            isShowingSongName1: true,
        }
    }

    private animationEnded1 = (ev: TransitionEvent) => {
        if (this.state.isFadeOut && this.state.isShowingSongName1) {
            this.setState({
                ...this.state,
                isFadeOut: false,
                isShowingSongName1: !this.state.isShowingSongName1,
                songName1: null,
            })
        }
    }

    private animationEnded2 = (ev: TransitionEvent) => {
        if (this.state.isFadeOut && !this.state.isShowingSongName1) {
            this.setState({
                ...this.state,
                isFadeOut: false,
                isShowingSongName1: !this.state.isShowingSongName1,
                songName2: null,
            })
        }
    }

    componentDidMount() {
        if (this.songNameDomElement1) {
            this.songNameDomElement1.addEventListener('transitionend', this.animationEnded1)
        }
        if (this.songNameDomElement2) {
            this.songNameDomElement2.addEventListener('transitionend', this.animationEnded2)
        }
    }

    componentDidUpdate(prevProps: StateProps) {
        if (this.state.isFadeOut) {
            if (this.state.isShowingSongName1
                ? this.state.songName2 != this.props.songName
                : this.state.songName1 != this.props.songName) {
                this.setState({
                    ...this.state,
                    songName1: this.state.isShowingSongName1 ? this.state.songName1 : this.props.songName,
                    songName2: !this.state.isShowingSongName1 ? this.state.songName2 : this.props.songName,
                })
            }
        } else if (this.state.isShowingSongName1
            ? this.state.songName1 != this.props.songName
            : this.state.songName2 != this.props.songName) {
            this.setState({
                ...this.state,
                isFadeOut: true,
                songName1: this.state.isShowingSongName1 ? this.state.songName1 : this.props.songName,
                songName2: !this.state.isShowingSongName1 ? this.state.songName2 : this.props.songName,
            })
        }
    }

    render() {
        var classNameSongName1 = "song-name"
        var classNameSongName2 = "song-name"
        if (this.state.isFadeOut) {
            classNameSongName1 += " hide"
            classNameSongName2 += " hide"
        } else if (this.state.isShowingSongName1) {
            classNameSongName2 += " hide"
        } else if (!this.state.isShowingSongName1) {
            classNameSongName1 += " hide"
        }

        return (
            <div>
                <span style={{ top: this.props.height * 0.6 + "px" }} ref={c => this.songNameDomElement1 = c} className={classNameSongName1}>{this.state.songName1}</span>
                <span style={{ top: this.props.height * 0.6 + "px" }} ref={c => this.songNameDomElement2 = c} className={classNameSongName2}>{this.state.songName2}</span>
            </div>
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