import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ASingleLineListItem from './ASingleLineListItem.react';
import ASingleLineDenseListItem from './ASingleLineDenseListItem.react';
import ATwoLineListItem from './ATwoLineListItem.react';
import ATwoLineDenseListItem from './ATwoLineDenseListItem.react';
import AThreeLineListItem from './AThreeLineListItem.react';
import AThreeLineDenseListItem from './AThreeLineDenseListItem.react';
import FunctionUtil from '../utils/FunctionUtil';
import Constants from '../constants';
const {
    ListConstants,
    PIXEL_TO_METER
} = Constants;
const DenseListHeight = ListConstants.SingleLineConstants.DENSE_TILE_HEIGHT * PIXEL_TO_METER;
const ListHeight = ListConstants.SingleLineConstants.TILE_HEIGHT * PIXEL_TO_METER;
const ExpandedListHeight = ListConstants.SingleLineConstants.EXPANDED_TILE_HEIGHT * PIXEL_TO_METER;

export default class AList extends React.Component {

    static propTypes = {
        width: React.PropTypes.number,
        backgroundColor: React.PropTypes.string,
        children: React.PropTypes.node
    }

    static defaultProps = {
        width: 3,
        backgroundColor: '#fafafa'
    }

    constructor(props) {
        super(props);
        this._height = null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    _getProcessedChildren = () => {
        this._height = 0;

        const originalChildren = FunctionUtil.listify(this.props.children);
        const originalLength = originalChildren.length;
        const newChildren = [];

        for (let i = 0; i < originalLength; i++) {
            const child = originalChildren[i];
            switch (child.type) {
            case ASingleLineListItem: {
                const childHeight = (child.props.leftElement) ? ExpandedListHeight : ListHeight;

                newChildren.push(
                        React.cloneElement(child, {
                            key: i,
                            width: this.props.width,
                            position: `0 ${-this._height - childHeight * 0.5} 0.005`
                        })
                    );
                this._height += childHeight;
                break;
            }
            case ASingleLineDenseListItem: {
                const childHeight = (child.props.leftElement) ? ListHeight : DenseListHeight;

                newChildren.push(
                        React.cloneElement(child, {
                            key: i,
                            width: this.props.width,
                            position: `0 ${-this._height - childHeight * 0.5} 0.005`
                        })
                    );
                this._height += childHeight;
                break;
            }
            case ATwoLineListItem: {
                const childHeight = 72 * PIXEL_TO_METER;

                newChildren.push(
                        React.cloneElement(child, {
                            key: i,
                            width: this.props.width,
                            position: `0 ${-this._height - childHeight * 0.5} 0.005`
                        })
                    );
                this._height += childHeight;
                break;
            }
            case ATwoLineDenseListItem: {
                const childHeight = 60 * PIXEL_TO_METER;

                newChildren.push(
                        React.cloneElement(child, {
                            key: i,
                            width: this.props.width,
                            position: `0 ${-this._height - childHeight * 0.5} 0.005`
                        })
                    );
                this._height += childHeight;
                break;
            }
            case AThreeLineListItem: {
                const childHeight = 88 * PIXEL_TO_METER;

                newChildren.push(
                        React.cloneElement(child, {
                            key: i,
                            width: this.props.width,
                            position: `0 ${-this._height - childHeight * 0.5} 0.005`
                        })
                    );
                this._height += childHeight;
                break;
            }
            case AThreeLineDenseListItem: {
                const childHeight = 76 * PIXEL_TO_METER;

                newChildren.push(
                        React.cloneElement(child, {
                            key: i,
                            width: this.props.width,
                            position: `0 ${-this._height - childHeight * 0.5} 0.005`
                        })
                    );
                this._height += childHeight;
                break;
            }
            }
        }

        return newChildren;
    }

    render() {
        const {
            width,
            backgroundColor,
            ...others
        } = this.props;
        const newChildren = this._getProcessedChildren();

        return (
            <a-entity
                geometry={`primitive: plane; width: ${width}; height: ${this._height};`}
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
