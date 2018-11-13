/*
author: YOYO
日期:2018-01-10 18:13:38
*/
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BaseCtrl from "../../Libs/BaseCtrl";
import VerifyMgr from "../../GameMgrs/VerifyMgr";
import VersionMgr from "../../../AppStart/AppMgrs/VersionMgr";


//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_MsgBoxCtrl;
//模型，数据处理
class Model extends BaseModel{
    private _curTitle:string = null          //标题
    private _initTitle:string = null         //初始标题
    private _content:string = null           //内容

	constructor()
	{
		super();

    }
    
    public setTitle(title:string){
        this._curTitle = title;
    }

    public getTitle():string{
        return this._curTitle
    }

    public setInitTitle(title:string){
        this._initTitle = title;
    }

    //获取原先的标题
    public getInitTile():string{
        return this._initTitle
    }

    private setContent (content:string){
        this._content = content;
    }

    private getContent ():string{
        return this._content
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        lab_content: null,         //文本内容
        lab_title: null,           //标题
        node_cancel: null,         //取消
        node_confirm: null,        //确定
        btn_restartgame:ctrl.btn_restartgame,//重启游戏
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
        this.ui.lab_title = ctrl.lab_title;
        this.ui.node_cancel = ctrl.node_cancel;
        this.ui.node_confirm = ctrl.node_confirm;
        this.model.setInitTitle(this.ui.lab_title.string);
    }
    
    //刷新内容
    public updateContent(){
        this.ui.lab_content.string = this.model.getContent();
    }

    //刷新标题
    public updateTitle(){
        this.ui.lab_title.string = this.model.getTitle();
    }

    //显示类型
    public setType(isSingle:Boolean){
        if(isSingle){
            this.ui.node_cancel.active = false;
            this.ui.node_confirm['_firstX'] = this.ui.node_confirm.x;
            this.ui.node_confirm.x = 0;
        }else{
            this.ui.node_cancel.active = true;
            if(this.ui.node_confirm['_firstX']) this.ui.node_confirm.x = this.ui.node_confirm['_firstX'];
        }
    }
}
//c, 控制
@ccclass
export default class Prefab_MsgBoxCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property(cc.Node)
    node_cancel:cc.Node = null

    @property(cc.Node)
    node_confirm:cc.Node = null

    @property(cc.Label)
    lab_content:cc.Label = null

    @property(cc.Label)
    lab_title:cc.Label = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
    @property(cc.Button)
    btn_restartgame:cc.Button = null
    
    //attributes
    private _cb_response:Function = null
    //attributes
    private _cb_response_finish:Function = null
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
        this.n_events = {
            "onStartGame": this.onStartGame,
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.node_cancel, this._onClick_cancel, '点击取消');
        this.connect(G_UiType.image, this.node_confirm, this._onClick_confirm, '点击确认');
        
        this.ui.btn_restartgame.node.on(cc.Node.EventType.TOUCH_END, (event)=> {//重启
            cc.audioEngine.stopAll();
            cc.game.restart(); 
        }, this) 
	}
	start () {
        
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin

    /**
     * 
     * @param content 文本内容
     * @param cb 回调函数
     * @param isSingle 是否显示单个确定按钮
     */
    public showMsg (content:string, cb?:Function, isSingle?:Boolean, title?:string, cb_finish?:Function){
        this._cb_response = cb;
        this._cb_response_finish = cb_finish;
        this.view.setType(isSingle);
        title = title ? title : this.model.getInitTile();
        this.model.setTitle(title);
        this.model.setContent(content);
        this.view.updateTitle();
        this.view.updateContent(); 
    }

    private _onClick_confirm(){
        //console.log('_onClick_confirm')
        this._doConfirm();
    }
    private _onClick_cancel(){
        //console.log('_onClick_cancel')
        this._doFinish();
    }

    private _doConfirm(){
        if(this._cb_response){
            this._cb_response();
        }
        this.finish();
    }

    private _doFinish(){
        if(this._cb_response_finish){
            this._cb_response_finish();
        }
        this.finish();
    }
    //end
    
    onStartGame() {
        this.finish();
    }
}