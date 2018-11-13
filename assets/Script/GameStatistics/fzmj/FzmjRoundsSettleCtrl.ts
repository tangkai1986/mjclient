/*
author: TK
日期:2018-02-06 16:02:51
总结算
*/

import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import GameCateCfg from "../../Plat/CfgMgrs/GameCateCfg";
import BunchInfoMgr from "../../Plat/GameMgrs/BunchInfoMgr";
import viewLogicSeatConvertMgr from "../../Plat/GameMgrs/viewLogicSeatConvertMgr";
import RecordMgr from "../../Plat/GameMgrs/RecordMgr";
 

let Green = new cc.Color(1,146,7),Red = new cc.Color(255,36,0), Yellow = new cc.Color(255,222,0);
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : FzmjRoundsSettleCtrl;
//模型，数据处理
class Model extends BaseModel{
    gameResultData:{} = null
    leap=90;
    itemData:[];
	constructor()
	{
        super();
    }
    setgameResultData(data)
    {
        if (data==null) {
            this.gameResultData = RoomMgr.getInstance().getBunchInfo();
        }
        else{
            this.gameResultData = data;
        }
    }
   
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        btn_ztj:null,
        btn_mjjf:null,
        btn_share:null,
        btn_exit:null,
        node_content : null,
        node_yellowBattleResult : null,
        node_yellowLightBattleResult : null,
        btn_close : null,
        node_panel:null,
        lbl_score0s:[],
        lbl_score1s:[],
        lbl_score2s:[],
        lbl_score3s:[],
        lbl_roundindexes:[],
        lbl_times:[],
        totalScores:{},
        lbl_names:{},
        lbl_nameSigns:{},
        waterMarkForWins:{},
        waterMarkForLosts:{},
        node_waterMark:null,
        lbl_totalScores:[],
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
        this.ui.node_content = ctrl.node_content;
        this.ui.node_yellowBattleResult = ctrl.node_yellowBattleResult;
        this.ui.node_yellowLightBattleResult = ctrl.node_yellowLightBattleResult;
        this.ui.node_panel = ctrl.node_panel;
        this.ui.node_waterMark = ctrl.node_waterMark;
    }
    initUIwithData()
    {
        let meiju = this.model.gameResultData.meiju;
        let prefabBarArr=[this.ui.node_yellowBattleResult,this.ui.node_yellowLightBattleResult];
        if (meiju.length>3) {
            this.ui.node_content.setContentSize(this.ui.node_content.getContentSize().width,this.model.leap*meiju.length);
        }
        this.model.itemData = [];
        for(let i =0;i<meiju.length;i++)
        {
            let colorindex=i%2;
            let itemData = meiju[i];
            let prefabBar=prefabBarArr[colorindex];
            let barItem = cc.instantiate(prefabBar);
            this.model.itemData.push(itemData[2]);
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
        for (let logicseatid = 0; logicseatid < BunchInfoMgr.getInstance().getSeatCount(); ++logicseatid) {
            this.ui.totalScores[logicseatid]=this.ui.node_panel.getChildByName(`lbl_totalScore${logicseatid}`).getComponent(cc.Label);
            this.ui.lbl_names[logicseatid]=this.ui.node_panel.getChildByName(`lbl_name${logicseatid}`).getComponent(cc.Label);
            this.ui.lbl_nameSigns[logicseatid]=this.ui.node_panel.getChildByName(`lbl_nameSign${logicseatid}`).getComponent(cc.Label);
            this.ui.waterMarkForWins[logicseatid]=this.ui.node_waterMark.getChildByName(`user${logicseatid}`).getChildByName("zjs_seal_win");
            this.ui.waterMarkForLosts[logicseatid]=this.ui.node_waterMark.getChildByName(`user${logicseatid}`).getChildByName("zjs_seal_loser");
            this.ui.lbl_totalScores[logicseatid]=this.ui.node_panel.getChildByName(`lbl_totalScore${logicseatid}`).getComponent(cc.Label);
        }
    }
    showData()
    {
        this.initUIwithData();
        let meijuData = this.model.gameResultData.meiju;
        if (meijuData!=null && meijuData!=undefined) {
            this.showDetailData(meijuData);
            // this.showTtlData(totalScore);
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
            for(let logicseatid=0;logicseatid<BunchInfoMgr.getInstance().getSeatCount();++logicseatid)
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
                if(hutime&&hutime.length>0){
                    hutimestr=`(${hutime})`;
                }else{
                    hutimestr="";
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
        let leijiData = this.model.gameResultData.leiji;
        let viewCalled = ["(我)","(下家)","(对家)","(上家)"];
        for (let logicseatid = 0; logicseatid < BunchInfoMgr.getInstance().getSeatCount(); ++logicseatid) {
            let viewSeatId = viewLogicSeatConvertMgr.getInstance().getViewSeatId(logicseatid);
            let users=BunchInfoMgr.getInstance().getMembelist();
            if(users==null) {
                return;
            }
            this.ui.lbl_nameSigns[logicseatid].string = viewCalled[viewSeatId];
            this.ui.lbl_nameSigns[logicseatid].node.active = true;
            this.ui.lbl_names[logicseatid].string=users[logicseatid].nickname;
            if(users[logicseatid].nickname.length>6){
                this.ui.lbl_names[logicseatid].string=users[logicseatid].nickname.substring(0,6);
            }
            this.ui.lbl_names[logicseatid].node.active = true;
            if (leijiData[logicseatid].title == 1) {
                this.ui.waterMarkForWins[logicseatid].active = true;
                this.ui.waterMarkForLosts[logicseatid].active = false;
            }
            else if (leijiData[logicseatid].title == 2) {
                this.ui.waterMarkForWins[logicseatid].active = false;
                this.ui.waterMarkForLosts[logicseatid].active = true;
            }
            this.ui.lbl_totalScores[logicseatid].string = leijiData[logicseatid].zongshuying;
            this.ui.lbl_totalScores[logicseatid].node.active = true;
            if (leijiData[logicseatid].zongshuying>=0) {
                this.ui.lbl_totalScores[logicseatid].node.color = Red;
            }
            else
            {
                this.ui.lbl_totalScores[logicseatid].node.color = Green; 
            }
        }
    }

}
//c, 控制
@ccclass
export default class FzmjRoundsSettleCtrl extends BaseCtrl {
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
        tooltip : "panel",
        type : cc.Node
    })
    node_panel : cc.Node = null;
    @property({
        tooltip : "waterMark",
        type : cc.Node
    })
    node_waterMark : cc.Node = null;

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
        // if (this.model.gameResultData!=null && this.model.gameResultData!=undefined) {
        //     this.view.showData();
        // }
        let resultData = BunchInfoMgr.getInstance().getBunchInfo();
        //console.log(resultData);
        this.showView(resultData);
	}

	//定义网络事件
	defineNetEvents()
	{
        // this.n_events = {
        //     'http.reqMyInfo' : this.http_reqMyInfo
        // }
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
    }
    
    bindUi()
    {
        let barList = this.ui.node_content.children;
        let self = this; 
        for (let i = 0; i < barList.length; i++) {
            barList[i].getChildByName("background").on(cc.Node.EventType.TOUCH_END, function(event) { 
                RecordMgr.getInstance().reqMatchRecord(self.model.itemData[i]); 
            }, this);
            //console.log("barList[i]",barList[i])
            barList[i].getChildByName("img_an1").active=true;
            barList[i].getChildByName("img_an1").on(cc.Node.EventType.TOUCH_END, function(event) { 
                //console.log("bindUi",self.model.itemData[i]);
                if (cc.sys.isNative) G_PLATFORM.copyToClipboard(self.model.itemData[i]+"0");
            }, this);
        }
    }
    showView(data)
    {
        this.model.setgameResultData(data);
        this.view.showData();
        if(BunchInfoMgr.getInstance().getplazzaFlag()) {
            this.bindUi();
        }
    }
}