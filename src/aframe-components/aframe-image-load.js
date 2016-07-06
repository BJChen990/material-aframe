import ImageUtil from '../utils/ImageUtil';
const AFRAME = window.AFRAME;
const THREE = AFRAME.THREE;

AFRAME.registerComponent('image-load', {
    schema: {
        src: { default: '' }
    },

    init: function() {
        this._listeners = {
            imageLoad: this._handleImageLoad.bind(this)
        };
    },

    update() {
        const el = this.el;
        const options = {};

        const imageSrc = this.data.src;
        const texture = ImageUtil.getCachedTexture(imageSrc);
        if (!texture) {
            ImageUtil.loadImage(this.data.src, this._listeners.imageLoad);
            options.color = 'black';
        }
        else {
            options.map = texture;
        }

        const circleMaterial = new THREE.MeshBasicMaterial(options);

        // const mesh = new THREE.Mesh(circleGeometry, circleMaterial);
        // mesh.el = el;
        el.object3DMap.mesh.materail = circleMaterial;
        // mesh.position.set(0, 0, 0.02);
        // this.mesh = mesh;
    },

    _handleImageLoad: function(texture) {
        const circleMaterial = new THREE.MeshBasicMaterial({
            map: texture
        });
        const mesh = this.el.object3DMap.mesh;
        mesh.material = circleMaterial;
        mesh.material.needsUpdate = true;
    },

    _handleSceneLoad: function() {
        const sceneEl = this.el.sceneEl;
        sceneEl.removeEventListener('loaded', this._listeners.sceneLoad);
        sceneEl.renderer.localClippingEnabled = true;
    },

    remove: function() {
    }
});
