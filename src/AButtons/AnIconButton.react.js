import React, {PropTypes} from 'react';
import AbstractFlatButton from './AbstractFlatButton.react';

const ButtonType = {
    NORMAL: 'normal',
    MINI: 'mini'
};

export default class AnIconButton extends AbstractFlatButton {

    static propTypes = {
        ...AbstractFlatButton.propTypes,
        buttonType: PropTypes.string,
        iconSrc: PropTypes.string,
        iconColor: PropTypes.string
    }

    static defaultProps = {
        ...AbstractFlatButton.defaultProps,
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
                clickable={true}
                geometry={`primitive: circle; radius: ${buttonRadius}`}
                material={`color: ${backgroundColor}; transparent: true; opacity: 0;`}
                araisedcanvas={`width: ${canvasSize}; height: ${canvasSize};`}
                svg={`path: ${iconSrc}; color: ${iconColor}`}
                ripple={`color: ${this._rippleColor}; type: circle;`}
                {...others}
            >
                <a-animation
                    begin='cursor-mouseenter'
                    dur='200'
                    attribute='material.opacity'
                    from='0'
                    to='0.3'
                />
                <a-animation
                    begin='cursor-mouseleave'
                    dur='200'
                    attribute='material.opacity'
                    from='0.3'
                    to='0'
                />
            </a-entity>
        );
    }
}
