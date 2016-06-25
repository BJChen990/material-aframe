var AFRAME = window.AFRAME;
var THREE = AFRAME.THREE;

AFRAME.registerComponent('image-clip', {

    schema: {
        src: { default: '' }
    },

    init: function() {
        this._listeners = {
            sceneLoad: this._handleSceneLoad.bind(this),
            imageLoad: this._handleImageLoad.bind(this)
        };
        this._image = null;

        var scene = this.el.sceneEl;
        if (scene.hasLoaded) {
            scene.renderer.localClippingEnabled = true;
        } else {
            scene.addEventListener('loaded', this._listeners.sceneLoad);
        }
    },

    update() {
        this._image = new THREE.TextureLoader().load(this.data.src, this._listeners.imageLoad);
        const el = this.el;
        const elGeometry = el.getComputedAttribute('geometry');
        const clippingPlanes = getCircularClippingPlanes(el.object3DMap.mesh);
        const circleGeometry = new THREE.PlaneBufferGeometry(elGeometry.radius * 2, elGeometry.radius * 2);
        const circleMaterial = new THREE.MeshBasicMaterial({
            color: 'black',
            clippingPlanes: clippingPlanes
        });

        const mesh = new THREE.Mesh(circleGeometry, circleMaterial);
        mesh.el = el;
        el.object3DMap.mesh.add(mesh);
        mesh.position.set(0, 0, 0.02);
        this.mesh = mesh;
    },

    _handleImageLoad: function() {
        const circleMaterial = new THREE.MeshBasicMaterial({
            map: this._image,
            clippingPlanes: getCircularClippingPlanes(this.el.object3DMap.mesh)
        });
        this.mesh.material = circleMaterial;
        this.mesh.material.needsUpdate = true;
    },

    _handleSceneLoad: function() {
        const sceneEl = this.el.sceneEl;
        sceneEl.removeEventListener('loaded', this._listeners.sceneLoad);
        sceneEl.renderer.localClippingEnabled = true;
    },

    remove: function() {
    }
});

function getCircularClippingPlanes(obj) {
    const positionArray = obj.geometry.attributes.position.array;
    const counts = positionArray.length;
    const matrixWorld = obj.matrixWorld;
    const planes = [];
    const orthoVector = new THREE.Vector3(0, 0, 1);

    for (var i = 0; i < counts; i += 9) {
        var firstPoint = new THREE.Vector3(positionArray[i], positionArray[i + 1], positionArray[i + 2]);
        var secondPoint = new THREE.Vector3(positionArray[i + 3], positionArray[i + 4], positionArray[i + 5]);
        var thirdPoint = new THREE.Vector3().addVectors(firstPoint, orthoVector);
        var plane = new THREE.Plane().setFromCoplanarPoints(secondPoint, firstPoint, thirdPoint);
        plane.applyMatrix4(matrixWorld);
        planes.push(plane);
    }

    return planes;
}
