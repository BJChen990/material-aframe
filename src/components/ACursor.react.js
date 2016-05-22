import React from 'react';

// Usage:
// <ACursor
//     innerSize
//     outerSize
//     color
//     hoverInnerSize
//     hoverOuterSize
//     hoverColor
//     clickedInnerSize
//     clickedOuterSize
//     onClick
//     onHover
// />

const ANIMATION_DURATION = '500';

export default class ACursor extends React.Component {
    static propsType = {
        innerSize: React.PropTypes.number,
        outerSize: React.PropTypes.number,
        color: React.PropTypes.string,
        hoverInnerSize: React.PropTypes.number,
        hoverOuterSize: React.PropTypes.number,
        hoverColor: React.PropTypes.string,
        clickedInnerSize: React.PropTypes.number,
        clickedOuterSize: React.PropTypes.number,
        clickedColor: React.PropTypes.string,
        onHover: React.PropTypes.func,
        onClick: React.PropTypes.func,
        timeout: React.PropTypes.number
    }
    static defaultProps = {
        innerSize: 0.000001,
        outerSize: 0.005,
        color: 'black',
        hoverInnerSize: 0.03,
        hoverOuterSize: 0.04,
        hoverColor: 'gray',
        clickedInnerSize: 0.02,
        clickedOuterSize: 0.03,
        clickedColor: 'red',
        onHover: null,
        onClick: null,
        timeout: 1500
    }

    constructor(props) {
        super(props);
        this.state = {
            currentInnerSize: props.innerSize,
            currentOuterSize: props.outerSize,
            currentColor: props.color
        };
    }

    componentDidMount() {
        this.refs.cursor.addEventListener('cursor-click', this._handleClick);
        this.refs.cursor.addEventListener('cursor-mouseenter', this._handleHover);
    }

    componentWillUnmount() {
        this.refs.cursor.removeEventListener('cursor-click', this._handleClick);
        this.refs.cursor.removeEventListener('cursor-mouseenter', this._handleHover);
    }

    shouldComponentUpdate() {
        // TODO add shallow compare.
        return true;
    }

    _handleClick = (event) => {
        const props = this.props;
        if (props.onClick) {
            this.props.onClick(event);
        }

        this.setState({
            currentInnerSize: props.clickedInnerSize,
            currentOuterSize: props.clickedOuterSize,
            currentColor: props.clickedColor
        });
    }

    _handleHover = (event) => {
        const props = this.props;
        if (props.onHover) {
            this.props.onHover(event);
        }

        this.setState({
            currentInnerSize: props.hoverInnerSize,
            currentOuterSize: props.hoverOuterSize,
            currentColor: props.hoverColor
        });
    }

    _getMouseEnterAnimations() {
        const {
            hoverInnerSize,
            hoverOuterSize,
            hoverColor,
            innerSize,
            outerSize,
            color
        } = this.props;
        const eventName = 'cursor-mouseenter';

        return [
            <a-animation
                key='inner'
                begin={eventName}
                dur={ANIMATION_DURATION}
                attribute='geometry.radiusInner'
                from={innerSize}
                to={hoverInnerSize}
            />,
            <a-animation
                key='outer'
                begin={eventName}
                dur={ANIMATION_DURATION}
                attribute='geometry.radiusOuter'
                from={outerSize}
                to={hoverOuterSize}
            />,
            <a-animation
                key='color'
                begin={eventName}
                dur={ANIMATION_DURATION}
                attribute='material.color'
                from={color}
                to={hoverColor}
            />
        ];
    }

    // TODO Not working, need investigation.
    _getMouseLeaveAnimations() {
        const {
            innerSize,
            outerSize,
            color
        } = this.props;
        const state = this.state;
        const eventName = 'cursor-mouseleave';

        return [
            <a-animation
                key='inner'
                begin={eventName}
                dur={ANIMATION_DURATION}
                attribute='geometry.radiusInner'
                from={state.currentInnerSize}
                to={innerSize}
            />,
            <a-animation
                key='outer'
                begin={eventName}
                dur={ANIMATION_DURATION}
                attribute='geometry.radiusOuter'
                from={state.currentOuterSize}
                to={outerSize}
            />,
            <a-animation
                key='color'
                begin={eventName}
                dur={ANIMATION_DURATION}
                attribute='material.color'
                from={state.currentColor}
                to={color}
            />
        ];
    }

    _getMouseClickAnimations() {
        const {
            hoverInnerSize,
            hoverOuterSize,
            hoverColor,
            clickedInnerSize,
            clickedOuterSize,
            clickedColor
        } = this.props;
        const eventName = 'cursor-click';

        return [
            <a-animation
                key='inner'
                begin={eventName}
                dur={ANIMATION_DURATION}
                attribute='geometry.radiusInner'
                from={hoverInnerSize}
                to={clickedInnerSize}
            />,
            <a-animation
                key='outer'
                begin={eventName}
                dur={ANIMATION_DURATION}
                attribute='geometry.radiusOuter'
                from={hoverOuterSize}
                to={clickedOuterSize}
            />,
            <a-animation
                key='color'
                begin={eventName}
                dur={ANIMATION_DURATION}
                attribute='material.color'
                from={hoverColor}
                to={clickedColor}
            />
        ];
    }

    render() {
        const props = this.props;

        return (
            <a-entity
                ref="cursor"
                raycaster='interval: 500; far: 10; recursive: true;'
                acursor={`fuse: true; fuseTimeout: ${props.timeout};`}
                position='0 0 -2'
                geometry={`primitive: ring; radiusInner: ${props.innerSize}; radiusOuter: ${props.outerSize};`}
                material={`color: ${props.color};`}
            >
                {this._getMouseEnterAnimations()}
                {this._getMouseLeaveAnimations()}
                {this._getMouseClickAnimations()}
            </a-entity>
        );
    }
}
