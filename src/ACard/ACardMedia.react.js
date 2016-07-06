import React from 'react';

export default class ACardMedia extends React.Component {

    static propTypes = {
        imageSrc: React.PropTypes.string
    }

    static contextTypes = {
        cardWidth: React.PropTypes.number
    }

    render() {
        const {
            imageSrc,
            ...others
        } = this.props;

        return (
            <a-entity
                geometry={`primitive: plane; width: ${this.context.cardWidth}; height: ${this.context.cardWidth};`}
                material={'color: white;'}
                image-load={`src: ${imageSrc || ''}`}
                {...others}
            />
        );
    }

}
