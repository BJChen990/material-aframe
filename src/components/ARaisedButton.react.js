import React from 'react';

export default class ARaisedButton extends React.Component {
    static propTypes = {
        width: React.PropTypes.number,
        backgroundColor: React.PropTypes.string,
        iconColor: React.PropTypes.string,
        icon: React.PropTypes.string,
        text: React.PropTypes.string,
        fontColor: React.PropTypes.string,
        textStyle: React.PropTypes.object,
        iconStyle: React.PropTypes.object,
        textDimension: React.PropTypes.string,
        colorChangeRate: React.PropTypes.number
    }
    static defaultProps = {
        width: 1,
        backgroundColor: '#fafafa',
        colorChangeRate: 1,
        text: 'BUTTON',
        textStyle: {},
        iconStyle: {},
        textDimension: '2d'
    }

    componentWillMount() {
        const backgroundColor = new THREE.Color(this.props.backgroundColor);
        const colorChangeRate = this.props.colorChangeRate;
        let r = backgroundColor.r * 255 - 26 * colorChangeRate;
        let g = backgroundColor.g * 255 - 26 * colorChangeRate;
        let b = backgroundColor.b * 255 - 26 * colorChangeRate;

        if (r > 255) {r = 255;}
        if (g > 255) {g = 255;}
        if (b > 255) {b = 255;}

        this._hoverColor = `rgb(${r}, ${g}, ${b})`;

        if (colorChangeRate > 0) {
            this._rippleColor = '#333333';
        } else {
            this._rippleColor = '#FFFFFF';
        }
    }

    componentDidMount() {
        this.refs.button.addEventListener('cursor-click', this._handleClick);
        this.refs.button.addEventListener('cursor-mouseleave', this._handleLeave);
    }

    componentWillUnmount() {
        this.refs.button.removeEventListener('cursor-click', this._handleClick);
        this.refs.button.removeEventListener('cursor-mouseleave', this._handleLeave);
    }

    render() {
        const {
            width,
            backgroundColor,
            text,
            ...others
        } = this.props;

        return (
            <a-entity>
                <a-entity
                    ref='button'
                    geometry = {`
                        primitive:roundedrect;
                        radius: 0.02;
                        width: ${width};
                        height: ${0.4};`
                     }
                    material={`
                        color: ${backgroundColor};
                        metalness: 0.05;
                        shader: flat;`
                    }
                    shadow
                    araisedcanvas
                    button-text={`
                        text: ${text};
                        color: ${this.props.fontColor};
                        fontFamily: OpenSans;`
                    }
                    ripple={`
                        color: ${this._rippleColor};`}
                    {...others}
                >
                    <a-animation
                        begin='cursor-mouseenter'
                        dur='200'
                        attribute='material.color'
                        from={backgroundColor}
                        to={this._hoverColor}
                    />
                    <a-animation
                        begin='cursor-mouseleave'
                        dur='200'
                        attribute='material.color'
                        from={this._hoverColor}
                        to={backgroundColor}
                    />
                </a-entity>
            </a-entity>
        );
    }

    _handleClick = () => {
        new TWEEN.Tween(this.refs.button.object3DMap.mesh.position).to({x: 0, y: 0, z: -0.3}, 300).start();

        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            new TWEEN.Tween(this.refs.button.object3DMap.mesh.position).to({x: 0, y: 0, z: 0}, 300).start();
            this.timer = setTimeout(() => {
                clearTimeout(this.timer);
                // this.props.onClick();
                this.timer = null;
            }, 500);
        }, 300);
    }
}
