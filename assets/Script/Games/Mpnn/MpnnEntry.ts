import ModuleMgr from "../../Plat/GameMgrs/ModuleMgr";

let modules={
    
    BullRoom:'MpnnRoom', 
    Bull_settle:"SubLayer/Games/Mpnn/Prefab_bull_settleCtrl",//结算
    Bull_totalSettle:"GameStatistics/mpnn/MpnnFinalSettle",//牛牛总结算
    Mpnn_settle_openContent:"SubLayer/Games/Mpnn/Mpnn_settle_openContent",//结算每局打开背景
    Mpnn_settle_meijuDetail:"SubLayer/Games/Mpnn/Mpnn_settle_openDetail",//结算每局打开后详情
    RoomUserInfo:'SubLayer/Plat/GameRoomCommon/RoomUserInfo',//个人信息
    GambleRecord:'SubLayer/Games/Mpnn/Mpnn_record',//战绩詳情
    
    Bull_settle_rowCotent:"GameCommon/Bull/bull_settle_rowContent",//结算每局信息
    Mpnn_cuopai:"SubLayer/Games/Mpnn/Mpnn_cuopai",//明牌牛牛搓牌
    Bull_calculate:"GameCommon/Bull/Bull_calculateCtrl",//算牌UI
    Bull_goldFalsh:"GameCommon/Bull/Bull_ani_coinFlash",//牛牛金币闪动特效
}


export default class MpnnEntry{ 
    constructor()
    { 
    }  
    private static _instance:MpnnEntry;
    public static getInstance ():MpnnEntry{
        if(!this._instance){
            this._instance = new MpnnEntry();
        }
        return this._instance;
    } 
    registerModules()
    {
        ModuleMgr.getInstance().registerGame(modules);
    }
}