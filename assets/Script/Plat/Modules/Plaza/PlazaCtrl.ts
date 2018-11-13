//大厅控制管理
import BaseModel from "../../Libs/BaseModel";
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import PlatMgr from "../../GameMgrs/PlatMgr";
import UserMgr from "../../GameMgrs/UserMgr";
import ClubMgr from "../../GameMgrs/ClubMgr";
import GpsSdkMgr from "../../SdkMgrs/GpsSdk";
import ClubChatMgr from "../../GameMgrs/ClubChatMgr";
import ShareMgr from "../../GameMgrs/ShareMgr"; 
import RoomMgr from "../../GameMgrs/RoomMgr";
import SwitchMgr from "../../GameMgrs/SwitchMgr";
import Prefab_RoomRuleCtrl from "../CreateRoom/Prefab_RoomRuleCtrl";
import GameAudioCfg from "../../CfgMgrs/GameAudioCfg";
import AudioMgr from "../../GameMgrs/AudioMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import MarqueMgr from "../../GameMgrs/MarqueMgr";
import PointMgr from "../../GameMgrs/PointMgr";
import RechargeMgr from "../../GameMgrs/RechargeMgr";
import NotifyMgr from "../../GameMgrs/NotifyMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : PlazaCtrl;
//模型，数据处理
class Model extends BaseModel{
	public announceSwitch = null;
	public clipboardText = "";
	public isLoadingGame=false;
	constructor()
	{
		super();
		this.announceSwitch = SwitchMgr.getInstance().get_switch_notice();
		ShareMgr.getInstance().sendReqCheckDailyShare();
	}
	updateSwitch(msg){
		this.announceSwitch = msg.cfg.switch_notice;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
    ui={
        prefab_Background : ctrl.Prefab_Background,
        prefab_Button_middle : ctrl.Prefab_Button_middle,
        prefab_Down_infoumation : ctrl.Prefab_Down_infoumation,
        prefab_Rank_list : ctrl.Prefab_Rank_list,
        prefab_The_announcement : ctrl.Prefab_The_announcement,
        prefab_Up_information : ctrl.Prefab_Up_information
    };
	//初始化ui
	initUi()
	{
        this.addPrefabNode(this.ui.prefab_Background);
        this.addPrefabNode(this.ui.prefab_Button_middle);
		this.addPrefabNode(this.ui.prefab_Down_infoumation);
		//注释排行榜，后续开启
        //this.addPrefabNode(this.ui.prefab_Rank_list);
        this.addPrefabNode(this.ui.prefab_The_announcement);
        this.addPrefabNode(this.ui.prefab_Up_information);
	}
}
//c, 控制
@ccclass
export default class PlazaCtrl extends BaseCtrl {
    //这边去声明ui组件
	@property(cc.Prefab)
	Prefab_Background:cc.Prefab = null;

	@property(cc.Prefab)
	Prefab_Button_middle:cc.Prefab = null;

	@property(cc.Prefab)
	Prefab_Down_infoumation:cc.Prefab = null;

	@property(cc.Prefab)
	Prefab_Rank_list:cc.Prefab = null;

	@property(cc.Prefab)
	Prefab_The_announcement:cc.Prefab = null;

	@property(cc.Prefab)
	Prefab_Up_information:cc.Prefab = null;
	
