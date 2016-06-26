import React from 'react';
import FunctionUtil from '../utils/FunctionUtil';

export default class AnVideoProgressBar extends React.Component {

    static propTypes = {
        position: React.PropTypes.string,
        width: React.PropTypes.number,
        duration: React.PropTypes.number
    };

    static contextTypes = {
        onSeekToTime: React.PropTypes.func,
        currentTime: React.PropTypes.number,
        duration: React.PropTypes.number
    }

    componentDidMount() {
        this.refs.progressBar.addEventListener('cursor-click', this._handleChangeTime);
    }

    componentWillUnmount() {
        this.refs.progressBar.removeEventListener('cursor-click', this._handleChangeTime);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return FunctionUtil.contextShallowCompare(this, nextProps, nextState, nextContext);
    }

    _handleChangeTime = (event) => {
        const props = this.props;
        const context = this.context;
        const width = props.width;
        const percentage = (event.detail.intersectInfo.intersections[0].point.x + width * 0.5) / width;
        context.onSeekToTime(Math.floor(percentage * context.duration));
    }

    render() {
        const {
            width,
            ...others
        } = this.props;
        const context = this.context;

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
                    position={`${(context.currentTime / context.duration - 0.5) * width} 0 0`}
                    radius='0.07'
                    color='#FFFFFF'
                />
            </a-entity>
        );
    }
}
