import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import QuickAudioCfg from "../../../Plat/CfgMgrs/QuickAudioCfg";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Sss_bubbleCtrl;
//模型，数据处理
class Model extends BaseModel{
	userInfo: any = null;
	logicSeatId:Number = null;
	seatType: Number = null;
	uid: any = null;
	constructor()
	{
		super();
		this.seatType = ctrl.type;
		this.uid = ctrl.uid;
		this.logicSeatId = RoomMgr.getInstance().getLogicSeatId(ctrl.seatId);
	}

	updateUserInfo() { 
		this.userInfo = UserMgr.getInstance().getUserById(this.uid); 	
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui = {
		//在这里声明ui
		expressionAltas: ctrl.expressionAltas
	};
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi() {
		for (let i = 0; i < this.node.childrenCount; ++i) {
			this.node.children[i].active = false;
		}
	}

	addChatMsg(msg) {
		if(msg.seatid != this.model.logicSeatId) return;
		switch(msg.type) {
			case 1:
				let text;
				if(this.model.seatType){
					text = this.node.position.x > 0 ? this.node.getChildByName("textLeft") : this.node.getChildByName("textRight");
				} else {
					text = this.node.getChildByName("text");
				}
				text.active = true;
				let list = QuickAudioCfg.getInstance().getCfg();
				let value = list[msg.id - 1].text;
				text.children[1].getComponent(cc.Label).string = value;
				text.children[0].width = text.children[1].width + 20;
                let sex = this.model.userInfo.sex;
                QuickAudioCfg.getInstance().play(msg.id, sex);
				this.hideBubble(text);
				break;
			case 2:
				let expression = this.node.getChildByName("expression");
				expression.active = true;
				expression.children[0].getComponent(cc.Sprite).spriteFrame = this.ui.expressionAltas.getSpriteFrame(msg.id);
				this.hideBubble(expression);
				break;
		}
	}

	hideBubble(bubble: cc.Node) {
		let act1 = cc.delayTime(2);
        let act2 = cc.callFunc(()=>{
            bubble.active = false;
        });
        bubble.runAction(cc.sequence(act1, act2));
	}
}
//c, 控制
@ccclass
export default class Sss_bubbleCtrl extends BaseCtrl {
	view:View = null;
	model:Model = null;
	seatId:Number = null;
	uid:any = null;
	type: Number = null;
	//这边去声明ui组件
	@property({
		tooltip: "表情图集",
		type: cc.SpriteAtlas
	})
	expressionAltas: cc.SpriteAtlas = null;
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
	defineNetEvents() {
		this.n_events = {
			"onRoomChat": this.onRoomChat,
			"http.reqUsers": this.http_reqUsers
		}
	}
	//定义全局事件
	defineGlobalEvents() {

	}
	//绑定操作的回调
	connectUi() {

	}
	start () {

	}
	//网络事件回调begin
	onRoomChat(msg) {
		this.view.addChatMsg(msg);
	}

	http_reqUsers () {
		if(this.model.uid == null){ 
			return;
		}
		this.model.updateUserInfo(); 
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
	initProperty (obj) {
		this.uid = obj.uid;
		this.seatId = obj.viewID;
		this.type = obj.type;
	}
}