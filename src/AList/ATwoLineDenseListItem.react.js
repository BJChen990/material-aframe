import BaseTwoLineListItem from './BaseTwoLineListItem.react';
import Constants from '../constants';

const {
    ListConstants,
    PIXEL_TO_METER
} = Constants;
const ListHeight = ListConstants.TwoLineConstants.DENSE_TILE_HEIGHT * PIXEL_TO_METER;
const textFontSize = ListConstants.TwoLineConstants.DENSE_FONT_SIZE;

export default class ATwoLineDenseListItem extends BaseTwoLineListItem {

    constructor(props) {
        super(props);
        this._listHeight = ListHeight;
        this._textFontSize = textFontSize;
    }
}
