/*
author: YOYO
日期:2018-03-19 21:02:24
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BunchInfoMgr from "../../../Plat/GameMgrs/BunchInfoMgr";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Tbnn_settle_openDetailCtrl;
//模型，数据处理
class Model extends BaseModel{
    viewIndex:number                            //在父节点中的索引
    curRound:number                             //当前是第几局
    curInfo                                     //可用的信息
	constructor()
	{
		super();
    }
    
    updateInfo (){
        let bunchInfo = BunchInfoMgr.getInstance().getBunchInfo();
        let meijuDict = bunchInfo.meiju[this.curRound][1];
        let mySeatId = BunchInfoMgr.getInstance().getMyLogicSeatId();
        //console.log('Tbnn_settle_openDetailCtrl meiju info= ',meijuDict)
        let curSeatId;
        if(this.viewIndex == 0){
            curSeatId = mySeatId;
        }else{
            if(this.viewIndex == mySeatId){
                curSeatId = 0;
            }else{
                curSeatId = this.viewIndex;
            }
        }
        this.curInfo = {};
        this.curInfo.handCards = meijuDict['handCards'][curSeatId];
        this.curInfo.resultType = meijuDict['resultType'][curSeatId];
        this.curInfo.chipValue = meijuDict['chipValue'][curSeatId];
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    model:Model
	ui={
        //在这里声明ui
        node_pokers:null,
        sprite_result:null,
        lbl_score:null,
        atlas_result:null,
        atlas_cards:null,
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
        this.ui.node_pokers = ctrl.node_pokers;
        this.ui.sprite_result = ctrl.sprite_result;
        this.ui.lbl_score = ctrl.lbl_score;
        this.ui.atlas_result = ctrl.atlas_result;
        this.ui.atlas_cards = ctrl.atlas_cards;
    }
    
    updateInfo (){
        if(!this.model.curInfo.handCards) return;
        this.setPokerData();   
        this.setResult();
        this.setChipValue();
    }
    setPokerData (){
        let dataList = this.model.curInfo.handCards;
        let pokers = this.ui.node_pokers.children;
        for(let i = 0; i < dataList.length; i ++){
            pokers[i].getComponent(cc.Sprite).spriteFrame = this.ui.atlas_cards.getSpriteFrame('bull_'+this.getSixValue(dataList[i]));
        }
    }
    setResult (){
        let resultValue = this.model.curInfo.resultType;
        this.ui.sprite_result.spriteFrame = this.ui.atlas_result.getSpriteFrame('bull_result_'+resultValue);
    }
    setChipValue (){
        let chipValue = this.model.curInfo.chipValue;
        this.ui.lbl_score.string = chipValue;
    }
    private getSixValue(logicNum){
        logicNum = parseInt(logicNum);
        let str = logicNum < 14 ?  "0x0" : "0x";
        return str + logicNum.toString(16);
    }
}
//c, 控制
@ccclass
export default class Tbnn_settle_openDetailCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
    @property(cc.Node)
    node_pokers:cc.Node = null
    @property(cc.Sprite)
    sprite_result:cc.Sprite = null
    @property(cc.Label)
    lbl_score:cc.Label = null
    @property(cc.SpriteAtlas)
    atlas_result:cc.SpriteAtlas = null
    //其他人的手牌
    @property(cc.SpriteAtlas)
    atlas_cards:cc.SpriteAtlas = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
        this.initMvc(Model,View);
        this.model.viewIndex = this.node.parent.parent.children.indexOf(this.node.parent);
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
	}
	start () {
        this.model.curRound = this.node.parent.parent.parent['_curRound'];
        this.model.updateInfo();
        this.view.updateInfo();
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}