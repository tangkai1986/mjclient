/*
author: YOYO
日期:2018-01-12 11:02:08
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import ShareMgr from "../../GameMgrs/ShareMgr";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import UserMgr from "../../GameMgrs/UserMgr";
import SwitchMgr from "../../GameMgrs/SwitchMgr";
import GoodsCfg from "../../CfgMgrs/GoodsCfg";
import RechargeMgr from "../../GameMgrs/RechargeMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_paymentCtrl;
//模型，数据处理
class Model extends BaseModel{
    public goodsId:number = null        //商品ID	
	constructor()
	{
        super();
    }   
    setGoodsId(goodsId){
        this.goodsId = goodsId;
    } 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_alipay:null,
		node_click:null,
		node_weChat:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
		this.ui.node_click = ctrl.node_click;
		this.ui.node_weChat = ctrl.node_weChat;
		this.ui.node_alipay = ctrl.node_alipay;
	}
}
//c, 控制
@ccclass
export default class Prefab_paymentCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property(cc.Node)
    node_weChat:cc.Node = null

    @property(cc.Node)
	node_alipay:cc.Node = null
	
    @property(cc.Node)
    node_click:cc.Node = null
    
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
		
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events={ 
           "EnterBackground":this.EnterBackground,
           "EnterForeground":this.EnterForeground,
       }
	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.node_weChat, this.node_weChat_cb, '点击微信支付')
        this.connect(G_UiType.image, this.node_alipay, this.node_alipay_cb, '点击支付宝支付')
        this.connect(G_UiType.image, this.node_click, this.node_close_cb, '点击关闭')
	}
	start () {
	}
	//网络事件回调begin	
	//end
	//全局事件回调begin
    EnterBackground(){ 
        console.log("EnterBackground",RechargeMgr.getInstance().getFromPayment());
    }
    EnterForeground(){
        if (RechargeMgr.getInstance().getFromPayment() == true) {
            UserMgr.getInstance().reqMyInfo();
            RechargeMgr.getInstance().setFromPayment(false);            
        }
        console.log("EnterForeground",RechargeMgr.getInstance().getFromPayment());
    }
	//end
    //按钮或任何控件操作的回调begin

    //获取点击的商品ID
    public setGoodsId(goodsId){
        this.model.setGoodsId(goodsId);
    }
    //点击关闭
    private node_close_cb(event){
        //console.log('node_close_cb')
        this.finish();
    }
    //点击微信支付
    private node_weChat_cb(event){

        RechargeMgr.getInstance().setFromPayment(true);
        //console.log('node_weChat_cb')
        if(this.model.goodsId == 0){
            cc.sys.openURL(`${RechargeMgr.getInstance().getGoodsList()[0].wechat_href}`);
            //console.log("weChat_href0",RechargeMgr.getInstance().getGoodsList()[0].wechat_href);                
        }else if(this.model.goodsId == 1){
            cc.sys.openURL(`${RechargeMgr.getInstance().getGoodsList()[1].wechat_href}`);
            //console.log("weChat_href1",RechargeMgr.getInstance().getGoodsList()[1].wechat_href);
        }else if(this.model.goodsId == 2){
            cc.sys.openURL(`${RechargeMgr.getInstance().getGoodsList()[2].wechat_href}`);
            //console.log("weChat_href2",RechargeMgr.getInstance().getGoodsList()[2].wechat_href);
        }       
        //console.log("weChat_goodsId",this.model.goodsId);
        this.finish();
    }
    //点击支付宝支付
    private node_alipay_cb(event){

        RechargeMgr.getInstance().setFromPayment(true);
        //console.log('node_alipay_cb')
        if(this.model.goodsId == 0){
            cc.sys.openURL(`${RechargeMgr.getInstance().getGoodsList()[0].alipay_href}`);
            //console.log("alipay_href0",RechargeMgr.getInstance().getGoodsList()[0].alipay_href);                
        }else if(this.model.goodsId == 1){
            cc.sys.openURL(`${RechargeMgr.getInstance().getGoodsList()[1].alipay_href}`);
            //console.log("alipay_href1",RechargeMgr.getInstance().getGoodsList()[1].alipay_href);
        }else if(this.model.goodsId == 2){
            cc.sys.openURL(`${RechargeMgr.getInstance().getGoodsList()[2].alipay_href}`);
            //console.log("alipay_href2",RechargeMgr.getInstance().getGoodsList()[2].alipay_href);
        }         
        //console.log("alipay_goodsId",this.model.goodsId);
        this.finish();
	}

	//end
}