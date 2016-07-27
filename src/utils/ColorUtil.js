export default class ColorUtil {
    static changeColorWithAmount(originalColor, colorChangeRate) {
        let r = originalColor.r * 255 - 26 * colorChangeRate;
        let g = originalColor.g * 255 - 26 * colorChangeRate;
        let b = originalColor.b * 255 - 26 * colorChangeRate;

        if (r > 255) {
            r = 255;
        }
        if (g > 255) {
            g = 255;
        }
        if (b > 255) {
            b = 255;
        }

        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
}
