'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACursor = exports.ARaisedButton = undefined;

var _ARaisedButton2 = require('./components/ARaisedButton.react');

var _ARaisedButton3 = _interopRequireDefault(_ARaisedButton2);

var _ACursor2 = require('./components/ACursor.react');

var _ACursor3 = _interopRequireDefault(_ACursor2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('aframe');
require('./aframe-geometries/rounded-rect');
require('./aframe-components/aframe-button-text');
require('./aframe-components/aframe-raised-canvas-texture');
require('./aframe-components/aframe-click-cursor');
require('./aframe-components/aframe-ripple');
require('./aframe-components/aframe-shadow');

exports.ARaisedButton = _ARaisedButton3.default;
exports.ACursor = _ACursor3.default;