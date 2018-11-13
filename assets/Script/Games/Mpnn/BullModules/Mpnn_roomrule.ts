/*
author: YOYO
日期:2018-02-02 10:05:31
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import UiMgr from "../../../Plat/GameMgrs/UiMgr";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import MpnnPlayer from "../BullMgr/MpnnPlayer";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import MpnnLogic from "../BullMgr/MpnnLogic";
import LocalStorage from "../../../Plat/Libs/LocalStorage";
import RoomOptionCfg from "../../../Plat/CfgMgrs/RoomOptionCfg";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_bull_SeatCtrl;
let BullConst = null;
//模型，数据处理
class Model extends BaseModel{
    gamestart = 1;
    bgState
	constructor()
	{
        super();
        BullConst = RoomMgr.getInstance().getDef();
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
    // model:Model = null
	ui={
        //在这里声明ui
      roundCount:null,
      difen:null,
      beishu:null,
      font_lanse:null,
      font_lvse:null,
      font_isstartlv:null,
      font_isstarlanse:null,
      mingpaizi:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.model.initBGState();
	}
	//初始化ui
	initUi()
	{
       this.ui.roundCount = ctrl.roundCount;
       this.ui.difen = ctrl.difen;
       this.ui.beishu = ctrl.beishu;
       this.ui.mingpaizi = ctrl.mingpaizi;
       this.ui.font_isstarlanse = ctrl.font_isstarlanse;
       this.ui.font_isstartlv = ctrl.font_isstartlv;
       this.ui.font_lvse = ctrl.font_lvse;
       this.ui.font_lanse = ctrl.font_lanse;
       this.model.initBGState();
       //this.updatenostart();
       this.updateCfg();
    }
    updateisstart(){
        if(this.model.gamestart==2)
        {
            let state  = this.model.bgState;
            if(state ==1){
                this.ui.roundCount.font = this.ui.font_isstartlv;
                this.ui.difen.font = this.ui.font_isstartlv;
                this.ui.beishu.font = this.ui.font_isstartlv;
                this.ui.mingpaizi.font = this.ui.font_isstartlv;
            }else if(state ==2){
                this.ui.roundCount.font = this.ui.font_isstarlanse;
                this.ui.difen.font = this.ui.font_isstarlanse;
                this.ui.beishu.font = this.ui.font_isstarlanse;
                this.ui.mingpaizi.font = this.ui.font_isstarlanse;
            }
        }
   
    }
    updatenostart(){
        if(this.model.gamestart==1){
            let state  = this.model.bgState;
            if(state ==1){
                this.ui.roundCount.font = this.ui.font_lvse;
                this.ui.difen.font = this.ui.font_lvse;
                this.ui.beishu.font = this.ui.font_lvse;
                this.ui.mingpaizi.font = this.ui.font_lvse;
            }else if(state ==2){
                this.ui.roundCount.font = this.ui.font_lanse;
                this.ui.difen.font = this.ui.font_lanse;
                this.ui.beishu.font = this.ui.font_lanse;
                this.ui.mingpaizi.font = this.ui.font_lanse;
            }
        }
    
    } 
    updateCfg(){
        let fangkacfg = RoomMgr.getInstance().getFangKaCfg();
        let beishu = RoomOptionCfg.getInstance().getGameRoomOption(19)
        let content = beishu["content"]["v_settleRule"][fangkacfg.v_settleRule]
        let difen = beishu["content"]["v_minChip"][fangkacfg.v_minChip]
        content=content.replace(/\*/g,'X');
        this.ui.beishu.string = content;
        this.ui.roundCount.string = `${fangkacfg.v_roundcount}局`
        if(fangkacfg.v_wanglaiLimit ==0){
            this.ui.difen.string = difen;
        }else if(fangkacfg.v_wanglaiLimit ==1){
            this.ui.difen.string = `${difen}   王癞玩法`
        }
       
    }

}
//c, 控制
@ccclass
export default class Prefab_bull_SeatCtrl extends BaseCtrl {
    view:View = null
    model:Model = null
    //这边去声明ui组件
    @property(cc.Label)
    roundCount:cc.Label = null

    @property(cc.Label)
    difen:cc.Label = null

    @property(cc.Label)
    beishu:cc.Label = null

    @property(cc.Label)
    mingpaizi:cc.Label = null


    @property(cc.Font)
    font_lvse:cc.Font = null

    @property(cc.Font)
    font_lanse:cc.Font = null

    @property(cc.Font)
    font_isstartlv:cc.Font = null

    @property(cc.Font)
    font_isstarlanse:cc.Font = null

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
        this.n_events['connector.entryHandler.enterRoom'] = this.onEnterRoom;
        this.n_events['onProcess_mpnn'] = this.onProcess;
        this.n_events[BullConst.clientEvent.onStart] = this.onStart;
        
	}
	//定义全局事件
	defineGlobalEvents()
	{
        //全局消息
        this.g_events = {
            'setAllTableLaebl':this.setAllTableLaebl,
        } 
       
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
        
    }
    onProcess(msg){
        if(msg.process==5){
            this.model.gamestart =1
            this.view.updatenostart();
           
        }
        
    }
    onStart(msg){
        //console.log("这是开始游戏的消息=======",msg)
        this.model.gamestart =2
        this.view.updateisstart();
       
    }
    onEnterRoom(msg){
        let gamestart = msg.gamestarted;
        if(gamestart){
            //console.log("变暗房间参数")
            this.model.gamestart =2
            this.view.updateisstart();
        }else if(!gamestart){
            //console.log("变亮房间参数")
            this.model.gamestart =1
            this.view.updatenostart();
           
        }
    }
    //网络事件回调begin
    setAllTableLaebl(){
        this.model.initBGState();
        this.view.updatenostart();
        this.view.updateisstart();
    }
	//end
    //全局事件回调begin
  
	//end
	//按钮或任何控件操作的回调begin
    //end

}