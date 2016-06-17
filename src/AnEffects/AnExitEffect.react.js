import React from 'react';

const TWEEN = window.AFRAME.TWEEN;

export default (OriginalComponent) => class extends React.Component {

    static propTypes = {
        children: React.PropTypes.node
    }

    static displayName = OriginalComponent.displayName ||
                         OriginalComponent.name ||
                         'Component';


    render() {
        return (
            <a-entity ref="leave">
                <OriginalComponent {...this.props} leaveScene={this._handleLeave} />
            </a-entity>
        );
    }

    _handleLeave = (callback) => {
        const position = this.refs.leave.object3D.position;

        new TWEEN.Tween(position)
            .to({x: 0, y: 5000, z: 0}, 3000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onComplete(() => {
                if (callback) {
                    callback();
                }
            })
            .start();
    }
};
