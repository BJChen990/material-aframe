import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export default class Indicator extends React.Component {

    static propTypes = {
        position: React.PropTypes.string,
        width: React.PropTypes.number,
        currentTime: React.PropTypes.number,
        duration: React.PropTypes.number
    };

    componentDidMount() {
        this.refs.progressBar.addEventListener('cursor-click', this._handleChangeTime);
    }

    componentWillUnmount() {
        this.refs.progressBar.removeEventListener('cursor-click', this._handleChangeTime);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    _handleChangeTime = (event) => {
        const props = this.props;
        const width = props.width;
        const percentage = (event.detail.intersectInfo.intersections[0].point.x + width * 0.5) / width;
        props.onSeekToTime(Math.floor(percentage * props.duration));
    }

    render() {
        const {
            width,
            duration,
            currentTime,
            ...others
        } = this.props;

        return (
            <a-entity {...others}>
                <a-cylinder
                    clickable={true}
                    ref='progressBar'
                    radius='0.03'
                    height={width}
                    rotation='0 0 90'
                    color='#FFFFFF'
                    selectable='true'
                />
                <a-sphere
                    position={`${(currentTime / duration - 0.5) * width} 0 0`}
                    radius='0.07'
                    color='#FFFFFF'
                />
            </a-entity>
        );
    }
}
