
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_maimatankuangCtrl;
//模型，数据处理
class Model extends BaseModel{
	marqueeSwitch:null;
	constructor()
	{
		super();
	}
	
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	
	constructor(model){
		super(model);
		this.initUi();
	
	}
    ui={
		
		btn_bigCount:null,
		btn_smallCount:null,
		btn_close:null,
		node_frame:null,
    };
	//初始化ui
	initUi()
	{
		this.ui.btn_bigCount = ctrl.btn_bigCount;
		this.ui.btn_smallCount = ctrl.btn_smallCount;
		this.ui.btn_close = ctrl.btn_close;
		this.ui.node_frame = ctrl.node_frame;
	}
	setPos(pos){
		this.ui.node_frame.position = pos;
	}
}
//c, 控制
@ccclass
export default class Prefab_maimatankuangCtrl extends BaseCtrl {
    //这边去声明ui组件
	@property(cc.Node)
	btn_smallCount:cc.Node = null
	
	@property(cc.Node)
	btn_bigCount:cc.Node = null

	@property(cc.Node)
	btn_close:cc.Node = null

	@property(cc.Node)
	node_frame:cc.Node = null
	//声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		//MarqueMgr.getInstance();
		this.initMvc(Model,View); 
	}

	//定义网络事件
	defineNetEvents()
	{ 
		this.n_events={ 
			
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.button,this.ui.btn_bigCount,this.btn_bigCount_cb,"码数较大的")
		this.connect(G_UiType.button,this.ui.btn_smallCount,this.btn_smallCount_cb,"码数较小的")
		this.connect(G_UiType.button,this.ui.btn_close,this.btn_close_cb,"关闭")
	}

	setPos(pos){
		this.view.setPos(pos);
	}

	btn_bigCount_cb(){
		this.gemit("onMaimaclose");
	}
	btn_smallCount_cb(){
		this.gemit("onMaimaclose");
	}
	btn_close_cb(){
		this.finish();
	}
	//网络事件回调begin
	
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
}
