import React from 'react';
import TextUtil from '../utils/TextUtil';
import TextBlock from '../models/TextBlock';
import Constants from '../constants';
import ACardTitle from './ACardTitle.react';
import ACardText from './ACardText.react';

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
        children: React.PropTypes.object
    }

    static defaultProps = {
        width: 2.5,
        backgroundColor: '#fafafa',
        text: 'This is a test textField to test card.\n Do not forget to test.'
    }

    constructor(props) {
        super(props);
        this._height = 0;
    }

    _getProcessedChildren() {
        let children = this.props.children;
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
            default:
                throw new Error('Invalid children type sent to ACard.');
            }
        }

        return newChildren;
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
        console.log(textBlock.toJS());
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
        console.log(textBlock.toJS());
        return textBlock.toJS();
    }

    render() {
        const newChildren = this._getProcessedChildren();

        return (
            <a-entity position="0 0 -4">
                {newChildren}
            </a-entity>
        );

        // return (
        //     <a-entity
        //         geometry={`primitive: roundedrect; width: ${width}; height: ${cardHeight}; radius: 0.02;`}
        //         material={`color: ${backgroundColor};`}
        //         shadow='src: /images/shadow.png; scaleX: 1.1; scaleY: 1.1; depth: -0.001; dy: 0; clickEnable: false;'
        //         {...others}
        //     >
        //         {/* Image */}
        //         <a-entity
        //             position={`0 ${cardCenter} 0.0001`}
        //             geometry={`primitive: plane; width: ${width}; height: ${width * Ratio}; radius: 0.02; topOnly: true;`}
        //             material={`color: white; src: url(${imageUrl})`}
        //         />
        //
        //         {/* TextAreaPaper */}
        //         <a-entity
        //             position={`0 ${textCenter} 0.005`}
        //             geometry={`primitive: plane; width: ${width}; height: ${textHeight};`}
        //             material={`color: ${backgroundColor};`}
        //             araisedcanvas={`width: ${width * 360}; height: ${textJson.height};`}
        //             text2d={`textJson: ${JSON.stringify(textJson)};`}
        //         />
        //
        //         {/* Actions */}
        //         <a-entity
        //             position={`0 ${actionCenter} 0.005`}
        //             geometry={`primitive: roundedrect; width: ${width}; height: ${0.577777}; radius: 0.02; bottomOnly: true`}
        //             material={`color: ${backgroundColor};`}
        //         >
        //             <AFlatButton
        //                 position="0 0 0.01"
        //                 text="BUTTON"
        //             />
        //         </a-entity>
        //     </a-entity>
        // );
    }
}
