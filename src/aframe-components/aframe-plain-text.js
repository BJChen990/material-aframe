const TEXT_SIZE = 56;

window.AFRAME.registerComponent('text2d', {
    schema: {
        paddingHorizontal: {
            default: 16 * 4
        },
        paddingVertical: {
            default: 16 * 4
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
        textJson: {
            type: 'string'
        }
    },

    dependencies: ['araisedcanvas'],

    init: function() {
        this.draw = this.el.components.araisedcanvas;
        this.draw.register(this.renderFunction.bind(this));
        this.lines = null;
    },

    update: function() {
        this.lines = JSON.parse(this.data.textJson).lines;
        this.draw.render();
    },

    renderFunction: function () {
        let ctx = this.draw.ctx;
        const data = this.data;
        ctx.translate(0, data.paddingVertical);
        const lineLength = this.lines.length;
        ctx.fillStyle = data.color;
        let height = 0;

        for (let i = 0; i < lineLength; i++) {
            const line = this.lines[i];
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
    }
});
