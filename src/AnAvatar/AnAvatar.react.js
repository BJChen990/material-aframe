import React from 'react';
require('../aframe-components/aframe-image-clip');

export default class AnAvatar extends React.Component {

    static propTypes = {
        radius: React.PropTypes.number,
        src: React.PropTypes.string.isRequired
    }

    static defaultProps = {
        radius: 1
    }

    render() {
        const {
            radius,
            src,
            ...others
        } = this.props;

        return (
            <a-entity
                geometry={`primitive: circle; radius: ${radius}`}
                material={'color: white; shader: flat;'}
                image-clip={`src: ${src};`}
                {...others}
            />
        );
    }
}
