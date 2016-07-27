import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import TextUtil from '../utils/TextUtil';
import TextBlock from '../models/TextBlock';
import Constants from '../constants';

const {
    CARD_TITLE_PADDING,
    CARD_TITLE_TITLE_FONT_SIZE,
    CARD_TITLE_SUBTITLE_FONT_SIZE,
    PIXEL_TO_CANVAS_PIXEL,
    TextBlockTextType
} = Constants;

const cardTitleCanvasPadding = CARD_TITLE_PADDING * PIXEL_TO_CANVAS_PIXEL;
const titleFontSize = CARD_TITLE_TITLE_FONT_SIZE * PIXEL_TO_CANVAS_PIXEL;
const subtitleFontSize = CARD_TITLE_SUBTITLE_FONT_SIZE * PIXEL_TO_CANVAS_PIXEL;

export default class ACardTitle extends React.Component {

    static propTypes = {
        title: React.PropTypes.string,
        subtitle: React.PropTypes.string,
        height: React.PropTypes.number,
        textJson: React.PropTypes.object
    }

    static defaultProps = {
        title: '',
        subtitle: ''
    }

    static contextTypes = {
        cardWidth: React.PropTypes.number,
        cardBackgroundColor: React.PropTypes.string,
        cardTextColor: React.PropTypes.string
    }

    static preprocessComponent(component, width) {
        const {title, subtitle} = component.props;
        const textBlock = new TextBlock(
            TextUtil.getCanvas().getContext('2d'),
            width * 360,
            {
                verticalPadding: cardTitleCanvasPadding,
                horizontalPadding: cardTitleCanvasPadding,
                titleFontSize,
                subtitleFontSize
            }
        );
        textBlock.pushText(title, TextBlockTextType.TITLE);
        textBlock.pushText(subtitle, TextBlockTextType.SUBTITLE);
        return textBlock.toJS();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return shallowCompare(this, nextProps, nextState, nextContext);
    }

    render() {
        const {
            height,
            textJson,
            ...others
        } = this.props;
        const cardWidth = this.context.cardWidth;

        return (
            <a-entity
                geometry={`primitive: plane; width: ${cardWidth}; height: ${height};`}
                material={`color: ${this.context.cardBackgroundColor};`}
                araisedcanvas={`width: ${cardWidth * 360}; height: ${height * 360};`}
                text2d={`textJson: ${JSON.stringify(textJson)}; color: ${this.context.cardTextColor}; paddingHorizontal: ${cardTitleCanvasPadding}; paddingVertical: ${cardTitleCanvasPadding}`}
                {...others}
            />
        );
    }
}
