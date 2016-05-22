'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ARaisedButton = function (_React$Component) {
    _inherits(ARaisedButton, _React$Component);

    function ARaisedButton() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, ARaisedButton);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(ARaisedButton)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this._handleClick = function () {
            new TWEEN.Tween(_this.refs.button.object3DMap.mesh.position).to({ x: 0, y: 0, z: -0.3 }, 300).start();

            _this.timer = setTimeout(function () {
                clearTimeout(_this.timer);
                new TWEEN.Tween(_this.refs.button.object3DMap.mesh.position).to({ x: 0, y: 0, z: 0 }, 300).start();
                _this.timer = setTimeout(function () {
                    clearTimeout(_this.timer);
                    // this.props.onClick();
                    _this.timer = null;
                }, 500);
            }, 300);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ARaisedButton, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
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
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.refs.button.addEventListener('cursor-click', this._handleClick);
            this.refs.button.addEventListener('cursor-mouseleave', this._handleLeave);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.refs.button.removeEventListener('cursor-click', this._handleClick);
            this.refs.button.removeEventListener('cursor-mouseleave', this._handleLeave);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var width = _props.width;
            var backgroundColor = _props.backgroundColor;
            var text = _props.text;

            var others = _objectWithoutProperties(_props, ['width', 'backgroundColor', 'text']);

            return _react2.default.createElement(
                'a-entity',
                null,
                _react2.default.createElement(
                    'a-entity',
                    _extends({
                        ref: 'button',
                        geometry: '\n                        primitive:roundedrect;\n                        radius: 0.02;\n                        width: ' + width + ';\n                        height: ' + 0.4 + ';',
                        material: '\n                        color: ' + backgroundColor + ';\n                        metalness: 0.05;\n                        shader: flat;',
                        shadow: true,
                        araisedcanvas: true,
                        'button-text': '\n                        text: ' + text + ';\n                        color: ' + this.props.fontColor + ';\n                        fontFamily: OpenSans;',
                        ripple: '\n                        color: ' + this._rippleColor + ';'
                    }, others),
                    _react2.default.createElement('a-animation', {
                        begin: 'cursor-mouseenter',
                        dur: '200',
                        attribute: 'material.color',
                        from: backgroundColor,
                        to: this._hoverColor
                    }),
                    _react2.default.createElement('a-animation', {
                        begin: 'cursor-mouseleave',
                        dur: '200',
                        attribute: 'material.color',
                        from: this._hoverColor,
                        to: backgroundColor
                    })
                )
            );
        }
    }]);

    return ARaisedButton;
}(_react2.default.Component);

ARaisedButton.propTypes = {
    width: _react2.default.PropTypes.number,
    backgroundColor: _react2.default.PropTypes.string,
    iconColor: _react2.default.PropTypes.string,
    icon: _react2.default.PropTypes.string,
    text: _react2.default.PropTypes.string,
    fontColor: _react2.default.PropTypes.string,
    textStyle: _react2.default.PropTypes.object,
    iconStyle: _react2.default.PropTypes.object,
    textDimension: _react2.default.PropTypes.string,
    colorChangeRate: _react2.default.PropTypes.number
};
ARaisedButton.defaultProps = {
    width: 1,
    backgroundColor: '#fafafa',
    colorChangeRate: 1,
    text: 'BUTTON',
    textStyle: {},
    iconStyle: {},
    textDimension: '2d'
};
exports.default = ARaisedButton;