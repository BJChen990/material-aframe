const AFRAME = window.AFRAME;
const THREE = AFRAME.THREE;
var scaleDummy = new THREE.Vector3();

/**
 * Raycaster component.
 *
 * Pass options to three.js Raycaster including which objects to test.
 * Poll for intersections.
 * Emit event on origin entity and on target entity on intersect.
 *
 * @member {array} intersectedEls - List of currently intersected entities.
 * @member {array} objects - Cached list of meshes to intersect.
 * @member {number} prevCheckTime - Previous time intersection was checked. To help interval.
 * @member {object} raycaster - three.js Raycaster.
 */
AFRAME.registerComponent('cursor-raycaster', {
    schema: {
        far: {default: Infinity}, // Infinity.
        interval: {default: 100},
        near: {default: 0},
        objects: {default: ''},
        recursive: {default: true}
    },

    init: function () {
        this.direction = new THREE.Vector3();
        this.intersectedEls = [];
        this.objects = null;
        this.prevCheckTime = undefined;
        this.raycaster = new THREE.Raycaster();
        this.updateOriginDirection();
    },

  /**
   * Create or update raycaster object.
   */
    update: function () {
        var data = this.data;
        var raycaster = this.raycaster;

        // Set raycaster properties.
        raycaster.far = data.far;
        raycaster.near = data.near;

        this.refreshObjects();
    },

  /**
   * Update list of objects to test for intersection.
   */
    refreshObjects: function () {
        const objects = [];

        // Push meshes onto list of objects to intersect.
        const interactableEls = document.querySelectorAll('[clickable], [hoverable]');
        const elLength = interactableEls.length;

        for (let i = 0; i < elLength; i++) {
            objects.push(interactableEls[i].object3D);
        }
        this.objects = objects;
    },

   /**
    * Check for intersections and cleared intersections on an interval.
    */
    tick: function (time) {
        const el = this.el;
        const data = this.data;
        const prevCheckTime = this.prevCheckTime;
        // Only check for intersection if interval time has passed.
        if (prevCheckTime && (time - prevCheckTime < data.interval)) { return; }

        const prevIntersectedEls = this.intersectedEls;
        const intersectedEls = [];  // Reset intersectedEls.
        let i;

        // Raycast.
        this.updateOriginDirection();
        const intersections = this.raycaster.intersectObjects(this.objects, data.recursive);
        const intersectionLength = intersections.length;

        // Update intersectedEls object first in case event handlers try to inspect it.
        if (intersectionLength) {
            for (i = 0; i < intersectionLength; i++) {
                const intersection = intersections[i];
                const intersectionEl = intersection.object.el;
                intersectedEls.push(intersectionEl);
                intersectionEl.emit('raycaster-intersected', {el: el, intersection: intersection});
            }
            el.emit('raycaster-intersection', {
                els: intersectedEls,
                intersections: intersections
            });
        }

        const prevIntersectedElLength = prevIntersectedEls.length;
        // Emit intersection cleared on both entities per formerly intersected entity.
        for (i = 0; i < prevIntersectedElLength; i++) {
            const element = prevIntersectedEls[i];

            if (intersectedEls.indexOf(element) !== -1) {continue;}
            el.emit('raycaster-intersection-cleared', {el: element});
            element.emit('raycaster-intersected-cleared', {el: el});
        }
        this.intersectedEls = intersectedEls;
    },

  /**
   * Set origin and direction of raycaster using entity position and rotation.
   */
    updateOriginDirection: (function () {
        var directionHelper = new THREE.Quaternion();
        var originVec3 = new THREE.Vector3();

        // Closure to make quaternion/vector3 objects private.
        return function updateOriginDirection () {
            var el = this.el;
            var object3D = el.object3D;
            const direction = this.direction;

            // Update matrix world.
            object3D.updateMatrixWorld();
            // Grab the position and rotation.
            object3D.matrixWorld.decompose(originVec3, directionHelper, scaleDummy);
            // Apply rotation to a 0, 0, -1 vector.
            direction.set(0, 0, -1);
            direction.applyQuaternion(directionHelper);

            this.raycaster.set(originVec3, direction);
        };
    })()
});
