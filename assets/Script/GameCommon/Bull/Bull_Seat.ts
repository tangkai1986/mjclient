/*
author: YOYO
日期:2018-02-02 10:05:31
*/
import UserMgr from "../../Plat/GameMgrs/UserMgr";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import UiMgr from "../../Plat/GameMgrs/UiMgr";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";

interface t_userInfo {
    coin:number,
    gold:number,
    headid:number,
    headurl:string,
    id:number,
    losecount:number,
    nickname:string,
    relief:number,
    sex:number,
    wincount:number
}

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Bull_Seat;
let BullLogic = null
let BullConst = null
//模型，数据处理
class Model extends BaseModel{
    viewSeatId:number = null    //视图座位
    logicseatid = null          //逻辑座位，服务器那边的座位
    uid:number = null           //玩家uid
    userinfo:t_userInfo =null   //玩家信息对象
    getScore:number;
	constructor()
	{
        super();
        
        BullConst = RoomMgr.getInstance().getDef();
        BullLogic = RoomMgr.getInstance().getLogic().getInstance();
    }
    
    clear(){
        this.uid = null;
        this.logicseatid = null;
        this.userinfo = null;
    }

    updateLogicId(  )
	{
        // body
		this.logicseatid=RoomMgr.getInstance().getLogicSeatId(this.viewSeatId); 
        this.uid=RoomMgr.getInstance().users[this.logicseatid];
        ////console.log('刷新玩家信息this.viewSeatId= ',this.viewSeatId,', this.logicseatid=',this.logicseatid,', this.uid=',this.uid)
    } 
    
    updateUserInfo() 
	{ 
        this.userinfo=UserMgr.getInstance().getUserById(this.uid)
        ////console.log('获取个人信息= this.uid= ', this.uid, ', this.userinfo=',this.userinfo)
    }
    
