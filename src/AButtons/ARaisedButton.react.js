require('../aframe-geometries/rounded-rect');
require('../aframe-components/aframe-plain-text');
require('../aframe-components/aframe-button-text');
require('../aframe-components/aframe-raised-canvas-texture');
require('../aframe-components/aframe-click-cursor');
require('../aframe-components/aframe-ripple');
require('../aframe-components/aframe-shadow');

import React, {PropTypes} from 'react';
import AbstractFloatingButton from './AbstractFloatingButton.react';

export default class ARaisedButton extends AbstractFloatingButton {
    static propTypes = {
        ...AbstractFloatingButton.propTypes,
        width: PropTypes.number,
        text: PropTypes.string,
        fontColor: PropTypes.string,
        textStyle: PropTypes.object,
        textDimension: PropTypes.string
    }

    static defaultProps = {
        ...AbstractFloatingButton.defaultProps,
        width: 1,
        text: 'BUTTON',
        fontColor: 'black',
        textStyle: {},
        iconStyle: {},
        textDimension: '2d'
    }

    render() {
        const {
            width,
            backgroundColor,
            text,
            ...others
        } = this.props;

        return (
            <a-entity
                ref='button'
                geometry = {`primitive:roundedrect; radius: 0.02; width: ${width}; height: ${0.4};`}
                material={`color: ${backgroundColor}; shader: flat;`}
                shadow='src: /images/shadow.png; scaleX: 1.1; scaleY: 1.15;'
                araisedcanvas={`width: ${width * 360}; height: ${0.4 * 360};`}
                button-text={`text: ${text}; color: ${this.props.fontColor}; fontFamily: OpenSans;`}
                ripple={`color: ${this._rippleColor};`}
                {...others}
            >
                <a-animation
                    begin='cursor-mouseenter'
                    dur='200'
                    attribute='material.color'
                    from={backgroundColor}
                    to={this._hoverColor}
                />
                <a-animation
                    begin='cursor-mouseleave'
                    dur='200'
                    attribute='material.color'
                    from={this._hoverColor}
                    to={backgroundColor}
                />
            </a-entity>
        );
    }
}
