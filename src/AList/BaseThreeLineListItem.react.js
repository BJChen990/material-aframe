import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import TextUtil from '../utils/TextUtil';
import ColorUtil from '../utils/ColorUtil';
import TextBlock from '../models/TextBlock';
import Constants from '../constants';
const THREE = window.AFRAME.THREE;

const { PIXEL_TO_METER } = Constants;

export default class AThreeLineListItem extends React.Component {

    static propTypes = {
        width: React.PropTypes.number,
        dense: React.PropTypes.bool,
        backgroundColor: React.PropTypes.string,
        primaryText: React.PropTypes.string,
        secondaryText: React.PropTypes.string,
        leftElement: React.PropTypes.node,
        rightElement: React.PropTypes.node
    }

    // TODO remove this
    static defaultProps = {
        width: 3,
        backgroundColor: '#fafafa',
        primaryText: '',
        secondaryText: '',
        leftElement: null,
        rightElement: null
    }

    constructor(props) {
        super(props);

        const threeColor = new THREE.Color(props.backgroundColor);
        this._hoverColor = ColorUtil.changeColorWithAmount(threeColor, 1);

        this._listHeight = null;
        this._textFontSize = null;
    }

    componentWillUpdate(nextProps) {
        const threeColor = new THREE.Color(nextProps.backgroundColor);
        this._hoverColor = ColorUtil.changeColorWithAmount(threeColor, 1);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    _getTextPart() {
        const {
            leftElement,
            rightElement,
            primaryText,
            secondaryText,
            width
        } = this.props;
        let textWidth,
            textCenterX;

        if (!leftElement && !rightElement) {
            textCenterX = 0;
            textWidth = width - 16 * PIXEL_TO_METER * 2;
        }
        else if (!rightElement) {
            textCenterX = (72 - 16) * PIXEL_TO_METER * 0.5;
            textWidth = width - (72 + 16) * PIXEL_TO_METER;
        }
        else if (!leftElement) {
            textCenterX = (-40) * PIXEL_TO_METER * 0.5;
            textWidth = width - (72) * PIXEL_TO_METER;
        }
        else {
            textWidth = width - (56 + 72) * PIXEL_TO_METER;
            textCenterX = - width * 0.5 + 72 * PIXEL_TO_METER + 0.5 * textWidth;
        }

        const textBlock = new TextBlock(
            TextUtil.getCanvas().getContext('2d'),
            textWidth * 360,
            {
                fontSize: this._textFontSize * Constants.PIXEL_TO_CANVAS_PIXEL
            }
        );
        textBlock.pushText(primaryText, Constants.TextBlockTextType.NORMAL);
        textBlock.pushText(secondaryText, Constants.TextBlockTextType.NORMAL);

        return (
            <a-entity
                geometry={`primitive: plane; width: ${textWidth}; height: ${this._listHeight};`}
                araisedcanvas={`width: ${textWidth * 360}; height: ${this._listHeight * 360};`}
                material={'transparent: true; opacity: 0;'}
                position={`${textCenterX} 0 0.001`}
                text2d={`textJson: ${JSON.stringify(textBlock.toJS())}; color: ${'black'}; verticalAlign: middle`}
            />
        );
    }

    // Only take AnAvatar and AnIconButton for now
    _getLeftElement = () => {
        // posiiton = 16 + self if is avatar
        const {
            leftElement,
            width
        } = this.props;

        if (!leftElement) {
            return;
        }

        const avatarCenter = -(0.5 * width) + (16 + 20) * PIXEL_TO_METER;
        return React.cloneElement(leftElement, {
            position: `${avatarCenter} 0 0.001`,
            radius: 20 * PIXEL_TO_METER
        });
    }

    _getRightElement = () => {
        const {
            rightElement,
            width
        } = this.props;

        if (!rightElement) {
            return;
        }

        const avatarCenter = (0.5 * width) - (8 + 20) * PIXEL_TO_METER;
        return React.cloneElement(rightElement, {
            position: `${avatarCenter} 0 0.001`
        });
    }

    render() {
        const {
            width,
            backgroundColor,
            ...others
        } = this.props;

        return (
            <a-entity
                hoverable={true}
                geometry={`primitive: plane; width: ${width}; height: ${this._listHeight};`}
                material={`color: ${backgroundColor};`}
                {...others}
            >
                {this._getLeftElement()}
                {this._getTextPart()}
                {this._getRightElement()}
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
