 
/*
author: YOYO
日期:2018-01-11 18:08:05
*/
import BaseModel from "../../Libs/BaseModel";
import BaseView from "../../Libs/BaseView";
import BaseCtrl from "../../Libs/BaseCtrl";
import QzmjEntry from "../../../Games/Qzmj/QzmjEntry";
import QgmjEntry from "../../../Games/Qgmj/QgmjEntry";
import BetMgr from "../../GameMgrs/BetMgr";
import LoaderMgr from "../../../AppStart/AppMgrs/LoaderMgr";
import GameCateCfg from "../../CfgMgrs/GameCateCfg"; 
import SssEntry from "../../../Games/Sss/SssEntry";
import RoomMgr from "../../GameMgrs/RoomMgr";
import QznnEntry from "../../../Games/Qznn/QznnEntry";
import TbnnEntry from "../../../Games/Tbnn/TbnnEntry"; 
import MpnnEntry from "../../../Games/Mpnn/MpnnEntry"; 
import QuickAudioCfg from "../../CfgMgrs/QuickAudioCfg";
import GameAudioCfg from "../../CfgMgrs/GameAudioCfg";
import viewLogicSeatConvertMgr from "../../GameMgrs/viewLogicSeatConvertMgr";
import LymjEntry from '../../../Games/Lymj/LymjEntry';
import FzmjEntry from '../../../Games/Fzmj/FzmjEntry';  

let gameEntrys={
    qzmj:QzmjEntry,
    tbnn:TbnnEntry,
    qgmj:QgmjEntry,
    sss:SssEntry,
    qznn:QznnEntry,
    mpnn:MpnnEntry,
    lymj:LymjEntry,
    fzmj:FzmjEntry,
}

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : LoadingGameCtrl;
//模型，数据处理
class Model extends BaseModel{ 
    gameDir;
    gameModuleName;
    gameCode;
    public game=null;
    maxloadcount=0;
    loadindex=0;
    gameid = null;
    bVideoMode=false;
	constructor()
	{
        super(); 
        this.bVideoMode=RoomMgr.getInstance().getVideoMode();
        this.gameid=BetMgr.getInstance().getGameId();
        this.game=GameCateCfg.getInstance().getGameById(this.gameid)
        GameAudioCfg.getInstance().setGameId(this.gameid);
        QuickAudioCfg.getInstance().setGameId(this.gameid);
        this.gameCode=this.game.code; 
        this.gameDir=this.game.code.substring(0,1).toUpperCase()+this.game.code.substring(1); 
        
        this.gameModuleName=`${this.gameDir}Room`;
    }
    isVideoMode(){
        return this.bVideoMode;
    }
    initLoadCount(loadcount){
        this.maxloadcount=loadcount;
        this.loadindex=0;
    }
    //加载完成后的回调
  

    //开始进度条
    public upgradeProcess(){
        this.loadindex++;
    } 
    isCompleted(){
        return this.loadindex==this.maxloadcount;
    }
    //完成一定数量的资源加载
 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    ui={
        lbl_progress : null,         //进度显示的label 
    }
    node=null;
    model:Model
    progressH:number=0;
    progressH2:number=0;
    guangbiaostartx=-460;
    maxwidth=920;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();  
	}
	//初始化ui
	initUi()
	{ 
        this.ui.lbl_progress = ctrl.lbl_progress;  
    }

    //更新进度条表现
    public updateProgress (){

        let percent=this.model.loadindex/this.model.maxloadcount;
        let process=Math.floor(percent*100); 
        this.ui.lbl_progress.string = `${process}%`;    
    }

 
}
//c, 控制
@ccclass
export default class LoadingGameCtrl extends BaseCtrl {
    model:Model
    view:View
    //这边去声明ui组件
    @property(cc.Label)
    lbl_progress:cc.Label = null
    funarr=[]
 
    timeDic={};
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
        this.timeDic['All']=(new Date()).getTime(); 
        RoomMgr.getInstance().setLoadingGame(true);
        this.node.name='Prefab_LoadingGame'
        //LoaderMgr.getInstance().releaseAll();
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
			//网络消息监听列表 
            'http.reqMyRoomState':this.http_reqMyRoomState,
		}
    }
    onDestroy()
    {
        super.onDestroy(); 
        RoomMgr.getInstance().setLoadingGame(false);
    }
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
    } 
    http_reqMyRoomState(msg)
    {
        let bRoomValid=msg.roomUserInfo&&msg.roomUserInfo.rid>0;
        if(!bRoomValid)//如果不是合法的房间,就结束自己
        {
            this.finish();
        }
    } 
    loadRes(){ 
        let self=this;
        //console.log("预加载麻将场景")
        cc.director.preloadScene(this.model.gameModuleName, (err)=> {
            if(err){
                cc.error(err);
            }else{ 
                for(let index=0;index<self.funarr.length;++index)
                {
                    self.funarr[index]();
                } 
            }
        }) 
    }
	start () { 
        if(cc.sys.isNative&&this.model.gameid!=13)
        {
            this._loadDone(); 
        }
        else
        { 
            let self=this;
            self.funarr=[];  
            self.funarr.push( 
                function(){
                    //console.log("下载加载麻将资源")
                    cc.loader.loadResDir(`Games/${self.model.gameDir}`, (err, assets)=> {
                        self._oneCompleted();
                    });
                }
            );
            self.funarr.push( 
                function(){
                    let audioUrl = `audio/Games/${self.model.gameDir}`;
                    //console.log("加载音频资源")
                    cc.loader.loadResDir(audioUrl, (err, assets)=> {
                        self._oneCompleted();
                    });
                },
            );
            let mahjongcommonfunc=function(){ 
                //console.log("加载麻将公共图片")
                cc.loader.loadResDir(`Mahjong/Textures`, (err, assets)=> {
                    self._oneCompleted();
                });
            }
            switch(this.model.game.cate)
            {
                case 1:
                    self.funarr.push(mahjongcommonfunc);
                break;
            }  
            this.model.initLoadCount(self.funarr.length);
            this.view.updateProgress();
            this.loadRes();
        } 
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
    //end
 
    
    private _oneCompleted(){
        this.model.upgradeProcess();
        //console.log("this.model.loadindex=",this.model.loadindex)
        this.view.updateProgress();
        if(this.model.isCompleted()){
            //加载完成了
            this._loadDone();
        }
    }
    //加载资源完成
    private _loadDone(){ 
            gameEntrys[this.model.gameCode].getInstance().registerModules(); 
            this.start_module(this.model.gameModuleName); 
    }
 
}
