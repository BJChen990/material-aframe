import ImageUtil from '../utils/ImageUtil';
const AFRAME = window.AFRAME;
const THREE = AFRAME.THREE;

AFRAME.registerComponent('image-clip', {
    schema: {
        src: { default: '' }
    },

    init: function() {
        this._listeners = {
            sceneLoad: this._handleSceneLoad.bind(this),
            imageLoad: this._handleImageLoad.bind(this)
        };
        this._texture = null;

        var scene = this.el.sceneEl;
        if (scene.hasLoaded) {
            scene.renderer.localClippingEnabled = true;
        } else {
            scene.addEventListener('loaded', this._listeners.sceneLoad);
        }
    },

    _getWorldClippingPlane: function() {
        const localPlanes = this._localPlanes;
        const worldMatrix = this.el.object3DMap.mesh.matrixWorld;
        const globalPlanes = [];
        const planeLength = localPlanes.length;

        for (let i = 0; i < planeLength; i++) {
            globalPlanes.push(new THREE.Plane().copy(localPlanes[i]).applyMatrix4(worldMatrix));
        }

        return globalPlanes;
    },

    update() {
        const el = this.el;
        const elGeometry = el.getComputedAttribute('geometry');
        this._localPlanes = getCircularClippingPlanes(el.object3DMap.mesh);
        const options = {
            clippingPlanes: this._getWorldClippingPlane()
        };
        const circleGeometry = new THREE.PlaneBufferGeometry(elGeometry.radius * 2, elGeometry.radius * 2);
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

        const mesh = new THREE.Mesh(circleGeometry, circleMaterial);
        mesh.el = el;
        el.object3DMap.mesh.add(mesh);
        mesh.position.set(0, 0, 0.02);
        this.mesh = mesh;
    },

    tick: function() {
        const lastPosition = this._lastPosition;
        const worldPosition = this.el.object3D.getWorldPosition();

        if (
            lastPosition &&
            (this._lastPosition.x === worldPosition.x) &&
            (this._lastPosition.y === worldPosition.y) &&
            (this._lastPosition.z === worldPosition.z)
        ) {
            return;
        }

        this._lastPosition = worldPosition;
        const circleMaterial = new THREE.MeshBasicMaterial({
            map: this._texture,
            clippingPlanes: this._getWorldClippingPlane()
        });
        const mesh = this.mesh;
        mesh.material = circleMaterial;
        mesh.material.needsUpdate = true;
    },

    _handleImageLoad: function(texture) {
        this._texture = texture;
        const circleMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            clippingPlanes: this._getWorldClippingPlane()
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

function getCircularClippingPlanes(obj) {
    const positionArray = obj.geometry.attributes.position.array;
    const counts = positionArray.length;

    let parent = obj.parent;
    while (parent) {
        parent.getWorldPosition();
        parent = parent.parent;
    }
    const planes = [];
    const orthoVector = new THREE.Vector3(0, 0, 1);

    for (var i = 0; i < counts; i += 9) {
        var firstPoint = new THREE.Vector3(positionArray[i], positionArray[i + 1], positionArray[i + 2]);
        var secondPoint = new THREE.Vector3(positionArray[i + 3], positionArray[i + 4], positionArray[i + 5]);
        var thirdPoint = new THREE.Vector3().addVectors(firstPoint, orthoVector);
        var plane = new THREE.Plane().setFromCoplanarPoints(secondPoint, firstPoint, thirdPoint);
        planes.push(plane);
    }

    return planes;
}
