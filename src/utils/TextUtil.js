const Canvas = document.createElement('canvas');

export default class TextUtil {

    static calculateTextSize(ctx, text, fontSize, fontFamily) {
        ctx.font = `${fontSize}px ${fontFamily}`;

        return {
            width: ctx.measureText(text).width
        };
    }

    static getCanvas() {
        return Canvas;
    }
}
