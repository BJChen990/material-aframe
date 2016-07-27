import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import '../aframe-components/aframe-stereocam-component';

export default class ACamera extends React.Component {

    static propTypes = {
        children: React.PropTypes.node
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

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
