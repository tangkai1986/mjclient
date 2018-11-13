/*
author: JACKY
日期:2018-03-07 16:52:57
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import FrameMgr from "../../GameMgrs/FrameMgr";
import UserMgr from "../../GameMgrs/UserMgr";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_bingPhoneCtrl;
//模型，数据处理
class Model extends BaseModel{
	imgText:null;
	phoneText:null
	VerificationCode:null;
	time:number;
	labelImgText:string;
	forbidden:boolean;//限制发送验证码
	constructor()
	{
		super();
		this.time = 60;
		this.forbidden=true;
		let num = this.generateMixed(4);   
		//console.log(num); 
		this.labelImgText = num
	} 
  
	generateMixed(n) {
		let chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
		let res = "";
		for(let i = 0; i < n ; i ++) {
			let id = Math.ceil(Math.random()*35);
			res += chars[id];
		}
		return res;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		Btn_Exit:null,
		EditBox_Phone:null,
		Btn_VerificationCode:null,
		EditBox_VerificationCode:null,
		img_Verification:null,
		EditBox_imgVerification:null,
		Btn_sure:null,
		label_Img:null,
		btn_cancel:null,
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
		this.ui.label_Img = ctrl.label_img
		this.ui.btn_cancel = ctrl.btn_cancel
		this.ui.Btn_Exit = ctrl.Btn_Exit;
		this.ui.EditBox_Phone = ctrl.EditBox_Phone;
		this.ui.Btn_VerificationCode = ctrl.Btn_VerificationCode;
		this.ui.EditBox_VerificationCode = ctrl.EditBox_VerificationCode;
		this.ui.img_Verification = ctrl.img_Verification;
		this.ui.EditBox_imgVerification = ctrl.EditBox_imgVerification;
		this.ui.Btn_sure = ctrl.Btn_sure;
		this.ui.label_Img.string = this.model.labelImgText;

	}
	//验证图片
	// showPng(png){
	// 	this.ui.img_Verification.FrameSripte = png;
	// }
	showTime(){
		this.model.time--;
		if(this.model.time<0){
			this.model.forbidden = true;
			this.model.time = 60;
			this.ui.Btn_VerificationCode.getChildByName("label").getComponent(cc.Label).string = '获取验证码'
			ctrl.unscheduleAllCallbacks();
		}else{
			this.ui.Btn_VerificationCode.getChildByName("label").getComponent(cc.Label).string = `倒计时(${this.model.time})`
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_bingPhoneCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
	@property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
	Btn_Exit: cc.Node = null;

	@property({
		tooltip : "手机号码",
		type : cc.EditBox
	})
	EditBox_Phone: cc.EditBox = null;

	@property({
		tooltip : "验证码按钮",
		type : cc.Node
	})
	Btn_VerificationCode: cc.Node = null;

	@property({
		tooltip : "验证码",
		type : cc.EditBox
	})
	EditBox_VerificationCode: cc.EditBox = null;

	@property({
		tooltip : "验证图片",
		type : cc.Node
	})
	img_Verification: cc.Node = null;

	@property({
		tooltip : "图片验证码",
		type : cc.EditBox
	})
	EditBox_imgVerification: cc.EditBox = null;

	@property({
		tooltip : "确认按钮",
		type : cc.Node
	})
	Btn_sure: cc.Node = null;

	@property({
		tooltip : "取消按钮",
		type : cc.Node
	})
	btn_cancel: cc.Node = null;

	@property({
		tooltip : "随机码",
		type : cc.Label
	})
	label_img: cc.Node = null;
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
	defineNetEvents()
	{
		this.n_events={
			//网络消息监听列表
        'http.reqBindPhone':this.http_reqBindPhone,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.button, this.ui.Btn_Exit, this.onBtnExit_cb, '退出绑定手机')
		this.connect(G_UiType.button, this.ui.Btn_sure, this.onBtnsure_cb, '点击手机认证按钮')
		this.connect(G_UiType.button,this.ui.img_Verification,this.img_Verification_cb,'点击更换验证码')
		this.connect(G_UiType.button, this.ui.Btn_VerificationCode, this.onBtnVerificationCode_cb, '点击验证码按钮')
		this.connect(G_UiType.edit, this.ui.EditBox_imgVerification.node, this.onImgVerification_cb, '输入图片验证码');
		this.connect(G_UiType.edit, this.ui.EditBox_Phone.node, this.onEditBoxPhone_cb, '输入手机号码');
		this.connect(G_UiType.edit, this.ui.EditBox_VerificationCode.node, this.onEditBoxVerificationCode_cb, '输入手机验证码');
		this.connect(G_UiType.image,this.ui.btn_cancel,this.btn_cancel_cb,'取消按钮');
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	onBtnExit_cb(event){
		this.finish();
	}
	onBtnsure_cb(event){
		if (this.model.phoneText == null || this.model.phoneText == '' ) {
            FrameMgr.getInstance().showTips("手机号码不能为空!", null, 35, cc.color(220,24,63));
            return;
        }
       
		if (this.model.VerificationCode == null || this.model.VerificationCode == '') {
            FrameMgr.getInstance().showTips("手机验证码不能为空!", null, 35, cc.color(220,24,63));
            return;
        }
        UserMgr.getInstance().http_BingPhone({"phone":this.model.phoneText,"code":this.model.VerificationCode});
	}
	onBtnVerificationCode_cb(event){
		if (this.model.phoneText == null || this.model.phoneText == '' ) {
            FrameMgr.getInstance().showTips("手机号码不能为空!", null, 35, cc.color(220,24,63));
            return;
		}
		if (this.model.imgText == null || this.model.imgText == ''||this.model.imgText !=this.model.labelImgText) {
            FrameMgr.getInstance().showTips("图片验证码错误，请重新输入！!", null, 35, cc.color(220,24,63));
            return;
		}
		if(!this.model.forbidden){
			return
		}
		UserMgr.getInstance().http_VerificationCode({"phone":this.model.phoneText});
		let draw = /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/.test(
			this.ui.EditBox_Phone.string)
		if(draw){
			this.schedule(this.view.showTime,1);
			this.model.forbidden =false;
		}
	}
	onImgVerification_cb(eventtype,event){	
		if(eventtype=="editing-did-ended")
		{   
			this.model.imgText = event.target.getComponent(cc.EditBox).string;
		}	
	}
	onEditBoxPhone_cb(eventtype,event){
		if(eventtype=="editing-did-ended")
		{   
			this.model.phoneText = event.target.getComponent(cc.EditBox).string;
		}	
	}
	onEditBoxVerificationCode_cb(eventtype,event){
		if(eventtype=="editing-did-ended")
		{   
			this.model.VerificationCode = event.target.getComponent(cc.EditBox).string;
		}	
	}
	 img_Verification_cb(){
		this.ui.label_Img.string=this.model.generateMixed(4)
		this.model.labelImgText= this.ui.label_Img.string;
	 }
	btn_cancel_cb(){
		this.finish();
	}
	http_reqBindPhone(msg){
		if(msg.result){
			FrameMgr.getInstance().showTips('手机绑定成功',null,35,cc.color(0,255,50)); 
		}else{
			FrameMgr.getInstance().showTips('手机绑定失败',null,35,cc.color(220,24,63)); 
		}
		this.finish()
	}
	//end
}