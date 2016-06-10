import React from 'react';

export default class ACardTitle extends React.Component {

    static propTypes = {
        children: React.PropTypes.object,
        height: React.PropTypes.number,
        width: React.PropTypes.number
    }

    _processChildren(children) {
        const props = this.props;
        const width = props.width;
        const positions = props.positions;
        let mChildren = children;
        if (!children) {
            return null;
        }

        // To make function simpler, make a non-array object to array.
        if (!Array.isArray(mChildren)) {
            mChildren = [mChildren];
        }
        const childrenLength = children.length;
        let newChildren = [];

        for (let i = 0; i < childrenLength; i++) {
            newChildren.push(React.cloneElement(mChildren[i], {
                position: `${-width * 0.5 + positions[i]} 0 0.01`
            }));
        }
        return newChildren;
    }

    render() {
        const {
            width,
            height,
            children,
            ...others
        } = this.props;
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
