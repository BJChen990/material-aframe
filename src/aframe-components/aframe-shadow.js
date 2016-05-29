const AFRAME = window.AFRAME;
const THREE = AFRAME.THREE;
const TWEEN = AFRAME.TWEEN;

AFRAME.registerComponent('shadow', {
    schema: {
        src: { default: '' },
        scaleX: { default: 1.2 },
        scaleY: { default: 1.2 }
    },

    init: function() {
        this.listeners = {
            click: this._onClick.bind(this)
        };
        this.el.addEventListener('cursor-click', this.listeners.click);
    },

    update: function() {
        var data = this.data;
        var el = this.el;

        var texture = new THREE.TextureLoader().load(data.src);
        var geometry = this._createGeometryFromEl(el);
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1
        });

        var mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(data.scaleX, data.scaleY, 1);
        mesh.el = el;
        el.object3D.add(mesh);
        mesh.position.set(0, -0.02, -0.105);
        this.mesh = mesh;
    },

    _createGeometryFromEl: function(el) {
        var elGeometry = el.getComputedAttribute('geometry');

        switch (elGeometry.primitive) {
        case 'roundedrect':
        case 'plane':
            return new THREE.PlaneBufferGeometry(elGeometry.width, elGeometry.height);
        case 'circle':
            return new THREE.CircleGeometry(elGeometry.radius, 32);
        }
    },

    _onClick: function() {
        var mesh = this.mesh;
        var data = this.data;

        new TWEEN.Tween(mesh.scale).to({ x: 1, y: 1, z: 1 }, 300).start();
        var timeout = setTimeout(function () {
            clearTimeout(timeout);
            new TWEEN.Tween(mesh.scale).to({ x: data.scaleX, y: data.scaleY, z: 1 }, 300).start();
        }, 300);
    },


    //not the most removable component out there, so will leave blank for now
    remove: function() {
        this.el.removeEventListener('cursor-click', this.listeners.click);
    }
});
