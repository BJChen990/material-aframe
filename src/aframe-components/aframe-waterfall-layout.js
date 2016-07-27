const AFRAME = window.AFRAME;

AFRAME.registerComponent('waterfall-layout', {
    schema: {
        columns: {default: 2, min: 1},
        margin: {default: 0.5, min: 0}
    },
    /**
    * Store initial positions in case need to reset on component removal.
    */
    init: function () {
        this._offsetOfRows = null;
        this._currentHeight = null;

        const observer = this.mutationObserver = new MutationObserver(this.update.bind(this));
        observer.observe(this.el.sceneEl, {
            childList: true,
            subtree: false
        });
    },

    /**
    * Update child entity positions.
    */
    update: function () {
        const data = this.data;
        const { margin, columns } = data;

        const offsetOfRows = this._offsetOfRows = [];
        for (let i = 0; i < columns; i++) {
            offsetOfRows.push(margin);
        }
        this._currentHeight = 0;

        const children = this.el.getChildEntities();
        const childrenLength = children.length;

        const width = parseFloat(children[0].getComputedAttribute('geometry').width);
        const startPosition = -((columns * width) + (columns - 1) * margin) * 0.5;

        let positions = [];
        let xPositions = [];

        for (let i = 0; i < childrenLength; i++) {
            const child = children[i];
            let rowIndex,
                xPosition;

            const height = parseFloat(child.getComputedAttribute('geometry').height);

            let max = -Infinity;
            for (let j = 0; j < columns; j++) {
                if (offsetOfRows[j] > max) {
                    max = offsetOfRows[j];
                    rowIndex = j;
                }
            }

            if (!xPositions[rowIndex]) {
                xPositions[rowIndex] = startPosition + rowIndex * margin + (rowIndex + 0.5) * width;
            }

            xPosition = xPositions[rowIndex];

            offsetOfRows[rowIndex] -= (margin + height);
            positions.push([xPosition, offsetOfRows[rowIndex] + height * 0.5 + margin, 0]);
        }

        let min = Infinity;

        for (let j = 0; j < columns; j++) {
            if (offsetOfRows[j] < min) {
                min = offsetOfRows[j];
            }
        }

        const newHeight = Math.abs(min);

        setPositions(children, positions, newHeight);
        this._currentHeight = newHeight;
    },

/**
* Reset positions.
*/
    remove: function () {
        this.mutationObserver.disconnect();
    }
});

/**
* Set position on child entities.
*
* @param {array} els - Child entities to set.
* @param {array} positions - Array of coordinates.
*/
function setPositions (els, positions, newHeight) {
    const elLength = els.length;
    const offset = newHeight * 0.5;

    for (let i = 0; i < elLength; i++) {
        const el = els[i];
        const position = positions[i];

        el.setAttribute('position', {
            x: position[0],
            y: position[1] + offset,
            z: position[2]
        });
    }
}
