import React from 'react';
import ColorUtil from '../utils/ColorUtil';
const THREE = window.AFRAME.THREE;
const TWEEN = window.AFRAME.TWEEN;

export default class AbstractFloatingButton extends React.Component {
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
        const position = this.refs.button.object3DMap.mesh.position;
        const exitEffect = this.props.exitEffect;

        new TWEEN.Tween(position)
            .to({x: 0, y: 0, z: -0.1}, 300)
            .onComplete(() => {
                new TWEEN.Tween(position)
                    .onComplete(() => {
                        if (exitEffect) {
                            return exitEffect(() => {
                                this._click();
                            });
                        }

                        this._click();
                    })
                    .to({x: 0, y: 0, z: 0}, 300)
                    .start();
            })
            .start();
    }
}
