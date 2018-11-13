import ModuleMgr from "../../Plat/GameMgrs/ModuleMgr";

let modules={
    
    BullRoom:'TbnnRoom', 
    Bull_settle:"SubLayer/Games/Tbnn/Prefab_bull_settleCtrl",//结算
    Bull_totalSettle:"GameStatistics/tbnn/TbnnFinalSettle",//牛牛总结算
    Bull_settle_openContent:"SubLayer/Games/Tbnn/Tbnn_settle_openContent",//结算每局打开背景
    Bull_settle_meijuDetail:"SubLayer/Games/Tbnn/Tbnn_settle_openDetail",//结算每局打开后详情
    RoomUserInfo:'SubLayer/Plat/GameRoomCommon/RoomUserInfo',//个人信息
    GambleRecord:'SubLayer/Games/Tbnn/Tbnn_record',//战绩詳情
    
    Bull_settle_rowCotent:"GameCommon/Bull/bull_settle_rowContent",//结算每局信息
    Bull_cuopai:"GameCommon/Bull/Bull_cuopai",//搓牌
    Bull_calculate:"GameCommon/Bull/Bull_calculateCtrl",//算牌UI
    Bull_goldFalsh:"GameCommon/Bull/Bull_ani_coinFlash",//牛牛金币闪动特效
}


export default class TbnnEntry{ 
    constructor()
    { 
    }  
    private static _instance:TbnnEntry;
    public static getInstance ():TbnnEntry{
        if(!this._instance){
            this._instance = new TbnnEntry();
        }
        return this._instance;
    } 
    registerModules()
    {
        ModuleMgr.getInstance().registerGame(modules);
    }
}