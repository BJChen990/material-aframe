import React, {PropTypes} from 'react';
import AbstractFloatingButton from './AbstractFloatingButton.react';

const ButtonType = {
    NORMAL: 'normal',
    MINI: 'mini'
};

export default class AFloatingActionButton extends AbstractFloatingButton {

    static propTypes = {
        ...AbstractFloatingButton.propTypes,
        buttonType: PropTypes.string,
        iconSrc: PropTypes.string,
        iconColor: PropTypes.string
    }

    static defaultProps = {
        ...AbstractFloatingButton.defaultProps,
        buttonType: ButtonType.NORMAL,
        iconColor: 'black'
    }

    render() {
        const {
            buttonType,
            backgroundColor,
            iconSrc,
            iconColor,
            ...others
        } = this.props;

        const buttonRadius = (buttonType === ButtonType.MINI) ? 0.2 : 0.31;
        const canvasSize = buttonRadius * 360;

        return (
            <a-entity
                ref='button'
                geometry={`primitive: circle; radius: ${buttonRadius}`}
                material={`color: ${backgroundColor}; shader: flat;`}
                araisedcanvas={`width: ${canvasSize}; height: ${canvasSize};`}
                shadow='src: /images/radial-gradient.png; scaleX: 1.2; scaleY: 1.2;'
                svg={`path: ${iconSrc}; iconColor: ${iconColor}`}
                ripple={`color: ${this._rippleColor}; type: circle;`}
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
