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
        this._texture;
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
            this._texture = texture;
            options.map = texture;
        }

        const circleMaterial = new THREE.MeshBasicMaterial(options);
        const mesh = new THREE.Mesh(el.object3DMap.mesh.geometry, circleMaterial);
        mesh.el = el;
        el.object3DMap.mesh.add(mesh);
        mesh.position.set(0, 0, 0.02);
        this.mesh = mesh;
    },

    _handleImageLoad: function(texture) {
        this._texture = texture;
        const circleMaterial = new THREE.MeshBasicMaterial({
            map: texture
        });
        const mesh = this.mesh;
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
