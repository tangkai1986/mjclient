/*
author: YOYO
日期:2018-03-28 10:36:18
*/
import BaseModel from "../Plat/Libs/BaseModel";
import BaseCtrl from "../Plat/Libs/BaseCtrl";
import BaseView from "../Plat/Libs/BaseView";
import RoomMgr from "../Plat/GameMgrs/RoomMgr";
import YySdkMgr from "../Plat/SdkMgrs/YySdk";
import LoaderMgr from "../AppStart/AppMgrs/LoaderMgr";
import GEventDef from "../Plat/GameMgrs/GEventDef";
import SettingMgr from "../Plat/GameMgrs/SettingMgr";
import GameAudioCfg from "../Plat/CfgMgrs/GameAudioCfg";
import FrameMgr from "../Plat/GameMgrs/FrameMgr";
import BetMgr from "../Plat/GameMgrs/BetMgr";
import SwitchMgr from "../Plat/GameMgrs/SwitchMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
const VoiceState = {
    state1 : 1,//麦克风开启，收听开启
    state2 : 2,//麦克风关闭，收听开启
    state3 : 3,//麦克风关闭，收听关闭
}
const WORDS = {
    1 : "麦克风和收听已开启，可与其他人实时通话",
    2 : "麦克风已关闭，当前只能听不能讲",
    3 : "麦克风和收听已关闭，无法与其他人实时通话",
}
const Time_wordShow = 1.5;
const voiceVolWhenMic = 20;
let ctrl : Common_voiceBtnCtrl;
//模型，数据处理
class Model extends BaseModel{
    public RealTimeSpeechSwitch = null;//实时语音开关
    state=3;
    errState=0;
	constructor(){
        super();
        this.RealTimeSpeechSwitch = SwitchMgr.getInstance().get_switch_real_time_speech();
        this.errState=0;
        this.state=3;
        if(cc.sys.isNative){
            if(G_PLATFORM.getMicrophoneMute() && G_PLATFORM.getSpeakerphoneOn()){
                this.state = 1;
            }else if(!G_PLATFORM.getMicrophoneMute() && G_PLATFORM.getSpeakerphoneOn()){
                this.state = 2;
            }else if(!G_PLATFORM.getMicrophoneMute() && !G_PLATFORM.getSpeakerphoneOn()){
                this.state = 3;
            }
            ////console.log("getMicrophoneMute1",G_PLATFORM.getMicrophoneMute());
            ////console.log("getSpeakerphoneOn1",G_PLATFORM.getSpeakerphoneOn());
            ////console.log("state1",this.state);
        }
    }
    updateSwitch(msg){
        this.RealTimeSpeechSwitch = msg.cfg.switch_real_time_speech; 
    }        
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_state1:null,
		node_state2:null,
        node_state3:null,
        node_tip:null
	};
	node:cc.Node;
    model:Model
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui.node_state1 = ctrl.node_state1;
		this.ui.node_state2 = ctrl.node_state2;
        this.ui.node_state3 = ctrl.node_state3;
        this.showSwitch();
    }
    showSwitch(){
        this.ui.node_state1.active = this.model.RealTimeSpeechSwitch == 1?true:false;
        ////console.log("node_state1",this.ui.node_state1.active);
    }
    
    //3态语音刷新
    updateVoiceBtn (state){
        switch(state){
            case VoiceState.state1:
            this.ui.node_state2.active = false;
            this.ui.node_state3.active = false;
            break
            case VoiceState.state2:
            this.ui.node_state2.active = true;
            this.ui.node_state3.active = false;
            break
            case VoiceState.state3:
            this.ui.node_state2.active = false;
            this.ui.node_state3.active = true;
            break
            default:
            break;
        }
        this.showTip();
    }
    //展示提示
    showTip (){
        if(!this.ui.node_tip){
            LoaderMgr.getInstance().loadRes(G_MODULE.Common_voiceTip, (prefab)=>{
                this.ui.node_tip = cc.instantiate(prefab);
                this.ui.node_tip.parent = this.ui.node_state1;
                this.ui.node_tip.x = -this.ui.node_state1.width/2;
                this.updateTip();
            })
        }else{
            this.updateTip();
        }
    }
    private updateTip (){
        this.ui.node_tip.active = true;
        let bg = this.ui.node_tip.children[0];
        let lbl_content = this.ui.node_tip.children[1].getComponent(cc.Label);
        let word = WORDS[this.model.state];
        lbl_content.string = word;
        bg.width = lbl_content.node.width + 40;
        this.doDelay();
    }
    private doDelay (){
        let curNode = this.ui.node_tip;
        curNode.stopAllActions();
        let act1 = cc.delayTime(1.5);
        let act2 = cc.callFunc(()=>{
            curNode.active = false;
        }, this);
        curNode.runAction(cc.sequence(act1, act2));
    }
}
//c, 控制
@ccclass
export default class Common_voiceBtnCtrl extends BaseCtrl {
	view:View = null
    model:Model = null
	//这边去声明ui组件
	@property(cc.Node)
    node_state1:cc.Node = null;
    @property(cc.Node)
    node_state2:cc.Node = null;
    @property(cc.Node)
	node_state3:cc.Node = null;
	
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
        this.initMvc(Model,View);
        if(this.isIPhoneX() && BetMgr.getInstance().getGameId()!=13){
            this.view.ui.node_state1.getComponent(cc.Widget).right = -540;
        }else{
            this.view.ui.node_state1.getComponent(cc.Widget).right = -630;
            if(BetMgr.getInstance().getGameId()==13){
                this.view.ui.node_state1.getComponent(cc.Widget).right = 16.5;
            }
        }
        ////console.log("widget right voice", this.view.ui.node_state1.getComponent(cc.Widget).right);
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
	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
            'http.reqGameSwitch':this.http_reqGameSwitch,
        }
        this.n_events['connector.entryHandler.enterRoom'] = this.myEnterRoom;
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events[GEventDef.voice_JoinRoomOk] = this.onJoinVoiceRoom;
        this.g_events[GEventDef.voice_DroppedRoomOk] = this.onDroppedRoomOk;
        this.g_events[GEventDef.voice_QuitRoomOk] = this.onQuitVoiceRoom;
    }
    
	//绑定操作的回调
	connectUi(){
        this.connect(G_UiType.image, this.ui.node_state1, this.node_state1_cb, '点击声音按钮');
    }
    //网络事件回调begin
    http_reqGameSwitch(msg){
        this.model.updateSwitch(msg);
        this.view.showSwitch();
    }
    myEnterRoom(){
        let voiceState = 3;
        if(cc.sys.isNative){
            if(G_PLATFORM.getMicrophoneMute() && G_PLATFORM.getSpeakerphoneOn()){
                voiceState = 1;
            }else if(!G_PLATFORM.getMicrophoneMute() && G_PLATFORM.getSpeakerphoneOn()){
                voiceState = 2;
            }else if(!G_PLATFORM.getMicrophoneMute() && !G_PLATFORM.getSpeakerphoneOn()){
                voiceState = 3;
            }
        } 
        this.model.state=voiceState;
        this.view.updateVoiceBtn(this.model.state);
    }
	//end
    //全局事件回调begin
    onJoinVoiceRoom(){
        this.model.errState = 0;
        let room = RoomMgr.getInstance();
        let voiceState = 3;
        if(cc.sys.isNative){
            if(G_PLATFORM.getMicrophoneMute() && G_PLATFORM.getSpeakerphoneOn()){
                voiceState = 1;
            }else if(!G_PLATFORM.getMicrophoneMute() && G_PLATFORM.getSpeakerphoneOn()){
                voiceState = 2;
            }else if(!G_PLATFORM.getMicrophoneMute() && !G_PLATFORM.getSpeakerphoneOn()){
                voiceState = 3;
            }
        }
        this.model.state=voiceState;
        room.swithVoiceState(voiceState);
        this.view.updateVoiceBtn(this.model.state);
    }
    onDroppedRoomOk(args){
        this.model.errState = 1;
        YySdkMgr.getInstance().setyyEnter(false);
        ////console.log("gvoice dropped",args,this.model.errState);
    }
    onQuitVoiceRoom(){
        ////console.log("gvoice语音推出了")
        FrameMgr.getInstance().showDialog("语音退出了",()=>{}, "确认", () => {}); 
    }
	//end
    //按钮或任何控件操作的回调begin
    node_state1_cb(){
        if(this.model.errState){
            FrameMgr.getInstance().showTips("语音正在连接中", null, 35, cc.color(0,255,0), cc.p(0,0), "Arial", 1000);
            return;
        }
        this.switchVoiceState();
    }
    //切换类型
    private switchVoiceState (){
        let room = RoomMgr.getInstance();
        let state =this.model.state;
        let nextState=this.model.state;
        state=(nextState%3)+1;
        ////console.log("states",this.model.state,state);
        switch(state)
        {
            case VoiceState.state1:
                YySdkMgr.getInstance().micUp();
                YySdkMgr.getInstance().speakerUp(); 
            break
            case VoiceState.state2:
                YySdkMgr.getInstance().micDown(1)
                YySdkMgr.getInstance().speakerUp();
            break
            case VoiceState.state3:
                YySdkMgr.getInstance().micDown(1)
                YySdkMgr.getInstance().speakerDown(1);
            break
            default:
            break;
        }
        if(cc.sys.isNative){
            if(G_PLATFORM.getMicrophoneMute() && G_PLATFORM.getSpeakerphoneOn()){
                state = 1;
            }else if(!G_PLATFORM.getMicrophoneMute() && G_PLATFORM.getSpeakerphoneOn()){
                state = 2;
            }else if(!G_PLATFORM.getMicrophoneMute() && !G_PLATFORM.getSpeakerphoneOn()){
                state = 3;
            }
        }
        room.swithVoiceState(state);
        this.model.state= state;
        this.view.updateVoiceBtn(this.model.state);        
    }
    //end
    
    onDestroy(){
        this.model.errState = 0;
        YySdkMgr.getInstance().LeaveRoom();
        super.onDestroy();
    }
}