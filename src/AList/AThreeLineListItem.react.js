import BaseThreeLineListItem from './BaseThreeLineListItem.react';
import Constants from '../constants';

const {
    ListConstants,
    PIXEL_TO_METER
} = Constants;
const ListHeight = ListConstants.ThreeLineConstants.TILE_HEIGHT * PIXEL_TO_METER;
const textFontSize = ListConstants.ThreeLineConstants.FONT_SIZE;

export default class AThreeLineListItem extends BaseThreeLineListItem {

    constructor(props) {
        super(props);

        this._listHeight = ListHeight;
        this._textFontSize = textFontSize;
    }
}
