const THREE = window.AFRAME.THREE;

export default class ClippingUtil {
    static getRectClippingPlanes(obj) {
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

    static getCircularClippingPlanes(obj) {
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
}
