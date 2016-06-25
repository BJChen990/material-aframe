import React from 'react';
import AVideoManager from './AVideoManager.react';
import ControlPanel from './ControlPanel.react';
require('../aframe-components/aframe-stereo-component');

const styles = {
    hidden: {display: 'none'}
};
let __instance = 0;
const PlayerState = {
    PLAYING: 'playing',
    PAUSED: 'paused'
};


class AHalfDomePlayer extends React.Component {

    static propTypes = {
        src: React.PropTypes.string
    }

    constructor(props) {
        super(props);
        this.videoId = `VIDEO_MANAGER_${__instance++}`;
        this.state = {
            state: PlayerState.PAUSED,
            currentTime: null,
            duration: null
        };
    }

    render() {
        const videoId = this.videoId;

        return (
            <a-entity>
                <a-entity
                    geometry='primitive: sphere; radius: 10; segmentsWidth: 64; segmentsHeight: 64; phiStart: -180; phiLength: 180;'
                    material={`shader: flat; src: #${videoId};`}
                    scale='-1 1 1'
                    stereo='eye: left; isVideo: true;'
                />
                <a-entity
                    geometry='primitive: sphere; radius: 10; segmentsWidth: 16; segmentsHeight: 64; phiStart: -180; phiLength: 180;'
                    material={`shader: flat; src: #${videoId};`}
                    scale='-1 1 1'
                    stereo='eye: right; isVideo: true;'
                />
                <ControlPanel
                    currentTime={this.state.currentTime}
                    duration={this.state.duration}
                    onSeekToTime={this._handleSeekToTime}
                    position="0 0 -4"
                    width={5}
                />
                <video
                    ref="video"
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

    _handleSeekToTime = (newTime) => {
        this.refs.video.currentTime = newTime;
    }

    _handleDurationChange = () => {
        this.setState({
            duration: this.refs.video.duration
        });
    }

    _handlePause = () => {
        this.setState({
            state: 'pause'
        });
    }

    _handlePlay = () => {
        this.setState({
            state: 'play'
        });
    }

    _handleSeeking = () => {
        const onSeeking = this.props.onSeeking;

        if (onSeeking) {
            onSeeking(this.refs.video);
        }
    }

    _handleTimeUpdate = () => {
        const onTimeUpdate = this.props.onTimeUpdate;
        const video = this.refs.video;

        if (onTimeUpdate) {
            onTimeUpdate(video);
        }
        this.setState({
            currentTime: video.currentTime
        });
    }
}

export default AVideoManager(AHalfDomePlayer);
