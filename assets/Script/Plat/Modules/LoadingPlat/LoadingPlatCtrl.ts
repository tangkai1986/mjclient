/*
author: YOYO
日期:2018-01-10 15:18:02
*/
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BaseCtrl from "../../Libs/BaseCtrl";
import PlatMgr from "../../GameMgrs/PlatMgr";
import LoaderMgr from "../../../AppStart/AppMgrs/LoaderMgr";
import GameCateCfg from "../../CfgMgrs/GameCateCfg";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
import SubGameMgr from "../../GameMgrs/SubGameMgr";
import MahjongLoder from "../../GameMgrs/MahjongLoader";
import ChatFillterMgr from "../../GameMgrs/ChatFillterMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : LoadingPlatCtrl;
//模型，数据处理
class Model extends BaseModel{
    _curProgress:number = null                  //当前的进度
   _maxProgress:number = null                  //最大进度
     _oneResProgress:number = null               //单次资源加载花费的进度
    _curLoadingNum:number = null                //加载的资源数量

   _baseStr:string = null
    totalCount=100;
	constructor()
	{
        super();
        this._baseStr = 'load res: '
    }
    updateProcess(){
        this._curProgress++;
        if( this._curProgress>=100)
        {
            this._curProgress=100;
        }
    }
    //加载完成后的回调
    public initLoading (){
        this._curLoadingNum = 0;
    }

    //开始进度条
    public startProgress (){
        this._curProgress = 0;
        this._maxProgress = 100;
        this._oneResProgress = Math.floor(this._maxProgress/this._curLoadingNum);
    }
    //增加资源加载总量
    public addResNum (resNum:number = 1){
        this._curLoadingNum += resNum;
    }
    //完成一定数量的资源加载
    public doneLoadResNum (resNum:number = 1):Boolean{
        //console.log(this._curLoadingNum)
        this._curLoadingNum -= resNum;
        this._curProgress += this._oneResProgress;
        if(this._curLoadingNum < 1){
            this._curProgress = this._maxProgress;
            return true
        }
        return false
    }
    //获取单个资源加载的进度需求
    public getOneResProgress (){
        return this._oneResProgress;
    }
    //增加进度
    public addProgress (addValue:number){
        this._curProgress += addValue;
        this._curProgress = Math.min(this._curProgress, this._maxProgress);
    }
    //获取当前进度信息
    public getCurProgress ():number{
        return this._curProgress
    }
    //获取基础文字显示
    public getBaseStr (){
        return this._baseStr
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    ui={
        lab_progress : null,         //进度显示的label
        loading_jdt:null,            //进度条
        loading_jinduguang:null,    //进度光
        loading_jdtpercent:null,    //进度百分比label
        btn_ok:null, 
        panel_tip:null,
    }
    node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.updateProcess();
	}
	//初始化ui
	initUi()
	{
        //this.ui.lab_progress = ctrl.lab_progress;
        this.ui.loading_jdt = ctrl.loading_jdt;
        this.ui.loading_jinduguang = ctrl.loading_jinduguang;
        this.ui.loading_jdtpercent = ctrl.loading_jdtpercent;
        this.ui.btn_ok=ctrl.btn_ok; 
        this.ui.panel_tip=ctrl.panel_tip; 
    }
    //更新进度条表现 
    showGamesPackErr(){
        this.ui.panel_tip.active=true;
    }
    updateProcess(){
        this.ui.loading_jinduguang.x = -445+920*this.model._curProgress/100;                               //调整进度光的位置
        this.ui.loading_jdt.width = 920*this.model._curProgress/100;                                  //调整进度条的宽度
        this.ui.loading_jdtpercent.string = `${this.model._curProgress}%`;                       //调整进度的百分比
    }
}
//c, 控制
@ccclass
export default class LoadingPlatCtrl extends BaseCtrl {
    //这边去声明ui组件
    // @property(cc.Label)
    // lab_progress:cc.Label = null

    @property(cc.Node)
    loading_jdt:cc.Node = null; 

    @property(cc.Node)
    loading_jinduguang:cc.Node = null; 

    @property(cc.Label)
    loading_jdtpercent:cc.Label = null; 

    
    @property(cc.Node)
    panel_tip:cc.Node = null; 

    
    @property(cc.Button)
    btn_ok:cc.Button = null; 
 
    private timer=null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离 

	onLoad (){
        LoaderMgr.getInstance().releaseAll();
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
        this.initMvc(Model,View);
        this.startTimer();
    }
    startTimer(){
        if(this.timer)
        {
            return
        }
        this.timer=setInterval(()=>{
            this.model.updateProcess();
            this.view.updateProcess();
        },10)
    }
    clearTimer(){ 
        if(this.timer)
        {
            clearInterval(this.timer)
            this.timer=null; 
        }
    }
    onDestroy(){
        this.clearTimer()
        super.onDestroy()
        PlatMgr.getInstance().unRegisterCb();
    }
	//定义网络事件
	defineNetEvents()
	{
	}
	//定义全局事件
	defineGlobalEvents()
	{

    }
    //确定按钮
    btn_ok_cb()
    {
        this.reqRemoteGamesPackInfo();
    }    
	//绑定操作的回调
	connectUi()
	{
        let self=this;
        this.ui.btn_ok.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            self.btn_ok_cb();
        }, this) 
	} 
	start () {  
        MahjongLoder.getInstance().loadRes(()=>{ 
            PlatMgr.getInstance().initPlat(this.completePlatInitCb.bind(this));  
        })
        //开始先加载麻将资源
        if (this.isIPhoneX()) {
            this.resetDesignResolution(this.node.getComponent(cc.Canvas))
        }
    } 
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
    //end 
    reqRemoteGamesPackCb(ret){
        if(ret==0)
        {
            if (cc.sys.isNative)
            {
                G_PLATFORM.startLocation(0);
            }
            //每次登录到大厅就拉取定位 
            this.start_module(G_MODULE.Plaza);
        }
        else
        {
            this.view.showGamesPackErr();
        }
    }
    reqRemoteGamesPackInfo(){
        this.ui.panel_tip.active=false;
        //获取远程子游戏包信息
        SubGameMgr.getInstance().getRemoteGamesPackInfo(this.reqRemoteGamesPackCb.bind(this))
    }
    completePlatInitCb()
    { 
        //最后根据本地配置的游戏包配置去刷新游戏
        //初始化屏蔽词库
        ChatFillterMgr.getInstance().initFilterWords();
        GameCateCfg.getInstance().refreshGames();
        this.clearTimer();
        this.model._curProgress=100;
        this.view.updateProcess(); 
        if (ServerMgr.getInstance().isEnableHotUpdate()) 
        {  
            this.reqRemoteGamesPackInfo();
        } 
        else
        {
            if (cc.sys.isNative)
            {
                G_PLATFORM.startLocation(0);
            }
            //每次登录到大厅就拉取定位
            this.start_module(G_MODULE.Plaza); 
        }
    }
}
