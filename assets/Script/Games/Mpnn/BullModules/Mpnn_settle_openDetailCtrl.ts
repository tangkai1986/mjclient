
/*
author: YOYO
日期:2018-03-19 21:02:24
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import BunchInfoMgr from "../../../Plat/GameMgrs/BunchInfoMgr";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Mpnn_settle_openDetailCtrl;
//模型，数据处理
class Model extends BaseModel{
    viewIndex:number                            //在父节点中的索引
    curRound:number                             //当前是第几局
    curInfo                                     //可用的信息
    maima_kaiguan:boolean
    roomRule:any
	constructor()
	{
        super();
    }
    
    updateInfo (){
        // let bunchInfo = RoomMgr.getInstance().getBunchInfo();
        
        let bunchInfo = BunchInfoMgr.getInstance().getBunchInfo();
        this.roomRule = bunchInfo.roomValue;
        this.maima_kaiguan=this.roomRule.v_playerbuyLimit;
        let meijuDict = bunchInfo.meiju[this.curRound][1];
        let mySeatId = BunchInfoMgr.getInstance().getMyLogicSeatId();
        //let mySeatId = 0;
        //console.log('this.roomRule.v_playerbuyLimit;= ',this.roomRule.v_playerbuyLimit)
        //console.log('Mpnn_settle_openDetailCtrl meiju info= ',meijuDict)
        //console.log('Mpnn_settle_openDetailCtrl bunchInfo= ',bunchInfo)
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
        //console.log("updateInfo 111", meijuDict);
        this.curInfo.handCards = meijuDict['handCards'][curSeatId];
        this.curInfo.resultType = meijuDict['resultType'][curSeatId];
        this.curInfo.chipValue = meijuDict['chipValue'][curSeatId];
        //this.curInfo.maimaValue = meijuDict['maimaValue'][curSeatId];
        this.curInfo.qiangzhuangtimes = meijuDict['grabRate'][curSeatId];
        //console.log("updateInfo 222", this.curInfo);
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
        lab_bumai:null,
        img_zhuang:null,
        node_maima:null,
        node_bq:null,
        node_qiangx:null,
        node_score:null,
        img_FSzhuang:null,
        maima_kaiguan:null,
        lab_QZbeishu:null,
        lab_playername:null,
        lab_maimanum:null,
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
        this.ui.maima_kaiguan = ctrl.maima_kaiguan;
        this.ui.lbl_score = ctrl.lbl_score;
        this.ui.lab_bumai = ctrl.lbl_bumai;
        this.ui.lab_QZbeishu = ctrl.lab_QZbeishu;
        this.ui.img_zhuang = ctrl.img_zhuang;
        this.ui.img_FSzhuang = ctrl.img_FSzhuang;
        this.ui.atlas_result = ctrl.atlas_result;
        this.ui.atlas_cards = ctrl.atlas_cards;
        this.ui.node_maima = ctrl.node_maima;
        this.ui.node_bq = ctrl.node_bq;
        this.ui.node_qiangx = ctrl.node_qiangx;
        this.ui.node_score = ctrl.node_score;
        this.ui.lab_maimanum = ctrl.lab_maimanum;
        this.ui.lab_playername = ctrl.lab_playername;
    }
    
    updateInfo (){
        if(!this.model.curInfo.handCards) return;
        this.setPokerData();   
        this.setResult();
        this.setChipValue();
        this.setMaimaData();
        this.setQZhuangTimes();
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
    setQZhuangTimes(){
        let QZtimes = this.model.curInfo.qiangzhuangtimes;
        if(QZtimes==0){
            this.ui.node_bq.active = true;
            this.ui.node_qiangx.active = false;
        }else{
            this.ui.node_bq.active = false;
            this.ui.node_qiangx.active = true;
            this.ui.lab_QZbeishu.string = QZtimes;
        }
    }
    setChipValue (){
        let chipValue = this.model.curInfo.chipValue;
        if(chipValue != 0){
            this.ui.img_FSzhuang.active = false;
            this.ui.node_score.active = true;
            this.ui.lbl_score.string = chipValue;
        }else{
            this.ui.img_FSzhuang.active = true;
            this.ui.node_score.active = false;
        }
    }
    setMaimaData(){
        if(this.model.maima_kaiguan){
            this.ui.maima_kaiguan.active = true;
            let maimaValue = this.model.curInfo.maimaValue;
            //this.ui.lab_maimanum.string = maimaValue;
            if(maimaValue==-1){
                this.ui.img_zhuang.node.active = true;
                this.ui.lab_bumai.node.active = false;
                this.ui.node_maima.active = false;
            }else if(maimaValue==0){
                this.ui.img_zhuang.node.active = false;
                this.ui.lab_bumai.node.active = true;
                this.ui.node_maima.active = false;
            }else{
                this.ui.img_zhuang.node.active = false;
                this.ui.lab_bumai.node.active = false;
                this.ui.node_maima.active = true;
            }
        }else{
            this.ui.maima_kaiguan.active = false;
        }
    }
    private getSixValue(logicNum){
        logicNum = parseInt(logicNum);
        let str = logicNum < 14 ?  "0x0" : "0x";
        return str + logicNum.toString(16);
    }
}
//c, 控制
@ccclass
export default class Mpnn_settle_openDetailCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
    @property(cc.Node)
    node_pokers:cc.Node = null
    @property(cc.Sprite)
    sprite_result:cc.Sprite = null
    @property(cc.Sprite)
    img_zhuang:cc.Sprite = null
    @property(cc.Node)
    img_FSzhuang:cc.Node = null
    @property(cc.Label)
    lbl_score:cc.Label = null
    @property(cc.Label)
    lbl_bumai:cc.Label = null
    @property(cc.Label)
    lab_QZbeishu:cc.Label = null
    @property(cc.Node)
    node_maima:cc.Node = null
    @property(cc.Node)
    node_score:cc.Node = null
    @property(cc.Node)
    node_bq:cc.Node = null
    @property(cc.Node)
    node_qiangx:cc.Node = null
    @property(cc.Node)
    maima_kaiguan:cc.Node = null
    @property(cc.Label)
    lab_playername:cc.Label = null
    @property(cc.Label)
    lab_maimanum:cc.Label = null
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

    refreshUi(){

    }
	//网络事件回调begin
	//end
    //全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}