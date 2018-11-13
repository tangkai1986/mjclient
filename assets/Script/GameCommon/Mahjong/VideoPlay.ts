
/*
author: JACKY
日期:2018-01-11 18:49:15
*/  
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";  
import RecordMgr from "../../Plat/GameMgrs/RecordMgr";
import { MahjongDef } from "./MahjongDef";
 
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : VideoPlayCtrl;
//模型，数据处理
class Model extends BaseModel{ 
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef(); 	
    bPause=false;
	constructor()
	{
		super();

	}
   
    //找到屏幕拥有者的逻辑坐标  
	clear(  )
	{
        // body 
        this.bPause=false;
	}  
 
    
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={ 
        btn_prestep:null, 
        btn_play:null, 
        btn_stop:null,
        btn_nextstep:null,   
        lbl_curstep:null,
        lbl_totalstep:null,
        lbl_leftcardcount:null,
        lbl_roundindex:null, 
        lbl_recordcode:null, 
		
		node_play:null,
		node_replay:null,
        btn_replay:null,
        node_recordcode:null,
        btn_exit:null,
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
        this.ui.btn_prestep=ctrl.btn_prestep;
        this.ui.btn_play=ctrl.btn_play;
        this.ui.btn_stop=ctrl.btn_stop;
        this.ui.btn_exit=ctrl.btn_exit;
        this.ui.btn_nextstep=ctrl.btn_nextstep;  
        this.ui.lbl_curstep=ctrl.lbl_curstep; 
        this.ui.lbl_totalstep=ctrl.lbl_totalstep; 
        this.ui.lbl_leftcardcount=ctrl.lbl_leftcardcount; 
        this.ui.lbl_roundindex=ctrl.lbl_roundindex; 
        this.ui.lbl_curstep.string=1
		this.ui.node_play=ctrl.node_play;
		this.ui.node_replay=ctrl.node_replay;
		this.ui.btn_replay=ctrl.btn_replay; 
        this.ui.node_play.active=false; 
        this.ui.node_replay.active=false; 
        this.ui.lbl_recordcode=ctrl.lbl_recordcode;
        this.ui.node_recordcode=ctrl.node_recordcode; 
        this.ui.lbl_recordcode.string=RecordMgr.getInstance().getRecordCode();
    } 
    updatePlayState(){

        this.ui.btn_play.active = this.model.bPause;
        this.ui.btn_stop.active = !this.model.bPause;
    }
    updateLoopIndex(){ 
        this.ui.lbl_curstep.string=RecordMgr.getInstance().getLoopIndex();
    }
	//清除
	clear( )
	{  
    }  
    initVideoInfo(){ 
        this.ui.node_play.active=true;
        this.ui.node_replay.active=false;
        this.ui.lbl_totalstep.string=RecordMgr.getInstance().getLoopCount()
        this.ui.lbl_roundindex.string=RoomMgr.getInstance().getRoundIndex()+1;
        this.updateLoopIndex();
        this.updateLeftCardCount(); 
    }
    finishVideo(){
        //console.log("隐藏播放按钮")
        this.ui.node_play.active=false;
        this.ui.node_replay.active=true;
    }
    updateLeftCardCount(  )
	{ 
		this.ui.lbl_leftcardcount.string=this.model.mahjongLogic.getInstance().getLeftCardCount();
    }   
    recover(){
        this.initVideoInfo();
    } 
}
//c, 控制
@ccclass
export default class VideoPlayCtrl extends BaseCtrl {
	//这边去声明ui组件 
    //上一步 
    @property(cc.Node)
	btn_prestep=null; 
    //播放
    @property(cc.Node)
    btn_play=null; 
    //暂停
    @property(cc.Node)
    btn_stop=null; 
    //下一步
    @property(cc.Node)
    btn_nextstep=null;  
      
    @property(cc.Node)
    node_recordcode=null; 
    
    @property(cc.Label)
    lbl_curstep=null;
    @property(cc.Label)
    lbl_totalstep=null;
    @property(cc.Label)
    lbl_leftcardcount=null;
    @property(cc.Label)
    lbl_roundindex=null;
    @property(cc.Label)
    lbl_recordcode=null;

    
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


    @property(cc.Node)
	node_play=null;  
    @property(cc.Node)
	node_replay=null;  
    @property(cc.Node)
    btn_replay=null;  
    
    @property(cc.Node)
    btn_exit=null;  
    
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		this.initMvc(Model,View);  
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events={ 
			'onSeatChange':this.onSeatChange, 
            'onProcess':this.onProcess,  
            'onSyncData':this.onSyncData,   
        } 
	}
	//定义全局事件
	defineGlobalEvents()
	{
		//全局消息
		this.g_events={ 
            'usersUpdated':this.usersUpdated,   
            'loopChanged':this.loopChanged,   
		}    
    }  
    onSyncData(){
        this.view.recover();
    }
    loopChanged(){
        //console.log("步长变化了")
        this.view.updateLoopIndex();
    }
    onProcess(msg){
        this.view.updateLeftCardCount();  
        switch(msg.process)
        {
            case  MahjongDef.process_loop:
                this.view.initVideoInfo();
            break;
            case  MahjongDef.process_gamesettle:
                this.view.finishVideo();
            break;
        }
	}
    onSeatChange(msg){
		// body
		this.view.updateLeftCardCount(); 
	}
    usersUpdated(){

    }
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.ui.btn_prestep, this.btn_prestep_cb, '上一步')  
        this.connect(G_UiType.image, this.ui.btn_play, this.btn_play_cb, '播放')  
        this.connect(G_UiType.image, this.ui.btn_stop, this.btn_play_cb, '暂停')  
        this.connect(G_UiType.image, this.ui.btn_exit, this.btn_exit_cb, '退出') 
        this.connect(G_UiType.image, this.ui.btn_nextstep, this.btn_nextstep_cb, '下一步')   
        this.connect(G_UiType.image, this.ui.btn_replay, this.btn_replay_cb, '重播')    
	}
	start () {
    }  
    //上一步
    btn_prestep_cb(){
        RecordMgr.getInstance().stopLoop()
        this.model.bPause=true; 
        this.view.updatePlayState()
        RecordMgr.getInstance().gotoPreStep();
    }
    //退出录像回放
    btn_exit_cb(){ 
        this.start_module(G_MODULE.Plaza);
    }
    pause(){
        if(this.model.bPause)
        {
            return;
        } 
        RecordMgr.getInstance().stopLoop()
        this.model.bPause=!this.model.bPause;
        this.view.updatePlayState();
    }
    play()
    {
        if(!this.model.bPause)
        {
            return;
        } 
        RecordMgr.getInstance().startLoop()
        this.model.bPause=!this.model.bPause;
        this.view.updatePlayState();
    }
    //播放/暂停
    btn_play_cb(){
        if(this.model.bPause)
        {
            this.play();
        }
        else
        {
            this.pause();
        } 
        this.ui.btn_play.active = this.model.bPause;
        this.ui.btn_stop.active = !this.model.bPause;
    }
    //下一步
    btn_nextstep_cb(){
        RecordMgr.getInstance().stopLoop()
        this.model.bPause=true; 
        this.view.updatePlayState();
        RecordMgr.getInstance().gotoNextStep();
    }   
    btn_replay_cb(){
        //重播
        RecordMgr.getInstance().replay();
    }
}