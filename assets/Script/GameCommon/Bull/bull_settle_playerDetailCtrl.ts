
/*
author: YOYO
日期:2018-03-19 19:18:59
*/
import BunchInfoMgr from "../../Plat/GameMgrs/BunchInfoMgr";
import UserMgr from "../../Plat/GameMgrs/UserMgr";
import UiMgr from "../../Plat/GameMgrs/UiMgr";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";


//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Bull_settle_playerDetailCtrl;
const CONFIGS = {
    title:{
        nothing:0,
        winer:1,                        //大赢家
        loser:2,                        //慈善家
        maxNiuniu:3,                    //牛牛次数最多
    }
}
//模型，数据处理
class Model extends BaseModel{
    viewSeatId:number                       //对应玩家的索引
    userInfo                                //玩家个人信息
	constructor()
	{
		super();
    }
    updateUserInfo (){
        let bunchMgr = BunchInfoMgr.getInstance();
        let bunchInfo = bunchMgr.getBunchInfo();
        let fangkaCfg = bunchInfo.roomValue;
        if(bunchInfo){
            let mySeatId = bunchMgr.getMyLogicSeatId();
            let logicSeatId;
            if(this.viewSeatId == 0){
                logicSeatId = mySeatId;
            }else {
                if(this.viewSeatId == mySeatId){
                    logicSeatId = 0;
                }else{
                    logicSeatId = this.viewSeatId;
                }
            }
            ////console.log('当前的索引', logicSeatId)
            let leijiInfo = bunchInfo.leiji[logicSeatId];
            ////console.log('获取的累计信息= ', leijiInfo)
            let users = bunchMgr.getMembelist();
            let recordUserInfo = users[logicSeatId];
            if(!recordUserInfo){
                ctrl.destroy();
                return
            }
            ////console.log('获取的累计信息1= ', recordUserInfo)
            this.userInfo = {
                id:recordUserInfo.id,
                nickname:recordUserInfo.nickname,
                headid:recordUserInfo.headid,
                headurl:recordUserInfo.headurl,
                url:recordUserInfo.url
            };
            this.userInfo.zongshuying = leijiInfo.zongshuying;
            this.userInfo.title = leijiInfo.title;
            this.userInfo.isMaster = recordUserInfo.bowner;
            this.userInfo.isWinerPay = fangkaCfg.v_paytype == 2;
            this.userInfo.cost = bunchInfo.costs[bunchMgr.getUidBySeatId(logicSeatId)];
            ////console.log('初始化玩家信息', this.userInfo)
        }else{
            cc.error('bullTotalSettle bunchInfo is empty')
        }
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        spriteFrame_dayingjia:null,
        spriteFrame_cishanduwang:null,
        spriteFrame_niuqichongtian:null,
        sprite_head:null,
        node_img_title:null,
        node_img_master:null,
        lbl_id:null,
        lbl_name:null,
        lbl_totalScore:null,
        node_payinfo:null,
        node_img_head:null
	};
    node=null;
    model:Model
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi(){
        this.ui.spriteFrame_niuqichongtian = ctrl.spriteFrame_niuqichongtian;
        this.ui.spriteFrame_cishanduwang = ctrl.spriteFrame_cishanduwang;
        this.ui.spriteFrame_dayingjia = ctrl.spriteFrame_dayingjia;
        this.ui.node_img_head = ctrl.node_img_head;
        this.ui.node_img_title = ctrl.node_img_title;
        this.ui.node_img_master = ctrl.node_img_master;
        this.ui.node_payinfo = ctrl.payinfo;
        this.ui.lbl_id = ctrl.lbl_id;
        this.ui.lbl_name = ctrl.lbl_name;
        this.ui.lbl_totalScore = ctrl.lbl_totalScore;
    }

    //刷新自己的信息
    updateInfo (){
        this.setWinerPay();
        this.setTitle();
        this.setTotalSocre();
        this.setID();
        this.setName();
        this.setIsMaster();
        this.setHead();
    }
    
