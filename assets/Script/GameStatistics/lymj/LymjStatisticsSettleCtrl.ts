/*
author: TK
日期:2018-02-06 16:02:51
总结算
*/


import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import BunchInfoMgr from "../../Plat/GameMgrs/BunchInfoMgr";
import viewLogicSeatConvertMgr from "../../Plat/GameMgrs/viewLogicSeatConvertMgr";
import UiMgr from "../../Plat/GameMgrs/UiMgr";



let Green = new cc.Color(1,146,7),Red = new cc.Color(255,36,0), Yellow = new cc.Color(255,222,0);
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : LymjStatisticsSettleCtrl;
//模型，数据处理
class Model extends BaseModel{
    gameResultData:{} = null;
    hutypenodeLeap=0;
    constructor()
    {
        super();
        this.hutypenodeLeap = ctrl.Int_hutypeLeap;
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
        node_panel:null,
        lbl_chihus:{},
        lbl_zimos:{},
        lbl_youjins:{},
        lbl_shuangyous:{},
        lbl_sanyous:{},
        lbl_scores:{},
        lbl_names:{},
        img_heads:[],
        lbl_IDs:{},
        waterMarkForWins:{},
        waterMarkForLosts:{},
        node_waterMark:null,
        sprite_fz:{},
        node_hutypeList:[],
        img_wu:[],
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
        this.ui.node_panel = ctrl.node_panel;
        this.ui.node_waterMark = ctrl.node_waterMark;
        this.ui.node_hutypeList.push(ctrl.node_hutype0);
        ctrl.node_hutype0.active=false;
        this.ui.node_hutypeList.push(ctrl.node_hutype1);
        ctrl.node_hutype1.active=false;
        this.ui.node_hutypeList.push(ctrl.node_hutype2);
        ctrl.node_hutype2.active=false;
        this.ui.node_hutypeList.push(ctrl.node_hutype3);
        ctrl.node_hutype3.active=false;
        for (let logicseatid = 0; logicseatid < BunchInfoMgr.getInstance().getSeatCount(); ++logicseatid) {
            let playerNode=this.ui.node_panel.getChildByName(`player${logicseatid}`);
            playerNode.active = true;
            playerNode.getChildByName("playerInfo").active=true;
            this.ui.lbl_scores[logicseatid]=playerNode.getChildByName(`txt_score`).getComponent(cc.Label);
            this.ui.lbl_names[logicseatid]=playerNode.getChildByName("playerInfo").getChildByName(`lbl_name`).getComponent(cc.Label);
            this.ui.img_heads[logicseatid]=playerNode.getChildByName("playerInfo").getChildByName(`img_rwtx`).getComponent(cc.Sprite);
            this.ui.lbl_names[logicseatid].node.active=false;
            this.ui.lbl_IDs[logicseatid]=playerNode.getChildByName("playerInfo").getChildByName(`lbl_ID`).getComponent(cc.Label);
            this.ui.waterMarkForWins[logicseatid]=this.ui.node_waterMark.getChildByName(`user${logicseatid}`).getChildByName("zjs_seal_win");
            this.ui.waterMarkForLosts[logicseatid]=this.ui.node_waterMark.getChildByName(`user${logicseatid}`).getChildByName("zjs_seal_loser");
            this.ui.sprite_fz[logicseatid]=playerNode.getChildByName("playerInfo").getChildByName(`fz`).getComponent(cc.Sprite);
            this.ui.sprite_fz[logicseatid].node.active=false;
            this.ui.img_wu[logicseatid]=playerNode.getChildByName("img_wu");
            this.ui.img_wu[logicseatid].active=false;
        }
    }
    showPlayerInfo()
    {
        let leijiData = this.model.gameResultData.leiji;
        if (leijiData==null || leijiData==undefined) {
            return;
        }
        for (let logicseatid = 0; logicseatid < BunchInfoMgr.getInstance().getSeatCount(); ++logicseatid) {
            let users=BunchInfoMgr.getInstance().getMembelist();
            if(!users) {
                return;
            }
            let viewSeatId = viewLogicSeatConvertMgr.getInstance().getViewSeatId(logicseatid);
            this.ui.lbl_names[logicseatid].node.active=true;
            this.ui.lbl_names[logicseatid].string=users[logicseatid].nickname;
            if(!users[logicseatid]) {
                return;
            }
            if(users[logicseatid].nickname&&users[logicseatid].nickname.length>6){
                this.ui.lbl_names[logicseatid].string=users[logicseatid].nickname.substring(0,6);
            }
            if(parseInt(this.model.gameResultData.roomOwner)==parseInt(users[logicseatid].id)) {
                this.ui.sprite_fz[logicseatid].node.active=true;
            }
            this.ui.lbl_IDs[logicseatid].string="ID:"+users[logicseatid].logicid;
            if(users[logicseatid].headid,users[logicseatid].headurl){
                UiMgr.getInstance().setUserHead(this.ui.img_heads[logicseatid],users[logicseatid].headid,users[logicseatid].headurl);
            }else{
                UiMgr.getInstance().setUserHead(this.ui.img_heads[logicseatid],users[logicseatid].id,users[logicseatid].url);
            }
            
            let leijiItem=this.model.gameResultData.leiji[logicseatid];
            let leijiItemList=[];
            leijiItemList.push(["吃胡",leijiItem.chihu]);
            leijiItemList.push(["自摸",leijiItem.zimo]);
            leijiItemList.push(["游金",leijiItem.youjin]);
            leijiItemList.push(["双游",leijiItem.shuangyou]);
            leijiItemList.push(["三游",leijiItem.sanyou]);
            let hutypenode = this.ui.node_hutypeList[logicseatid];
            let nodeCount = 0;
            for (let i=0;i<leijiItemList.length;i++) {
                let leijiItemCube = leijiItemList[i];
                if(leijiItemCube[1]>0) {
                    let node = cc.instantiate(hutypenode);
                    node.active=true;
                    let nodePos = node.getPosition();
                    hutypenode.parent.addChild(node);
                    node.getChildByName("lbl_hu").getComponent(cc.Label).string = leijiItemCube[0];
                    node.getChildByName("hu_Num").getComponent(cc.Label).string = leijiItemCube[1];
                    node.getChildByName("hu_Num").color = Red;
                    node.setPosition(nodePos.x,nodePos.y-this.model.hutypenodeLeap*nodeCount);
                    nodeCount++;
                }
            }
            if (leijiData[logicseatid].title == 1) {
                this.ui.waterMarkForWins[logicseatid].active = true;
                this.ui.waterMarkForLosts[logicseatid].active = false;
            }
            else if (leijiData[logicseatid].title == 2) {
                this.ui.waterMarkForWins[logicseatid].active = false;
                this.ui.waterMarkForLosts[logicseatid].active = true;
            }
            this.ui.lbl_scores[logicseatid].string = leijiData[logicseatid].zongshuying;
            if (leijiData[logicseatid].zongshuying>=0) {
                this.ui.lbl_scores[logicseatid].node.color = Red;
            }
            else
            {
                this.ui.lbl_scores[logicseatid].node.color = Green; 
            }
        }
    }

}
//c, 控制
@ccclass
export default class LymjStatisticsSettleCtrl extends BaseCtrl {
    //这边去声明ui组件
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
    @property({
        tooltip : "hutype",
        type : cc.Node
    })
    node_hutype0 : cc.Node = null;
    @property({
        tooltip : "hutype",
        type : cc.Node
    })
    node_hutype1 : cc.Node = null;
    @property({
        tooltip : "hutype",
        type : cc.Node
    })
    node_hutype2 : cc.Node = null;
    @property({
        tooltip : "hutype",
        type : cc.Node
    })
    node_hutype3 : cc.Node = null;
    @property({
        tooltip : "hutype",
        type : cc.Integer
    })
    Int_hutypeLeap : cc.Integer = 0;

    //声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离


    onLoad (){
        //创建mvc模式中模型和视图
        //控制器
        ctrl = this;
        //数据模型
        this.initMvc(Model,View);
        let resultData = BunchInfoMgr.getInstance().getBunchInfo();
        //console.log("getBunchInfo",resultData);
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
    showView(data)
    {
        this.model.setgameResultData(data);
        this.view.showPlayerInfo();
    }
}
