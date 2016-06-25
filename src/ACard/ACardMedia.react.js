import React from 'react';

const styles = {
    source: {
        display: 'none'
    }
};

let __instance = 0;

export default class ACardMedia extends React.Component {

    static propTypes = {
        videoSrc: React.PropTypes.string,
        imageSrc: React.PropTypes.string
    }

    static contextTypes = {
        cardWidth: React.PropTypes.number
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            instanceId: ++__instance,
            mediaHeight: context.cardWidth,
            mediaIdSrc: null
        };
    }

    render() {
        const {
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
                geometry={`primitive: plane; width: ${this.context.cardWidth}; height: ${mediaHeight};`}
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
