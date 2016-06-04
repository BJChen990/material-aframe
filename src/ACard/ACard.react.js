import React from 'react';
import TextUtil from '../utils/TextUtil';
import TextBlock from '../models/TextBlock';
import ARaisedButton from '../AButtons/ARaisedButton.react';

const Ratio = 9 / 16;
const MeterToPixel = 1 / 360;

export default class ACard extends React.Component {

    static propTypes = {
        width: React.PropTypes.number,
        backgroundColor: React.PropTypes.string,
        text: React.PropTypes.string,
        imageUrl: React.PropTypes.string
    }

    static defaultProps = {
        width: 2.5,
        backgroundColor: '#fafafa',
        text: 'This is a test textField to test card.\n Do not forget to test.'
    }

    constructor(props) {
        super(props);
        const textBlock = new TextBlock(
            TextUtil.getCanvas().getContext('2d'),
            props.width * 360,
            {
                verticalPadding: 16 * 4,
                horizontalPadding: 16 * 4
            }
        );
        textBlock.pushText('Pepe fun!', true);
        textBlock.pushText('The frog pepe is really funny.');
        this._textJson = textBlock.toJS();
    }


    render() {
        const {
            width,
            backgroundColor,
            imageUrl,
            ...others
        } = this.props;
        const textJson = this._textJson;
        const textHeight = textJson.height * MeterToPixel;
        const imageHeight = width * Ratio;
        const cardHeight = imageHeight + textHeight + 0.5;
        const cardCenter = (cardHeight - imageHeight) * 0.5;
        const textCenter = (-cardHeight + textHeight) * 0.5 + 0.5;
        const actionCenter = (-cardHeight + 0.5) * 0.5;

        return (
            <a-entity
                geometry={`primitive: roundedrect; width: ${width}; height: ${cardHeight}; radius: 0.02;`}
                material={`color: ${backgroundColor};`}
                shadow='src: /images/shadow.png; scaleX: 1.1; scaleY: 1.1; depth: -0.001; dy: 0; clickEnable: false;'
                {...others}
            >
                {/* Image */}
                <a-entity
                    position={`0 ${cardCenter} 0.0001`}
                    geometry={`primitive: plane; width: ${width}; height: ${width * Ratio}; radius: 0.02; topOnly: true;`}
                    material={`color: white; src: url(${imageUrl})`}
                />

                {/* TextAreaPaper */}
                <a-entity
                    position={`0 ${textCenter} 0.005`}
                    geometry={`primitive: plane; width: ${width}; height: ${textHeight};`}
                    material={`color: ${backgroundColor};`}
                    araisedcanvas={`width: ${width * 360}; height: ${textHeight * 360};`}
                    text2d={`textJson: ${JSON.stringify(textJson)};`}
                />

                {/* Actions */}
                <a-entity
                    position={`0 ${actionCenter} 0.005`}
                    geometry={`primitive: roundedrect; width: ${width}; height: ${0.5}; radius: 0.02; bottomOnly: true`}
                    material={`color: ${backgroundColor};`}
                >
                    <ARaisedButton
                        position="0 0 0.107"
                        text="BUTTON"
                    />
                </a-entity>

            </a-entity>
        );
    }
}
