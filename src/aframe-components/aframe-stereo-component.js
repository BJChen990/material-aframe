AFRAME.registerComponent('stereo', {
    schema: {
        eye: {type: 'string', default: 'left'},
        mode: {type: 'string', default: 'full'},
        isVideo: {type: 'bool', default: false}
    },

    init: function(){
        const data = this.data;
        this._clickListenerAdded = true;

        if (data.isVideo) {
            this._clickListenerAdded = false;
            const mesh = this.el.object3DMap.mesh;
            const geometry = mesh.geometry;

            if (data.eye === 'left') {
                const uvs = geometry.attributes.uv.array;
                const uvLength = uvs.length;
                for (let i = 0; i < uvLength; i += 2) {
                    uvs[i] *= 0.5;
                }
            }

            if (data.eye === 'right') {
                const uvs = geometry.attributes.uv.array;
                const uvLength = uvs.length;
                for (let i = 0; i < uvLength; i += 2) {
                    uvs[i] *= 0.5;
                    uvs[i] += 0.5;
                }
            }
        }
    },

       // On element update, put in the right layer, 0:both, 1:left, 2:right (spheres or not)

    update: function(){
        const object3D = this.el.object3D;
        const data = this.data;

        if(data.eye === 'both'){
            object3D.layers.set(0);
        }
        else{
            object3D.layers.set(data.eye === 'left' ? 1 : 2);
        }

    },

    tick: function(){

           // If this value is false, it means that (a) this is a video on a sphere [see init method]
           // and (b) of course, tick is not added

        if(!this._clickListenerAdded){
            const el = this.el;
            const canvas = el.sceneEl.canvas;

            if (typeof(canvas) !== 'undefined') {

                const video = this.videoEl = el.object3DMap.mesh.material.map.image;

                canvas.onclick = () => {
                    video.play();

                };
                this._clickListenerAdded = true;
            }
        }

    }
}
);

  // Sets the 'default' eye viewed by camera in non-VR mode