    getIsMyself(){
        return RoomMgr.getInstance().getMySeatId() == this.logicseatid
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    model:Model
    isUpdateMoney = null
	ui={
        //在这里声明ui
        node_img_head:null,
        lbl_name:null,
        lbl_money:null,
	};
	node=null;
	constructor(model){
        super(model);
        this.isUpdateMoney = true;
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi(){
        this.ui.node_img_head = ctrl.node_img_head;
        this.ui.lbl_name = ctrl.lbl_name;
        this.ui.lbl_money = ctrl.lbl_money;
    }

    //清除
	clear( )
	{
        if(this.node.active){
            this.updateIsMyself();
            this.resetHead();
            this.updateMoney();
            this._updateName();
        }
	} 

    //更新玩家信息
    updateUserInfo (){
        if(this.node.active){
            this._updateHead();
            //this.updateMoney();
            this._updateName();
        }
    }
    //更新金钱
    updateMoney(){
        let score = BullLogic.getMyScore(this.model.logicseatid);
        if(score) {
            if(parseInt(score)>0){
                score= `+${score}`;
            }
            this.ui.lbl_money.string = score;
        }
        else this.ui.lbl_money.string = '0';
    }

    //根据是否是玩家自己，变化座位表现
    updateIsMyself (){
        if(this.model.getIsMyself()){
            let bg = this.node.children[0];
            bg.width = this.node.width;
            bg.height = this.node.height;
        }
    }

    //=====================

    
    //显示头像
    private _updateHead (){
        if(!this.ui.node_img_head._defaultHead){
            this.ui.node_img_head._defaultHead = this.ui.node_img_head.getComponent(cc.Sprite).spriteFrame;
        };
        //UiMgr.getInstance().setUserHead(this.ui.node_img_head, this.model.userinfo.headid, this.model.userinfo.headurl);
        UiMgr.getInstance().setUserHead(this.ui.node_img_head,
            (this.model.userinfo.headid||(typeof this.model.userinfo.headurl == "number" &&this.model.userinfo.headurl)),
            (this.model.userinfo.headurl|| (typeof this.model.userinfo.headurl == "string" && this.model.userinfo.headurl)));
    }
    //更新名字
    private _updateName(){
        if(this.model.userinfo) {
            let curStr;
            if(this.model.userinfo.nickname){
                curStr = this.model.userinfo.nickname;
            }
            curStr = curStr? curStr:"";
            this.ui.lbl_name.string = curStr;
        }else {this.ui.lbl_name.string = '';}
        
    }
    private resetHead (){
        if(this.ui.node_img_head._defaultHead){
            this.ui.node_img_head.getComponent(cc.Sprite).spriteFrame = this.ui.node_img_head._defaultHead;
        }
    }
}
//c, 控制
@ccclass
export default class Bull_Seat extends BaseCtrl {
    view:View 
    model:Model
    //这边去声明ui组件
    @property({
        type:cc.Node,
        displayName:"headImg"
    })
    node_img_head:cc.Node = null
    @property({
        type:cc.Label,
        displayName:"nameLabel"
    })
    lbl_name:cc.Label = null
    @property({
        type:cc.Label,
        displayName:"moneyLabel"
    })
    lbl_money:cc.Label = null

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
        this.initMvc(Model,View);
      
        this.model.viewSeatId = this.node.parent.children.indexOf(this.node);
        this.node.active = false;
        this.view.updateMoney();
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events={
			//网络消息监听列表
			'onEnterRoom':this.onEnterRoom,
            'onLeaveRoom':this.onLeaveRoom,
			// onSyncData:this.onSyncData,
			// onSeatChange:this.onSeatChange,
			'http.reqRoomUsers':this.http_reqRoomUsers, 
			'http.reqUsers':this.http_reqUsers, 
        }
        this.n_events['http.reqSettle'] = this.onReqSettle;
        this.n_events[BullConst.clientEvent.onProcess] = this.onProcess;
        this.n_events[BullConst.clientEvent.onSettle] = this.onSettle_bull;
	}
	//定义全局事件
	defineGlobalEvents()
	{
        //全局消息
        this.g_events={ 
            'usersUpdated':this.usersUpdated,
            'changeShuohuaActive':this.chengeShuohuaActive,
        } 
	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.node_img_head, this.showUserDetail, '点击头像');
	}
	start () {
        
    }
    //打开个人信息面板
    showUserDetail(  )
	{
		// body
		if (this.model.uid!=null){ 
			var ctrl=this.start_sub_module(G_MODULE.RoomUserInfo, (uiCtrl)=>{ 
			 
                uiCtrl.setUid(this.model.uid);
            },'RoomUserInfoCtrl')
		}
	} 
    //网络事件回调begin, 有人加入房间也是走这里
    onEnterRoom(msg){ 
        this.model.updateLogicId();
		if (this.model.logicseatid !=msg.seatid){ 
			return;
        }
        ////console.log('onEnterRoom= ', msg)
        this.model.uid=msg.user;
    }
    onLeaveRoom(msg){ 
		if (this.model.logicseatid==msg.seatid){
			this.model.clear(); 
            this.view.clear();
            this.node.active = false;
		}
    }
    onProcess(msg){
		if(msg.process==BullConst.process.start){ 
            // 同步服务端时间 msg.servertime
		}else if(msg.process==BullConst.process.settle){

        }
	}
    http_reqRoomUsers(msg)
	{
        ////console.log('http_reqRoomUsers== ', msg)
	    // body
	    this.model.updateLogicId();
	    this.view.clear(); 
    } 
    http_reqUsers(msg){
        ////console.log('http_reqUsers== ', msg)
        // body 
        if(!this.model.uid){ 
            return;
        }
        this.node.active = true;
        this.model.updateUserInfo();
        this.view.updateMoney();
        this.view.updateUserInfo(); 
        // let myViewId = RoomMgr.getInstance().getViewSeatId(RoomMgr.getInstance().getMySeatId());
    }
    //房间正式结算通知
    onReqSettle (){
        this.model.updateUserInfo(); 
        this.view.updateUserInfo(); 
        if(this.view.isUpdateMoney){
            this.view.updateMoney();
        }
    }
    
    onSettle_bull(msg){
        if(!this.node.active) return;
        this.model.getScore = msg.scoreInfo[this.model.logicseatid];
        if(this.model.getScore > 0){
            let cb = function(){
                this.view.updateMoney();
            }
            let seq = cc.sequence(cc.delayTime(2.5),cc.callFunc(cb,this));
            this.node.runAction(seq);
            this.view.isUpdateMoney = false
        }else{
            this.view.isUpdateMoney = true;
        }
    }
     
	//end
    //全局事件回调begin
    usersUpdated()
	{ 
	    // body
	    this.model.updateLogicId();
	    this.view.clear(); 
    } 
    chengeShuohuaActive(){
        this.ui.shuohua.active = !this.ui.shuohua.active;
    }
	//end
	//按钮或任何控件操作的回调begin
    //end

    //初始化界面UI上对应的id
    initViewSeatId (viewSeatId:number){
        this.model.viewSeatId = viewSeatId;
    }
}