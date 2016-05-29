import loadSvg from 'load-svg';

window.AFRAME.registerComponent('svg', {
    schema: {
        path: { default: '' },
        color: { default: 'black' }
    },

    dependencies: ['araisedcanvas'],

    init: function() {
        this.draw = this.el.components.araisedcanvas;
        this.draw.register(this.renderFunction.bind(this));
        this.path = null;
    },

    update: function() {
        loadSvg(this.data.path, (err, svg) => {
            if (err) {
                throw err;
            }

            var svgWidth = svg.getAttribute('width');
            this.scale = this.draw.canvas.width / svgWidth;
            var paths = svg.querySelectorAll('path');
            var pathLength = paths.length;
            this.paths = [];

            for (var i = 0; i < pathLength; i++) {
                if (paths[i].getAttribute('fill') !== 'none') {
                    this.paths.push(new Path2D(paths[i].getAttribute('d')));
                }
            }
            this.draw.render();
        });
    },

    renderFunction: function() {
        var ctx = this.draw.ctx;
        ctx.fillStyle = this.data.color;

        ctx.save();
        ctx.scale(this.scale, this.scale);
        var paths = this.paths;
        var pathLength = paths.length;

        for (var i = 0; i < pathLength; i++) {
            ctx.fill(paths[i]);
        }
        ctx.restore();
    }
});
