import ModuleMgr from "../../Plat/GameMgrs/ModuleMgr";

let modules={
    
    BullRoom:'QznnRoom', 
    Bull_calculate:"SubLayer/Plat/GameRoomCommon/Bull_calculateCtrl",//算牌UI
    Bull_settle:"SubLayer/Games/Bull/Prefab_bull_settleCtrl",//结算
    qznn_chooseGrab:"SubLayer/Games/Qznn/Prefab_bull_chooseGrabCtrl",//是否抢庄
    qznn_chooseChip:"SubLayer/Games/Qznn/Prefab_bull_chooseChipCtrl",//闲家下注
    qznn_grabFlag:"SubLayer/Games/Qznn/Prefab_qznn_grabFlag",//是否抢庄的标记
    qznn_dealerWord:"SubLayer/Games/Qznn/Bull_dealerWord",//庄字
    qznn_dealerSelected:"SubLayer/Games/Qznn/Bull_dealerSelected",//庄家选中
    Bull_totalSettle:"SubLayer/Games/Qznn/Qznn_totalSettle",//牛牛总结算
    Bull_cuopai:"SubLayer/Plat/GameRoomCommon/Bull_cuopai",//搓牌
    Bull_goldFalsh:"Plat/GameRoomCommom/Bull_ani_coinFlash/",//牛牛金币闪动特效
}

export default class QznnEntry{ 
    constructor()
    { 
    }  
    private static _instance:QznnEntry;
    public static getInstance ():QznnEntry{
        if(!this._instance){
            this._instance = new QznnEntry();
        }
        return this._instance;
    } 
    registerModules()
    {
        ModuleMgr.getInstance().registerGame(modules);
    }
}