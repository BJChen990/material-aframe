AFRAME.registerComponent('stereocam', {

    schema: {
        eye: { type: 'string', default: 'left'}
    },

       // Cam is not attached on init, so use a flag to do this once at 'tick'

       // Use update every tick if flagged as 'not changed yet'

    init: function(){
            // Flag to register if cam layer has already changed
        this.layer_changed = false;
    },

    tick: function(time){


        var originalData = this.data;

            // If layer never changed

        if(!this.layer_changed){

            // because stereocam component should be attached to an a-camera element
            // need to get down to the root PerspectiveCamera before addressing layers

            // Gather the children of this a-camera and identify types

            var childrenTypes = [];

            this.el.object3D.children.forEach( function (item, index, array) {
                childrenTypes[index] = item.type;
            });

            // Retrieve the PerspectiveCamera
            var rootIndex = childrenTypes.indexOf('PerspectiveCamera');
            var rootCam = this.el.object3D.children[rootIndex];

            if(originalData.eye === 'both'){
                rootCam.layers.enable( 1 );
                rootCam.layers.enable( 2 );
            }
            else{
                rootCam.layers.enable(originalData.eye === 'left' ? 1:2);
            }
        }
    }

});
