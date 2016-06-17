import React from 'react';

const TWEEN = window.AFRAME.TWEEN;

export default (OriginalComponent) => class extends React.Component {

    static propTypes = {
        children: React.PropTypes.node
    }

    static displayName = OriginalComponent.displayName ||
                         OriginalComponent.name ||
                         'Component';

    constructor(props) {
        super(props);

        this.state = {
            yPosition: -5000
        };
    }

    _handleEnter = (callback) => {
        const self = this;

        new TWEEN.Tween({position: -5000})
        .to({position: 0}, 3000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(function() {
            self.setState({
                yPosition: this.position
            });
        })
        .onComplete(() => {
            if (callback) {
                callback();
            }
        })
        .start();
    }

    render() {
        return (
            <a-entity position={`0 ${this.state.yPosition} 0`}>
                <OriginalComponent {...this.props} enterScene={this._handleEnter} />
            </a-entity>
        );
    }
};
