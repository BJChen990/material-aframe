import React from 'react';
import AVideoManager from './AVideoManager.react';
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


class AHalfDomePlayer extends React.Component {

    static propTypes = {
        src: React.PropTypes.string,
        onSeeking: React.PropTypes.func,
        onTimeUpdate: React.PropTypes.func
    }

    static childContextTypes = {
        currentTime: React.PropTypes.number,
        currentState: React.PropTypes.string,
        duration: React.PropTypes.number,
        onSeekToTime: React.PropTypes.func,
        onSetPlay: React.PropTypes.func,
        onSetPause: React.PropTypes.func,
        onSetForward: React.PropTypes.func
    }

    getChildContext() {
        const state = this.state;

        return {
            onSetPlay: this._handleSetPlay,
            onSetPause: this._handleSetPause,
            onSetForward: this._handleSetForward,
            onSeekToTime: this._handleSeekToTime,
            currentState: state.state,
            currentTime: state.currentTime,
            duration: state.duration
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

    render() {
        const videoId = this.videoId;

        return (
            <a-entity>
                <AHalfDomePlayerScreen videoId={videoId} />
                <AVideoControlPanel
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

export default AVideoManager(AHalfDomePlayer);
