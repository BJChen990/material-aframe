import React from 'react';
const THREE = window.AFRAME.THREE;
const TWEEN = window.AFRAME.TWEEN;

export default class AbstractFloatingButton extends React.Component {
    static propTypes = {
        backgroundColor: React.PropTypes.string,
        colorChangeRate: React.PropTypes.number,
        onClick: React.PropTypes.func
    }

    static defaultProps = {
        backgroundColor: '#fafafa',
        colorChangeRate: 1,
        onClick: null
    }

    componentWillMount() {
        var backgroundColor = new THREE.Color(this.props.backgroundColor);
        var colorChangeRate = this.props.colorChangeRate;
        var r = backgroundColor.r * 255 - 26 * colorChangeRate;
        var g = backgroundColor.g * 255 - 26 * colorChangeRate;
        var b = backgroundColor.b * 255 - 26 * colorChangeRate;

        if (r > 255) {
            r = 255;
        }
        if (g > 255) {
            g = 255;
        }
        if (b > 255) {
            b = 255;
        }

        this._hoverColor = 'rgb(' + r + ', ' + g + ', ' + b + ')';

        if (colorChangeRate > 0) {
            this._rippleColor = '#333333';
        } else {
            this._rippleColor = '#FFFFFF';
        }
    }

    componentDidMount() {
        this.refs.button.addEventListener('cursor-click', this._handleClick);
    }

    componentWillUnmount() {
        this.refs.button.removeEventListener('cursor-click', this._handleClick);
    }

    _handleClick = () => {
        const position = this.refs.button.object3DMap.mesh.position;
        const onClick = this.props.onClick;

        new TWEEN.Tween(position)
            .to({x: 0, y: 0, z: -0.1}, 300)
            .onComplete(() => {
                new TWEEN.Tween(position)
                    .onComplete(() => {
                        if (onClick) {
                            onClick();
                        }
                    })
                    .to({x: 0, y: 0, z: 0}, 300)
                    .start();
            })
            .start();
    }
}
