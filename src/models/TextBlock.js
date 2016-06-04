import TextUtil from '../utils/TextUtil';
import LineBreaker from 'linebreak';

export default class TextBlock {
    constructor(ctx, width, options = {}) {
        this._ctx = ctx;
        this._width = width;
        this._paddingHorizontal = options.horizontalPadding || 0;
        this._paddingVertical = options.verticalPadding || 0;
        this._titleFontSize = options.titleFontSize || 24 * 4;
        this._subtitleFontSize = options.titleFontSize || 18 * 4;
        this._fontSize = options.fontSize || 52;
        this._fontFamily = options.fontFamily || 'OpenSans';
        this._lines = [];
    }

    pushText(text, isTitle = false) {
        let remainedString = this._processLine(text, isTitle);
        while (remainedString !== '') {
            remainedString = this._processLine(remainedString, isTitle);
        }
    }

    _processLine(text, isTitle) {
        const breaker = new LineBreaker(text);
        const lines = this._lines;
        let last = 0,
            bk = breaker.nextBreak(),
            currentSplit = {string:'', end:0, width: 0},
            fontSize = isTitle ? this._titleFontSize : this._fontSize,
            fontFamily = this._fontFamily,
            maxWidth = this._width - this._paddingHorizontal * 2,
            ctx = this._ctx;

        while (bk) {
            const str = text.slice(last, bk.position).trim();
            const textSize = TextUtil.calculateTextSize(ctx, str, fontSize, fontFamily);
            const width = textSize.width;

            if (width <= maxWidth) {
                currentSplit.string = str;
                currentSplit.end = bk.position;
                currentSplit.width = width;
                if (bk.required) {
                    lines.push({text: currentSplit.string, width: currentSplit.width, fontSize: fontSize});
                    return text.slice(currentSplit.end);
                }
            } else {
                lines.push({text: currentSplit.string, width: currentSplit.width, fontSize: fontSize});
                return text.slice(currentSplit.end);
            }
            bk = breaker.nextBreak();
        }
        lines.push({text: currentSplit.string, width: currentSplit.width, fontSize: fontSize});
        return '';
    }

    toJS() {
        const lines = this._lines;
        const lineLength = lines.length;
        let height = 2 * this._paddingVertical;

        for (let i = 0; i < lineLength; i++) {
            height += lines[i].fontSize * 1.5;
        }

        return {
            height: height,
            lines: lines
        };
    }
}
