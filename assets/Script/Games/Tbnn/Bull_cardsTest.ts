import TbnnLogic from "./BullMgr/TbnnLogic";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import TbnnConst from "./BullMgr/TbnnConst";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";

const {ccclass, property} = cc._decorator;
let ctrl : Bull_cardsTest;
let BullLogic;
let BullConst;
class Model extends BaseModel{
	constructor()
	{
        super();
        BullLogic = RoomMgr.getInstance().getLogic();
        BullConst = RoomMgr.getInstance().getDef();
	}
}
class View extends BaseView{
    constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
    }
    //初始化ui
	initUi(){
    }
}
@ccclass
export default class Bull_cardsTest extends BaseCtrl {
    @property(cc.Node)
    node_cards:cc.Node = null
    @property(cc.Node)
    node_start:cc.Node = null
    @property(cc.EditBox)
    editBox:cc.EditBox = null
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
        this.n_events[BullConst.clientEvent.onGiveCards] = this.onGiveCards;
	}

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchLimit, this);
        this.node_cards.on(cc.Node.EventType.TOUCH_START, this.clickAddCards, this);
        this.node_start.on(cc.Node.EventType.TOUCH_START, this.clickStart, this);
    }

    onGiveCards(){
        this.node.destroy();
    }

    touchLimit (){

    }

    clickAddCards (){
        let curJson = JSON.parse(this.editBox.string);
        //console.log('最终传输的数据', curJson)
        BullLogic.getInstance().sendTestCards(curJson);
        this.node.destroy();
    }
    clickStart (){
        BullLogic.getInstance().sendTestStart();
        this.node.destroy();
    }

    // update (dt) {}
}
