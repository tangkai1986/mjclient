import BaseMgr from "../Libs/BaseMgr";
import UserMgr from "./UserMgr";
import RoomMgr from "./RoomMgr"; 
import GoodsCfg from "../CfgMgrs/GoodsCfg"; 
import NameCfg from "../CfgMgrs/NameCfg"; 
import VerifyMgr from "./VerifyMgr";
import BetMgr from "./BetMgr";
import LuckDrawMgr from "./LuckDrawMgr";
import CreateRoomMgr from "./CreateRoomMgr";
import LoginMgr from "./LoginMgr";
import ClubMgr from "./ClubMgr";
import ClubMemberMgr from "./ClubMemberMgr";
import ClubGameMgr from "./ClubGameMgr";
import ClubChatMgr from "./ClubChatMgr";
import GameCateCfg from "../CfgMgrs/GameCateCfg";
import JbcCfg from "../CfgMgrs/JbcCfg";
import RoomCostCfg from "../CfgMgrs/RoomCostCfg";
import RoomOptionCfg from "../CfgMgrs/RoomOptionCfg";
import ChatFillterMgr from "./ChatFillterMgr"

import GameNet from "../NetCenter/GameNet";
import SocketNet from "../NetCenter/SocketNet";
import RoomRuleCfg from "../CfgMgrs/RoomRuleCfg";
import UserDefaultCfg from "../CfgMgrs/UserDefaultCfg";
import GameHelpCfg from "../CfgMgrs/GameHelpCfg";
import NotifyMgr from "./NotifyMgr";
import MarqueMgr from "./MarqueMgr"
import TaskMgr from "./TaskMgr";
import ShareMgr from "./ShareMgr"; 
import QuickAudioCfg from "../CfgMgrs/QuickAudioCfg";
import GameResCfg from "../CfgMgrs/GameResCfg";
import GameAudioCfg from "../CfgMgrs/GameAudioCfg";
import redPushMgr from "./redPushMgr";
import AudioCfg from "../CfgMgrs/AudioCfg";
import FrameMgr from "./FrameMgr";
import YySdk from "../SdkMgrs/YySdk";
import GameFreeMgr from "./GameFreeMgr";
import LocalStorage from "../Libs/LocalStorage";
import CreateRoomOptionCfg from "../CfgMgrs/CreateRoomOptionCfg";
import RichIconCfg from "../CfgMgrs/RichIconCfg"
import ProductSettingCfg from "../CfgMgrs/ProductSettingCfg";
import FilterCfg from "../CfgMgrs/FilterCfg";
import RechargeMgr from "./RechargeMgr";

