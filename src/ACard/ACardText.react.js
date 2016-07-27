import React from 'react';
import TextUtil from '../utils/TextUtil';
import TextBlock from '../models/TextBlock';
import Constants from '../constants';
const CardTextPadding = Constants.CARD_TEXT_PADDING * Constants.PIXEL_TO_CANVAS_PIXEL;
const CardTextFontSize = Constants.CARD_TEXT_FONT_SIZE * Constants.PIXEL_TO_CANVAS_PIXEL;


export default class ACardText extends React.Component {

    static propTypes = {
        children: React.PropTypes.string,
        height: React.PropTypes.number,
        textJson: React.PropTypes.object
    }

    static defaultProps = {
        children: ''
    }

    static contextTypes = {
        cardWidth: React.PropTypes.number,
        cardBackgroundColor: React.PropTypes.string,
        cardTextColor: React.PropTypes.string
    }

    static preprocessComponent(component, width) {
        const {children} = component.props;
        const textBlock = new TextBlock(
            TextUtil.getCanvas().getContext('2d'),
            width * 360,
            {
                verticalPadding: CardTextPadding,
                horizontalPadding: CardTextPadding,
                fontSize: CardTextFontSize
            }
        );
        textBlock.pushText(children, Constants.TextBlockTextType.NORMAL);
        return textBlock.toJS();
    }

    render() {
        const cardWidth = this.context.cardWidth;
        const {
            height,
            textJson,
            ...others
        } = this.props;

        return (
            <a-entity
                geometry={`primitive: plane; width: ${cardWidth}; height: ${height};`}
                material={`color: ${this.context.cardBackgroundColor};`}
                araisedcanvas={`width: ${cardWidth * 360}; height: ${height * 360};`}
                text2d={`textJson: ${JSON.stringify(textJson)}; color: ${this.context.cardTextColor}; paddingHorizontal: ${CardTextPadding}; paddingVertical: ${CardTextPadding}`}
                {...others}
            />
        );
    }
}
