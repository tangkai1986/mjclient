/*
author: Justin
日期:2018-01-11 15:04:46
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import CharMgr from "../../GameMgrs/CharMgr"; 
import FrameMgr from "../../GameMgrs/FrameMgr";
import RoomMgr from "../../GameMgrs/RoomMgr";
import RoomCostCfg from "../../CfgMgrs/RoomCostCfg"; 
import QuickAudioCfg from "../../CfgMgrs/QuickAudioCfg";
import GameAudioCfg from "../../CfgMgrs/GameAudioCfg"; 
import UserMgr from "../../GameMgrs/UserMgr"; 
import { SssDef } from "../../../Games/Sss/SssMgr/SssDef";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_ChatNodeCtrl;
//模型，数据处理
class Model extends BaseModel{
	public ExpressionLen : number;
	public chatcfg =null;
	private userSex = null;

	constructor()
	{
		super();
		this.ExpressionLen = 29; 
		this.userSex = UserMgr.getInstance().getMySex();
		this.chatcfg = QuickAudioCfg.getInstance().getCfg();
	}
	getTextById(id){ 
		for(let i = 0;i<this.chatcfg.length;++i)
		{
			let item=this.chatcfg[i];
			if(item.id==id)
			{
				return item;
			}
		}
		return null;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	public allHeight: number;
	ui={
		//在这里声明ui
		scroll_Expression : null,
		scroll_Text : null,
		atlas_Expression : null,
		prefab_ChatText : null,
		panel_text : null,
		
		
		chattextlist:[],
		chatexpressionlist:[],
	};
	//private node=null;
	//private model:Model =null
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.model=model;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui.atlas_Expression = ctrl.ExpressionAtlas;
		this.ui.scroll_Expression = ctrl.ExpressionScroll; 
		this.ui.panel_text = ctrl.panel_text;
		this.ui.scroll_Text = ctrl.TextScroll;
		//默认是表情列表，所以文本节点不激活，避免吞噬触摸事件
		this.ui.scroll_Text.node.active = false;
		//高度为0
		this.allHeight = 0;
		this.initText();
		this.initExpression();
	}
    initText(){
		let list = this.model.chatcfg;
        for (let i = 0; i<list.length; ++i ) {
			let text = list[i].text;
			let id=list[i].id;
			let panel_text = cc.instantiate(this.ui.panel_text); 
			panel_text.position=cc.p(233,0);
			this.addText(id,text,panel_text);
			this.ui.chattextlist.push(panel_text);
        }
	}
	initExpression(){
		let index = 5;
		let len : any = this.model.ExpressionLen;
		for (let i = 1; i < len + 1; i ++) {
			let node = new cc.Node();
			node.name = i + "";
			let expression = node.addComponent(cc.Sprite);
			index --;
			this.ui.chatexpressionlist.push(expression);
			this.addExpress(index,i,expression);
			if (index == 0) index = 5;
		}
	}
	addExpress (index:number,i:number,expression) : void {
		let spacingY = this.ui.scroll_Expression.content.getComponent(cc.Layout).spacingY,
        nodeHeight = 0;
		this.ui.scroll_Expression.content.height = 0;
		let node = expression.node;
		node.tag = i
		expression.spriteFrame = this.ui.atlas_Expression.getSpriteFrame(i);
		this.ui.scroll_Expression.content.addChild(node);
		if (index == 0) {
			this.allHeight += node.height + spacingY;
		}
		nodeHeight = node.height;
		this.ui.scroll_Expression.content.height = this.allHeight + nodeHeight+280;		
	}
	
	addText (i:number,text:string,TextItem:cc.Node) : void {
        let node = this.ui.scroll_Text.content;
		node.addChild(TextItem);
		TextItem.getChildByName("content").getComponent(cc.Label).string = text;
		TextItem.tag = i;
		node.height += node.getComponent(cc.Layout).spacingY + TextItem.getChildByName("content").getComponent(cc.Label).lineHeight+5;
	}

	showExpression () : void {
		this.ui.scroll_Expression.node.active = true;
		this.ui.scroll_Text.node.active = false;
	}

	showText () : void {
		this.ui.scroll_Expression.node.active = false;
		this.ui.scroll_Text.node.active = true;
	}
}
//c, 控制
@ccclass
export default class Prefab_ChatNodeCtrl extends BaseControl {
	//这边去声明ui组件
	@property({
		tooltip : "聊天类型，表情还是文本",
		type : cc.ToggleGroup
	})
	ChatType : cc.ToggleGroup = null;

	@property({
		tooltip : "聊天类型，表情按钮",
		type : cc.Node
	})
	ExpressionBtn : cc.Node = null;

	@property({
		tooltip : "聊天类型，文本按钮",
		type : cc.Node
	})
	TextBtn : cc.Node = null;

	@property({
		tooltip : "表情图集",
		type : cc.SpriteAtlas
	})
	ExpressionAtlas : cc.SpriteAtlas = null;

	@property({
		tooltip : "表情容器",
		type : cc.ScrollView
	})
	ExpressionScroll : cc.ScrollView = null;

	@property({
		tooltip : "文本容器",
		type : cc.ScrollView
	})
	TextScroll : cc.ScrollView = null;
 

	@property(cc.Node)
	bg : cc.Node = null;
	
	@property(cc.Node)
	panel_text : cc.Node = null;
	
	private chatOver = true;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events = {
			"onProcess": this.onProcess,
            'onStartGame':this.onStartGame,   
			"onDissolutionRoom": this.onDissolutionRoom,
			onGameFinished:this.onGameFinished,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{ 
		this.connect(G_UiType.image, this.ExpressionBtn, this.ExpressionBtn_cb, "切换表情类型")
		this.connect(G_UiType.image, this.TextBtn, this.TextBtn_cb, '切换文本类型')
		this.connect(G_UiType.image, this.bg, this.bg_bc, '点击背景关闭界面')
        for (let i = 0; i<this.ui.chattextlist.length; ++i ) {
			this.connect(G_UiType.image, this.ui.chattextlist[i], this.prefab_ChatText_cb, '点击聊天文本'); 
        }
        for (let i = 0; i<this.ui.chatexpressionlist.length; ++i ) {
			this.connect(G_UiType.image, this.ui.chatexpressionlist[i].node, this.expression_cb, '点击表情文本'); 
        }
	}
	start () {
		
	}

	onProcess(msg) {
		if (msg.process == SssDef.process_peipai) {
			this.finish();
		}else if(msg.process == SssDef.process_gamesettle){
			this.finish();
		}
	}
	onStartGame(msg) { 
		this.finish(); 
	}
	onDissolutionRoom(msg) {
		if(msg.result) {
			this.finish();
		}
	}
	onGameFinished(msg)
	{  
        this.finish();  
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	
	private ExpressionBtn_cb () : void {
		this.view.showExpression();
	}
	private TextBtn_cb () : void {
		this.view.showText();
	}
	private prefab_ChatText_cb (node,event) : void {
		//let text = node.getChildByName("content").getComponent(cc.Label).string
		if(this.TextScroll.isScrolling() || this.TextScroll.isAutoScrolling()){
			return
		}
		let item = this.model.getTextById(node.tag) 
		var msg={
			"type":1,
			"id":item.id,
        }
		RoomMgr.getInstance().roomChat(msg);
		this.finish();
	}
	private expression_cb (node,event) : void {
		if(this.ExpressionScroll.isScrolling() || this.ExpressionScroll.isAutoScrolling()){
			return
		}
		var msg={
			"type":2,
			"id":node.tag,
        }
		RoomMgr.getInstance().roomChat(msg);
		this.finish();
	}
	private bg_bc (node,event) : void {
		this.finish();
	}
}