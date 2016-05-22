const THREE = AFRAME.THREE;

AFRAME.registerComponent('araisedcanvas', {
    schema: {
        width: {default: 352},
        height: {default: 144}
    },

    init: function () {
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

    update: function () {
        this.createCanvas(this.data.width, this.data.height);
    },

    createCanvas: function (w, h) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = w;
        this.canvas.height = h;
        this.canvas.style = 'display: none';
        this.ctx = this.canvas.getContext('2d');

        this.texture = new THREE.Texture(this.canvas);
        const material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            opacity: 1
        });

        const elGeometry = this.el.getComputedAttribute('geometry');
        const geometry = new THREE.PlaneBufferGeometry(elGeometry.width, elGeometry.height);

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.el = this.el;
        this.el.object3DMap.mesh.add(this.mesh);
        this.mesh.position.set(0, 0, 0.01);

        if(!this.el.hasLoaded) {
            this.el.addEventListener('loaded', this.listeners.elementLoad);
        }
        else {
            this.render();
        }
    },

    updateGeometry: function(difference) {
        const expandRatio = (difference / this.canvas.width) + 1;
        this.canvas.width *= expandRatio;
        const elGeometry = this.el.getComputedAttribute('geometry');
        const newWidth = elGeometry.width * expandRatio;
        const oldHeight = elGeometry.height;

        this.mesh.geometry = new THREE.PlaneBufferGeometry(newWidth, oldHeight);
        this.el.setAttribute('geometry', {
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
        if(this.renderer) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderer();
        }
        this.texture.needsUpdate = true;
    },

	remove: function () {
        this.el.removeEventListener('loaded', this.listeners.elementLoad);
    }
});
