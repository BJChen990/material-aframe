import React from 'react';
require('../aframe-components/aframe-stereocam-component');

export default class ACamera extends React.Component {
    render() {
        const {
            children,
            ...others
        } = this.props;

        return (
            <a-camera
                stereocam="eye: right;"
                {...others}
            >
                {children}
            </a-camera>
        );
    }
}
