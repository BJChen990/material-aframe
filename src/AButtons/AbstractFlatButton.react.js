import React from 'react';
import ColorUtil from '../utils/ColorUtil';
const THREE = window.AFRAME.THREE;

export default class AbstractFlatButton extends React.Component {

    static propTypes = {
        backgroundColor: React.PropTypes.string,
        colorChangeRate: React.PropTypes.number,
        onClick: React.PropTypes.func,
        exitEffect: React.PropTypes.func
    }

    static defaultProps = {
        backgroundColor: '#fafafa',
        colorChangeRate: 1,
        onClick: null
    }

    constructor(props) {
        super(props);
        this._leaved = false;
    }

    componentWillMount() {
        const { backgroundColor, colorChangeRate } = this.props;
        const threeColor = new THREE.Color(backgroundColor);

        this._hoverColor = ColorUtil.changeColorWithAmount(threeColor, colorChangeRate);

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

    _click = () => {
        if (this._leaved) {
            return;
        }
        this._leaved = true;

        const onClick = this.props.onClick;
        if (onClick) {
            onClick();
        }
    }

    _handleClick = () => {
        const exitEffect = this.props.exitEffect;

        setTimeout(() => {
            if (exitEffect) {
                return exitEffect(() => {
                    this._click();
                });
            }

            this._click();
        }, 600);
    }
}