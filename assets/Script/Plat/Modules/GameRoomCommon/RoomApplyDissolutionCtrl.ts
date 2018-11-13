import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import RoomMgr from "../../GameMgrs/RoomMgr";
import UserMgr from "../../GameMgrs/UserMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import BunchInfoMgr from "../../GameMgrs/BunchInfoMgr";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_ApplyDissolutionRoom;
//模型，数据处理
class Model extends BaseModel{
    mySeatId=null;
    users=null;
    applySeatId=null;
    applySeats=null;
    offline = null;
    b_iHaveVote=false;
    agreeTime = null;
    spriteparent=null; 
    constructor(){
        super();
        this.recover();
    }
    getPlayerInfo(seatId) {
		let userinfo=this.users[seatId];  
        return userinfo;
    }
    updateApplySeats(){
        this.applySeats=RoomMgr.getInstance().getApplySeats();
        for(let seatId in this.applySeats)
        {
            //表示自己投了票
            if(seatId==this.mySeatId){
                this.b_iHaveVote=true;
                break;
            }
        }
    } 
    recover()
    {
        this.users={};
        let users=RoomMgr.getInstance().users
        for(let key in users)
        {
            let seatId=parseInt(key)
            let uid=users[key]
            let userinfo=UserMgr.getInstance().getUserById(uid);
            this.users[seatId]=userinfo;
        } 
        this.agreeTime=RoomMgr.getInstance().offlineAutoDisRoomTickTime;  
        this.mySeatId = RoomMgr.getInstance().getMySeatId();
        this.applySeatId=RoomMgr.getInstance().getApplyDissolutionSeatId();
        this.offline =RoomMgr.getInstance().getoffline();  
        this.updateApplySeats(); 
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{ 
    ui={
    //在这里声明ui
        richText_title:ctrl.RichText_title,
        node_tip:ctrl.Node_tip,
        btn_agree:ctrl.Button_agree,
        btn_refuse:ctrl.Button_refuse,
        lbl_agreeTime:ctrl.lbl_agreeTime,
    };
    constructor(model){
        super(model);
        this.node=ctrl.node; 
        this.initUi();
    }
    //初始化ui
    initUi(){             
        this.ui.btn_agree.active = true;
        this.ui.btn_refuse.active = true;
        let playercount = RoomMgr.getInstance().getSeatCount()
        let tip = this.ui.node_tip.getChildByName(`tip_${playercount}`);
        tip.active = true;
        this.model.spriteparent = tip.getChildren();
        // //console.log("spriteparent", this.model.spriteparent[0].getChildByName("nickname").getComponent(cc.Label));
        if(this.model.applySeatId!=null||this.model.applySeatId!=undefined) {
            let playerInfo = this.model.getPlayerInfo(this.model.applySeatId);
            if(!playerInfo) {
                return;
            }
            let name = playerInfo.nickname.substring(0,6);
            this.ui.richText_title.string = `<color=#b73a2a>玩家【${name}】申请解散房间，请问是否同意？</color>`;
            // //console.log("this.model.applySeats=",this.model.applySeats)
            // //console.log("this.model.offline=",this.model.offline)
            for(let seatId = 0; seatId<RoomMgr.getInstance().getSeatCount(); ++seatId){            
                 let seat_data = RoomMgr.getInstance().getUidBySeatId(seatId);
                 if (seat_data != null){
                    this.model.spriteparent[seatId].getChildByName("nickname").getComponent(cc.Label).string = "["+this.model.users[seatId].nickname.toString().substring(0,6) +"]:";
                    //console.log("apply nickname",this.model.spriteparent[seatId].getChildByName("nickname").getComponent(cc.Label).string);
                    //问题规避
                    if(this.model.offline) {
                        let count = this.model.offline.length
                        if (count != null){
                            for(let i=0;i<count;i++)
                            {
                                if(seatId == this.model.offline[i]){
                                    this.model.spriteparent[seatId].getChildByName("wait").active = true;
                                    break
                                }
                            }
                        }
                    }
                    let state=this.model.applySeats[seatId] 
                    if(state ==1){
                        this.model.spriteparent[seatId].getChildByName("wait").active = false;
                        this.model.spriteparent[seatId].getChildByName("agree").active = true;
                    }else if(state ==2){
                        this.model.spriteparent[seatId].getChildByName("wait").active = false;
                        this.model.spriteparent[seatId].getChildByName("refuse").active = true;
                    }else{
                        this.model.spriteparent[seatId].getChildByName("wait").active = true;
                    }
                 }else{
                    this.model.spriteparent[seatId].getChildByName("nickname").active = false;
                 }
            }
            this.updateAgreeButtons();
            this.ui.lbl_agreeTime.string = `${this.model.agreeTime}`
        }
        
    }
    recover()
    {
        this.node=ctrl.node; 
        this.initUi();
    }
    hideButtons(){ 
        this.ui.btn_agree.active = false;
        this.ui.btn_refuse.active = false;
    }
    updateAgreeButtons(){
        if (this.model.b_iHaveVote) {
            this.hideButtons();
        }
    }
    updateTip(seatId) { 
        let state=this.model.applySeats[seatId]; 
        if(state ==1){
            this.model.spriteparent[seatId].getChildByName("wait").active = false;
            this.model.spriteparent[seatId].getChildByName("agree").active = true;
        }else if(state ==2){
            this.model.spriteparent[seatId].getChildByName("wait").active = false;
            this.model.spriteparent[seatId].getChildByName("refuse").active = true;
        }else{
            this.model.spriteparent[seatId].getChildByName("wait").active = true;
        }
        this.updateAgreeButtons();
    } 
}
//c, 控制
@ccclass
export default class Prefab_ApplyDissolutionRoom extends BaseCtrl {
    //这边去声明ui组件
    @property(cc.RichText)
    RichText_title=null;
    @property(cc.Node)
    Node_tip=null;
    @property(cc.Node)
    Button_agree=null;
    @property(cc.Node)
    Button_refuse=null;
    @property(cc.Label)
    lbl_agreeTime = null; 
    
    timer=null;
    //声明ui组件end
    onLoad (){
        //创建mvc模式中模型和视图
        //控制器 
        ctrl = this;
        //数据模型
        this.initMvc(Model,View);
        this.startTimer();//启动倒计时显示
    }

    onDestroy(){
        this.clearTimer();
        super.onDestroy();
    }
    
    startTimer(){
        this.clearTimer(); 
        this.timer=setInterval(()=>{ 
            this.model.agreeTime--; 
            if(this.model.agreeTime>=0){
                this.ui.lbl_agreeTime.string = `${this.model.agreeTime}`
            } 
            else{
                this.view.hideButtons();
                this.clearTimer();
            }
        },1000) 
    }
    
    clearTimer(){
        if(this.timer)
        {
            clearInterval(this.timer)
            this.timer=null
        }
    }
    //定义网络事件
    defineNetEvents(){
        this.n_events={
			//网络消息监听列表
            'onAgreeDissolutionRoom':this.onAgreeDissolutionRoom,
            'onRefuseDissolutionRoom':this.onRefuseDissolutionRoom,
            'onDissolutionRoom':this.onDissolutionRoom,
            'connector.entryHandler.enterRoom':this.connector_entryHandler_enterRoom,  
            'onUserOffLine':this.onUserOffLine,
		}	
    }
    onUserOffLine(msg)
    {
        //console.log("这是服务起发过来的离线玩家消息", msg);
    }
    //定义全局事件
    defineGlobalEvents(){
		//全局消息 	  
        this.g_events={ 
            'mj_destroyRoom':this.mj_destroyRoom,   
        } 
    }
    //4059 【优化-房间模块】解散房间后玩家信息显示为预置信息
    mj_destroyRoom()
    {
        this.finish();
    }
    connector_entryHandler_enterRoom(){
        this.finish();
    }
    //绑定操作的回调
    connectUi(){
        this.connect(G_UiType.button, this.ui.btn_agree, this.btn_agree_cb, '同意解散房间');
        this.connect(G_UiType.button, this.ui.btn_refuse, this.btn_refuse_cb, '拒绝解散房间');
    }
    onAgreeDissolutionRoom(msg) {
        this.model.updateApplySeats(); 
        this.view.updateTip(msg.seatId);
    }
    onRefuseDissolutionRoom(msg) { 
        this.model.updateApplySeats();
        this.view.updateTip(msg.seatId);
    }
    onDissolutionRoom(msg) {
        let callback = cc.callFunc(()=>{
            this.node.active = false;
            this.view.initUi()
            //console.log("移除了自己onDissolutionRoom",msg)
            if (msg.result) {
            }
            else{ 
                FrameMgr.getInstance().showTips("有玩家拒绝解散房间，解散失败！", null, 35, cc.color(220,24,63), cc.p(0,0), "Arial", 1500);
            }
        })
        let delaytime =cc.delayTime(2);
        var seq = cc.sequence(delaytime,callback); 
        this.node.runAction(seq);
    }
    //end
    //全局事件回调begin
 
    //end
    //按钮或任何控件操作的回调begin
    btn_agree_cb() {
		RoomMgr.getInstance().agreeDissolutionRoom()
    }
    btn_refuse_cb() {
		RoomMgr.getInstance().refuseDissolutionRoom()
    }
    //end
}
