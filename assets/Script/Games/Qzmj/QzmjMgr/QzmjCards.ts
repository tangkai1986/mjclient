import { MahjongGeneral } from "../../../GameCommon/Mahjong/MahjongGeneral";
import MahjongCards from "../../../GameCommon/Mahjong/MahjongCards";

export default class QzmjCards extends MahjongCards{
    constructor(cardcount){
        //console.log("cardcount=",cardcount)
        super(cardcount);
    }
}