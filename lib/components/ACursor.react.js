'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Usage:
// <ACursor
//     innerSize
//     outerSize
//     color
//     hoverInnerSize
//     hoverOuterSize
//     hoverColor
//     clickedInnerSize
//     clickedOuterSize
//     onClick
//     onHover
// />

var ANIMATION_DURATION = '500';

var ACursor = function (_React$Component) {
    _inherits(ACursor, _React$Component);

    function ACursor(props) {
        _classCallCheck(this, ACursor);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ACursor).call(this, props));

        _initialiseProps.call(_this);

        _this.state = {
            currentInnerSize: props.innerSize,
            currentOuterSize: props.outerSize,
            currentColor: props.color
        };
        return _this;
    }

    _createClass(ACursor, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.refs.cursor.addEventListener('cursor-click', this._handleClick);
            this.refs.cursor.addEventListener('cursor-mouseenter', this._handleHover);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.refs.cursor.removeEventListener('cursor-click', this._handleClick);
            this.refs.cursor.removeEventListener('cursor-mouseenter', this._handleHover);
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate() {
            // TODO add shallow compare.
            return true;
        }
    }, {
        key: '_getMouseEnterAnimations',
        value: function _getMouseEnterAnimations() {
            var _props = this.props;
            var hoverInnerSize = _props.hoverInnerSize;
            var hoverOuterSize = _props.hoverOuterSize;
            var hoverColor = _props.hoverColor;
            var innerSize = _props.innerSize;
            var outerSize = _props.outerSize;
            var color = _props.color;

            var eventName = 'cursor-mouseenter';

            return [_react2.default.createElement('a-animation', {
                key: 'inner',
                begin: eventName,
                dur: ANIMATION_DURATION,
                attribute: 'geometry.radiusInner',
                from: innerSize,
                to: hoverInnerSize
            }), _react2.default.createElement('a-animation', {
                key: 'outer',
                begin: eventName,
                dur: ANIMATION_DURATION,
                attribute: 'geometry.radiusOuter',
                from: outerSize,
                to: hoverOuterSize
            }), _react2.default.createElement('a-animation', {
                key: 'color',
                begin: eventName,
                dur: ANIMATION_DURATION,
                attribute: 'material.color',
                from: color,
                to: hoverColor
            })];
        }

        // TODO Not working, need investigation.

    }, {
        key: '_getMouseLeaveAnimations',
        value: function _getMouseLeaveAnimations() {
            var _props2 = this.props;
            var innerSize = _props2.innerSize;
            var outerSize = _props2.outerSize;
            var color = _props2.color;

            var state = this.state;
            var eventName = 'cursor-mouseleave';

            return [_react2.default.createElement('a-animation', {
                key: 'inner',
                begin: eventName,
                dur: ANIMATION_DURATION,
                attribute: 'geometry.radiusInner',
                from: state.currentInnerSize,
                to: innerSize
            }), _react2.default.createElement('a-animation', {
                key: 'outer',
                begin: eventName,
                dur: ANIMATION_DURATION,
                attribute: 'geometry.radiusOuter',
                from: state.currentOuterSize,
                to: outerSize
            }), _react2.default.createElement('a-animation', {
                key: 'color',
                begin: eventName,
                dur: ANIMATION_DURATION,
                attribute: 'material.color',
                from: state.currentColor,
                to: color
            })];
        }
    }, {
        key: '_getMouseClickAnimations',
        value: function _getMouseClickAnimations() {
            var _props3 = this.props;
            var hoverInnerSize = _props3.hoverInnerSize;
            var hoverOuterSize = _props3.hoverOuterSize;
            var hoverColor = _props3.hoverColor;
            var clickedInnerSize = _props3.clickedInnerSize;
            var clickedOuterSize = _props3.clickedOuterSize;
            var clickedColor = _props3.clickedColor;

            var eventName = 'cursor-click';

            return [_react2.default.createElement('a-animation', {
                key: 'inner',
                begin: eventName,
                dur: ANIMATION_DURATION,
                attribute: 'geometry.radiusInner',
                from: hoverInnerSize,
                to: clickedInnerSize
            }), _react2.default.createElement('a-animation', {
                key: 'outer',
                begin: eventName,
                dur: ANIMATION_DURATION,
                attribute: 'geometry.radiusOuter',
                from: hoverOuterSize,
                to: clickedOuterSize
            }), _react2.default.createElement('a-animation', {
                key: 'color',
                begin: eventName,
                dur: ANIMATION_DURATION,
                attribute: 'material.color',
                from: hoverColor,
                to: clickedColor
            })];
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props;

            return _react2.default.createElement(
                'a-entity',
                {
                    ref: 'cursor',
                    raycaster: 'interval: 500; far: 10; recursive: true;',
                    acursor: 'fuse: true; fuseTimeout: ' + props.timeout + ';',
                    position: '0 0 -2',
                    geometry: 'primitive: ring; radiusInner: ' + props.innerSize + '; radiusOuter: ' + props.outerSize + ';',
                    material: 'color: ' + props.color + ';'
                },
                this._getMouseEnterAnimations(),
                this._getMouseLeaveAnimations(),
                this._getMouseClickAnimations()
            );
        }
    }]);

    return ACursor;
}(_react2.default.Component);

ACursor.propsType = {
    innerSize: _react2.default.PropTypes.number,
    outerSize: _react2.default.PropTypes.number,
    color: _react2.default.PropTypes.string,
    hoverInnerSize: _react2.default.PropTypes.number,
    hoverOuterSize: _react2.default.PropTypes.number,
    hoverColor: _react2.default.PropTypes.string,
    clickedInnerSize: _react2.default.PropTypes.number,
    clickedOuterSize: _react2.default.PropTypes.number,
    clickedColor: _react2.default.PropTypes.string,
    onHover: _react2.default.PropTypes.func,
    onClick: _react2.default.PropTypes.func,
    timeout: _react2.default.PropTypes.number
};
ACursor.defaultProps = {
    innerSize: 0.000001,
    outerSize: 0.005,
    color: 'black',
    hoverInnerSize: 0.03,
    hoverOuterSize: 0.04,
    hoverColor: 'gray',
    clickedInnerSize: 0.02,
    clickedOuterSize: 0.03,
    clickedColor: 'red',
    onHover: null,
    onClick: null,
    timeout: 1500
};

var _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this._handleClick = function (event) {
        var props = _this2.props;
        if (props.onClick) {
            _this2.props.onClick(event);
        }

        _this2.setState({
            currentInnerSize: props.clickedInnerSize,
            currentOuterSize: props.clickedOuterSize,
            currentColor: props.clickedColor
        });
    };

    this._handleHover = function (event) {
        var props = _this2.props;
        if (props.onHover) {
            _this2.props.onHover(event);
        }

        _this2.setState({
            currentInnerSize: props.hoverInnerSize,
            currentOuterSize: props.hoverOuterSize,
            currentColor: props.hoverColor
        });
    };
};

exports.default = ACursor;
