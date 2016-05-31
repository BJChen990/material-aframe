import React from 'react';
const THREE = window.AFRAME.THREE;

export default class AbstractFlatButton extends React.Component {

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
        let timer = setTimeout(() => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                clearTimeout(timer);
                if (this.props.onClick) {
                    this.props.onClick();
                }
                timer = null;
            }, 500);
        }, 300);
    }
}
