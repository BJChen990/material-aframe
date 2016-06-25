import React from 'react';
import Constants from '../constants';
const PIXEL_TO_METER = Constants.PIXEL_TO_METER;

export default class ACardActions extends React.Component {

    static propTypes = {
        positions: React.PropTypes.array,
        children: React.PropTypes.node,
        height: React.PropTypes.number,
        width: React.PropTypes.number
    }

    static contextTypes = {
        cardWidth: React.PropTypes.number
    }

    static preprocessComponent(component) {
        const {children} = component.props;
        if (!children) {
            return [];
        }
        else if (!Array.isArray(children)) {
            return [8 * PIXEL_TO_METER + 0.97 * 0.5];
        }

        const length = children.length;
        const positions = [];
        let xPosition = 8 * PIXEL_TO_METER + 0.97 * 0.5;

        for (let i = 0; i < length; i++) {
            positions.push(xPosition);
            xPosition += 8 * PIXEL_TO_METER + 0.97;
        }
        return positions;
    }

    _processChildren(children) {
        const positions = this.props.positions;
        const width = this.context.cardWidth;
        let mChildren = children;
        if (!children) {
            return null;
        }

        // To make function simpler, make a non-array object to array.
        if (!Array.isArray(mChildren)) {
            mChildren = [mChildren];
        }

        const childrenLength = mChildren.length;
        let newChildren = [];

        for (let i = 0; i < childrenLength; i++) {
            newChildren.push(React.cloneElement(mChildren[i], {
                key: i,
                position: `${-width * 0.5 + positions[i]} 0 0.01`
            }));
        }
        return newChildren;
    }

    render() {
        const {
            height,
            children,
            ...others
        } = this.props;
        const width = this.context.cardWidth;
        const newChildren = this._processChildren(children);

        return (
            <a-entity
                geometry={`primitive: plane; width: ${width}; height: ${height};`}
                material={'color: #fafafa;'}
                {...others}
            >
                {newChildren}
            </a-entity>
        );
    }
}
