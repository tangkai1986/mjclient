/*
author: JACKY
日期:2018-01-16 14:40:18
*/
   
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import RoomMgr from "../../GameMgrs/RoomMgr"; 
import UserMgr from "../../GameMgrs/UserMgr";
import GpsSdk from "../../SdkMgrs/GpsSdk"; 
import { SssDef } from "../../../Games/Sss/SssMgr/SssDef";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : RoomUserInfoCtrl;
//模型，数据处理
class Model extends BaseModel{
    userInfo:{} = null;
	constructor()
	{
        super();
    }
    setUid(uid)
    {
        this.userInfo=UserMgr.getInstance().getUserById(uid);
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        lbl_name:null,
        lbl_id:null,
        lbl_address:null,
        lbl_content:null,
        node_head:null,
        lbl_gender:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.ui.lbl_name = ctrl.lbl_name;
        this.ui.lbl_id = ctrl.lbl_id;
        this.ui.lbl_address = ctrl.lbl_address;
        this.ui.lbl_content = ctrl.lbl_content;
        this.ui.node_head = ctrl.node_head;
        this.ui.lbl_gender = ctrl.lbl_gender;
        this.addGrayLayer();
    }
    
    updateInfo (){
        //console.log("我的信息：",this.model.userInfo);
        let userInfo = this.model.userInfo
        switch(userInfo.sex){
            case 1:
            this.ui.lbl_gender.string = "男";
            break
            case 2:
            this.ui.lbl_gender.string = "女";
            break
            default:
            this.ui.lbl_gender.string = "女";
            break
        }
        this.ui.lbl_id.string = userInfo.logicid;
        this.ui.lbl_name.string = userInfo.nickname?userInfo.nickname.substring(0,6):'unknow';
        
        this.ui.lbl_content.string = userInfo.signature.trim();
        if(userInfo.signature.trim() == null || userInfo.signature.trim() == undefined){
            this.ui.lbl_content.string = "";
        }
        this.updateHead();
        if(cc.sys.isNative){G_PLATFORM.startLocation(0);}
        this.updateAddress();
    }
    updateHead (){
        UiMgr.getInstance().setUserHead(this.ui.node_head, this.model.userInfo.headid, this.model.userInfo.headurl)   
    }
    updateAddress(){
        if(UserMgr.getInstance().getUid() == this.model.userInfo.id){
            if(cc.sys.isNative){                
                this.ui.lbl_address.string = GpsSdk.getInstance().getAddress()==""?'未知':GpsSdk.getInstance().getAddress();
                //console.log("lbl_address1",this.ui.lbl_address.string);
            }else{
                this.ui.lbl_address.string = this.model.userInfo.create_city==""?'未知':this.model.userInfo.create_city;
                //console.log("lbl_address2",this.ui.lbl_address.string);
            }               
        }else{
            this.ui.lbl_address.string = this.model.userInfo.city==""&&this.model.userInfo.sub_city==""?'未知':(this.model.userInfo.city + this.model.userInfo.sub_city);
            //console.log("lbl_address3",this.ui.lbl_address.string);
        }
    }
}
//c, 控制
@ccclass
export default class RoomUserInfoCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property(cc.Label)
    lbl_name:cc.Label = null

    @property(cc.Label)
    lbl_id:cc.Label = null

    @property(cc.Label)
    lbl_address:cc.Label = null

    @property(cc.Label)
    lbl_content:cc.Label = null

    @property(cc.Node)
    node_head:cc.Node = null

    @property(cc.Node)
    node_close:cc.Node = null

    @property(cc.Label)
    lbl_gender:cc.Label = null

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
            "onProcess": this.onProcess,
            'onStartGame':this.onStartGame, 
            "onDissolutionRoom": this.onDissolutionRoom,
            onGameFinished:this.onGameFinished,
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events  = {
            locationResult: this.locationResult,
        }
	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.node_close, this.finish, '点击关闭')
        // this.connect(G_UiType.image, this.ui.node_changecard, this.node_changecard_cb, '点击换牌')
	}
	start () {

	}
    //网络事件回调begin
    onProcess(msg) {
		if (msg.process == SssDef.process_peipai) {
			this.finish();
		}else if(msg.process == SssDef.process_gamesettle){
			this.finish();
		}
	}
    onStartGame(msg) { 
	    this.finish(); 
    }

    onDissolutionRoom(msg) {
        if(msg.result) {
			this.finish();
		}
    }
    onGameFinished(msg)
	{  
        this.finish();  
	}
	//end
    //全局事件回调begin
    locationResult () {           
        this.view.updateAddress();
    }
	//end
    //按钮或任何控件操作的回调begin
    private node_changecard_cb () : void {
        if (RoomMgr.getInstance().getMySeatId() == this.model.userInfo.seatId) return;
        this.start_sub_module(G_MODULE.QzmjSwitchCardWithPlayerGm,function(uiCtrl){
            uiCtrl.setTargetSeatId(this.model.userInfo.seatId);
        },'QzmjSwitchCardWithPlayerGmCtrl');
      
    }
    //end
    
    //显示玩家信息，传入的对象和玩家自己的操作对象的结构是一样的
    setUid (uid){
        this.model.setUid(uid);
        this.view.updateInfo();
        if (UserMgr.getInstance().getUid() == uid ) {
        };
    }
}