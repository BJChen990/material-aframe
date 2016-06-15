import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import TextUtil from '../utils/TextUtil';
import TextBlock from '../models/TextBlock';
import Constants from '../constants';
import ACardTitle from './ACardTitle.react';
import ACardText from './ACardText.react';
import ACardActions from './ACardActions.react';
import ACardMedia from './ACardMedia.react';
import ACardHeader from './ACardHeader.react';

const CanvasPixelToMeter = Constants.CANVAS_PIXEL_TO_METER;
const CardTitlePadding = Constants.CARD_TITLE_PADDING;
const CardTitleTitleFontSize = Constants.CARD_TITLE_TITLE_FONT_SIZE;
const CardTitleSubtitleFontSize = Constants.CARD_TITLE_SUBTITLE_FONT_SIZE;
const CardTextPadding = Constants.CARD_TEXT_PADDING;
const CardTextFontSize = Constants.CARD_TEXT_FONT_SIZE;

export default class ACard extends React.Component {

    static propTypes = {
        width: React.PropTypes.number,
        backgroundColor: React.PropTypes.string,
        text: React.PropTypes.string,
        imageUrl: React.PropTypes.string,
        children: React.PropTypes.array
    }

    static defaultProps = {
        width: 3,
        backgroundColor: '#fafafa',
        text: 'This is a test textField to test card.\n Do not forget to test.'
    }

    constructor(props) {
        super(props);
        this._height = 0;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    _getProcessedChildren(oldChildren) {
        let children = oldChildren;
        if (!children) {
            throw new Error('Currently ACard must has a valid-type children.');
        }

        // To make function simpler, make a non-array object to array.
        if (!Array.isArray(children)) {
            children = [children];
        }
        const childrenLength = children.length;
        let newChildren = [];

        for (let i = 0; i < childrenLength; i++) {
            const currentChild = children[i];
            switch (currentChild.type) {
            case ACardHeader: {
                const mHeight = 72 * Constants.PIXEL_TO_METER;
                newChildren.push(
                    React.cloneElement(currentChild, {
                        key: 'header',
                        width: this.props.width,
                        height: mHeight,
                        position: `0 ${-this._height - mHeight * 0.5} 0.005`
                    })
                );
                this._height += mHeight;
                break;
            }
            case ACardTitle: {
                const data = this._processTitle(currentChild);
                const mHeight = data.height * CanvasPixelToMeter;
                newChildren.push(
                    React.cloneElement(currentChild, {
                        key: 'title',
                        textJson: data,
                        width: this.props.width,
                        height: mHeight,
                        position: `0 ${-this._height - mHeight * 0.5} 0.005`
                    })
                );
                this._height += mHeight;
                break;
            }
            case ACardText: {
                const data = this._processText(currentChild);
                const mHeight = data.height * CanvasPixelToMeter;
                newChildren.push(
                    React.cloneElement(currentChild, {
                        children: null,
                        key: 'text',
                        textJson: data,
                        width: this.props.width,
                        height: mHeight,
                        position: `0 ${-this._height - mHeight * 0.5} 0.005`
                    })
                );
                this._height += mHeight;
                break;
            }
            case ACardMedia: {
                newChildren.push(
                    React.cloneElement(currentChild, {
                        key: 'media',
                        width: this.props.width,
                        position: `0 ${-this._height - this.props.width * 0.5} 0.005`
                    })
                );
                this._height += this.props.width;
                break;
            }
            case ACardActions: {
                const positions = this._processActions(currentChild);
                const mHeight = 0.4 + 8 * 2 * Constants.PIXEL_TO_METER;
                newChildren.push(
                    React.cloneElement(currentChild, {
                        key: 'actions',
                        width: this.props.width,
                        height: 0.4 + 8 * 2 * Constants.PIXEL_TO_METER,
                        position: `0 ${-this._height - mHeight * 0.5} 0.005`,
                        positions: positions
                    })
                );
                this._height += mHeight;
                break;
            }
            default:
                throw new Error('Invalid children type sent to ACard.');
            }
        }

        return newChildren;
    }

    _processActions(component) {
        const {children} = component.props;
        if (!children) {
            return [];
        }
        else if (!Array.isArray(children)) {
            return [8 * Constants.PIXEL_TO_METER + 0.97 * 0.5];
        }

        const length = children.length;
        const positions = [];
        let xPosition = 8 * Constants.PIXEL_TO_METER + 0.97 * 0.5;

        for (let i = 0; i < length; i++) {
            positions.push(xPosition);
            xPosition += 8 * Constants.PIXEL_TO_METER + 0.97;
        }
        return positions;
    }

    _processText(component) {
        const {children} = component.props;
        const cardTextPadding = CardTextPadding * Constants.PIXEL_TO_CANVAS_PIXEL;
        const textBlock = new TextBlock(
            TextUtil.getCanvas().getContext('2d'),
            this.props.width * 360,
            {
                verticalPadding: cardTextPadding,
                horizontalPadding: cardTextPadding,
                fontSize: CardTextFontSize * Constants.PIXEL_TO_CANVAS_PIXEL
            }
        );
        textBlock.pushText(children, Constants.TextBlockTextType.NORMAL);
        return textBlock.toJS();
    }

    _processTitle(component) {
        const {title, subtitle} = component.props;
        const cardTitleCanvasPadding = CardTitlePadding * Constants.PIXEL_TO_CANVAS_PIXEL;
        const textBlock = new TextBlock(
            TextUtil.getCanvas().getContext('2d'),
            this.props.width * 360,
            {
                verticalPadding: cardTitleCanvasPadding,
                horizontalPadding: cardTitleCanvasPadding,
                titleFontSize: CardTitleTitleFontSize * Constants.PIXEL_TO_CANVAS_PIXEL,
                subtitleFontSize: CardTitleSubtitleFontSize * Constants.PIXEL_TO_CANVAS_PIXEL
            }
        );
        textBlock.pushText(title, Constants.TextBlockTextType.TITLE);
        textBlock.pushText(subtitle, Constants.TextBlockTextType.SUBTITLE);
        return textBlock.toJS();
    }

    render() {
        const {
            children,
            ...others
        } = this.props;
        const newChildren = this._getProcessedChildren(children);

        return (
            <a-entity
                hoverable={true}
                geometry={`primitive: roundedrect; width: ${this.props.width}; height: ${this._height}; radius: 0.02;`}
                material={'color: #fafafa;'}
                shadow='src: /images/shadow.png; scaleX: 1.1; scaleY: 1.1; depth: -0.001; dy: 0; clickEnable: false;'
                {...others}
            >
                <a-entity position={`0 ${this._height * 0.5} 0`}>
                    {newChildren}
                </a-entity>
            </a-entity>
        );
    }
}
