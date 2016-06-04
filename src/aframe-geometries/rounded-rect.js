const THREE = AFRAME.THREE;
var degToRad = THREE.Math.degToRad;

window.AFRAME.registerGeometry('roundedrect', {
    schema: {
        radius: {default: 2, min: 0},
        width: {default: 2, min: 0},
        height: {default: 1, min: 0},
        topOnly: {default: false},
        bottomOnly: {default: false}
    },
    init: function (data) {
        const rectShape = new THREE.Shape();
        const halfHeight = data.height * 0.5;
        const halfWidth = data.width * 0.5;
        const turnPointHorizontal = halfWidth - data.radius;
        const turnPointVertical = halfHeight - data.radius;

        if (data.topOnly) {
            
            rectShape.moveTo(halfWidth, turnPointVertical);
            rectShape.arc(-data.radius, 0, data.radius, degToRad(90), 0, false);
            rectShape.lineTo(-turnPointHorizontal, halfHeight);
            rectShape.arc(0, -data.radius, data.radius, degToRad(180), degToRad(90), false);
            rectShape.lineTo(-halfWidth, -halfHeight);
            rectShape.lineTo(halfWidth, -halfHeight);
            rectShape.lineTo(halfWidth, turnPointVertical);
        }
        else if (data.bottomOnly) {
            rectShape.moveTo(halfWidth, halfHeight);
            rectShape.lineTo(-halfWidth, halfHeight);
            rectShape.lineTo(-halfWidth, -turnPointVertical);
            rectShape.arc(data.radius, 0, data.radius, degToRad(270), degToRad(180), false);
            rectShape.lineTo(turnPointHorizontal, -halfHeight);
            rectShape.arc(0, data.radius, data.radius, degToRad(360), degToRad(270), false);
            rectShape.lineTo(halfWidth, halfHeight);
        }
        else {
            rectShape.moveTo(halfWidth, turnPointVertical);
            rectShape.arc(-data.radius, 0, data.radius, degToRad(90), 0, false);
            rectShape.lineTo(-turnPointHorizontal, halfHeight);
            rectShape.arc(0, -data.radius, data.radius, degToRad(180), degToRad(90), false);
            rectShape.lineTo(-halfWidth, -turnPointVertical);
            rectShape.arc(data.radius, 0, data.radius, degToRad(270), degToRad(180), false);
            rectShape.lineTo(turnPointHorizontal, -halfHeight);
            rectShape.arc(0, data.radius, data.radius, degToRad(360), degToRad(270), false);
            rectShape.lineTo(halfWidth, turnPointVertical);
        }
        this.geometry = new THREE.ShapeGeometry(rectShape);
    }
});