    private bShowExitDlg=false;//显示退出对话框
	//声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){ 
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
		// let randomIdx = Math.round(cc.random0To1()+1);
		// AudioMgr.getInstance().play(`背景音乐${randomIdx}`);
		AudioMgr.getInstance().play(`背景音乐1`);
		//客户端进入大厅数据统计
		PointMgr.getInstance().enterHallPoint(); 
	}
	onDestroy(){
		super.onDestroy(); 
	}
	//定义网络事件
	defineNetEvents()
	{ 
        this.n_events = {
			'http.reqMyRoomState':this.http_reqMyRoomState,   
			'connector.entryHandler.enterPlat':this.connector_entryHandler_enterPlat,
			'connector.entryHandler.enterGameSvr':this.connector_entryHandler_enterGameSvr,
			'http.reqGameSwitch':this.http_reqGameSwitch,
			'http.reqFangKaCfg':this.http_reqFangKaCfg,
    	}
	} 
	//在大厅中就可以加载基本信息确保房间恢复
    connector_entryHandler_enterPlat(){  
	}
	connector_entryHandler_enterGameSvr(msg)
	{ 
		if(this.model.isLoadingGame)
		{ 
			return;
		}
		AudioMgr.getInstance().stopbackgroudMusic();
		this.start_sub_module(G_MODULE.LoadingGame)
		this.model.isLoadingGame=true;
	} 
    EnterBackground () { 
	}
    EnterForeground () {
        let password = this.getRoomPassword();
        //console.log("剪切板是否有 password?", password);
		if (password) RoomMgr.getInstance().reqFangKaCfg(password);
		//获取茶馆讯息
		ClubMgr.getInstance().reqClubList();
		ShareMgr.getInstance().sendReqCheckDailyShare();
	}
	http_reqMyRoomState(msg)
	{
		if (cc.sys.isNative)
			this.model.clipboardText = G_PLATFORM.gainToClipboard();
		if(!msg.roomUserInfo)
		{
			let password = this.getRoomPassword();
			//console.log("剪切板是否有 password?", password);
			if (password) {
                RoomMgr.getInstance().reqFangKaCfg(password);
				return
			}
			let clubid=this.getClubId(); 
			if (clubid) {
				//加入申请进入茶馆
				ClubMgr.getInstance().reqClubApplyJoin(Number(clubid));
				return
			}
		}
		//如果还没显示大转盘就显示大转盘
		if(PlatMgr.getInstance().isAutoShowAd()&&SwitchMgr.getInstance().get_switch_luck_draw()==1) { 
			//一进大厅后弹出公告改为大转盘，客户和西丹确认后结果
			this.start_sub_module(G_MODULE.LuckDraw);
			PlatMgr.getInstance().disableAutoShowAd();
		}
	}
	// 获取设备剪切板的 RoomPassword
	getRoomPassword () {
    	if (!cc.sys.isNative) return null;
        //console.log("设备剪切板字符串:", this.model.clipboardText);
        let password = null;
        try {
            let obj = this.model.clipboardText && JSON.parse(this.model.clipboardText);
            if (obj && obj.password && obj.password.length==6) {
                password = obj.password;
			}
		}catch (e) {
        	//console.log("剪切板字符串转 JSON 失败",e)
		}
		return password;
	}
	getClubId(){
    	if (!cc.sys.isNative) return null;
        //console.log("设备剪切板字符串:", this.model.clipboardText);
        let clubid = null;
        try {
            let obj = this.model.clipboardText && JSON.parse(this.model.clipboardText);
            if (obj && obj.clubid) {
                clubid = obj.clubid;
			}
		}catch (e) {
        	//console.log("剪切板字符串转 JSON 失败",e)
		}
		return clubid;
	}
    http_reqFangKaCfg () {
    	// 加入房间界面存在的时候不做处理
		//if (this.node.parent.getChildByName("Prefab_JoinRoom")) return;
		//if (this.node.parent.getChildByName("Prefab_LoadingGame")) return;
        // this.start_sub_module(G_MODULE.GameRoomRule, (uiRoom:Prefab_RoomRuleCtrl)=>{
        //     uiRoom.OpenAddGrayLayer();
        //     uiRoom.openCloseBtn();
        // }, "Prefab_RoomRuleCtrl");
	}
	http_reqGameSwitch(msg){
		this.model.updateSwitch(msg)
	}
	//定义全局事件
	defineGlobalEvents()
	{ 
		//全局消息
		this.g_events={
			'backPressed':this.backPressed,
			'onGainToClipboard':this.http_reqMyRoomState,
			'EnterBackground': this.EnterBackground,
			'EnterForeground': this.EnterForeground, 
		} 
	}
	exitGameCb(){
		cc.game.end();
	}
	cancelExitCb(){
	    this.bShowExitDlg=false;
	}
	//返回键
	backPressed()
	{ 
		if(this.bShowExitDlg)
		{
			return;
		}
		FrameMgr.getInstance().showDialog("确定离开",this.exitGameCb.bind(this), "系统提示",this.cancelExitCb.bind(this));
	    this.bShowExitDlg=true;
	}
	//绑定操作的回调
	connectUi()
	{
	} 
	start () { 
        if (this.isIPhoneX()) {
            this.resetDesignResolution(this.node.getComponent(cc.Canvas))
        }
		RoomMgr.getInstance().reqMyRoomState();//获取我的房间状态 
		NotifyMgr.getInstance().refreshNotifies();//在这里重新请求房间内收到的推送
	}
	//网络事件回调begin
 
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    
}
	
	

	
