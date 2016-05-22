'use strict';

var THREE = AFRAME.THREE;

AFRAME.registerComponent('araisedcanvas', {
    schema: {
        width: { default: 352 },
        height: { default: 144 }
    },

    init: function init() {
        this.renderer = null;
        this.canvas = null;
        this.ctx = null;
        this.listeners = {
            elementLoad: this._onElementLoad.bind(this)
        };
    },

    register: function register(renderer) {
        this.renderer = renderer;
    },

    update: function update() {
        this.createCanvas(this.data.width, this.data.height);
    },

    createCanvas: function createCanvas(w, h) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = w;
        this.canvas.height = h;
        this.canvas.style = 'display: none';
        this.ctx = this.canvas.getContext('2d');

        this.texture = new THREE.Texture(this.canvas);
        var material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            opacity: 1
        });

        var elGeometry = this.el.getComputedAttribute('geometry');
        var geometry = new THREE.PlaneBufferGeometry(elGeometry.width, elGeometry.height);

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.el = this.el;
        this.el.object3DMap.mesh.add(this.mesh);
        this.mesh.position.set(0, 0, 0.01);

        if (!this.el.hasLoaded) {
            this.el.addEventListener('loaded', this.listeners.elementLoad);
        } else {
            this.render();
        }
    },

    updateGeometry: function updateGeometry(difference) {
        var expandRatio = difference / this.canvas.width + 1;
        this.canvas.width *= expandRatio;
        var elGeometry = this.el.getComputedAttribute('geometry');
        var newWidth = elGeometry.width * expandRatio;
        var oldHeight = elGeometry.height;

        this.mesh.geometry = new THREE.PlaneBufferGeometry(newWidth, oldHeight);
        this.el.setAttribute('geometry', {
            primitive: elGeometry.primitive,
            width: newWidth,
            height: oldHeight,
            radius: elGeometry.radius
        });
    },

    _onElementLoad: function _onElementLoad() {
        this.render();
    },

    render: function render() {
        if (this.renderer) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderer();
        }
        this.texture.needsUpdate = true;
    },

    remove: function remove() {
        this.el.removeEventListener('loaded', this.listeners.elementLoad);
    }
});