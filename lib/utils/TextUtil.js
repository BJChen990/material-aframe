'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dummyDiv = document.createElement('div');
var dummyText = document.createTextNode('M');
var body = document.querySelector('body');

var TextUtil = function () {
    function TextUtil() {
        _classCallCheck(this, TextUtil);
    }

    _createClass(TextUtil, null, [{
        key: 'calculateTextSize',
        value: function calculateTextSize(ctx, text, fontSize, fontFamily) {
            ctx.font = fontSize + 'px ' + fontFamily;

            dummyDiv.appendChild(dummyText);
            dummyDiv.setAttribute('style', 'font: ' + ctx.font);
            body.appendChild(dummyDiv);
            var height = dummyDiv.offsetHeight;
            body.removeChild(dummyDiv);

            return {
                width: ctx.measureText(text).width,
                height: height
            };
        }
    }]);

    return TextUtil;
}();

exports.default = TextUtil;