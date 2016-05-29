var AFRAME = window.AFRAME;
var THREE = AFRAME.THREE;

AFRAME.registerComponent('araisedcanvas', {
    schema: {
        width: { default: 352 },
        height: { default: 144 }
    },

    init: function() {
        this.renderer = null;
        this.canvas = null;
        this.ctx = null;
        this.listeners = {
            elementLoad: this._onElementLoad.bind(this)
        };
    },

    register: function(renderer) {
        this.renderer = renderer;
    },

    update: function() {
        this.createCanvas(this.data.width, this.data.height);
    },

    createCanvas: function(w, h) {
        var el = this.el;
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.style = 'display: none';
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.texture = new THREE.Texture(canvas);
        var material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            opacity: 1
        });

        var elGeometry = el.getComputedAttribute('geometry');
        var geometry = void 0;

        switch (elGeometry.primitive) {
        case 'roundedrect':
        case 'plane':
            geometry = new THREE.PlaneBufferGeometry(elGeometry.width, elGeometry.height);
            break;
        case 'circle':
            geometry = new THREE.PlaneBufferGeometry(elGeometry.radius, elGeometry.radius);
            break;
        }

        var mesh = new THREE.Mesh(geometry, material);
        mesh.el = el;
        el.object3DMap.mesh.add(mesh);
        mesh.position.set(0, 0, 0.01);
        this.mesh = mesh;

        if (!el.hasLoaded) {
            el.addEventListener('loaded', this.listeners.elementLoad);
        } else {
            this.render();
        }
    },

    // This should only be called when text width is too long.
    updateGeometry: function(difference) {
        var el = this.el;
        var expandRatio = difference / this.canvas.width + 1;
        this.canvas.width *= expandRatio;
        var elGeometry = el.getComputedAttribute('geometry');
        var newWidth = elGeometry.width * expandRatio;
        var oldHeight = elGeometry.height;

        this.mesh.geometry = new THREE.PlaneBufferGeometry(newWidth, oldHeight);
        el.setAttribute('geometry', {
            primitive: elGeometry.primitive,
            width: newWidth,
            height: oldHeight,
            radius: elGeometry.radius
        });
    },

    _onElementLoad: function() {
        this.render();
    },

    render: function() {
        if (this.renderer) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderer();
        }
        this.texture.needsUpdate = true;
    },

    remove: function() {
        this.el.removeEventListener('loaded', this.listeners.elementLoad);
    }
});
