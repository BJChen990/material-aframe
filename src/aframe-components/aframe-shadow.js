const scaleRatioX = 1.2;
const scaleRatioY = 1.4;
const THREE = AFRAME.THREE;

AFRAME.registerComponent('shadow', {

    init: function () {
        this.listeners = {
            click: this._onClick.bind(this)
        };
        this.el.addEventListener('cursor-click', this.listeners.click.bind(this));
    },

    update: function () {
        const elGeometry = this.el.getComputedAttribute('geometry');
        this.texture = new THREE.TextureLoader().load('/images/pwbackg.png');
        const material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            opacity: 1
        });
        const geometry = new THREE.PlaneBufferGeometry(elGeometry.width, elGeometry.height);

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.scale.set(scaleRatioX, scaleRatioY, 1);

        this.mesh.el = this.el;
        this.el.object3D.add(this.mesh);
        this.mesh.position.set(0, -0.02, - 0.305);
    },

    _onClick() {
        new TWEEN.Tween(this.mesh.scale).to({x: 1, y: 1, z: 1}, 300).start();
        let timeout = setTimeout(() => {
            clearTimeout(timeout);
            new TWEEN.Tween(this.mesh.scale).to({x: scaleRatioX, y: scaleRatioY, z: 1}, 300).start();
        }, 300);

    },

	//not the most removable component out there, so will leave blank for now
    remove: function () {}
});
