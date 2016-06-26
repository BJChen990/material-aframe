import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export default class AHalfDomePlayerScreen extends React.Component {

    static propTypes = {
        videoId: React.PropTypes.string
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        const videoId = this.props.videoId;

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
            </a-entity>
        );
    }
}
