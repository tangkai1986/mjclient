/*
author: Justin
日期:2018-02-09 15:22:45
*/ 
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import { MahjongDef } from "./MahjongDef";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjFaPaiGmCtrl;
//模型，数据处理
class Model extends BaseModel{
	roomCards : {};
	changeIndex : null;//要改变的原始下标-第一个点击的
	changePurpose : null;//改变后的下标第二个点击的

	
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef(); 
	constructor()
	{
		super();

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		prefab_MahjongItem : null,
		node_Mahjong : null,
		node_Close : null,
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
		this.ui.node_Mahjong = ctrl.Node_Mahjong;
		this.ui.node_Close = ctrl.Node_Close;
		this.ui.prefab_MahjongItem = ctrl.Prefab_MahjongItem;
		this.ui.node_Mahjong.removeAllChildren();
	}

	createMahjong (id, parent) : void {
		let node = cc.instantiate(this.ui.prefab_MahjongItem); 
		let face=node.getChildByName("MaJiang");
		face.getComponent(cc.Sprite).spriteFrame = this.model.mahjongResMgr.getInstance().getCardSpriteFrame(id)
		parent.addChild(node);
		return node;
	}
}
//c, 控制
@ccclass
export default class QzmjFaPaiGmCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip : "麻将预制资源",
		type : cc.Prefab
	})
	Prefab_MahjongItem : cc.Prefab = null;
	
	@property({
		tooltip : "关闭",
		type : cc.Node
	})
	Node_Close : cc.Node = null;
	@property({
		tooltip : "麻将位置",
		type : cc.Node
	})
	Node_Mahjong : cc.Node = null;
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
		this.n_events={
			//网络消息监听列表
            'room.roomHandler.gmReq':this.room_roomHandler_gmReq.bind(this), 
          	onGmOp:this.onGmOp,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.node_Close, this.finish, "点击了关闭");
		let nodes = this.ui.node_Mahjong.children || [];
		for (let i = 0; i < nodes.length; i ++) {
			this.connect(G_UiType.image, nodes[i], this.touchCards.bind(this, i), `点击了麻将下标${i}`);
		}
	}
	start () {
		let msg = {
			reqtype : MahjongDef.gmreq_cards, 
			data : {}
		};
		this.model.mahjongLogic.getInstance().gmReq(msg);
	}
	onGmOp(msg){
		this.finish();
	}
	//网络事件回调begin
	room_roomHandler_gmReq (msg) : void {
		this.model.roomCards = msg.data.cards;
		let cards = msg.data.cards;
		for (let i = 0; i < cards.length; i ++) {
			let node = this.view.createMahjong(cards[i], this.ui.node_Mahjong);
		}
		this.connectUi();
	}
	// onGmOp () : void {
	// 	this.finish();
	// }
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	touchCards (index) : void {
		if (this.model.changeIndex == null) {
			this.model.changeIndex = index;
		} else {
			this.model.changePurpose = index;
			if (this.model.changeIndex >= 0 && this.model.changePurpose >= 0) {
				////console.log("第一个点击的", this.model.changeIndex);
				////console.log("第二个点击的", this.model.changePurpose);
				if (this.model.changeIndex != this.model.changePurpose) {
					let msg={ 
						optype : MahjongDef.gmop_changewallorder, 
						data:{
							src : this.model.changeIndex,
							dest : this.model.changePurpose, 
						}
					}
					this.model.mahjongLogic.getInstance().gmOp(msg);
					
				} else {
					////console.log("两次相同，不做改变");
				}
			}
		}
		this.touchEffect(this.view.ui.node_Mahjong.children, 0.8);
		this.view.ui.node_Mahjong.children[index].setScale(new cc.Vec2(1, 1));
	}
	
	touchEffect (nodes, scale) : void {
		for (let i = 0; i < nodes.length; i ++) {
			nodes[i].setScale(new cc.Vec2(scale, scale));
		}
	}
	//end
}