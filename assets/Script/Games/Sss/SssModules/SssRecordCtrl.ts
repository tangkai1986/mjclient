import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import { SssDef } from "../SssMgr/SssDef";
import BunchInfoMgr from "../../../Plat/GameMgrs/BunchInfoMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : SssRecord;
//模型，数据处理
class Model extends BaseModel{
	roundData: any = null;
	constructor()
	{
		super();
		this.roundData = BunchInfoMgr.getInstance().getBunchInfo().meiju;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	model: Model;
	ui={
		//在这里声明ui
		closeBtn: ctrl.closeBtn,
		content: ctrl.content,
		item: ctrl.item
	};
	
	constructor(model){
		super(model);
		this.node = ctrl.node;
		this.initUi();
		this.addGrayLayer();
	}
	//初始化ui
	initUi() {
		for (let i = this.model.roundData.length - 1; i >= 0; --i) {
			let newNode = cc.instantiate(this.ui.item);
			newNode.getComponent('SssSettleRoundItemCtrl').init(this.model.roundData[i][1], i);
			this.ui.content.addChild(newNode);
		}
	}
}
//c, 控制
@ccclass
export default class SssRecord extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Node)
	closeBtn: cc.Node = null;

	@property({
		tooltip: "内容",
		type: cc.Node
	})
	content: cc.Node = null;

	@property(cc.Prefab)
	item: cc.Prefab = null;
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
			"onProcess": this.onProcess,
			'onStartGame':this.onStartGame,   
			"onDissolutionRoom": this.onDissolutionRoom,
			onGameFinished:this.onGameFinished,
		}
	}
	//定义全局事件
	defineGlobalEvents() {

	}
	//绑定操作的回调
	connectUi() {
		this.connect(G_UiType.button, this.ui.closeBtn, this.finish,'关闭');
	}
	start () {
	}
	//网络事件回调begin
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
	//end
}