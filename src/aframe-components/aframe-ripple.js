var INITIAL_SIZE = 0.15;
var AFRAME = window.AFRAME;
var THREE = AFRAME.THREE;
var TWEEN = AFRAME.TWEEN;

AFRAME.registerComponent('ripple', {

    schema: {
        type: { default: 'rect' },
        color: { default: '' }
    },

    init: function() {
        this._listener = {
            click: this._handleClick.bind(this),
            sceneLoad: this._handleSceneLoad.bind(this)
        };
        this.isClicking = false;
        this.el.addEventListener('cursor-click', this._listener.click);

        var scene = this.el.sceneEl;
        if (scene.hasLoaded) {
            scene.renderer.localClippingEnabled = true;
        } else {
            scene.addEventListener('loaded', this._listener.sceneLoad);
        }
    },

    _handleSceneLoad: function() {
        this.el.sceneEl.removeEventListener('loaded', this._listener.sceneLoad);
        this.el.sceneEl.renderer.localClippingEnabled = true;
    },

    _getClippingPlanes: function(type) {
        if (type === 'rect') {
            return getRectClippingPlanes(this.el.object3DMap.mesh);
        }

        return getCircularClippingPlanes(this.el.object3DMap.mesh);
    },

    _getTargetRatio: function() {
        var elGeometry = this.el.getComputedAttribute('geometry');

        if (elGeometry.primitive !== 'circle') {
            return Math.max(elGeometry.width, elGeometry.height) / INITIAL_SIZE * 1.2;
        }

        return elGeometry.radius / INITIAL_SIZE * 2;
    },

    _handleClick: function(event) {
        var _this = this;

        if (this.isClicking) {
            return;
        }
        this.isClicking = true;

        var el = this.el;
        var clickedPoint = event.detail.intersectInfo.intersections[0].point;
        var circleGeometry = new THREE.CircleGeometry(INITIAL_SIZE, 32);
        var clippingPlanes = this._getClippingPlanes(this.data.type);
        var circleMaterial = new THREE.MeshBasicMaterial({
            color: this.data.color,
            clippingPlanes: clippingPlanes,
            transparent: true,
            opacity: 0.2
        });

        var mesh = new THREE.Mesh(circleGeometry, circleMaterial);
        var targetRatio = this._getTargetRatio();

        mesh.el = el;
        el.object3DMap.mesh.add(mesh);
        var localClickedPoint = el.object3D.worldToLocal(clickedPoint);
        mesh.position.set(localClickedPoint.x, localClickedPoint.y, localClickedPoint.z + 0.02);

        new TWEEN.Tween(mesh.scale).to({ x: targetRatio, y: targetRatio, z: targetRatio }, 800).start();
        new TWEEN.Tween(mesh.material).to({ opacity: 0 }, 800).start();

        var timeout = setTimeout(function () {
            mesh.el = null;
            el.object3DMap.mesh.remove(mesh);
            mesh = null;
            clearTimeout(timeout);
            _this.isClicking = false;
        }, 800);
    },

    remove: function() {
        this.el.removeEventListener('cursor-click', this._listener.click);
    }
});

function getRectClippingPlanes(obj) {
    var bBox = new THREE.Box3().setFromObject(obj);
    var normalVector = obj.getWorldDirection();
    var currentPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(normalVector, new THREE.Vector3((bBox.max.x + bBox.min.x) * 0.5, (bBox.max.y + bBox.min.y) * 0.5, (bBox.max.z + bBox.min.z) * 0.5));

    var rightTop = new THREE.Vector3(bBox.max.x, bBox.max.y, bBox.max.z);
    if (Math.abs(currentPlane.distanceToPoint(rightTop)) > 0.01) {
        rightTop = new THREE.Vector3(bBox.max.x, bBox.max.y, bBox.min.z);
    }

    var rightBottom = new THREE.Vector3(bBox.max.x, bBox.min.y, bBox.max.z);
    if (Math.abs(currentPlane.distanceToPoint(rightBottom)) > 0.01) {
        rightBottom = new THREE.Vector3(bBox.max.x, bBox.min.y, bBox.min.z);
    }

    var leftTop = new THREE.Vector3(bBox.min.x, bBox.max.y, bBox.min.z);
    if (Math.abs(currentPlane.distanceToPoint(leftTop)) > 0.0001) {
        leftTop = new THREE.Vector3(bBox.min.x, bBox.max.y, bBox.max.z);
    }

    var leftBottom = new THREE.Vector3(bBox.min.x, bBox.min.y, bBox.min.z);
    if (Math.abs(currentPlane.distanceToPoint(leftBottom)) > 0.0001) {
        leftBottom = new THREE.Vector3(bBox.min.x, bBox.min.y, bBox.max.z);
    }

    return [new THREE.Plane().setFromCoplanarPoints(rightTop, rightBottom, new THREE.Vector3().addVectors(rightBottom, normalVector)), new THREE.Plane().setFromCoplanarPoints(rightBottom, leftBottom, new THREE.Vector3().addVectors(leftBottom, normalVector)), new THREE.Plane().setFromCoplanarPoints(leftTop, rightTop, new THREE.Vector3().addVectors(leftTop, normalVector)), new THREE.Plane().setFromCoplanarPoints(leftBottom, leftTop, new THREE.Vector3().addVectors(leftBottom, normalVector))];
}

function getCircularClippingPlanes(obj) {
    var positionArray = obj.geometry.attributes.position.array;
    var counts = positionArray.length;
    var matrixWorld = obj.matrixWorld;
    var planes = [];
    var m = positionArray;
    var orthoVector = new THREE.Vector3(0, 0, 1);

    for (var i = 0; i < counts; i += 9) {
        var firstPoint = new THREE.Vector3(m[i], m[i + 1], m[i + 2]);
        var secondPoint = new THREE.Vector3(m[i + 3], m[i + 4], m[i + 5]);
        var thirdPoint = new THREE.Vector3().addVectors(firstPoint, orthoVector);
        var plane = new THREE.Plane().setFromCoplanarPoints(secondPoint, firstPoint, thirdPoint);
        plane.applyMatrix4(matrixWorld);
        planes.push(plane);
    }

    return planes;
}