    //如果是赢家支付
    private setWinerPay (){
        let bunchMgr = BunchInfoMgr.getInstance();
        let bunchInfo = bunchMgr.getBunchInfo();
        let fangkaCfg = bunchInfo.roomValue;
        let lbl_paytype = this.ui.node_payinfo.getChildByName("lbl_paytype");
        let lbl_playercost = this.ui.node_payinfo.getChildByName("lbl_playercost")
        if(fangkaCfg.v_paytype==1){
            this.ui.node_payinfo.active = true;
            lbl_paytype.getComponent(cc.Label).string = `AA支付：`
            lbl_playercost.getComponent(cc.Label).string = this.model.userInfo.cost;
        }else if(fangkaCfg.v_paytype==0){
            let myseatID = bunchMgr.getMyLogicSeatId();
           if(this.model.userInfo.id==bunchInfo.roomOwner){
            this.ui.node_payinfo.active = true;
            lbl_paytype.getComponent(cc.Label).string = `房主支付：`
            lbl_playercost.getComponent(cc.Label).string = this.model.userInfo.cost;
           }
        }else if(fangkaCfg.v_paytype==2){
            if(this.model.userInfo.isWinerPay){
            //自己是否是大赢家
            if(parseInt(this.model.userInfo.zongshuying) > 0){
                // let winerPayNode = this.ui.lbl_winerPay.node.parent;
                // winerPayNode.active = true;
                this.ui.node_payinfo.active = true;
                lbl_paytype.getComponent(cc.Label).string = `赢家支付：`
                // let cost = BunchInfoMgr.getInstance().getBunchInfo().roomValue.v_fangfei;
                lbl_playercost.getComponent(cc.Label).string = this.model.userInfo.cost;
                //this.ui.lbl_winerPay.string = this.model.userInfo.cost;
            }
        }
        }
    }
    //如果有称号
    private setTitle(){
        switch(this.model.userInfo.title){
            case CONFIGS.title.winer:
                //大赢家
                this.ui.node_img_title.active = true;
                this.ui.node_img_title.getComponent(cc.Sprite).spriteFrame = this.ui.spriteFrame_dayingjia;
            break
            case CONFIGS.title.loser:
                //慈善赌王
                this.ui.node_img_title.active = true;
                this.ui.node_img_title.getComponent(cc.Sprite).spriteFrame = this.ui.spriteFrame_cishanduwang;
            break
            case CONFIGS.title.maxNiuniu:
                //牛气冲天
                this.ui.node_img_title.active = true;
                this.ui.node_img_title.getComponent(cc.Sprite).spriteFrame = this.ui.spriteFrame_niuqichongtian;
            break
        }
    }
    //总成绩，正数用红色显示，负数用-号加绿色字显示。
    private setTotalSocre (){
        let curValue = this.model.userInfo.zongshuying;
        if(parseInt(curValue)>=0){
            this.ui.lbl_totalScore.node.color = new cc.Color(255,0,0);
            this.ui.lbl_totalScore.string = "+"+curValue;
        }else{
            this.ui.lbl_totalScore.node.color = new cc.Color(0,255,0);
            this.ui.lbl_totalScore.string = curValue;
        }
    }
    private setID (){
        this.ui.lbl_id.string = this.model.userInfo.id;
    }
    private setName (){
        this.ui.lbl_name.string = this.changeStrLen(this.model.userInfo.nickname);
    }
    private setIsMaster(){
        this.ui.node_img_master.active = this.model.userInfo.isMaster;
    }
    //UiMgr.getInstance().setUserHead(curNode.getChildByName('headImg'), 
                                    //(user.headid || (typeof user.url == "number" && user.url)),
                                    // (user.headurl || (typeof user.url == "string" && user.url)));
    private setHead(){
        //UiMgr.getInstance().setUserHead(this.ui.node_img_head,this.model.userInfo.headid,this.model.userInfo.headurl);
        let user = this.model.userInfo;
        UiMgr.getInstance().setUserHead(this.ui.node_img_head, 
                            (user.headid || (typeof user.url == "number" && user.url)),
                            (user.headurl || (typeof user.url == "string" && user.url)));
    }
    private changeStrLen (curStr:string){
        if (curStr == null || curStr.length == null)return "";
        let newStr = "", limitNum = 6, curLen = 0;
        for(let i = 0; i < curStr.length; i ++){
            if (curStr.charCodeAt(i) > 255) {
                if((curLen+2) > limitNum) {
                    newStr+="...";
                    break;
                }
                newStr += curStr[i];
                curLen += 2;
            }else{
                if((curLen+1) > limitNum) {
                    newStr+="...";
                    break;
                }
                newStr += curStr[i];
                curLen += 1;
            }
        }
        return newStr
    }
}
//c, 控制
@ccclass
export default class Bull_settle_playerDetailCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
    @property(cc.SpriteFrame)
    spriteFrame_dayingjia:cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    spriteFrame_cishanduwang:cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    spriteFrame_niuqichongtian:cc.SpriteFrame = null

    @property(cc.Label)
    lbl_name:cc.Label = null
    @property(cc.Label)
    lbl_id:cc.Label = null
    @property(cc.Label)
    lbl_totalScore:cc.Label = null
    // @property(cc.Label)
    // lbl_winerPay:cc.Label = null
    @property(cc.Node)
    payinfo:cc.Node = null
    @property(cc.Node)
    node_img_head:cc.Node = null
    @property(cc.Node)
    node_img_title:cc.Node = null
    @property(cc.Node)
    node_img_master:cc.Node = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
        this.initMvc(Model,View);
        this.model.viewSeatId = this.node.parent.children.indexOf(this.node);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {
            'http.reqMyInfo' : this.http_reqMyInfo,
        }
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
        this.model.updateUserInfo();
        this.view.updateInfo();
	}
    //网络事件回调begin
    http_reqMyInfo(){
        this.model.updateUserInfo();
        this.view.updateInfo();
    }
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}