/*
author: YOYO
日期:2018-01-13 11:24:10
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UserMgr from "../../GameMgrs/UserMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import GoodsCfg from "../../CfgMgrs/GoodsCfg";
import RechargeMgr from "../../GameMgrs/RechargeMgr";
import SwitchMgr from "../../GameMgrs/SwitchMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_shopDetailCtrl;
//模型，数据处理
class Model extends BaseModel{
    public m_type:string = null
    public m_goodsId:number = null
    public m_Name:string = null
    public m_Explain:string = null
    public m_lastMoney:number = null
    public m_nowMoney:number = null
    public m_leaveNum:number = null
    public m_price:number = null
    public m_buyNum:number = null
	constructor()
	{
        super();

        let infoList = null;
        var buy_data = BehaviorMgr.getInstance().getGoodsBuyData();

        this.m_goodsId = buy_data[0];
        this.m_type = buy_data[1];

        if (this.m_type == "coin"){
            infoList = GoodsCfg.getInstance().getCoinCfg();
        }else if (this.m_type == "gold"){
            infoList = GoodsCfg.getInstance().getGoldCfg();
        }
        var infoObj = infoList[this.m_goodsId];
        this.m_Name = infoObj.name;
        this.m_Explain = infoObj.explain
        this.m_lastMoney = infoObj.oprice;
        this.m_nowMoney = infoObj.price;
        this.m_leaveNum = infoObj.amount;
        this.m_price = infoObj.price;

        this.m_buyNum = 1;
    }
    public getTotalPrice(){
        if (this.m_nowMoney == null) return 0
        return this.m_buyNum * this.m_nowMoney
    }
    public addToBuyNum(toNum:number = 1){
        this.m_buyNum += toNum;
        this.m_buyNum = Math.min(this.m_buyNum, 99);
    }
    public delToBuyNum(delNum:number = 1){
        this.m_buyNum -= delNum;
        this.m_buyNum = Math.max(this.m_buyNum, 0);
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        sprite_money:null,
        lab_moneyName:null,
        lab_leaveNum:null,
        lab_lastMoney:null,
        lab_nowMoney:null,
        lab_detail:null,
        lab_buyNum:null,
        lab_totalPrice:null,
        spriteFrame_jewel:null,
        btn_buy:null,
        node_btnNum:null,
        node_btn_add:null,
        node_btn_del:null,
        node_close:null
	};
    node=null;
    private _spriteFrame_gold:cc.SpriteFrame = null
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
        this.ui.sprite_money = ctrl.sprite_money;
        this.ui.lab_moneyName = ctrl.lab_moneyName;
        this.ui.lab_leaveNum = ctrl.lab_leaveNum;
        this.ui.lab_lastMoney = ctrl.lab_lastMoney;
        this.ui.lab_nowMoney = ctrl.lab_nowMoney;
        this.ui.lab_detail = ctrl.lab_detail;
        this.ui.lab_buyNum = ctrl.lab_buyNum;
        this.ui.lab_totalPrice = ctrl.lab_totalPrice;
        this.ui.spriteFrame_jewel = ctrl.spriteFrame_jewel;
        this.ui.btn_buy = ctrl.btn_buy;
        this.ui.node_close = ctrl.node_close;
        this.ui.node_btnNum = ctrl.node_btnNum;
        this.ui.node_btn_add = ctrl.node_btn_add;
        this.ui.node_btn_del = ctrl.node_btn_del;

        
        this.showJewelImg();
        this.updateMoneyName();
        this.updateLeaveNum();
        this.updateLastMoney();
        this.updateNowMoney();
        this.updateItemDetail();
        this.updateToBuyNum();
        this.updateTotalPrive();

        if(this.model.m_type == 'coin') this.showGoldImg();
        else this.showJewelImg();
    }
    public showGoldImg (){
        if(this._spriteFrame_gold){
            this.ui.sprite_money.spriteFrame = this._spriteFrame_gold;
        }
        this.ui.node_btnNum.active = true;
    }
    public showJewelImg (){
        if(!this._spriteFrame_gold){
            this._spriteFrame_gold = this.ui.sprite_money.spriteFrame;
        }
        this.ui.sprite_money.spriteFrame = this.ui.spriteFrame_jewel;
        this.ui.node_btnNum.active = false;
    }
    public updateMoneyName(){
        this.ui.lab_moneyName.string = this.model.m_Name;
    }
    public updateLeaveNum(){
        this.ui.lab_leaveNum.string = this.model.m_leaveNum;
    }
    public updateLastMoney(){
        this.ui.lab_lastMoney.string = this.model.m_lastMoney;
    }
    public updateNowMoney(){
        this.ui.lab_nowMoney.string = this.model.m_nowMoney;
    }
    public updateItemDetail(){
        this.ui.lab_detail.string = this.model.m_Explain;
    }
    public updateToBuyNum(){
        this.ui.lab_buyNum.string = this.model.m_buyNum;
        this.updateTotalPrive();
    }
    public updateTotalPrive(){
        this.ui.lab_totalPrice.string = this.model.getTotalPrice();
    }
}
//c, 控制
@ccclass
export default class Prefab_shopDetailCtrl extends BaseCtrl {
	//这边去声明ui组件

    @property(cc.Sprite)
    sprite_money:cc.Sprite = null

    @property(cc.Node)
    node_btn_add:cc.Node = null

    @property(cc.Node)
    node_btn_del:cc.Node = null

    @property(cc.Label)
    lab_moneyName:cc.Label = null

    @property(cc.Label)
    lab_leaveNum:cc.Label = null

    @property(cc.Label)
    lab_lastMoney:cc.Label = null

    @property(cc.Label)
    lab_nowMoney:cc.Label = null

    @property(cc.Label)
    lab_detail:cc.Label = null

    @property(cc.Label)
    lab_buyNum:cc.Label = null

    @property(cc.Label)
    lab_totalPrice:cc.Label = null

    @property(cc.SpriteFrame)
    spriteFrame_jewel:cc.SpriteFrame = null

    @property(cc.Node)
    btn_buy:cc.Node = null

    @property(cc.Node)
    node_close:cc.Node = null
    
    @property(cc.Node)
    node_btnNum:cc.Node = null

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
	}
    //网络事件回调begin
	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {
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
        this.connect(G_UiType.image, this.ui.node_btn_add, this.node_btn_add_cb, '点击增加')
        this.connect(G_UiType.image, this.ui.node_btn_del, this.node_btn_del_cb, '点击减少')
        this.connect(G_UiType.image, this.ui.node_close, this.node_close_cb, '点击关闭')
        this.connect(G_UiType.image, this.ui.btn_buy, this.btn_buy_cb, '点击购买')
    }

	start () {
	}
    //网络事件回调begin
    private http_reqGameSwitch(msg){
        this.model.updateSwtich(msg)
    }
	//end
	//全局事件回调begin
    //end
    
    public setInfo (infoObj){
    }

    //按钮或任何控件操作的回调begin
    private node_btn_add_cb(){
        //console.log('node_btn_add_cb')
        this.model.addToBuyNum();
        this.view.updateToBuyNum();
    }
    private node_btn_del_cb(){
        //console.log('node_btn_del_cb')
        this.model.delToBuyNum();
        this.view.updateToBuyNum();
    }
    private node_close_cb(){
        //console.log('node_btn_del_cb');
        this.finish();
    }
    public BuyItem(){
        if(this.model.m_type == "coin"){
            //金币
            RechargeMgr.getInstance().reqBuyGoods(3, this.model.m_goodsId, this.model.m_buyNum);
        }else if(this.model.m_type == "gold"){
            //钻石
            let uid = UserMgr.getInstance().getUid()
            //开关控制
                RechargeMgr.getInstance().reqRechargeApi(uid, this.model.m_goodsId, 1);
            
        }
            
    }
    private btn_buy_cb(){
        //console.log('btn_buy_cb');
        //购买金币
         //console.log('m_goodsId:' +this.model.m_goodsId + "+_type:" +this.model.m_type);
         if (this.model.m_type == 'coin'){
            if(UserMgr.getInstance().getMyInfo().gold >= this.model.m_price){
                this.BuyItem();
            }else{
                this.node_close_cb()
                FrameMgr.getInstance().showMsgBox('钻石不足');
            }
         }else{
            this.BuyItem();
         }
    }
    

	//end
}