//
import BaseMgr from "../Libs/BaseMgr";
import RoomMgr from "./RoomMgr";
import UserMgr from "./UserMgr";
import FrameMgr from "./FrameMgr";
import BetMgr from "./BetMgr";
import Prefab_shopCtrl from "../Modules/Shop/Prefab_shopCtrl";
import ClubMgr from "./ClubMgr";
import LoginMgr from "./LoginMgr";
import PlatMgr from "./PlatMgr";
import GameCateCfg from "../CfgMgrs/GameCateCfg";
import SubGameMgr from "./SubGameMgr";

/**
 * gfun
 * Bet
 * platmodule
 */

 
export default class VerifyMgr extends BaseMgr{
    roomUserInfo:any = null                    //未决事件，1表示未结束游戏，2表示未解散房间
    routes:any = null  
    autoEnter=true;                     
    constructor (){
        super();

        this.roomUserInfo=null;
        this.routes={ 
            'http.reqMyRoomState':this.http_reqMyRoomState,
            'onGameFinished':this.onGameFinished, 
        }
    }

    onGameFinished(msg){
        this.roomUserInfo=null;
    }
    disableAutoEnter(){
        this.autoEnter=false;    
    }
    http_reqMyRoomState(msg) {
        this.roomUserInfo=msg.roomUserInfo   
        //console.log("http_reqMyRoomState msg=",JSON.stringify(msg))
        console.log("获取到信息=",this.roomUserInfo)
        if(this.roomUserInfo&&this.roomUserInfo.rid>0)
        {
            PlatMgr.getInstance().disableAutoShowAd();
            this.gemit('ge_close_gonggao');
            RoomMgr.getInstance().http_reqFangKaCfg({cfg:msg.cfg}); 
            RoomMgr.getInstance().http_reqRoomInfo({roominfo:msg.roominfo}); 
            if(RoomMgr.getInstance().isInRoom())
            {
                //如果已经在房间中了就恢复房间
                PlatMgr.getInstance().enterGameSvr();
            }
            else
            {
                BetMgr.getInstance().setGameId(this.roomUserInfo.gameid);  
                BetMgr.getInstance().setBetType(this.roomUserInfo.bettype);
                let game=GameCateCfg.getInstance().getGameById(this.roomUserInfo.gameid); 
                let state=SubGameMgr.getInstance().getSubGameState(game.code) 
                
                if(this.autoEnter)
                { 
                    if(state!=0)
                    {
                        this.showRecoverRoom();
                    }
                    else
                    {
                        this.checkDownLoadAndEnterGameSvr();
                    } 
                    this.autoEnter=false;
                }
                else{
                    this.showRecoverRoom();
                }
                this.autoEnter=false;
            }
        } 
        else
        {
            this.roomUserInfo=null; 
            //
            if(RoomMgr.getInstance().isInRoom())
            {
                //如果已经在房间中了就恢复房间
                LoginMgr.getInstance().disconnectGameSvr();
            }
        }
    } 
    checkDownLoadAndEnterGameSvr(){
        let game=GameCateCfg.getInstance().getGameById(this.roomUserInfo.gameid); 
        let state=SubGameMgr.getInstance().getSubGameState(game.code) 
        if(state==0)
        {
            LoginMgr.getInstance().disconnectDaTing();
        }
        else
        {
			this.start_sub_module(G_MODULE.DownLoadGame,(obj)=>{
				obj.regCompleteCb(()=>{ 
                    LoginMgr.getInstance().disconnectDaTing();
				})
			},'Prefab_downLoadGamePanelCtrl');  
        } 
    }
    showRecoverRoom(){
        let okcb = function(){
            if(!this.roomUserInfo){
                FrameMgr.getInstance().showMsgBox("游戏已解散");  
                return;
            }  
            this.checkDownLoadAndEnterGameSvr();
        } 
        FrameMgr.getInstance().showDialog("你有房间未恢复,点击确定进入!",okcb.bind(this)) 
    }
    checkUnSettled(){
        if(this.roomUserInfo){ 
            this.showRecoverRoom();
            return true;
        }
        return false;
    }
    //判断金币是否足够
    checkCoin(){
        //判断是否有未恢复的游戏
        if(this.checkUnSettled()){
            return false
        } 
        let myinfo=UserMgr.getInstance().getMyInfo();   
        let jbcCfg=BetMgr.getInstance().getJbcCfg(); 
        if(myinfo.coin<jbcCfg.leastcoin){ 
            //金币不足
            if(myinfo.relief>0){
                //启用救济金
                this.start_sub_module(G_MODULE.ReliefMoney)  
            }else{
                //打开购买游戏豆界面 
                this.start_sub_module(G_MODULE.Shop, (uiComp:Prefab_shopCtrl)=>{
                    uiComp.buyCoin();
                });
   
            }
            return false;
        }
        return true;
    } 

 

    checkFangKa(cost){
        if(this.checkUnSettled()){
            return false
        }
        let myinfo=UserMgr.getInstance().myinfo  
        if(myinfo.fangka<cost){
            // let ctrl=this.start_module(platmodule.recharge)
            // ctrl.initShop(1)
            return false;
        }
        return true;
    } 

    checkGold(cost){
        let myGold = UserMgr.getInstance().myinfo.gold
        if(myGold < cost){
            return false;
        }
        return true;
    }
    checkClubGold(id,cost){
        let myGold = ClubMgr.getInstance().getClubDiamond(id)
        if(myGold < cost){
            return false;
        }
        return true;
    }
    //单例处理
    private static _instance:VerifyMgr;
    public static getInstance ():VerifyMgr{
        if(!this._instance){
            this._instance = new VerifyMgr();
        }
        return this._instance;
    }
}