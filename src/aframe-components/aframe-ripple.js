const INITIAL_SIZE = 0.15;
const THREE = AFRAME.THREE;

AFRAME.registerComponent('ripple', {

    schema: {
        type: {
            default: 'rect'
        },
        color: {
            default: '#333333'
        }
    },

    init: function() {
        this._listener = {
            click: this._handleClick.bind(this),
            sceneLoad: this._handleSceneLoad.bind(this)
        };
        this.isClicking = false;
        this.el.addEventListener('cursor-click', this._listener.click);

        const scene = this.el.sceneEl;
        if (scene.hasLoaded) {
            scene.renderer.localClippingEnabled = true;
        }
        else {
            scene.addEventListener('loaded', this._listener.sceneLoad);
        }
    },

    _handleSceneLoad: function() {
        this.el.sceneEl.removeEventListener('loaded', this._listener.sceneLoad);
        this.el.sceneEl.renderer.localClippingEnabled = true;
    },

    _handleClick: function(event) {
        if (this.isClicking) {
            return;
        }
        this.isClicking = true;
        const clickedPoint = event.detail.intersectInfo.intersections[0].point;

        let circleGeometry,
            circleMaterial;

        if (this.data.type === 'rect') {
            circleGeometry = new THREE.CircleGeometry(INITIAL_SIZE, 32);
            circleMaterial = new THREE.MeshBasicMaterial({
                color: this.data.color,
                clippingPlanes: getRectClippingPlanes(this.el.object3DMap.mesh),
                transparent: true,
                opacity: 0.2
            });
        }
        else {
            circleGeometry = new THREE.CircleGeometry(0.05, 32);
            circleMaterial = new THREE.MeshBasicMaterial({
                color: '#888888',
                clippingPlanes: getCircularClippingPlanes(this.el.object3D),
                transparent: true,
                opacity: 0.6
            });
        }

        let mesh = new THREE.Mesh(circleGeometry, circleMaterial);
        const elGeometry = this.el.getComputedAttribute('geometry');
        const targetRatio = Math.max(elGeometry.width, elGeometry.height) / INITIAL_SIZE * 1.2;
        mesh.el = this.el;
        this.el.object3DMap.mesh.add(mesh);
        const localClickedPoint = this.el.object3D.worldToLocal(clickedPoint);
        mesh.position.set(localClickedPoint.x, localClickedPoint.y, localClickedPoint.z + 0.02);

        new TWEEN.Tween(mesh.scale).to({x: targetRatio, y: targetRatio, z: targetRatio}, 800).start();
        new TWEEN.Tween(mesh.material).to({opacity: 0}, 800).start();

        let timeout = setTimeout(() => {
            mesh.el = null;
            this.el.object3DMap.mesh.remove(mesh);
            mesh = null;
            clearTimeout(timeout);
            this.isClicking = false;

        }, 800);
    },

    remove: function() {
        this.el.removeEventListener('cursor-click', this._listener.click);
    }
});

function getRectClippingPlanes(obj) {
    const bBox = new THREE.Box3().setFromObject(obj);
    const normalVector = obj.getWorldDirection();
    const currentPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(normalVector,
        new THREE.Vector3(
            (bBox.max.x + bBox.min.x) * 0.5,
            (bBox.max.y + bBox.min.y) * 0.5,
            (bBox.max.z + bBox.min.z) * 0.5
        )
    );

    let rightTop = new THREE.Vector3(bBox.max.x, bBox.max.y, bBox.max.z);
    if (Math.abs(currentPlane.distanceToPoint(rightTop)) > 0.01) {
        rightTop = new THREE.Vector3(bBox.max.x, bBox.max.y, bBox.min.z);
    }

    let rightBottom = new THREE.Vector3(bBox.max.x, bBox.min.y, bBox.max.z);
    if (Math.abs(currentPlane.distanceToPoint(rightBottom)) > 0.01) {
        rightBottom = new THREE.Vector3(bBox.max.x, bBox.min.y, bBox.min.z);
    }

    let leftTop = new THREE.Vector3(bBox.min.x, bBox.max.y, bBox.min.z);
    if (Math.abs(currentPlane.distanceToPoint(leftTop)) > 0.0001) {
        leftTop = new THREE.Vector3(bBox.min.x, bBox.max.y, bBox.max.z);
    }

    let leftBottom = new THREE.Vector3(bBox.min.x, bBox.min.y, bBox.min.z);
    if (Math.abs(currentPlane.distanceToPoint(leftBottom)) > 0.0001) {
        leftBottom = new THREE.Vector3(bBox.min.x, bBox.min.y, bBox.max.z);
    }

    return [
        new THREE.Plane().setFromCoplanarPoints(
            rightTop,
            rightBottom,
            new THREE.Vector3().addVectors(rightBottom, normalVector),
        ),
        new THREE.Plane().setFromCoplanarPoints(
            rightBottom,
            leftBottom,
            new THREE.Vector3().addVectors(leftBottom, normalVector),
        ),
        new THREE.Plane().setFromCoplanarPoints(
            leftTop,
            rightTop,
            new THREE.Vector3().addVectors(leftTop, normalVector),
        ),
        new THREE.Plane().setFromCoplanarPoints(
            leftBottom,
            leftTop,
            new THREE.Vector3().addVectors(leftBottom, normalVector),
        )
    ];
}

function getCircularClippingPlanes(obj) {
    const normalVector = obj.getWorldDirection();
    const positions = obj.children[0].geometry.attributes.position;
    const counts = positions.array.length;
    const planes = [];
    const objMatrix = obj.matrix;
    const m = positions.array;
    const orthoVector = new THREE.Vector3(0, 0, 1);

    for (let i = 0; i < counts; i += 9) {
        const firstPoint = new THREE.Vector3(m[i], m[i + 1], m[i + 2]);
        const secondPoint = new THREE.Vector3(m[i + 3], m[i + 4], m[i + 5]);
        const thirdPoint = new THREE.Vector3().addVectors(firstPoint, orthoVector);
        const plane = new THREE.Plane().setFromCoplanarPoints(
            secondPoint,
            firstPoint,
            thirdPoint
        );
        plane.applyMatrix4(obj.matrixWorld);
        planes.push(plane);
    }

    return planes;
}
