/*
author: YOYO
日期:2018-01-12 11:31:32
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import Prefab_shopItemCtrl from "./Prefab_shopItemCtrl";
import Prefab_shopDetailCtrl from "./Prefab_shopDetailCtrl";
import GoodsCfg from "../../CfgMgrs/GoodsCfg";
import UserMgr from "../../GameMgrs/UserMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import RechargeMgr from "../../GameMgrs/RechargeMgr";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
const STR_BtnIndex = '_btnIndex';
const STR_ItemInfo = '_itemInfo';
const BUY_TYPE = cc.Enum({
    buyCoin:0,
    buyGold:1
})

let ctrl : Prefab_shopCtrl;
//模型，数据处理
class Model extends BaseModel{
    public myinfo=null;
    public infoList=null;
	constructor()
	{
        super();
        this.updateMyInfo();
        this.infoList = RechargeMgr.getInstance().getGoodsList();
    }
    //更新我的信息
    updateMyInfo()
    {
        this.myinfo=UserMgr.getInstance().getMyInfo();
    }   
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
     //格子容器相关
     private _showItemNum:number = null
     private _itemHeight:number = null
     private _itemWidth:number = null
     private _itemOffX:number = null
     private _itemOffY:number = null
     private _startPosX:number = null
     private _clickType:number = null
     private _lineNum:number = null
     private _addRecord = null
	ui={
        //在这里声明ui
        node_leftBtns:null,                         //左边的按钮父节点
        node_goldList:null,                         //钻石列表容器
        node_coinList:null,                         //金币列表容器
        node_goldContent:null,                      //钻石容器
        node_coinContent:null,                      //金币容器
        lab_money1:null,                            //金钱1
        lab_money2:null,                            //钻石
        lab_money3:null,                            //金钱3
        prefab_item:null,                            //
        prefab_itemDetail:null,
        node_close:null,
        node_btn_record:null,
        node_btn_bag:null,
        prefab_loading:null,
        node_loading:null,
        node_btn_bindagent:null,
        node_btn_applyAgent:null,
	};
    node:cc.Node=null;
	constructor(model){
        super(model);
        this._lineNum = 4;
        this._itemOffX = 30;
        this._itemOffY = 20;
        this._showItemNum = 0;
        this._addRecord = new Array(false, false);
		this.node=ctrl.node;
        this.initUi();
        this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
        this.ui.node_leftBtns = ctrl.node_leftBtns;
        this.ui.node_goldList = ctrl.node_goldList;
        this.ui.node_coinList = ctrl.node_coinList;
        this.ui.node_goldContent = ctrl.node_goldContent;
        this.ui.node_coinContent = ctrl.node_coinContent;
        this.ui.lab_money1 = ctrl.lab_money1;
        this.ui.lab_money2 = ctrl.lab_money2;
        this.ui.lab_money3 = ctrl.lab_money3;
        this.ui.prefab_item = ctrl.prefab_item;
        this.ui.prefab_itemDetail = ctrl.prefab_itemDetail;
        this.ui.node_close = ctrl.node_close;
        this.ui.node_btn_record = ctrl.node_btn_record;
        this.ui.node_btn_bag = ctrl.node_btn_bag;
        this.ui.prefab_loading = ctrl.prefab_loading;
        this.ui.node_btn_bindagent = ctrl.node_btn_bindagent;
        this.ui.node_btn_applyAgent = ctrl.node_btn_applyAgent;
        this.initGoods();
        
        this.updateMyInfo();

        this.initLoading();
    }

    updateMyInfo()
    {
        this.updateMoney2();
    }
    
    //刷新钻石信息
    public updateMoney2(){
        this.ui.lab_money2.string = this.model.myinfo.gold;
    }

    public initGoods(){
        for (let i = 0; i < this.model.infoList.length; i++) {
            BehaviorMgr.getInstance().setGoodsItemData(i, "gold");
            BehaviorMgr.getInstance().setGoodsBuyData(i+1,"gold");
            let curNode: cc.Node = cc.instantiate(this.ui.prefab_item);
            curNode.parent = this.ui.node_goldContent;
            curNode.getComponent('Prefab_shopItemCtrl').updateNowBuyMoney(this.model.infoList[i].now_money);
        }
        //console.log("infoList", this.model.infoList.length,this.model.infoList);
    }
    //商城独有的loading界面
    public popLoading(){
        if (this.ui.node_loading != null){
            let prefabcomp = this.ui.node_loading.getComponent(this.ui.node_loading.name)
            prefabcomp.updateJuHua(false);
        }
    }
    public showLoading(){
        if (this.ui.node_loading != null){
            let prefabcomp = this.ui.node_loading.getComponent(this.ui.node_loading.name)
            prefabcomp.updateJuHua(true);
        }
    }
    public initLoading(){
        if (this.ui.node_loading == null){
            this.ui.node_loading = cc.instantiate(this.ui.prefab_loading);
            this.ui.node_loading.parent = this.node;
            this.ui.node_loading.position = cc.p(0, 0);
        }
    }
}
//c, 控制
@ccclass
export default class Prefab_shopCtrl extends BaseCtrl {
	//这边去声明ui组件

    @property(cc.Label)
    lab_money1:cc.Label = null

    @property(cc.Label)
    lab_money2:cc.Label = null

    @property(cc.Label)
    lab_money3:cc.Label = null

    @property(cc.Node)
    node_leftBtns:cc.Node = null

    @property(cc.Node)
    node_btn_record:cc.Node = null

    @property(cc.Node)
    node_goldList:cc.Node = null

    @property(cc.Node)
    node_coinList:cc.Node = null

    @property(cc.Node)
    node_goldContent:cc.Node = null

    @property(cc.Node)
    node_coinContent:cc.Node = null

    @property(cc.Prefab)
    prefab_item:cc.Prefab = null

    @property(cc.Node)
    node_close:cc.Node = null

    @property(cc.Node)
    node_btn_bag:cc.Node = null

    @property(cc.Node)
    node_btn_bindagent:cc.Node = null

    @property(cc.Prefab)
    prefab_itemDetail:cc.Prefab = null

    @property(cc.Prefab)
    prefab_loading:cc.Prefab = null
    @property(cc.Node)
    node_btn_applyAgent:cc.Node = null


	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {
            'http.reqMyInfo' : this.http_reqMyInfo,

        }
	}
	//定义全局事件
	defineGlobalEvents()
	{
	        this.g_events = {
	            apple_receipt:this.apple_receipt,
	        }
	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.button, this.ui.node_btn_record, this.node_btn_record_cb, '点击前往充值记录')
        this.connect(G_UiType.button, this.ui.node_close, this.node_close_cb, '点击关闭')
        this.connect(G_UiType.button, this.ui.node_btn_bag, this.node_btn_bag_cb, '点击前往背包')
        this.connect(G_UiType.button,this.ui.node_btn_bindagent,this.btn_bindagentCb,"点击登录管理")       
        this.connect(G_UiType.button,this.ui.node_btn_applyAgent,this.node_btnapplyAgentCb,"点击申请代理")     
	}
	start () {
	}
    private btn_bindagentCb()
    {
        // this.start_sub_module(G_MODULE.bindAgent);
        cc.sys.openURL('http://gme.fj116.com/agent/login.html');
    }
    //网络事件回调begin
    //玩家信息更新
    private http_reqMyInfo (msg){
        this.model.updateMyInfo();
        this.view.updateMyInfo();
    }
    private apple_receipt (msg){
        //console.log("apple_receipt");
        if (msg.state){
            this.view.showLoading();
        }else{
            this.view.popLoading();
        }
    }
    
    //点击充值记录
    private node_btn_record_cb(node){
        //console.log('node_btn_record_cb')
        this.start_sub_module(G_MODULE.RechargeRecord);
    }
    //点击关闭
    private node_close_cb(node){
        //console.log('node_close_cb')
        this.finish();
    }
    //背包
    private node_btn_bag_cb(){
        this.start_sub_module(G_MODULE.Bag);
    }
    private node_btnapplyAgentCb()
    {
        cc.sys.openURL('http://gme.fj116.com/agent/Agentapply/agentApply.html');
    }

	//end
}