import React from 'react';
import FunctionUtil from '../utils/FunctionUtil';
import AVideoControlPanel from './AVideoControlPanel.react';
import AHalfDomePlayerScreen from './AHalfDomePlayerScreen.react';
require('../aframe-components/aframe-stereo-component');

const styles = {
    hidden: {display: 'none'}
};
let __instance = 0;
const PlayerState = {
    PLAYING: 'playing',
    PAUSED: 'paused',
    PENDING: 'pending'
};


export default class AHalfDomePlayer extends React.Component {

    static propTypes = {
        src: React.PropTypes.string,
        onSeeking: React.PropTypes.func,
        onTimeUpdate: React.PropTypes.func
    }

    static childContextTypes = {
        onSeekToTime: React.PropTypes.func,
        onSetPlay: React.PropTypes.func,
        onSetPause: React.PropTypes.func,
        onSetForward: React.PropTypes.func
    }

    getChildContext() {
        return {
            onSetPlay: this._handleSetPlay,
            onSetPause: this._handleSetPause,
            onSetForward: this._handleSetForward,
            onSeekToTime: this._handleSeekToTime
        };
    }

    constructor(props) {
        super(props);
        this.videoId = `VIDEO_MANAGER_${__instance++}`;
        this.state = {
            state: PlayerState.PENDING,
            currentTime: null,
            duration: null
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return FunctionUtil.contextShallowCompare(this, nextProps, nextState, nextContext);
    }

    render() {
        const videoId = this.videoId;
        const {
            currentState,
            currentTime,
            duration
        } = this.state;

        return (
            <a-entity>
                <AHalfDomePlayerScreen
                    videoId={videoId}
                />
                <AVideoControlPanel
                    currentState={currentState}
                    currentTime={currentTime}
                    duration={duration}
                    position="0 0 -4"
                    width={5}
                />
                <video
                    ref={(element) => {this.video = element;}}
                    id={videoId}
                    src={this.props.src}
                    style={styles.hidden}
                    onDurationChange={this._handleDurationChange}
                    onSeeking={this._handleSeeking}
                    onPause={this._handlePause}
                    onEnded={this._handlePause}
                    onPlay={this._handlePlay}
                    onTimeUpdate={this._handleTimeUpdate}
                    onProgress={this._handleProgress}
                />
            </a-entity>
        );
    }

    // Control related
    _handleSetForward = (time) => {
        this.video.currentTime += time;
    }

    _handleSeekToTime = (newTime) => {
        this.video.currentTime = newTime;
    }

    _handleSetPlay = () => {
        this.video.play();
    }

    _handleSetPause = () => {
        this.video.pause();
    }

    // Event related
    _handleDurationChange = () => {
        this.setState({
            duration: this.video.duration
        });
    }

    _handlePause = () => {
        this.setState({
            state: PlayerState.PAUSED
        });
    }

    _handlePlay = () => {
        this.setState({
            state: PlayerState.PLAYING
        });
    }

    _handleSeeking = () => {
        const onSeeking = this.props.onSeeking;

        if (onSeeking) {
            onSeeking(this.video);
        }
    }

    _handleTimeUpdate = () => {
        const onTimeUpdate = this.props.onTimeUpdate;
        const video = this.video;

        if (onTimeUpdate) {
            onTimeUpdate(video);
        }
        this.setState({
            currentTime: video.currentTime
        });
    }
}
