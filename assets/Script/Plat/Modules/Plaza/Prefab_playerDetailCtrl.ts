/*
author: YOYO
日期:2018-01-13 16:02:51
玩家个人详细信息界面
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UserMgr from "../../GameMgrs/UserMgr";
import UiMgr from "../../GameMgrs/UiMgr";
import GameNet from "../../NetCenter/GameNet";
import GpsSdk from "../../../Plat/SdkMgrs/GpsSdk";
import FrameMgr from "../../GameMgrs/FrameMgr"
import LoginMgr from "../../GameMgrs/LoginMgr";
import SwitchMgr from "../../GameMgrs/SwitchMgr";
import LocalStorage from "../../Libs/LocalStorage";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_playerDetailCtrl;
//模型，数据处理
class Model extends BaseModel{
    myInfo:any = null;
    editString:string = null;//编辑个性签名
    lastSignature:string = null;//初始个性签名
    public bingAccount = null;//绑定账号开关
	constructor()
	{
        super(); 
        UserMgr.getInstance().reqMyInfo();
        this.bingAccount = SwitchMgr.getInstance().get_switch_bing_account();
    }
    
    updateMyInfo(){        
        this.myInfo = UserMgr.getInstance().getMyInfo();
        this.editString = this.myInfo.signature; 
        this.lastSignature = this.myInfo.signature;        
        //console.log(`editString`, this.editString);
        //console.log(`lastSignature`, this.lastSignature);        
        //测试
        this._check();
    }
    updateSwitch(msg){
        this.bingAccount = msg.cfg.switch_bing_account;
    }
    //模拟
    private _check(){
        this.myInfo.idstatus = this.myInfo.idstatus?this.myInfo.idstatus:1;
        this.myInfo.headid = this.myInfo.headid?this.myInfo.headid:1;
        this.myInfo.headurl = this.myInfo.headurl?this.myInfo.headurl:cc.url.raw(`resources/Icons/img_rwtx.png`);
        this.myInfo.signature = this.myInfo.signature?this.myInfo.signature:'';
        this.myInfo.sex = this.myInfo.sex?this.myInfo.sex:2;
        this.myInfo.nickname = this.myInfo.nickname?this.myInfo.nickname:'unknow';
        this.myInfo.phone = this.myInfo.phone?this.myInfo.phone:"未绑定";
        this.myInfo.name = this.myInfo.name?this.myInfo.name:'未认证';
        this.myInfo.city = this.myInfo.city?this.myInfo.city:'未知';
        this.myInfo.sub_city = this.myInfo.sub_city?this.myInfo.sub_city:"";
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        editBox_info:null,
        node_img_head:null,
        lab_id:null,
        lab_sex:null,
        lab_nickName:null,
        lab_iphone:null,
        lab_realyName:null,
        lab_address:null,
        btn_realyName:null,
        node_btn_iphone:null
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
        this.ui.node_img_head = ctrl.node_img_head;
        this.ui.editBox_info = ctrl.editBox_info;
        this.ui.lab_id = ctrl.lab_id; 
        this.ui.lab_sex = ctrl.lab_sex;      
        this.ui.lab_nickName = ctrl.lab_nickName;
        this.ui.lab_iphone = ctrl.lab_iphone;
        this.ui.lab_realyName = ctrl.lab_realyName;
        this.ui.lab_address = ctrl.lab_address;
        this.ui.btn_realyName = ctrl.node_btn_realyName;
        this.ui.node_btn_iphone = ctrl.node_btn_iphone;
        this.ui.node_btn_iphone.active = false;
        this.showBingAccount();
    }

    updateMyInfo(){
        this.updateHead();
        this.updateSignature();
        this.updateID();
        this.updateSex();
        this.updateNickName();
        this.updateIphone(); 
        this.updateRealyName();        
        this.updateAddress();
        this.updataIdstatus();
    }

    private updateHead(){
        //console.log("我的头像刷新了",this.model.myInfo)
        UiMgr.getInstance().setUserHead(this.ui.node_img_head, this.model.myInfo.headid, this.model.myInfo.headurl);
    }
    private updateSignature(){
        this.ui.editBox_info.string = this.model.myInfo.signature.trim();
    }
    private updateID(){
        this.ui.lab_id.string = this.model.myInfo.logicid;
    }
    private updateSex(){
        //console.log("mySex",this.model.myInfo.sex);
        switch(this.model.myInfo.sex){
            case 1:
                //man男
                this.ui.lab_sex.string = '男';
                break;
            case 2:
                //women女
                this.ui.lab_sex.string = '女';
                break;
            default:
                //protected保密
                //若微信未设置性别则默认为女
                this.ui.lab_sex.string = '女';
                break;
        }
        //console.log("mySex--", this.ui.lab_sex.string);
    }
    private updateNickName(){
        this.ui.lab_nickName.string = this.model.myInfo.nickname.substring(0,6);
    }
    private updateIphone(){
        this.ui.lab_iphone.string = this.model.myInfo.phone;
    }
    private updateRealyName(){
        this.ui.lab_realyName.string = this.model.myInfo.name;
    }
    private updateAddress(){
        this.ui.lab_address.string = this.model.myInfo.city + this.model.myInfo.sub_city;
    }
    private updataIdstatus(){
        this.ui.btn_realyName.active = this.model.myInfo.idstatus==2?false:true;
    }
    private showBingAccount(){
        this.ui.node_btn_iphone.active = this.model.bingAccount == 1?true:false;
    }
}
//c, 控制
@ccclass
export default class Prefab_playerDetailCtrl extends BaseCtrl {
    //这边去声明ui组件
    @property({
		tooltip : "头像",
		type : cc.Node
	})
    node_img_head:cc.Node = null

    @property({
		tooltip : "个性签名",
		type : cc.EditBox
	})
    editBox_info:cc.EditBox = null

    @property({
		tooltip : "ID",
		type : cc.Label
	})
    lab_id:cc.Label = null
    
    @property({
        tooltip : "性别",
		type : cc.Label
    })
    lab_sex:cc.Label = null

    @property({
		tooltip : "昵称",
		type : cc.Label
	})
    lab_nickName:cc.Label = null

    @property({
		tooltip : "手机号",
		type : cc.Label
	})
    lab_iphone:cc.Label = null

    @property({
		tooltip : "实名",
		type : cc.Label
	})
    lab_realyName:cc.Label = null

    @property({
		tooltip : "所在地",
		type : cc.Label
	})
    lab_address:cc.Label = null

    @property({
		tooltip : "复制ID按钮",
		type : cc.Node
	})
    node_btn_copy:cc.Node = null

    @property({
		tooltip : "昵称修改按钮",
		type : cc.Node
	})
    node_btn_nickName:cc.Node = null

    @property({
		tooltip : "实名认证按钮",
		type : cc.Node
	})
    node_btn_realyName:cc.Node = null

    @property({
		tooltip : "定位按钮",
		type : cc.Node
	})
    node_btn_address:cc.Node = null

    @property({
		tooltip : "绑定手机号按钮",
		type : cc.Node
	})
    node_btn_iphone:cc.Node = null

    @property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
    node_btn_close:cc.Node = null
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
        this.n_events = {
            'http.reqMyInfo' : this.http_reqMyInfo,
            'http.reqGameSwitch':this.http_reqGameSwitch,
            'http.reqSyncUser':this.http_reqSyncUser,
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events  = {
            locationResult: this.locationResult,
            'weChat_empowerment_success': this.weChat_empowerment_success,
        }
	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.edit,this.ui.editBox_info.node,this.editBox_info_cb,"输入个人签名完毕");
        this.connect(G_UiType.image,this.node_btn_copy,this.node_btn_copy_cb,"点击复制");
        this.connect(G_UiType.image,this.node_btn_nickName,this.node_btn_nickName_cb,"点击刷新昵称");
        this.connect(G_UiType.image,this.node_btn_iphone,this.node_btn_iphone_cb,"点击电话");
        this.connect(G_UiType.image,this.node_btn_realyName,this.node_btn_realyName_cb,"点击实名");
        this.connect(G_UiType.image,this.node_btn_address,this.node_btn_address_cb,"点击地址");
        this.connect(G_UiType.image,this.node_btn_close,this.node_close_cb,"点击关闭");
	}
    //网络事件回调begin    
    private http_reqMyInfo(msg){
        //console.log("myinfoMsg",JSON.stringify(msg));
        this.model.updateMyInfo();
        this.view.updateMyInfo();
    }
    private http_reqGameSwitch(msg){        
        this.model.updateSwitch(msg);
        this.view.showBingAccount();
    }
    http_reqSyncUser(){ 
        UserMgr.getInstance().reqMyInfo();
        FrameMgr.getInstance().showTips("刷新成功",null,35,cc.color(0,255,30));
    }
	//end
	//全局事件回调begin
    locationResult (msg) {
        let address = GpsSdk.getInstance().getAddress();
        if(address){
            this.lab_address.string = address;
        }
        if (parseInt(msg.code)) {
            FrameMgr.getInstance().showTips(msg.content, null, 35, cc.color(0,255,50), cc.p(0,0), "Arial", 1500); 
        }else{
            FrameMgr.getInstance().showTips(msg.content, null, 35, cc.color(220,24,63), cc.p(0,0), "Arial", 1500);
        }
    }
    weChat_empowerment_success (msg) {
        let loginCache = LocalStorage.getInstance().getWeChatToken();
        //console.log("loginCache",loginCache.username,msg.username);
        if (loginCache.username != msg.username) {
            FrameMgr.getInstance().showDialog('登陆信息不合法,请重新登陆!',()=>{
                LoginMgr.getInstance().logOut();
            },'刷新失败');
            return;
        }
        //console.log("weChat_empowerment_success=",JSON.stringify(msg))
        UserMgr.getInstance().reqSyncUser(msg);
        msg.uid= LoginMgr.getInstance().getUid();
        msg.token= LoginMgr.getInstance().getToken();
        msg.gate_host= LoginMgr.getInstance().getHost();
        msg.gate_port= LoginMgr.getInstance().getPort();
        LocalStorage.getInstance().setWeChatToken(msg);
        //console.log("LocalStorage1",msg,"LocalStorage2",msg.uid,msg.token,msg.gate_host,msg.gate_port);        
    }
	//end
    //按钮或任何控件操作的回调begin
    private editBox_info_cb(name, event){
        //console.log(`editBox_info_cb`, event.getUserData().string);        
        //console.log(`editString--`, this.model.editString);
        //console.log(`lastSignature--`, this.model.lastSignature);
        this.model.editString = event.getUserData().string;
        if(this.model.editString != this.model.lastSignature){
            //个人签名发生了变化
            UserMgr.getInstance().reqEditSignature(this.model.editString);
        }
    }
    private node_btn_copy_cb(){        
        //console.log('node_btn_copy_cb')
        //实现复制内容到剪贴板
        //console.log('复制了微信号');
        if (cc.sys.isNative)
            G_PLATFORM.copyToClipboard (this.model.myInfo.logicid);
    }
    private node_btn_nickName_cb(){
        //console.log('node_btn_nickName_cb')
        if (cc.sys.isNative){
            G_PLATFORM.weChatLogin();
        }        
    }
    private node_btn_iphone_cb(){
        //console.log('node_btn_iphone_cb')
        this.start_sub_module(G_MODULE.bingPhone);
    }
    private node_btn_realyName_cb(){
        //console.log('node_btn_realyName_cb')
        this.start_sub_module(G_MODULE.shimingRenZheng);
    }
    private node_btn_address_cb(){
        //console.log('node_btn_address_cb')
        if (cc.sys.isNative)
            G_PLATFORM.startLocation(0)
    }    
    private node_close_cb(){
        this.finish();
    }
    //end
}
