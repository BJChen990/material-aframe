import React, {PropTypes} from 'react';
import AbstractFlatButton from './AbstractFlatButton.react';

export default class AFlatButton extends AbstractFlatButton {

    static propTypes = {
        ...AbstractFlatButton.propTypes,
        width: PropTypes.number,
        text: PropTypes.string,
        fontColor: PropTypes.string
    }

    static defaultProps = {
        ...AbstractFlatButton.defaultProps,
        width: 0.97,
        text: 'BUTTON',
        fontColor: 'black'
    }

    render() {
        const {
            width,
            backgroundColor,
            text,
            fontColor,
            ...others
        } = this.props;
        return (
            <a-entity
                ref='button'
                geometry={`primitive:roundedrect; radius: 0.02; width: ${width}; height: 0.4;`}
                material={`color: ${backgroundColor}; transparent: true; opacity: 0;`}
                araisedcanvas={`width: ${width * 360}; height: ${0.4 * 360};`}
                button-text={`text: ${text}; color: ${fontColor}; fontFamily: OpenSans;`}
                ripple={`color: ${this._rippleColor}; type: rect`}
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
