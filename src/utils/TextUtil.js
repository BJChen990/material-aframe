const dummyDiv = document.createElement('div');
const dummyText = document.createTextNode('M');
const body = document.querySelector('body');

export default class TextUtil {

    static calculateTextSize(ctx, text, fontSize, fontFamily) {
        ctx.font = `${fontSize}px ${fontFamily}`;

        dummyDiv.appendChild(dummyText);
        dummyDiv.setAttribute('style', 'font: ' + ctx.font);
        body.appendChild(dummyDiv);
        const height = dummyDiv.offsetHeight;
        body.removeChild(dummyDiv);

        return {
            width: ctx.measureText(text).width,
            height: height
        };
    }
}
