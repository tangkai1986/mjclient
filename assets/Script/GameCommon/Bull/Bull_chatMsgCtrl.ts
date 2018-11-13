/*
author: YOYO
日期:2018-03-29 10:25:45
*/
import BullPosMgr from "./BullPosMgr";
import QuickAudioCfg from "../../Plat/CfgMgrs/QuickAudioCfg";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import UserMgr from "../../Plat/GameMgrs/UserMgr";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Bull_chatMsgCtrl;
//模型，数据处理
class Model extends BaseModel{
    private userSex:null;
	constructor()
	{
		super();
        this.userSex = UserMgr.getInstance().getMySex();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
        prefab_chatMsg:null,
        ExpressionAtlas:null
	};
    node=null;
    private dict_chats:Array<cc.Node>
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        
        this.dict_chats = [];
	}
	//初始化ui
	initUi()
	{
		this.ui.prefab_chatMsg = ctrl.Prefab_ChatMsg;
		this.ui.ExpressionAtlas = ctrl.ExpressionAtlas;
	}
	
    addChatMsg(viewSeat,type,id){
        let prefab_ChatMsg = this.dict_chats[viewSeat];
        if(!prefab_ChatMsg){
            prefab_ChatMsg = cc.instantiate(this.ui.prefab_chatMsg);
            prefab_ChatMsg.parent = this.node;
            this.dict_chats[viewSeat] = prefab_ChatMsg;
        }
        prefab_ChatMsg.active = true;
        prefab_ChatMsg.stopAllActions();
        
		//坐标
		let pos = BullPosMgr.getInstance().getChatPos(viewSeat);
        prefab_ChatMsg.position = pos;
        let isLeft = pos.x < 0;
        let children = prefab_ChatMsg.children;
        let curContent;
        if(isLeft){
            curContent = children[0].children;
            children[0].active = true;
            children[1].active = false;
        }else{
            curContent = children[1].children;
            children[0].active = false;
            children[1].active = true;
        }
        let background = curContent[0];
        let textNode = curContent[1];
        let imgNode = curContent[2];
		//刷新
        switch(type){
            case 1:
            //文本
                textNode.active = true;
                imgNode.active = false;
                //set data
                let list = QuickAudioCfg.getInstance().getCfg()
                let value = list[id-1].text;
                textNode.getComponent(cc.Label).string = value;
                background.width = textNode.width + 30;
                QuickAudioCfg.getInstance().play(id,this.model.userSex);
            break
            case 2:
            //表情
                textNode.active = false;
                imgNode.active = true;
                imgNode.getComponent(cc.Sprite).spriteFrame = this.ui.ExpressionAtlas.getSpriteFrame(id);
                background.width = 50;
            break
        }
        this.addHideAct(prefab_ChatMsg);
    }
    private addHideAct (curNode:cc.Node){
        let act1 = cc.delayTime(2);
        let act2 = cc.callFunc(()=>{
            curNode.active = false;
        }, this);
        curNode.runAction(cc.sequence(act1, act2));
    }
}
//c, 控制
@ccclass
export default class Bull_chatMsgCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
	 @property({
        type:cc.Prefab,
        displayName:"Prefab_ChatMsg"
    })
    Prefab_ChatMsg:cc.Prefab = null
    @property({
		tooltip : "表情图集",
		type : cc.SpriteAtlas
	})
	ExpressionAtlas : cc.SpriteAtlas = null;
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
			 'onRoomChat':this.onRoomChat
		}
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
	}
	//网络事件回调begin
	onRoomChat(msg) {
		let viewSeatId = RoomMgr.getInstance().getViewSeatId(msg.seatid);
		this.view.addChatMsg(viewSeatId, msg.type, msg.id);
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}