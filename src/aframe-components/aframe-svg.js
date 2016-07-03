import canvg from 'canvg-client';

window.AFRAME.registerComponent('svg', {
    schema: {
        path: { default: '' },
        color: { default: 'black' }
    },

    dependencies: ['araisedcanvas'],

    init: function() {
        this.draw = this.el.components.araisedcanvas;
        this.draw.register(this.renderFunction.bind(this));
        this._path = null;
    },

    update: function() {
        fetch(this.data.path)
            .then((respnose) => {
                return respnose.text();
            })
            .then((svgString) => {
                this._path = svgString;
                this.draw.render();
            });
    },

    renderFunction: function() {
        const canvas = this.draw.canvas;
        canvg(canvas, this._path);
    }
});
