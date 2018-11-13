/*
author: tk
日期:2018-02-3 11:26
玩家个人详细信息界面
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import FrameMgr from "../../GameMgrs/FrameMgr";
import UserMgr from "../../GameMgrs/UserMgr";

const {ccclass, property} = cc._decorator;
let ctrl : Prefab_shimingRenZhengCtrl;

//模型，数据处理
class Model extends BaseModel{
    realName:string = null
    PersonID:string = null
	constructor()
	{
        super();
    }

}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        node_submit:null,
        node_cancel:null,
        realName:null,
        PersonID:null
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
        this.ui.node_submit = ctrl.node_submit;
        this.ui.node_cancel = ctrl.node_cancel;
        this.ui.realName = ctrl.realName;
        this.ui.PersonID = ctrl.PersonID;
    }
}

//c, 控制
@ccclass
export default class Prefab_shimingRenZhengCtrl extends BaseCtrl {

    @property({
		tooltip : "认证按钮",
		type : cc.Node
	})
    node_submit:cc.Node = null

    @property({
		tooltip : "取消按钮",
		type : cc.Node
	})
    node_cancel:cc.Node = null

	@property({
		tooltip : "真实姓名",
		type : cc.EditBox
	})
	realName : cc.EditBox = null;

	@property({
		tooltip : "身份证号",
		type : cc.EditBox
	})
	PersonID : cc.EditBox = null;
   
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
            'http.ReqIdCardRegistration' : this.http_ReqIdCardRegistration,
         }
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.node_cancel, this.node_cancel_cb, '点击取消');
		this.connect(G_UiType.image, this.ui.node_submit, this.node_submit_cb, '点击认证');
		this.connect(G_UiType.edit, this.ui.realName.node, this.realName_cb, '输入真实姓名');
		this.connect(G_UiType.edit, this.ui.PersonID.node, this.PersonID_cb, '输入身份证号');
	}
	start () {
	}
    //网络事件回调begin

	/**
	 * 点击关闭
	 * @param event 
	 */
	private node_cancel_cb (event) : void {
		this.finish();
    }
    //提交
    private node_submit_cb(){        
        if (this.model.realName == null || this.model.realName == '' ) {
            //console.log("请填写真实名");
            FrameMgr.getInstance().showTips("请填写真实名!", null, 35, cc.color(255,36,0));
            return;
        }
        if (this.model.PersonID == null || this.model.PersonID == '') {
            //console.log("请填写身份证");
            FrameMgr.getInstance().showTips("请填写身份证!", null, 35, cc.color(255,36,0));
            return;
        }
        //console.log('真实姓名',this.model.realName.length);
        //console.log('身份证',this.model.PersonID);
        //console.log('node_submit_cb');
        UserMgr.getInstance().ReqIdCardRegistration({"name":this.model.realName,"card":this.model.PersonID});
    }
    //真实姓名
    private realName_cb(eventtype,event){
        //console.log('realName_cb',event.target.getComponent(cc.EditBox).string);        
        if(eventtype == "text-changed"){
            if(this.clearEmoji(event.target.getComponent(cc.EditBox).string) == true){
                event.target.getComponent(cc.EditBox).string = "";
            }            
        }
        if(eventtype=="editing-did-ended")
        {   
            //console.log(event.target.getComponent(cc.EditBox).string)
            //editing-did-ended
            this.model.realName = event.target.getComponent(cc.EditBox).string;
        }
    }
    //身份证号
    private PersonID_cb(eventtype,event){
        //console.log('PersonID_cb');
        //editing-did-ended
        if(eventtype=="editing-did-ended")
        {
            this.model.PersonID = event.target.getComponent(cc.EditBox).string;
        }
    }
    //过滤表情
    clearEmoji(emoji){        
        for ( var i = 0; i < emoji.length; i++) {  
            var hs = emoji.charCodeAt(i);  
            if (0xd800 <= hs && hs <= 0xdbff) {  
                if (emoji.length > 1) {  
                    var ls = emoji.charCodeAt(i + 1);  
                    var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;  
                    if (0x1d000 <= uc && uc <= 0x1f77f) {
                        return true;  
                    }  
                }  
            } else if (emoji.length > 1) {  
                var ls =emoji.charCodeAt(i + 1);  
                if (ls == 0x20e3) {
                    return true;  
                }  
            } else {  
                if (0x2100 <= hs && hs <= 0x27ff) {
                    return true;  
                } else if (0x2B05 <= hs && hs <= 0x2b07) {
                    return true;  
                } else if (0x2934 <= hs && hs <= 0x2935) {
                    return true;  
                } else if (0x3297 <= hs && hs <= 0x3299) {
                    return true;  
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030  
                        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b  
                        || hs == 0x2b50) {
                    return true;  
                }  
            }  
        }  
    }

    http_ReqIdCardRegistration()
    {
        //显示提交成功
        //console.log("认证成功");
        FrameMgr.getInstance().showTips("实名认证成功!", null, 35, cc.color(0,255,30));
        //刷新我的信息
        UserMgr.getInstance().reqMyInfo();
        this.finish();
    }
}
