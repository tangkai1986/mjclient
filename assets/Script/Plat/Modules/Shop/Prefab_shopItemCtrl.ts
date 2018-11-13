/*
author: YOYO
日期:2018-01-12 14:50:18
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import GoodsCfg from "../../CfgMgrs/GoodsCfg";
import UserMgr from "../../GameMgrs/UserMgr";
import RechargeMgr from "../../GameMgrs/RechargeMgr";
import SwitchMgr from "../../GameMgrs/SwitchMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_shopItemCtrl;
//模型，数据处理
class Model extends BaseModel{
    public m_goodsType:string = null    //商品类型
    public goodsId:number = null        //商品ID
    public m_moneyName:string = null    
    public m_lastMoney:number = null    //原价
    public m_nowMoney:number = null     //现价
    public m_leaveNum:number = null     //数量     
    public m_goodsId:number = null
	constructor()
	{
        super();
        let infoList = null;
        var item_data = BehaviorMgr.getInstance().getGoodsItemData();
        var buy_data = BehaviorMgr.getInstance().getGoodsBuyData();
        this.m_goodsId = buy_data[0];
        this.goodsId = item_data[0];
        this.m_goodsType = item_data[1];
        //console.log("item_data",item_data);
        if (this.m_goodsType == "coin"){
            infoList = GoodsCfg.getInstance().getCoinCfg();
        }else if (this.m_goodsType == "gold"){
            infoList = GoodsCfg.getInstance().getGoldCfg();
        }
        var infoObj = infoList[this.goodsId];
        this.m_moneyName = infoObj.name +':'+ infoObj.amount;
        this.m_lastMoney = infoObj.oprice;
        this.m_nowMoney = infoObj.price;
        this.m_leaveNum = infoObj.amount;
    }
    
    public getIsActivity(){
        let bool = this.m_lastMoney == this.m_nowMoney?false:true;
        return bool
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        lab_name:null,
        lab_last:null,
        lab_now:null,
        node_lab_now:null,
        node_lab_last:null,

        node_img_activity:null,
        spriteFrame_moneyType2:null,
        sprite_buy:null,
        btn_buy:null,
        spriteFrame_buyType2:null,
        itemSprite:null,
        label_goodNum:null,
        node_spark:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.ui.lab_name = ctrl.lab_name;
        this.ui.lab_last = ctrl.lab_last;
        this.ui.lab_now = ctrl.lab_now;
        this.ui.node_lab_now = ctrl.node_lab_now;
        this.ui.node_lab_last = ctrl.node_lab_last;
        this.ui.node_img_activity = ctrl.node_img_activity;           //促销角标
        this.ui.sprite_buy = ctrl.sprite_buy;
        this.ui.btn_buy = ctrl.btn_buy;
        this.ui.itemSprite = ctrl.itemSprite
        this.ui.label_goodNum = ctrl.label_goodNum;
        this.ui.node_spark = ctrl.node_spark;
        this.updateName();
        this.updateLastMoney();
        this.updateNowMoney();
        this.updateActivity();
        this.updategoodNum();
        this.updatediscountInfo();
        
        if(this.model.m_goodsType == 'coin') this.showGoldImg();
        else this.showJewelImg();
    }
    public updatediscountInfo()
    {
        let childrenList = this.ui.node_spark.children;
        if(parseInt(this.model.goodsId)>=3) {
            return;
        }
        childrenList[parseInt(this.model.goodsId)].active = true;
    }
    public updateName(){
        this.ui.lab_name.string = this.model.m_moneyName;
    }
    public updateLastMoney(){
        this.ui.lab_last.string = '原价  '+this.model.m_lastMoney+'元';
    }
    public updateNowMoney(){
        this.ui.lab_now.string = this.model.m_nowMoney+'元';
    }
    public updateNowBuyMoney(money){
        if(parseInt(money)==money){
            this.ui.lab_now.string = money+'元';
            //console.log("money1",money);
        }else{
            this.ui.lab_now.string = money.toFixed(2)+'元';
            //console.log("money2",money);
        }        
    }
    //显示促销信息
    public updateActivity(){
        //现在不显示促销信息
        // this.ui.node_img_activity.active = this.model.getIsActivity();
        // this.ui.node_lab_last.active = this.model.getIsActivity();
        this.ui.node_img_activity.active = false;
        this.ui.node_lab_last.active = false;
    }
    public showJewelImg() {
        let path = 'Plat/shop/gold_' + this.model.goodsId;
        //加载选中后的图片
        cc.loader.loadRes(path, cc.SpriteFrame, (err, assets) => {
            if (err) {
                cc.error(err)
            } else {
                if(cc.isValid(this.ui.itemSprite) && this.ui.itemSprite) {
                    this.ui.itemSprite.getComponent(cc.Sprite).spriteFrame = assets;
                }
            }
        })
    }
    public updategoodNum()
    {
        this.ui.label_goodNum.string = this.model.m_leaveNum +"个";
    }
    public showGoldImg (){
        
    }
    
}
//c, 控制
@ccclass
export default class Prefab_shopItemCtrl extends BaseCtrl {
	//这边去声明ui组件

    @property(cc.Label)
    lab_name:cc.Label = null

    @property(cc.Label)
    lab_last:cc.Label = null

    @property(cc.Label)
    lab_now:cc.Label = null

    @property(cc.Node)
    node_lab_now:cc.Node = null

    @property(cc.Node)
    node_lab_last:cc.Node = null

    @property(cc.Node)
    node_img_activity:cc.Node = null
    @property(cc.Node)
    node_spark:cc.Node = null

    @property(cc.Sprite)
    sprite_buy:cc.Sprite = null
    @property(cc.Label)
    label_goodNum:cc.Label = null

    @property({
    	tooltip : '购买按钮',
    	type : cc.Node
    })
    btn_buy: cc.SpriteFrame = null;

    @property({
    	tooltip : '商品图标',
    	type : cc.Node
    })
    itemSprite: cc.Node = null;

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

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.button, this.ui.btn_buy, this.btn_buyCB, '购买')
	}
	start () {
	}
    updateNowBuyMoney(money)
    {
        this.view.updateNowBuyMoney(money);
    }
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    public btn_buyCB(){
        RechargeMgr.getInstance().reqReqGoodsList();
        this.start_sub_module(G_MODULE.Payment, (prefabComp)=>{
            prefabComp.setGoodsId(this.model.goodsId);
        },'Prefab_paymentCtrl');

        // let uid = UserMgr.getInstance().getUid();        
        // let apple = SwitchMgr.getInstance().get_switch_apple_pay_outside();
        // //console.log("reqRechargeApi:apple:", apple);
        // if (cc.sys.OS_IOS == cc.sys.os && apple == 2){
        //     let goodsList = GoodsCfg.getInstance().getGoldCfg(),
        //     payid = "";
        //     for(let i = 0; i < goodsList.length; i ++){
        //         if(this.model.m_goodsId == goodsList[i].id){
        //             payid = goodsList[i].payid;
        //             break
        //         }
        //     }
        //     if (payid != ""){
        //         RechargeMgr.getInstance().Ios_Recharge(payid);
        //         this.gemit("apple_receipt", {state:true});
        //     }else{
        //         //console.log("rechargeapi ios id null", payid);
        //     }
        // }else{
        //     //RechargeMgr.getInstance().reqRechargeApi(uid, this.model.m_goodsId, 1);
        //     if(this.model.goodsId == 0){
        //         cc.sys.openURL(`${RechargeMgr.getInstance().getGoodsList()[0].wechat_href}`);
        //         //console.log("href0",RechargeMgr.getInstance().getGoodsList()[0].wechat_href);                
        //     }else if(this.model.goodsId == 1){
        //         cc.sys.openURL(`${RechargeMgr.getInstance().getGoodsList()[1].wechat_href}`);
        //         //console.log("href1",RechargeMgr.getInstance().getGoodsList()[1].wechat_href);
        //     }else if(this.model.goodsId == 2){
        //         cc.sys.openURL(`${RechargeMgr.getInstance().getGoodsList()[2].wechat_href}`);
        //         //console.log("href2",RechargeMgr.getInstance().getGoodsList()[2].wechat_href);
        //     } 
        //     //console.log("goodsId",this.model.goodsId);
        // }
    }
    //end
}