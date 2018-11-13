/*
author: YOYO
日期:2018-03-02 14:07:09
*/
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import LocalStorage from "../../Plat/Libs/LocalStorage";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_bull_roomInfoCtrl;
let BullConst = null;
//模型，数据处理
class Model extends BaseModel{
    roomId:number = null                //房间id
    curRounds:number =null              //当前的局数
    curLogic:any
    bgState:any
	constructor()
	{
        super();
        this.curRounds = -1;
        BullConst = RoomMgr.getInstance().getDef();
        this.curLogic = RoomMgr.getInstance().getLogic().getInstance();
    }
    initBGState (){
        this.bgState = LocalStorage.getInstance().getBullRoomBGCfg();
        if(!this.bgState){
            this.bgState = 1;
            LocalStorage.getInstance().setBullRoomBGCfg(this.bgState);
        }
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        lbl_roomId:null,
        lbl_roomRounds:null,
        font_fjhsz : null,
        font_fjhszBlue : null,
        font_jsszlv:null,
        font_jsszBlue:null,
        font_fjhszkjq :null,
        font_isstartlv:null,
        font_isstartlanse:null,
        //==================
        node_fjhLabel :null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.initRoomIdFont();
         //  //更新到正确的背景
        this.model.initBGState();
	}
	//初始化ui
	initUi()
	{
       
        this.ui.font_fjhszkjq = ctrl.font_fjhszkjq;
        this.ui.font_jsszBlue = ctrl.font_jsszBlue;
        this.ui.font_jsszlv = ctrl.font_jsszlv;
        this.ui.font_fjhszBlue = ctrl.font_fjhszBlue;
        this.ui.font_fjhsz = ctrl.LabelAtlas_fjhsz;
        this.ui.lbl_roomId = ctrl.lbl_roomId;
        this.ui.lbl_roomRounds = ctrl.lbl_roomRounds;
        this.ui.font_isstartlv = ctrl.font_isstartlv;
        this.ui.font_isstartlanse = ctrl.font_isstartlanse;

        this.ui.node_fjhLabel = ctrl.node_fjhLabel;
    }
    
    updateRoomId(){
        this.ui.lbl_roomId.string = RoomMgr.getInstance().getRoomInfo().password;
    }

    updateRoomRounds(){
        let roundIndex = -1;
        let room = RoomMgr.getInstance();
        if(room.isGameStarted()) roundIndex = room.getRoundIndex();
        else roundIndex = room.getRoundIndex()-1;
        this.ui.lbl_roomRounds.string = `第${roundIndex+1}局`
    }
    initRoomIdFont(){
        this.ui.lbl_roomId.font = this.ui.font_fjhszkjq;
    }
    updateRoomIdFont(){
       
            let state = this.model.bgState;
            if(state ==1){
                this.ui.lbl_roomId.font = this.ui.font_fjhsz;
            }else if(state ==2){
                this.ui.lbl_roomId.font = this.ui.font_fjhszBlue;
            }
        
        
    }
    updatestartlvfont(){
        let state = this.model.bgState;
        if(state ==1){
            this.ui.node_fjhLabel.font = this.ui.font_isstartlv;
            this.ui.lbl_roomRounds.font = this.ui.font_isstartlv;
            this.ui.lbl_roomId.font = this.ui.font_isstartlv;
        }else if(state ==2){
            this.ui.lbl_roomRounds.font = this.ui.font_isstartlanse;
            this.ui.node_fjhLabel.font = this.ui.font_isstartlanse;
            this.ui.lbl_roomId.font = this.ui.font_isstartlanse;
        }
    }
    //局数数字
    updateRoundCountFont(){
      
            let state = this.model.bgState;
            if(state ==1){
                this.ui.node_fjhLabel.font = this.ui.font_jsszlv;
                this.ui.lbl_roomRounds.font = this.ui.font_jsszlv;
            }else if(state ==2){
                this.ui.lbl_roomRounds.font = this.ui.font_jsszBlue;
                this.ui.node_fjhLabel.font = this.ui.font_jsszBlue;
            }
        
       
    }
}
//c, 控制
@ccclass
export default class Prefab_bull_roomInfoCtrl extends BaseCtrl {
    view:View = null
    model:Model = null
	//这边去声明ui组件
    @property(cc.Label)
    lbl_roomId:cc.Label = null
    @property(cc.Label)
    lbl_roomRounds:cc.Label = null
    @property(cc.Font)
    LabelAtlas_fjhsz:cc.Font = null
    @property(cc.Font)
    font_fjhszBlue:cc.Font = null
    @property(cc.Font)
    font_jsszlv:cc.Font = null
    @property(cc.Font)
    font_jsszBlue:cc.Font = null
    @property(cc.Font)
    font_fjhszkjq:cc.Font = null
    @property(cc.Font)
    font_isstartlv:cc.Font = null
    @property(cc.Font)
    font_isstartlanse:cc.Font = null
    //===============
    @property({
        type:cc.Label,
        displayName:"房间号字"
    })
    node_fjhLabel:cc.Label= null
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
        this.n_events[BullConst.clientEvent.onStart] = this.onStart;
        this.n_events['connector.entryHandler.enterRoom'] = this.onMyEnterRoom;//自己进入的
        this.n_events['onGameFinished'] = this.onGameFinished;
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events = {
            'setAllTableLaebl':this.setAllTableLaebl,
        } 
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
         this.view.updateRoomId();
        this.view.updateRoomRounds();
	}
    //网络事件回调begin
    
    /*
    servertime_now:null,                //服务器时间
            servertime_next:null,               //服务器时间
            curRounds:null,                     //当前的局数
    */
   onStart(msg){
        this.model.curRounds = msg.curRounds;
        this.view.updateRoomRounds();
        this.view.updatestartlvfont();
    }
   
    //自己进入的
    onMyEnterRoom(msg){
        // this.view.updateRoomRounds();
        // this.view.updateRoomIdFont();
        let gamestart = msg.gamestarted
        if(gamestart){
            this.view.updateRoomRounds();
            this.view.updatestartlvfont();
           
        }else if(!gamestart){
           
            this.view.updateRoomIdFont();
            this.view.updateRoundCountFont();
        }
    }
    onGameFinished(msg){
        this.view.updateRoomIdFont();
        this.view.updateRoundCountFont();
    }
    // http_reqRoomInfo() 
	// {  
    //     let roomInfo = RoomMgr.getInstance().roominfo;
    //     //console.log('http_reqRoomInfo= ', roomInfo)
    //     this.model.roomId = roomInfo.id;
    //     this.model.curRounds = roomInfo.roundcount;
    //     this.view.updateRoomRounds();
    // }  

	//end
    //全局事件回调begin
    private setAllTableLaebl(){
         this.model.initBGState();
        //  this.view.updateRoundCountFont();
        //  this.view.updateRoomIdFont();
         this.view.updatestartlvfont();
    }
	//end
	//按钮或任何控件操作的回调begin
	//end
}