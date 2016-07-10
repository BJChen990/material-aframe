import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Constants from '../constants';
import TextUtil from '../utils/TextUtil';
import TextBlock from '../models/TextBlock';
const {
    PIXEL_TO_CANVAS_PIXEL,
    PIXEL_TO_METER,
    TextBlockTextType
} = Constants;

const AvatarSize = 40;
const Padding = 16;
// const HeaderHeight = 72;

export default class ACardHeader extends React.Component {

    static propTypes = {
        avatar: React.PropTypes.element,
        title: React.PropTypes.string,
        subtitle: React.PropTypes.string,
        height: React.PropTypes.number,
        width: React.PropTypes.number
    }

    static defaultProps = {
        children: ''
    }

    static contextTypes = {
        cardWidth: React.PropTypes.number,
        cardBackgroundColor: React.PropTypes.string,
        cardTextColor: React.PropTypes.string
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return shallowCompare(this, nextProps, nextState, nextContext);
    }

    render() {
        const {
            height,
            avatar,
            title,
            subtitle,
            ...others
        } = this.props;
        const width = this.context.cardWidth;
        const avatarPosition = -width * 0.5 + (16 + 0.5 * AvatarSize) * PIXEL_TO_METER;

        const newAvatar = React.cloneElement(avatar, {
            position: `${avatarPosition} 0 0.001`,
            radius: Constants.PIXEL_TO_METER * AvatarSize * 0.5
        });

        const textWidth = width - ((16 + AvatarSize) * PIXEL_TO_METER);
        const textPosition = width * 0.5 - textWidth * 0.5;
        const cardHeaderCanvasPadding = Padding * PIXEL_TO_CANVAS_PIXEL;
        const textBlock = new TextBlock(
            TextUtil.getCanvas().getContext('2d'),
            this.props.width * 360,
            {
                verticalPadding: cardHeaderCanvasPadding,
                horizontalPadding: cardHeaderCanvasPadding,
                titleFontSize: 16 * PIXEL_TO_CANVAS_PIXEL,
                subtitleFontSize: 16 * PIXEL_TO_CANVAS_PIXEL
            }
        );
        textBlock.pushText(title, TextBlockTextType.TITLE);
        textBlock.pushText(subtitle, TextBlockTextType.SUBTITLE);

        return (
            <a-entity
                geometry={`primitive: plane; width: ${width}; height: ${height};`}
                material={`color: ${this.context.cardBackgroundColor};`}
                {...others}
            >
                {newAvatar}
                <a-entity
                    geometry={`primitive: plane; width: ${textWidth}; height: ${height};`}
                    material={`color: ${this.context.cardBackgroundColor};`}
                    araisedcanvas={`width: ${textWidth * 360}; height: ${height * 360};`}
                    text2d={`textJson: ${JSON.stringify(textBlock.toJS())}; color: ${this.context.cardTextColor}`}
                    position={`${textPosition} 0 0.001`}
                />
            </a-entity>
        );
    }
}
