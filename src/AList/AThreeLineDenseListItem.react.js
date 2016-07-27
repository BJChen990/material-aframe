import BaseThreeLineListItem from './BaseThreeLineListItem.react';
import Constants from '../constants';

const {
    ListConstants,
    PIXEL_TO_METER
} = Constants;
const ListHeight = ListConstants.ThreeLineConstants.DENSE_TILE_HEIGHT * PIXEL_TO_METER;
const textFontSize = ListConstants.ThreeLineConstants.DENSE_FONT_SIZE;

export default class AThreeLineDenseListItem extends BaseThreeLineListItem {

    constructor(props) {
        super(props);

        this._listHeight = ListHeight;
        this._textFontSize = textFontSize;
    }
}
