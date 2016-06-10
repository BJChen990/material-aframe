import React from 'react';

export default class ACardTitle extends React.Component {

    static propTypes = {
        title: React.PropTypes.string,
        subtitle: React.PropTypes.string,
        height: React.PropTypes.number,
        width: React.PropTypes.number,
        textJson: React.PropTypes.object
    }

    static defaultProps = {
        title: null,
        subtitle: null
    }


    render() {
        const {
            width,
            height,
            textJson,
            ...others
        } = this.props;

        return (
            <a-entity
                geometry={`primitive: plane; width: ${width}; height: ${height};`}
                material={'color: #fafafa;'}
                araisedcanvas={`width: ${width * 360}; height: ${height * 360};`}
                text2d={`textJson: ${JSON.stringify(textJson)};`}
                {...others}
            />
        );
    }
}
