'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACursor = exports.ARaisedButton = undefined;

var _ARaisedButton2 = require('./lib/components/ARaisedButton.react');

var _ARaisedButton3 = _interopRequireDefault(_ARaisedButton2);

var _ACursor2 = require('./lib/components/ACursor.react');

var _ACursor3 = _interopRequireDefault(_ACursor2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('aframe');
require('./lib/aframe-geometries/rounded-rect');
require('./lib/aframe-components/aframe-button-text');
require('./lib/aframe-components/aframe-raised-canvas-texture');
require('./lib/aframe-components/aframe-click-cursor');
require('./lib/aframe-components/aframe-ripple');
require('./lib/aframe-components/aframe-shadow');

exports.ARaisedButton = _ARaisedButton3.default;
exports.ACursor = _ACursor3.default;
