import React from 'react';

const styles = {
    source: {
        display: 'none'
    }
};

let __instance = 0;

export default class ACardMedia extends React.Component {

    static propTypes = {
        width: React.PropTypes.number,
        videoSrc: React.PropTypes.string,
        imageSrc: React.PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            instanceId: ++__instance,
            mediaHeight: props.width,
            mediaIdSrc: null
        };
    }

    render() {
        const {
            width,
            videoSrc,
            imageSrc,
            ...others
        } = this.props;
        const {
            mediaIdSrc,
            instanceId,
            mediaHeight
        } = this.state;

        return (
            <a-entity
                geometry={`primitive: plane; width: ${width}; height: ${mediaHeight};`}
                material={`color: white; ${mediaIdSrc ? `src: #${mediaIdSrc}` : ''}`}
                {...others}
            >
            {
                (videoSrc) ?
                <video id={`CARD_MEDIA_${instanceId}`} src={videoSrc} style={styles.source} /> :
                null
            }
            {
                (imageSrc) ?
                <img
                    id={`CARD_MEDIA_${instanceId}`}
                    src={imageSrc}
                    style={styles.source}
                    onLoad={this._handleSourceLoad}
                /> :
                null
            }
            </a-entity>
        );
    }

    _handleSourceLoad = () => {
        this.setState({
            mediaIdSrc: `CARD_MEDIA_${this.state.instanceId}`
        });
    }
}
