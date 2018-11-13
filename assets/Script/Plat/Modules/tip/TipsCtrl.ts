/*
author: tk
日期:2018-02-3 11:26
玩家个人详细信息界面
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

const {ccclass, property} = cc._decorator;
let ctrl : Prefab_tipsCtrl;

//模型，数据处理
class Model extends BaseModel{
    fontSize:number = null;
    context:string = null;
    pos:{} = null;
    contentSize:{} = null;
    delayTime:number = null;
    fontColor:{} = null;
	font:string = null;
	startSecond:number = null;
	model = null;
	constructor()
	{
		super();

		var date = new Date();
		this.startSecond = date.getTime();
    }

}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        sprite_bg:null,
        lbl_Context:null
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
        this.ui.sprite_bg = ctrl.sprite_bg;
        this.ui.lbl_Context = ctrl.lbl_Context;
    }
    /**
     * 
     * @param pos 位置
     * @param color 颜色
     * @param font 字体
     * @param fontSize 字号
     * @param context 文本
     * @param delayTime 间隔时间
     * @param contentSize 显示框大小
     */
    showTip()
    {
    	this.ui.sprite_bg.node.setPosition(this.model.pos);
    	this.ui.lbl_Context.node.color = this.model.fontColor;
    	this.ui.lbl_Context.fontSize = this.model.fontSize;
    	this.ui.lbl_Context.fontFamily = this.model.font;
		this.ui.lbl_Context.string = this.model.context; 
		//获取提示文字的大小
		let size=this.ui.lbl_Context.node.getContentSize();
		//获取背景框的大小
		let h=this.ui.sprite_bg.node.getContentSize().height;
		//根据提示文字的宽和背景框的高一起来定义TipCtrl的大小
        this.ui.sprite_bg.node.setContentSize(size.width+60,h);
    }
}

//c, 控制
@ccclass
export default class Prefab_tipsCtrl extends BaseCtrl {

    @property(cc.Sprite)
    sprite_bg:cc.Sprite = null

    @property(cc.Label)
    lbl_Context:cc.Label = null
   
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
        // this.n_events = {
        //     'http.reqMyInfo' : this.http_reqMyInfo
        // }
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

    update(dt){
		var date = new Date();
		var curSecond = date.getTime();
    	if ((curSecond - this.model.startSecond) > this.model.delayTime) {
    		////console.log(this.callback);
	    	if (this.model.callback) {
	    		this.model.callback();
	    	}
	    	this.model.startSecond = null;
	    	this.finish();
		}
    }
    /**
     * 
     * @param pos 位置
     * @param color 颜色
     * @param font 字体
     * @param fontSize 字号
     * @param context 文本
     * @param delayTime 间隔时间(毫秒)
     * @param cb 回调
     */
    public showTips(context:string, cb?:Function, fontSize?:number, color?:{}, pos?:{}, font?:string, delayTime?:number, contentSize?:{})
    {
    	this.model.callback = cb;
        this.model.pos = pos;
        this.model.contentSize = contentSize;
    	this.model.fontColor = color;
    	this.model.fontSize = fontSize;
    	this.model.font = font;
    	this.model.context = context;
    	this.model.delayTime = delayTime;
    	this.view.showTip();
    }
    
}
