import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import MpnnConst from "../BullMgr/MpnnConst";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MarqueeCtrl;
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
		this.node=ctrl.node;
		this.initUi();
		
	}
    ui={
        btn_bumai:null,
        maimaparents:null,
		btn_maima:null,
		Prefab_maimaCount:null,
    };
	//初始化ui
	initUi()
	{
        this.ui.btn_bumai= ctrl.btn_bumai
		this.ui.btn_maima = ctrl.maimaparents.children;
		this.ui.Prefab_maimaCount = ctrl.tankuang;
	}
}
//c, 控制
@ccclass
export default class MarqueeCtrl extends BaseCtrl {
    //这边去声明ui组件
	@property({
		tooltip : "买码按钮父节点",
		type : cc.Node
	})
	maimaparents : cc.Node = null;
	@property({
		tooltip : "不买按钮",
		type : cc.Node
	})
    btn_bumai : cc.Node = null;
    @property({
		tooltip : "买码弹框",
		type : cc.Prefab
	})
    tankuang : cc.Prefab = null;
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
		this.g_events = {
			"onMaimaclose":this.onMaimaClose,
		}
		this.n_events[MpnnConst.clientEvent.onProcess] = this.onProcess;
	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.button,this.ui.btn_bumai,this.btn_bumai_cb,"不买按钮")
    for(let i=0;i<this.ui.btn_maima.length;i++){
        let CB = function(){
            this.btn_maima_cb(i)
        }
        this.connect(G_UiType.button,this.ui.btn_maima[i],CB,"点击买码")
        }
	}
	//网络事件回调begin
	onProcess(msg){
		switch(msg.process){
            case MpnnConst.process.calculate:
				this.finish();
            break;
        }
	}
	btn_bumai_cb(){

    }
    btn_maima_cb(index){
		let maimakuang = cc.instantiate(this.ui.Prefab_maimaCount);
		this.node.addChild(maimakuang);
		let pos = this.ui.btn_maima[index].getPosition()
		maimakuang.getComponent("Prefab_maimatankuangCtrl").setPos(cc.p(pos.x,pos.y+120));
    }
	//end
	//全局事件回调begin
	onMaimaClose(){
		this.finish();
	}
	//end
    //按钮或任何控件操作的回调begin
}
