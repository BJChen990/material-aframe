const TEXT_SIZE = 56;

window.AFRAME.registerComponent('text2d', {
    schema: {
        paddingHorizontal: {
            default: 0
        },
        paddingVertical: {
            default: 0
        },
        fontSize: {
            default: TEXT_SIZE
        },
        fontFamily: {
            default: 'OpenSans'
        },
        color: {
            default: 'black'
        },
        textAlign: {
            default: 'left'
        },
        verticalAlign: {
            default: 'top'
        },
        textJson: {
            type: 'string'
        }
    },

    dependencies: ['araisedcanvas'],

    init: function() {
        this.draw = this.el.components.araisedcanvas;
        this.draw.register(this.renderFunction.bind(this));
        this._lines = null;
        this._height = null;
    },

    update: function() {
        const textInfo = JSON.parse(this.data.textJson);
        this._lines = textInfo.lines;
        this._height = textInfo.height;
        this.draw.render();
    },

    renderFunction: function () {
        let ctx = this.draw.ctx;
        const data = this.data;
        ctx.translate(0, data.paddingVertical);
        const lineLength = this._lines.length;
        ctx.fillStyle = data.color;
        let height = this.getStartHeight();

        for (let i = 0; i < lineLength; i++) {
            const line = this._lines[i];
            ctx.font = `${line.fontSize}px ${data.fontFamily}`;

            switch (data.textAlign) {
            case 'center':
                ctx.fillText(
                    line.text,
                    (data.width - line.width) * 0.5,
                    height + line.fontSize
                );
                break;
            case 'right':
                ctx.fillText(
                    line.text,
                    data.width - line.width - data.paddingHorizontal,
                    height + line.fontSize
                );
                break;
            case 'left':
                ctx.fillText(
                    line.text,
                    data.paddingHorizontal,
                    height + line.fontSize
                );
                break;
            }
            height += line.fontSize * 1.2;
        }
    },

    getStartHeight() {
        const align = this.data.verticalAlign;
        switch (align) {
        case 'top':
            return 0;
        case 'middle':
            return (this.draw.canvas.height - this._height) * 0.5;
        case 'bottom':
            return this.draw.canvas.height - this._height;
        }
    }
});
