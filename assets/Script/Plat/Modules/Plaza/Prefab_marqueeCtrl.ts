//大厅控制管理
import BaseModel from "../../Libs/BaseModel";
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import MarqueMgr from "../../GameMgrs/MarqueMgr";
import SwitchMgr from "../../GameMgrs/SwitchMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MarqueeCtrl;
//模型，数据处理
class Model extends BaseModel{
	marqueeSwitch:null;
	constructor()
	{
		super();
		this.marqueeSwitch = SwitchMgr.getInstance().get_switch_horse_race_lamp();
	}
	updateSwitch(msg){
		this.marqueeSwitch = msg.cfg.switch_horse_race_lamp;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	private _marqueePos = null;
	private _delayTime = null;
	private _moveDistanceX = null;
	private _moveTime = null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
		this._marqueePos = this.ui.node_marquee.position;
		this._delayTime =3;
		this._moveDistanceX = -(3*this.ui.node_mask.width);
		this._moveTime = 10;
	}
    ui={
		node_marquee:null,
		node_mask:null,
		node_laba:null,
		node_tishidi:null
    };
	//初始化ui
	initUi()
	{
		this.ui.node_marquee = ctrl.Marquee;
		this.ui.node_mask = ctrl.Mask;
		this.ui.node_laba = ctrl.laba;
		this.ui.node_tishidi = ctrl.tishidi;
		// this.ui.node_mask.active = false;
		// this.ui.node_laba.active = false;
		// this.ui.node_tishidi.active = false;
	}
	setMarqueePos(){
		this.ui.node_marquee.position = this._marqueePos;
	}
	move(){
		let callback = cc.callFunc(()=>{
			            this.setMarqueePos();
			        });
		let moveBy = cc.moveBy(this._moveTime,this._moveDistanceX, 0);
		let delayTime = cc.delayTime(this._delayTime);
		var seq =  cc.repeatForever(cc.sequence(moveBy, delayTime,callback));
		this.ui.node_marquee.runAction(seq);
	}
	showMarquee() {
		let bool = this.model.marqueeSwitch == 1 ? true : false;
		if (!bool) {
			return
		}
		this.ui.node_mask.active = true;
		this.ui.node_laba.active = true;
		this.ui.node_tishidi.active = true;
		let text = MarqueMgr.getInstance().getMarqueeText();
		this.ui.node_marquee.getComponent(cc.Label).string = text;
	}
	//开关控制
	showSwitch() {
		if (this.ui.node_mask.active) {
			let bool = this.model.marqueeSwitch == 1 ? true : false;
			this.ui.node_mask.active = bool;
			this.ui.node_laba.active = bool;
			this.ui.node_tishidi.active = bool;
		}
	}
}
//c, 控制
@ccclass
export default class MarqueeCtrl extends BaseCtrl {
    //这边去声明ui组件
	@property({
		tooltip : "跑马灯",
		type : cc.Node
	})
	Marquee : cc.Node = null;
	@property({
		tooltip : "遮罩层",
		type : cc.Node
	})
	Mask : cc.Node = null;
	@property({
		tooltip : "喇叭",
		type : cc.Node
	})
	laba : cc.Node = null;
	@property({
		tooltip : "提示地",
		type : cc.Node
	})
	tishidi : cc.Node = null;
	//声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		//MarqueMgr.getInstance();
		this.initMvc(Model,View); 
		this.view.showMarquee();
		this.view.move();
	}

	//定义网络事件
	defineNetEvents()
	{ 
		this.n_events={ 
			'http.reqHorseRaceLamp':this.http_reqHorseRaceLamp,
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
	}
	//网络事件回调begin
	private http_reqHorseRaceLamp(msg){
		this.view.showMarquee();
	}
	http_reqGameSwitch(msg){
		this.model.updateSwitch(msg);
		this.view.showSwitch();
	}
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
}
