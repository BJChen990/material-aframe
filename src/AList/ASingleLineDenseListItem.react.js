import BaseSingleLineListItem from './BaseSingleLineListItem.react';
import Constants from '../constants';

const {
    ListConstants,
    PIXEL_TO_METER
} = Constants;
const ListHeight = ListConstants.SingleLineConstants.DENSE_TILE_HEIGHT * PIXEL_TO_METER;
const ExpandedListHeight = ListConstants.SingleLineConstants.TILE_HEIGHT * PIXEL_TO_METER;
const textFontSize = ListConstants.SingleLineConstants.DENSE_FONT_SIZE;

export default class ASingleLineDenseListItem extends BaseSingleLineListItem {

    constructor(props) {
        super(props);

        this._listHeight = props.leftElement ? ExpandedListHeight : ListHeight;
        this._textFontSize = textFontSize;
    }
}
