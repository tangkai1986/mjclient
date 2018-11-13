import BaseModel from "../Plat/Libs/BaseModel";
import BaseCtrl from "../Plat/Libs/BaseCtrl";
import BaseView from "../Plat/Libs/BaseView";
import RoomMgr from "../Plat/GameMgrs/RoomMgr";
import YySdkMgr from "../Plat/SdkMgrs/YySdk";
import GEventDef from "../Plat/GameMgrs/GEventDef";
import BetMgr from "../Plat/GameMgrs/BetMgr";
import FrameMgr from "../Plat/GameMgrs/FrameMgr";

//MVC模块
const {ccclass, property} = cc._decorator;
let ctrl : Offline_voiceBtnCtrl;
//模型，数据处理
class Model extends BaseModel{
    curSecond=null;
    endSecend=null;
	constructor(){
        super();  
        this.curSecond = 0;  
        this.endSecend = 0;
    }      
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
        node_voice:null,
	};
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.ui.node_voice = ctrl.node_voice;
        this.ui.node_voice.getChildByName('node_speak').active = false; 
    }
}
//c, 控制
@ccclass
export default class Offline_voiceBtnCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Node)
    node_voice:cc.Node = null;
	
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
        this.initMvc(Model,View);
        if(this.isIPhoneX() && BetMgr.getInstance().getGameId()!=13){
            this.view.ui.node_voice.getComponent(cc.Widget).right = -540;
        }else{
            this.view.ui.node_voice.getComponent(cc.Widget).right = -630;
            if(BetMgr.getInstance().getGameId()==13){
                this.view.ui.node_voice.getComponent(cc.Widget).right = 16.5;
            }
        }
        ////console.log("widget right voice", this.view.ui.node_voice.getComponent(cc.Widget).right);
	}
    isIPhoneX () {
        let size = cc.view.getFrameSize();
        ////console.log("设备 size", size)
        if(
            cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE
			&& ((size.width == 2436 && size.height == 1125) 
			||(size.width == 1125 && size.height == 2436))
			// size.width == 812 && size.height == 375
        ) {
            return true;
        }
        return false;
    }
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events={ 
			"EnterBackground":this.EnterBackground,
			"EnterForeground":this.EnterForeground,
		}
    }    
	//绑定操作的回调
	connectUi(){
		this.connect(G_UiType.button, this.ui.node_voice, {"startCallBack":this.node_voice_start, "moveCallBack":null, "endCallBack":this.node_voice_end,"cancelCallBack":this.node_voice_cancel}, '点击录音按钮');        
    }
    //网络事件回调begin  
	//end
    //全局事件回调begin 
  
    EnterBackground () { 
	}
	EnterForeground () { 
    }
    resetTime()
    {
        this.model.endSecend=0;
        this.model.curSecond=0;
    }
	//end
    //按钮或任何控件操作的回调begin
    //按住开始录音
    node_voice_start(){
        //如果房间有正在播放语音的动作,就不能录音
        if(RoomMgr.getInstance().isPlayingRecord())
        {
            return;
        }
        //如果在录音状态中就不让他继续调用
        if(RoomMgr.getInstance().isRecording()){
            return ;
        } 
        ////console.log("node_voice_start");
        //判定是否开启录音权限
        if(YySdkMgr.getInstance().getBolYYEvent()){ 
            //获取录音起始时间        
            let date = new Date();
            this.model.curSecond = date.getTime();   
            //设为正在录音中标志
            RoomMgr.getInstance().startRecording();
            this.view.ui.node_voice.getChildByName('node_speak').active = true;
            this.view.ui.node_voice.getChildByName('node_speak').getChildByName('anim_speak').getComponent(cc.Animation).play('anim_speak');
            YySdkMgr.getInstance().StartRecording();
        }else{ 
            FrameMgr.getInstance().showTips("语音正在连接中", null, 35, cc.color(0,255,0), cc.p(0,0), "Arial", 1000);
        }        
    }
    node_voice_end(){
        //如果不是正在录音中就不处理以下流程
        if(!RoomMgr.getInstance().isRecording()){
            return ;
        } 
        //隐藏掉录音中的动画显示
        ////console.log("node_voice_end");        
        this.view.ui.node_voice.getChildByName('node_speak').active = false;
        //记录录音结束的事件
        let date = new Date();
        this.model.endSecend = date.getTime(); 
        //记录下录音总时间,服务器会帮忙广播这个时间，在座位头像上显示
        RoomMgr.getInstance().setvoiceLength((this.model.endSecend/1000 - this.model.curSecond/1000));
        //调用java底层停止录音的时候,java层就会自动将录音上传到gvoice服务器，所以这边无论时间录制多久,现有代码都会上传,
        //如果不调用StopRecording虽然不会上传录音，但是会一直录,造成状态错误
        YySdkMgr.getInstance().StopRecording(); 
        RoomMgr.getInstance().stopRecording();     
        this.resetTime();     
    }
    node_voice_cancel(){
        this.node_voice_end();    
    }
    //end
    
    onDestroy(){
        this.node_voice_cancel();
        super.onDestroy();
    }
}