let state_cfg=0;
let state_baseInfo=1;
let state_complete=2;
export default class PlatMgr extends BaseMgr{
    loadprocess:any = null
    baseInfoArr:Array<Function> = null
    baseInfoCount:number = null
    routes:any = null
    completecb:Function = null
    autoshowad=true;
    bInitBaseInfo=false;
    loadingState=null;
    state=null;
    cfgs=[
        FilterCfg,
        ProductSettingCfg,
        GoodsCfg,
        GameCateCfg,
        JbcCfg,
        NameCfg,
        RoomCostCfg,
        RoomOptionCfg,
        RoomRuleCfg,
        UserDefaultCfg,
        GameHelpCfg,
        GameAudioCfg,
        QuickAudioCfg,
        GameResCfg,
        AudioCfg,
        CreateRoomOptionCfg,
        RichIconCfg];
    constructor (){
        super(); 
        this.loadprocess=0;
        this.baseInfoArr = [
            function(){
                UserMgr.getInstance().reqMyInfo();//获取我的信息
            }, 
            function(){
                GameFreeMgr.getInstance().reqGameFreeList();//获取限免信息
            },
            function(){	
                RechargeMgr.getInstance().reqReqGoodsList();//请求商城商品信息 
            },
            function(){	 
                MarqueMgr.getInstance().reqHorseRaceLamp();//获取跑马灯信息 
            } ,
            function(){	  
                ClubChatMgr.getInstance().reqWSUrl();//获取茶馆聊天websocket 
            } ,
            function(){	  
                ClubMgr.getInstance().reqClubList();//获取茶馆信息
            }  
            
        ];
        this.baseInfoCount=this.baseInfoArr.length;
        this.routes={
            'http.reqMyInfo':this.http_reqMyInfo, 
            "http.reqGameFreeList": this.http_reqGameFreeList, 
            "http.reqGoodsList":this.http_reqGoodsList,
            "http.reqHorseRaceLamp":this.http_reqHorseRaceLamp,
            "http.reqWSUrl":this.http_reqWSUrl,
            "http.reqClubList":this.http_reqClubList,
        }
    } 
    http_reqClubList(msg)
    {
        this.checkIfBaseInfoAllLoaded();
    }
    http_reqWSUrl(msg)
    {
        this.checkIfBaseInfoAllLoaded();
    }
    http_reqHorseRaceLamp(msg)
    {
        this.checkIfBaseInfoAllLoaded();
    }
    http_reqGoodsList(msg)
    {
        this.checkIfBaseInfoAllLoaded();
    }
    http_reqMyInfo(msg){
        this.checkIfBaseInfoAllLoaded();
    }
    http_reqGameFreeList(msg){
        this.checkIfBaseInfoAllLoaded();
    }
    isAutoShowAd(){//自动显示大厅一些推广页面
        return this.autoshowad;
    }
    disableAutoShowAd(){//禁止显示大厅推广页面
        this.autoshowad=false;
    }
    checkIfBaseInfoAllLoaded(){
        //这边初始化平台时候才会去检测资源加载清空，其他情况下的监听都是普通回调
        if(this.state!=state_baseInfo)
        {
            return;
        }
        this.loadprocess++; 
        if(this.loadprocess>=this.baseInfoCount){
            //表示全部加载完成了 
            this.state=state_complete;
            this.completecb&&this.completecb();
        }
    } 
    unRegisterCb()
    {
        this.completecb=null;
    }
    initPlat(completeCb){ 
        this.completecb=completeCb; 
        this.state=state_cfg;
        //一开始先加载goods; 
        for(let i = 0;i<this.cfgs.length;++i)
        {
            let item=this.cfgs[i].getInstance();
            item.registerCompleteCb(this.cfgLoadedCb.bind(this))
            item.load();
        } 
    }
    loadBaseInfo(){   
        //设置平台初始化标记,繁殖监听平台回调错乱
        this.bInitBaseInfo=true; 
        this.state=state_baseInfo;    
        //获取我的基本信息
        for(let i = 0; i < this.baseInfoCount; i ++){
            this.baseInfoArr[i]();
        }
    }
    
    enterPlat() {  
        let msg={
            token:LoginMgr.getInstance().getToken(),
        } 
        this.send_msg('connector.entryHandler.enterPlat',msg);
    } 

    //进入游戏服务器
    enterGameSvr() {  
        let msg={
            token:LoginMgr.getInstance().getToken(),
        } 
        this.send_msg('connector.entryHandler.enterGameSvr',msg);
    } 
 
 

    //单例处理
    private static _instance:PlatMgr;
    public static getInstance ():PlatMgr{
        if(!this._instance){
            this._instance = new PlatMgr();
        }
        return this._instance;
    }
    initMgrs(){ 
        //初始化网络协议的单例
        GameNet.getInstance();
        SocketNet.getInstance();
        //初始化呀呀语音
        YySdk.getInstance();
        //初始化所有管理器
        ChatFillterMgr.getInstance();
        VerifyMgr.getInstance();
        BetMgr.getInstance();
        RoomMgr.getInstance();
        ClubMgr.getInstance();
        ClubMemberMgr.getInstance();
        ClubGameMgr.getInstance();
        ClubChatMgr.getInstance();
        LuckDrawMgr.getInstance();
        CreateRoomMgr.getInstance();
        MarqueMgr.getInstance();
        NotifyMgr.getInstance();//全服推送
        TaskMgr.getInstance();
        ShareMgr.getInstance();
        GameFreeMgr.getInstance();
        redPushMgr.getInstance();
    }
    //配置下载回调
    cfgLoadedCb(){
        if(this.state!=state_cfg)
        {
            return;
        } 
        for(let i = 0;i<this.cfgs.length;++i)
        {
            if(!this.cfgs[i].getInstance().isLoaded())
                return;
        } 
        //初始化管理器
        this.initMgrs();
        //加载基础的网络信息
        this.loadBaseInfo();
    } 
}
