import TextUtil from '../utils/TextUtil';

const FONT_SIZE = 48;


AFRAME.registerComponent('button-text', {
    schema: {
        fontSize: {
            default: FONT_SIZE
        },
        fontFamily: {
            default: 'OpenSans'
        },
        color: {
            default: 'white'
        },
        text: {
            type: 'string'
        }
    },

    dependencies: ['araisedcanvas'],

    init: function() {
        this.draw = this.el.components.araisedcanvas;
        this.draw.register(this.renderFunction.bind(this));
        this.textWidth = null;
        this.textHeight = null;
    },

    update: function() {
        const size = TextUtil.calculateTextSize(
            this.draw.ctx,
            this.data.text,
            this.data.fontSize,
            this.data.fontFamily
        );
        this.textWidth = size.width;
        this.textHeight = size.height;

        // If the text is too long, update the geometry and canvas
        const diffOfWidth = this.draw.canvas.width - this.textWidth - 64;
        if (diffOfWidth < 0) {
            this.draw.updateGeometry(-diffOfWidth);
        }

        this.draw.render();
    },

    renderFunction: function () {
        const ctx = this.draw.ctx;
        const canvas = this.draw.canvas;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        ctx.fillStyle = this.data.color;
        ctx.font = `${this.data.fontSize}px ${this.data.fontFamily}`;

        ctx.fillText(
            this.data.text,
            (canvasWidth - this.textWidth) * 0.5,
            (canvasHeight + this.textHeight) * 0.5
        );
    }
});
