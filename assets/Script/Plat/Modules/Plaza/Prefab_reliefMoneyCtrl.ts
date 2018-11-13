/*
author: YOYO
日期:2018-01-15 13:45:44
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UserMgr from "../../GameMgrs/UserMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_reliefMoneyCtrl;
//模型，数据处理
class Model extends BaseModel{
    str_content:null
	constructor()
	{
		super();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        lab_content:null
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
        this.ui.lab_content = ctrl.lab_content;
    }
    
    public updateContent (){
        this.ui.lab_content.string = this.model.str_content;
    }
}
//c, 控制
@ccclass
export default class Prefab_reliefMoneyCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property(cc.Node)
    node_close:cc.Node = null
    @property(cc.Node)
    node_btn_rec:cc.Node = null
    @property(cc.Label)
    lab_content:cc.Label = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

    private _rec_cb:Function = null
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
			'http.reqGetRelief':this.http_reqGetRelief,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.node_close, this.node_close_cb, '点击关闭');
        this.connect(G_UiType.image, this.node_btn_rec, this.node_btn_rec_cb, '点击领取');
	}
	start () {
        
	}
    //网络事件回调begin
    private node_close_cb(){ 
        this.finish();
    } 

    private node_btn_rec_cb(){ 
        UserMgr.getInstance().reqGetRelief();
	}
	
	http_reqGetRelief(msg)
	{
		//console.log("http_reqGetRelief msg=",msg)
		//可以在这里显示动画，暂时先直接关闭
		this.finish();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
    //end 
}