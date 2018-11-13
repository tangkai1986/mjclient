/*
author: Justin
日期:2018-01-19 10:15:29
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef";


let Green = new cc.Color(24,221,40),Red = new cc.Color(255,78,0), Yellow = new cc.Color(255,222,0);
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : LymjGambleRecordCtrl;
//模型，数据处理
class Model extends BaseModel{
	gameResultData : any;
	leap=68;
	constructor()
	{
		super(); 
		this.gameResultData=RoomMgr.getInstance().getBunchInfo();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_content : null,
		node_yellowBattleResult : null,
		node_yellowLightBattleResult : null,
		btn_close : null,
		node_panel: null,
        lbl_score0s:[],
        lbl_score1s:[],
        lbl_score2s:[],
        lbl_score3s:[],
        lbl_roundindexes:[],
        lbl_times:[],
        lbl_names:{},
        lbl_nameSigns:{},
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
		//console.log("winlog");
		this.ui.btn_close = ctrl.btn_close;
        this.ui.node_content = ctrl.node_content;
        this.ui.node_yellowBattleResult = ctrl.node_yellowBattleResult;
        this.ui.node_yellowLightBattleResult = ctrl.node_yellowLightBattleResult;
        this.ui.node_panel = ctrl.node_panel;
        if (this.model.gameResultData== null || this.model.gameResultData == undefined) {
           return;
        }
        let meiju = this.model.gameResultData.meiju;
        if (meiju == null || meiju == undefined) {
        	return;
        }
        let prefabBarArr=[this.ui.node_yellowBattleResult,this.ui.node_yellowLightBattleResult];
        if (meiju.length>7) {
            this.ui.node_content.setContentSize(this.ui.node_content.getContentSize().width,this.model.leap*meiju.length);
        }
        for(let i =0;i<meiju.length;i++)
        {
            let colorindex=i%2;
            let prefabBar=prefabBarArr[colorindex];
            let barItem = cc.instantiate(prefabBar);
            barItem.active = true;
            barItem.setPosition(cc.v2(0,(i+1)*(-this.model.leap)));
            this.ui.node_content.addChild(barItem);
            this.ui.lbl_roundindexes[i]=barItem.getChildByName("lbl_roundindex").getComponent(cc.Label);
            this.ui.lbl_times[i]=barItem.getChildByName("lbl_time").getComponent(cc.Label);
            this.ui.lbl_score0s[i]=barItem.getChildByName("lbl_score0").getComponent(cc.Label);
            this.ui.lbl_score1s[i]=barItem.getChildByName("lbl_score1").getComponent(cc.Label);
            this.ui.lbl_score2s[i]=barItem.getChildByName("lbl_score2").getComponent(cc.Label);
            this.ui.lbl_score3s[i]=barItem.getChildByName("lbl_score3").getComponent(cc.Label);
        }
        for (let logicseatid = 0; logicseatid < RoomMgr.getInstance().getSeatCount(); ++logicseatid) {
            this.ui.lbl_names[logicseatid]=this.ui.node_panel.getChildByName(`lbl_name${logicseatid}`).getComponent(cc.Label);
            this.ui.lbl_nameSigns[logicseatid]=this.ui.node_panel.getChildByName(`lbl_nameSign${logicseatid}`).getComponent(cc.Label);
        }
	}
	showData()
	{
        let meijuData = this.model.gameResultData.meiju;
        if (meijuData!=null && meijuData!=undefined) {
            this.showDetailData(meijuData);
            this.showPlayerInfo();
        }
	}
	showDetailData(meijuData)
	{
        for (let i = 0; i < meijuData.length; ++i) {
            let itemData = meijuData[i];
            let myDate = new Date(itemData[0]);
            let curtime = myDate.getHours().toString()+":"+myDate.getMinutes();
            this.ui.lbl_times[i].string = "("+curtime+")";
            this.ui.lbl_roundindexes[i].string = `第${i+1}局`;
            let lbl_scores=[this.ui.lbl_score0s[i],this.ui.lbl_score1s[i],this.ui.lbl_score2s[i],this.ui.lbl_score3s[i]] 
            for(let logicseatid=0;logicseatid<RoomMgr.getInstance().getSeatCount();++logicseatid)
            {
                let dataItem=itemData[1][logicseatid.toString()];
                let hutime=dataItem[0];
                let score=dataItem[1];
                let yikescore=dataItem[2];
                let yikescorestr='';
                let hutimestr = '';
                let scorestr='';
                let lbl_score=lbl_scores[logicseatid];
                lbl_score.node.active = true;
                let prefix = "";
                if (score>0) {
                    prefix = "+";
                }
                if(this.model.gameResultData.scoretype == 1)
                {
                    yikescorestr=`${yikescore}`
                    scorestr=`(${prefix}${score})`;
                }
                else{
                    scorestr=`${prefix}${score}`;
                }
                if(hutime){
                    hutimestr=`(${hutime})`;
                }
                let wholescore=`${yikescorestr}${scorestr}${hutimestr}`;
                lbl_score.string=wholescore;
                if(score>=0)
                {
                    lbl_score.node.color = Red;
                }
                else{
                    lbl_score.node.color = Green;
                }
            }
        }
	}
	showPlayerInfo()
	{
        let viewCalled = ["(我)","(下家)","(对家)","(上家)"];
        for(let logicseatid=0;logicseatid<RoomMgr.getInstance().getSeatCount();++logicseatid)
        {
            let viewSeatId = RoomMgr.getInstance().getViewSeatId(logicseatid);
            this.ui.lbl_nameSigns[logicseatid].string = viewCalled[viewSeatId];
            this.ui.lbl_nameSigns[logicseatid].node.active = true;
            let uid = RoomMgr.getInstance().users[logicseatid];
            if (uid==null || uid==undefined) {
                continue;
            }
            let user = UserMgr.getInstance().getUserById(uid);
            this.ui.lbl_names[logicseatid].string = user.nickname;
            this.ui.lbl_names[logicseatid].node.active = true;
        }
	}
}
//c, 控制
@ccclass
export default class LymjGambleRecordCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip : "滚动视图",
		type : cc.Node
	})
	node_content : cc.Node = null;
	@property({
		tooltip : "深色战绩记录",
		type : cc.Node
	})
	node_yellowBattleResult : cc.Node = null;
	@property({
		tooltip : "浅色战绩记录",
		type : cc.Node
	})
	node_yellowLightBattleResult : cc.Node = null;
	@property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
	btn_close : cc.Node = null;
	@property({
		tooltip : "panel",
		type : cc.Node
	})
	node_panel : cc.Node = null;
	//声明ui组件end
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
		if (this.model.gameResultData!=null && this.model.gameResultData!=undefined) {
			this.view.showData();
		}
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {
            'onStartGame':this.onStartGame,   
			"onDissolutionRoom": this.onDissolutionRoom,
			onGameFinished:this.onGameFinished,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.btn_close, this.btn_closecb, '点击关闭');
	}
	start () {
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
    
	btn_closecb()
	{
		this.finish();
	}
}
