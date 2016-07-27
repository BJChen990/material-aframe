import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Constants from '../constants';
import FunctionUtil from '../utils/FunctionUtil';
import ACardTitle from './ACardTitle.react';
import ACardText from './ACardText.react';
import ACardActions from './ACardActions.react';
import ACardMedia from './ACardMedia.react';
import ACardHeader from './ACardHeader.react';

const {
    CANVAS_PIXEL_TO_METER,
    PIXEL_TO_METER
} = Constants;

export default class ACard extends React.Component {

    static propTypes = {
        width: React.PropTypes.number,
        backgroundColor: React.PropTypes.string,
        textColor: React.PropTypes.string,
        imageUrl: React.PropTypes.string,
        children: React.PropTypes.array
    }

    static defaultProps = {
        width: 3,
        backgroundColor: '#fafafa',
        textColor: 'black'
    }

    static childContextTypes = {
        cardWidth: React.PropTypes.number,
        cardBackgroundColor: React.PropTypes.string,
        cardTextColor: React.PropTypes.string
    }

    getChildContext() {
        const props = this.props;

        return {
            cardWidth: props.width,
            cardBackgroundColor: props.backgroundColor,
            cardTextColor: props.textColor
        };
    }

    constructor(props) {
        super(props);
        this._height = 0;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    componentWillUpdate() {
        this._height = 0;
    }

    _getProcessedChildren(oldChildren) {
        const children = FunctionUtil.listify(oldChildren);
        const childrenLength = children.length;
        let newChildren = [];

        for (let i = 0; i < childrenLength; i++) {
            const currentChild = children[i];
            switch (currentChild.type) {
            case ACardHeader: {
                const mHeight = 72 * PIXEL_TO_METER;
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
                const data = ACardTitle.preprocessComponent(currentChild, this.props.width);
                const mHeight = data.height * CANVAS_PIXEL_TO_METER;
                newChildren.push(
                    React.cloneElement(currentChild, {
                        key: 'title',
                        textJson: data,
                        height: mHeight,
                        position: `0 ${-this._height - mHeight * 0.5} 0.005`
                    })
                );
                this._height += mHeight;
                break;
            }
            case ACardText: {
                const data = ACardText.preprocessComponent(currentChild, this.props.width);
                const mHeight = data.height * CANVAS_PIXEL_TO_METER;
                newChildren.push(
                    React.cloneElement(currentChild, {
                        children: null,
                        key: 'text',
                        textJson: data,
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
                        position: `0 ${-this._height - this.props.width * 0.5} 0.005`
                    })
                );
                this._height += this.props.width;
                break;
            }
            case ACardActions: {
                const positions = ACardActions.preprocessComponent(currentChild);
                const mHeight = 0.4 + 8 * 2 * PIXEL_TO_METER;
                newChildren.push(
                    React.cloneElement(currentChild, {
                        key: 'actions',
                        width: this.props.width,
                        height: 0.4 + 8 * 2 * PIXEL_TO_METER,
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

    render() {
        const {
            children,
            width,
            backgroundColor,
            ...others
        } = this.props;
        const newChildren = this._getProcessedChildren(children);

        return (
            <a-entity
                hoverable={true}
                geometry={`primitive: roundedrect; width: ${width}; height: ${this._height}; radius: 0.02;`}
                material={`color: ${backgroundColor};`}
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
