const THREE = window.AFRAME.THREE;
const ImageLoader = new THREE.TextureLoader();
const textureCache = {};

export default class ImageUtil {
    static getCachedTexture(src) {
        return textureCache[src];
    }

    static loadImage(src, callback) {
        ImageLoader.load(src, function (texture) {
            textureCache[src] = texture;
            return callback(texture);
        });
    }
}
