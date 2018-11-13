import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import bindAgentMgr from "../../GameMgrs/bindAgentMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_JoinRoomCtrl;
//模型，数据处理
class Model extends BaseModel{
    public agentID = null;
	constructor()
	{
        super(); 
        this.agentID = bindAgentMgr.getInstance().getAgentID();
	}

}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        btn_close :ctrl.btn_close,
        btn_confirm:ctrl.btn_confirm,
        lab_agentID:ctrl.lab_agentID,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
		this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
		this.ui.lab_agentID.string = this.model.agentID;
	}

	
}
//c, 控制
@ccclass
export default class Prefab_JoinRoomCtrl extends BaseControl {
	//这边去声明ui组件
	@property({
		tooltip : "关闭",
		type : cc.Node
	})
    btn_close : cc.Node = null;
    
    @property({
		tooltip : "确定",
		type : cc.Node
	})
	btn_confirm : cc.Node = null;

    @property({
        tooltip:"代理的ID显示", 
        type:cc.Label
    })  
    lab_agentID:cc.Label = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.model = new Model();
		//视图
		this.view = new View(this.model);
		//引用视图的ui
		this.ui=this.view.ui;
		//定义网络事件
		this.defineNetEvents();
		//定义全局事件
		this.defineGlobalEvents();
		//注册所有事件
		this.regAllEvents()
		//绑定ui操作
		this.connectUi();
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
		this.g_events={
			closBindAgent:this.closBindAgent,
			closeConfirm:this.closeConfirm,
		}
	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.button, this.ui.btn_confirm, this.confirmCB, "确定绑定");
		this.connect(G_UiType.button, this.ui.btn_close, this.closeCB, "关闭绑定代理确认界面");
	}

    confirmCB(){
		bindAgentMgr.getInstance().sendID();
		this.finish();
    }
    
    closeCB(){
        this.finish();
    }

	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	private closBindAgent():void{
		this.finish();
	}
	private closeConfirm():void{
		this.finish();
	}
	//end
	//按钮或任何控件操作的回调begin
}
