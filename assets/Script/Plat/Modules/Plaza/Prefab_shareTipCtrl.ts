import BaseModel from "../../Libs/BaseModel";
import BaseView from "../../Libs/BaseView";
import BaseCtrl from "../../Libs/BaseCtrl";
import ShareMgr from "../../GameMgrs/ShareMgr";

const {ccclass, property} = cc._decorator;
let ctrl : Prefab_shareTipCtrl;
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    ui={
        btn_confirm:ctrl.btn_confirm,
        btn_cancel:ctrl.btn_cancel
    };
    constructor(model){
        super(model);
        this.node=ctrl.node;
		this.initUi();
		this.addGrayLayer();
    }
    //初始化ui
	initUi()
	{

    }
}

@ccclass
export default class Prefab_shareTipCtrl extends BaseCtrl {
    //这边去声明ui组件
    @property({
		tooltip : "确定按钮",
		type : cc.Node
	})
    btn_confirm:cc.Node = null;

    @property({
		tooltip : "取消按钮",
		type : cc.Node
	})
    btn_cancel:cc.Node = null;
    
    onLoad () {
        //创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
    }
    //定义网络事件
	defineNetEvents()
	{
        
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.button,this.ui.btn_confirm,this.btn_confirm_cb,'点击确定按钮');
        this.connect(G_UiType.button,this.ui.btn_cancel,this.btn_cancel_cb,'点击取消按钮');
    }
    //点击确定按钮
    private btn_confirm_cb(){
        //console.log("btn_confirm_cb",ShareMgr.getInstance().shareButtonFlag);
        ShareMgr.getInstance().shareButtonFlag=true;
        this.start_sub_module(G_MODULE.Shared);
        this.finish();
    }
    //点击取消按钮
    private btn_cancel_cb(){
        //console.log("btn_cancel_cb",ShareMgr.getInstance().shareButtonFlag);
        ShareMgr.getInstance().shareButtonFlag = false;
        this.finish();
    }
}
