/*
author: JACKY
日期:2018-01-10 17:16:06
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import RoomMgr from "../../GameMgrs/RoomMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import Prefab_shopCtrl from "../Shop/Prefab_shopCtrl";
import UserMgr from "../../GameMgrs/UserMgr";
import UiMgr from "../../GameMgrs/UiMgr";
import Prefab_TaskPanelCtrl from "../Task/Prefab_TaskPanelCtrl";
import LoginMgr from "../../GameMgrs/LoginMgr";
import SwitchMgr from "../../GameMgrs/SwitchMgr"; 
import LocalStorage from "../../Libs/LocalStorage";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : NodeTopCtrl;
//模型，数据处理
class Model extends BaseModel{ 
    myinfo=null;
    public isGetReward = null;
    public invitationCode = null;
    public promotersId = null;
    public bingAccount = null;
    public luckyDrawSwitch = null;
    constructor()
	{
		super();
        //在这边去获取数据层的数据
        this.myinfo=UserMgr.getInstance().getMyInfo();
        this.isGetReward = this.myinfo.is_get_reward;
        this.invitationCode = this.myinfo.invitation_code;
        this.promotersId = this.myinfo.promoters_id;
        this.bingAccount = SwitchMgr.getInstance().get_switch_bing_account();
        this.luckyDrawSwitch = SwitchMgr.getInstance().get_switch_luck_draw();
    } 
    updateMyInfo()
    {
        this.myinfo=UserMgr.getInstance().getMyInfo();
        console.log("this.model.myinfo.headurl",this.myinfo.headurl);
        
        this.isGetReward = this.myinfo.is_get_reward;
        this.invitationCode = this.myinfo.invitation_code;
        this.promotersId = this.myinfo.promoters_id;
        this.myinfo.idstatus = this.myinfo.idstatus?this.myinfo.idstatus:1;
        //console.log("我的数据是",this.myinfo)
    }
    updateSwitch(msg){
        this.bingAccount = msg.cfg.switch_bing_account;
        this.luckyDrawSwitch = msg.cfg.switch_luck_draw;
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        sprite_head : null,              //头像图片
        lab_name : null,                 //名字
        lab_id : null,                   //id
        lab_diamonds: null,              //右边金钱
        node_clickBindAgent:null,        //绑定代理
        node_clickSafety:null,           //安全认证
        node_clickRealName:null,         //实名认证
        node_clickFirstCharge:null,      //首充按钮
        node_luckyDraw:null,             //大转盘按钮
        node_setting:null,               //大厅设置
        node_clickHead:null,
        node_clickRightMoney:null,
	};
	constructor(model){
		super(model);
        this.node=ctrl.node;
        this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.ui.node_clickHead = ctrl.node_clickHead;
        this.ui.node_clickRightMoney = ctrl.node_clickRightMoney;
		this.ui.sprite_head = ctrl.sprite_head;
		this.ui.lab_name = ctrl.lab_name;
        this.ui.lab_id = ctrl.lab_id;
        this.ui.lab_diamonds = ctrl.lab_diamonds;
        this.ui.node_clickBindAgent = ctrl.node_clickBindAgent;
        this.ui.node_clickSafety = ctrl.node_clickSafety;
        this.ui.node_clickRealName = ctrl.node_clickRealName;
        this.ui.node_clickFirstCharge = ctrl.node_clickFirstCharge;
        this.ui.node_luckyDraw = ctrl.node_luckyDraw;
        this.ui.node_setting = ctrl.node_setting;
        this.ui.node_clickFirstCharge.active = false;//初始化按钮
        this.ui.node_clickSafety.active=true;
        this.ui.node_clickBindAgent.active = false;
        this.ui.node_luckyDraw.active = true;
        this.ui.node_setting.active = true;
        //this.updateFirstCharge();
        this.updataIdstatus();
        this.updateAgent();

    }
    updateMyInfo()
    {       
        this.updateName();
        this.updateID();
        this.updateDiamonds();
        this.updateHead();
        //this.updateFirstCharge();
        this.initUserNickName();
        this.updataIdstatus();
        this.updateAgent();
        //this.ui.node_clickSafety.active=this.model.myinfo.phone.length<=0;
        this.showButton();
    }
    //初始化用户昵称
    public initUserNickName(){
        if(this.model.myinfo.plat ==1){
            this.model.myinfo.nickname = "游客"+this.model.myinfo.nickname;
            this.ui.lab_name.string = this.model.myinfo.nickname.substring(0,6);
            //随机头像
            //this.updateHead();
        }
        else if(this.model.myinfo.plat == 2){
            this.model.headurl = this.model.myinfo.headurl; //换微信头像
            this.updateHead();
        }
    }
    //更新头像图片
    public updateHead (){
        //let headSpriteUrl   =  null;
        //headSpriteUrl = LocalStorage.getInstance().getData("wechatImg");
        UiMgr.getInstance().setUserHead(this.ui.sprite_head.node, this.model.myinfo.headid, this.model.myinfo.headurl); 
    }
    //名字
    public updateName(){
        //去读玩家的微信昵称并刷新        
        this.ui.lab_name.string = this.model.myinfo.nickname.substring(0,6);
    }
    //id
    public updateID(){
        this.ui.lab_id.string = "ID:"+this.model.myinfo.logicid
    }
    //右边金钱
    public updateDiamonds(){
        this.ui.lab_diamonds.string = this.model.myinfo.gold;
    }
    //更新首冲:未领取过奖励的显示首冲按钮，否则隐藏
    // public updateFirstCharge(){
    //     this.ui.node_clickFirstCharge.active = this.model.isGetReward?false:true;
    // }
    public updataIdstatus(){
        this.ui.node_clickRealName.active = this.model.myinfo.idstatus==2?false:true;
    }
    //更新绑定代理按钮
    public updateAgent(){
        this.model.updateMyInfo();
        if(this.model.invitationCode && this.model.promotersId){
            this.ui.node_clickBindAgent.active = false;
            return
        }
        this.ui.node_clickBindAgent.active = false
    }
    //开关
    public showButton(){
        this.ui.node_luckyDraw.active = this.model.luckyDrawSwitch == 1?true:false;
        if(this.model.myinfo.phone.length>0){
            return
        }
        // this.ui.node_clickSafety.active = this.model.bingAccount == 1?true:false;
    }
}
//c, 控制
@ccclass
export default class NodeTopCtrl extends BaseControl {
	//这边去声明ui组件
    @property(cc.Node)
    node_clickHead:cc.Node = null;
    
    @property(cc.Node)
    node_clickRightMoney:cc.Node = null;
    
    @property(cc.Sprite)
    sprite_head:cc.Sprite = null

    @property(cc.Label)
	lab_name:cc.Label = null;

    @property(cc.Label)
	lab_id:cc.Label = null;
	
	@property(cc.Label)
    lab_diamonds:cc.Label = null;

    @property(cc.Node)
    node_clickBindAgent:cc.Node = null;
    
    @property(cc.Node)
    node_clickSafety:cc.Node = null;

    @property(cc.Node)
    node_clickRealName:cc.Node = null;

    @property(cc.Node)
    node_luckyDraw:cc.Node = null;

    @property(cc.Node)
    node_clickFirstCharge:cc.Node = null;

    @property(cc.Node)
    node_setting:cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
        this.initMvc(Model,View);
        
        this.model.updateMyInfo();
        this.view.updateMyInfo();
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {
            'http.reqMyInfo' : this.http_reqMyInfo,
            'http.reqGetRelief':this.http_reqGetRelief,
            'http.ReqIdCardRegistration' : this.http_ReqIdCardRegistration,
            'http.reqGameSwitch':this.http_reqGameSwitch,
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{
        
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.button,this.ui.node_clickHead,this._onclick_head,"点击头像");
		this.connect(G_UiType.button,this.ui.node_clickRightMoney,this._onclick_rightMoney,"点击右边金钱");
		this.connect(G_UiType.button,this.ui.node_clickBindAgent,this._onclick_bindAgent,"点击绑定代理");
		this.connect(G_UiType.button,this.ui.node_clickSafety,this._onclick_safety,"点击安全认证");
		this.connect(G_UiType.button,this.ui.node_clickRealName,this._onclick_realName,"点击实名认证");
        this.connect(G_UiType.button,this.ui.node_clickFirstCharge,this._onclick_firstRecharge,"点击首充按钮");
        this.connect(G_UiType.button,this.ui.node_luckyDraw,this._onclick_luckyDraw,'点击大转盘抽奖');
        this.connect(G_UiType.button,this.ui.node_setting,this._onclick_setting,'点击大厅设置');
	}
	start () { 
	}
    //网络事件回调begin
    //玩家信息更新
    private http_reqMyInfo (msg){
        this.model.updateMyInfo();
        this.view.updateMyInfo();
    }
    private http_reqGetRelief(msg)
    {
        this.model.updateMyInfo();
        this.view.updateMyInfo();
    }
    private http_reqGameSwitch(msg){
        this.model.updateSwitch(msg);
        this.view.showButton();
    }
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
    private _onclick_head (event){ 
        this.start_sub_module(G_MODULE.PlayerDetail);
    }
    private _onclick_rightMoney (event){
        //console.log('_onclick_rightMoney')
        this.start_sub_module(G_MODULE.Shop);
	}
    private _onclick_bindAgent (event) {
        this.start_sub_module(G_MODULE.Shared);
        //this.start_sub_module(G_MODULE.bindAgent);
    }
    private _onclick_safety (event) {
        this.start_sub_module(G_MODULE.CustomService);
        //this.start_sub_module(G_MODULE.bingPhone);
    }
    private _onclick_realName (event) {
        this.start_sub_module(G_MODULE.shimingRenZheng);
    }
    private _onclick_firstRecharge (event) {
        // this.start_sub_module(G_MODULE.Task)
        this.start_sub_module(G_MODULE.Task, (uiComp:Prefab_TaskPanelCtrl)=>{
            uiComp.setFirstRecharge();
        }, 'Prefab_TaskPanelCtrl');
    }
    private _onclick_luckyDraw(){
        this.start_sub_module(G_MODULE.LuckDraw);
    }
    private _onclick_setting(){
        this.start_sub_module(G_MODULE.PlazaSetting);
    }
    http_ReqIdCardRegistration()
    {
        this.ui.node_clickRealName.active = false;
    }
	//end
}
