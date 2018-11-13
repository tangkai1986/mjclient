/*
author: YOYO
日期:2018-03-16 20:57:25
*/
import BullPosMgr from "./BullPosMgr";
import UserMgr from "../../Plat/GameMgrs/UserMgr";
import TbnnAudioMgr from "../../Games/Tbnn/BullMgr/TbnnAudioMgr";
import GEventDef from "../../Plat/GameMgrs/GEventDef";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import TbnnAudio from"../../Games/Tbnn/BullMgr/TbnnAudio"
import MpnnAudio from "../../Games/Mpnn/BullMgr/MpnnAudio";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Bull_cardResultTypeCtrl;
let BullConst;
let BullLogic;
//模型，数据处理
class Model extends BaseModel{
    seatCount:number = null             //最大座位数
    //bullScoreRate = null
    _roomRuleInfo = null
    _gameid = null
    userSex = null;
    delaerSeatId:number = null
	constructor()
	{
		super();
        BullConst = RoomMgr.getInstance().getDef();
        BullLogic = RoomMgr.getInstance().getLogic().getInstance();
        this.seatCount = RoomMgr.getInstance().getSeatCount();
        //this.bullScoreRate = BullLogic.getScoreRate();
        this._roomRuleInfo = RoomMgr.getInstance().getFangKaCfg();
        this.userSex = UserMgr.getInstance().getMySex();
        if(BullLogic.getDelaerSeatId){
            this.delaerSeatId = BullLogic.getDelaerSeatId();
        }
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    // private node_cardResultType:cc.Node                         //根据位置配置获取当前要用的节点
    private dict_results                                        //所有的结果表现对象
    ui={
        //在这里声明ui
        prefab_Min_ani:null,
        prefab_niuniu_ani:null,
        prefab_hulu_ani:null,
        prefab_shunzi_ani:null,
        prefab_tonghua_ani:null,
        prefab_wuhua_ani:null,
        prefab_wuxiaoniu_ani:null,
        prefab_zhadanniu_ani:null,
        atlas_resultValue:null,
        prefab_oneResultType:null,
        font_huluniu:null,
        font_niuniu:null,
        font_putongniu:null,
        font_shunziniu:null,
        font_tonghuaniu:null,
        font_wuhuaniu:null,
        font_wuxiaoniu:null,
        font_zhadnaniu:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.dict_results = {};
	}
	//初始化ui
	initUi()
	{
        this.ui.font_huluniu = ctrl.font_huluniu;
        this.ui.font_niuniu = ctrl.font_niuniu;
        this.ui.font_putongniu = ctrl.font_putongniu;
        this.ui.font_shunziniu = ctrl.font_shunziniu;
        this.ui.font_tonghuaniu = ctrl.font_tonghuaniu;
        this.ui.font_wuhuaniu = ctrl.font_wuhuaniu;
        this.ui.font_wuxiaoniu = ctrl.font_wuxiaoniu;
        this.ui.font_zhadnaniu = ctrl.font_zhadnaniu;
        this.ui.prefab_Min_ani = ctrl.prefab_Min_ani;
        this.ui.prefab_niuniu_ani = ctrl.prefab_niuniu_ani;
        this.ui.prefab_hulu_ani = ctrl.prefab_hulu_ani;
        this.ui.prefab_shunzi_ani = ctrl.prefab_shunzi_ani;
        this.ui.prefab_tonghua_ani = ctrl.prefab_tonghua_ani;
        this.ui.prefab_wuhua_ani = ctrl.prefab_wuhua_ani;
        this.ui.prefab_wuxiaoniu_ani = ctrl.prefab_wuxiaoniu_ani;
        this.ui.prefab_zhadanniu_ani = ctrl.prefab_zhadanniu_ani;
        this.ui.atlas_resultValue = ctrl.atlas_resultValue;
        this.ui.prefab_oneResultType = ctrl.prefab_oneResultType;

        // this.node_cardResultType = this.node.getChildByName('seats_'+this.model.seatCount);
    }
    
    /**
     * 显示结果牌型
     * @param viewSeatId 界面上设置的id，从0开始
     * @param value 需要显示的牌型值
     */
    
    showResultType(viewSeatId:number, value,onsettle:Boolean = true){
     
        let typeNode = this.getOneResult(viewSeatId);   //这个就是Bull_oneResultType
        if(typeNode){
            typeNode.active = true;
            let bgNode:cc.Node = typeNode.children[0];
            let valueNode = typeNode.children[1];
            let label = typeNode.children[2];
            let aniNode = bgNode.children[0];
            if(aniNode){
                aniNode.destroy();
                bgNode.removeAllChildren(true);
            }
            // TbnnAudioMgr.getInstance().playResultAudio(value,this.model.userSex);
            if(onsettle)
            {
                TbnnAudio.getInstance().playResultAudio(this.model.userSex,value);
            }
            aniNode = this.getBgAni(value);
            //得到字体
            let font = this.getFont(value);
            let index = parseInt(value);
            let ScoreRate = this.getScoreRate(index);
            if(ScoreRate != 0 && ScoreRate != 1){
                label.active = true;
                label.getComponent(cc.Label).string = `x${ScoreRate}`;
            }else{
                label.active = false;
            }
            label.getComponent(cc.Label).font = font;
            if (aniNode) {
                bgNode.addChild(aniNode);
            }
            let frame = this.ui.atlas_resultValue.getSpriteFrame('bull_result_' + value);
            if (frame) {
                valueNode.getComponent(cc.Sprite).spriteFrame = frame;
            } else {
                cc.error('show cardResultType value=' + value)
            }
        }
    }
    //隐藏所有的牌型结果体现
    hideAllResultType(){
        let effectNode:cc.Node;
        for(let viewSeatId in this.dict_results){
            effectNode = this.dict_results[viewSeatId].children[0].children[0];
            if(effectNode) {
                effectNode.removeFromParent(true);
                effectNode.destroy();
            }
            this.dict_results[viewSeatId].active = false;
        }
    }
    private getFont(resultType){
        let font = null;
        switch(resultType){
            case 0:
                break
            case 10:
                //牛牛
                font = this.ui.font_niuniu;
                break
            case 12:
                //顺子
                font = this.ui.font_shunziniu;
                break
            case 13:
                //同花
                font = this.ui.font_tonghuaniu;
                break
            case 14:
                //葫芦
                font = this.ui.font_huluniu;
                break
            case 15:
                //炸弹
                font = this.ui.font_zhadnaniu;
                break
            case 17:
                //五花
                font = this.ui.font_wuhuaniu;
                break
            case 18:
                //五小牛
                font = this.ui.font_wuxiaoniu;
                break
            default:
            font = this.ui.font_putongniu;
                break
        }
        if(font){
            return font;
        }
        return null
    }
    private getScoreRate(resultType){
        let ScoreRate = null;
        switch(resultType){
            case 0:
            ScoreRate = 1;
                break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                ScoreRate = this.model._roomRuleInfo.t_niu_6;
                break;
            case 7:
                ScoreRate = this.model._roomRuleInfo.t_niu_7;
                break;
            case 8:
                ScoreRate = this.model._roomRuleInfo.t_niu_8;
                break;
            case 9:
                ScoreRate = this.model._roomRuleInfo.t_niu_9;
                break;
            case 10:
                //牛牛
                ScoreRate = this.model._roomRuleInfo.t_niu_10;
                break;
            case 12:
                //顺子
                ScoreRate = this.model._roomRuleInfo.t_niu_12;
                break;
            case 13:
                //同花
                ScoreRate = this.model._roomRuleInfo.t_niu_13;
                break;
            case 14:
                //葫芦
                ScoreRate = this.model._roomRuleInfo.t_niu_14;
                break;
            case 15:
                //炸弹
                ScoreRate = this.model._roomRuleInfo.t_niu_15;
                break;
            case 17:
                //五花
                ScoreRate = this.model._roomRuleInfo.t_niu_17;
                break;
            case 18:
                //五小牛
                ScoreRate = this.model._roomRuleInfo.t_niu_18;
                break;
            default:
                ScoreRate = 1;
                break;
        }
        if(ScoreRate){
            return ScoreRate;
        }
        return null
    }
    //根据值获取对应的背景特效
    private getBgAni (resultType){
        let curPrefab = null;
        switch(resultType){
            case 0:
                break
            case 10:
                //牛牛
                curPrefab = this.ui.prefab_niuniu_ani;
                break
            case 12:
                //顺子
                curPrefab = this.ui.prefab_shunzi_ani;
                break
            case 13:
                //同花
                curPrefab = this.ui.prefab_tonghua_ani;
                break
            case 14:
                //葫芦
                curPrefab = this.ui.prefab_hulu_ani;
                break
            case 15:
                //炸弹
                curPrefab = this.ui.prefab_zhadanniu_ani;
                break
            case 17:
                //五花
                curPrefab = this.ui.prefab_wuhua_ani;
                break
            case 18:
                //五小牛
                curPrefab = this.ui.prefab_wuxiaoniu_ani;
                break
            default:
                curPrefab = this.ui.prefab_Min_ani;
                break
        }
        if(curPrefab){
            return cc.instantiate(curPrefab);
        }
        return null
    }

    private getOneResult (viewSeatId){
        let curNode = this.dict_results[viewSeatId];
        if(!curNode){
            curNode = cc.instantiate(this.ui.prefab_oneResultType);
            curNode.parent = this.node;
            curNode.position = BullPosMgr.getInstance().getResultTypePos(viewSeatId);
            this.dict_results[viewSeatId] = curNode;
        }
        return curNode;
    }
}
//c, 控制
@ccclass
export default class Bull_cardResultTypeCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
    @property(cc.SpriteAtlas)
    atlas_resultValue:cc.SpriteAtlas = null
    @property(cc.Prefab)
    prefab_Min_ani:cc.Prefab = null
    @property(cc.Prefab)
    prefab_niuniu_ani:cc.Prefab = null
    @property(cc.Prefab)
    prefab_hulu_ani:cc.Prefab = null
    @property(cc.Prefab)
    prefab_shunzi_ani:cc.Prefab = null
    @property(cc.Prefab)
    prefab_tonghua_ani:cc.Prefab = null
    @property(cc.Prefab)
    prefab_wuhua_ani:cc.Prefab = null
    @property(cc.Prefab)
    prefab_wuxiaoniu_ani:cc.Prefab = null
    @property(cc.Prefab)
    prefab_zhadanniu_ani:cc.Prefab = null
    @property(cc.Prefab)
    prefab_oneResultType:cc.Prefab = null
    @property(cc.Font)
    font_shunziniu:cc.Font = null
    @property(cc.Font)
    font_tonghuaniu:cc.Font = null
    @property(cc.Font)
    font_zhadnaniu:cc.Font = null
    @property(cc.Font)
    font_wuxiaoniu:cc.Font = null
    @property(cc.Font)
    font_wuhuaniu:cc.Font = null
    @property(cc.Font)
    font_putongniu:cc.Font = null
    @property(cc.Font)
    font_niuniu:cc.Font = null
    @property(cc.Font)
    font_huluniu:cc.Font = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
        this.initMvc(Model,View);
        this.atlas_resultValue.getSpriteFrame
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events['onPrepare'] = this.onPrepare;
        this.n_events[BullConst.clientEvent.onTanPai] = this.onTanPai;
        this.n_events[BullConst.clientEvent.onSettle] = this.onSettle_bull;
        this.n_events['room.roomHandler.nextRound'] = this.room_roomHandler_nextRound;
        this.n_events['connector.entryHandler.enterRoom'] = this.onMyEnterRoom;//自己进入的
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events[GEventDef.bull_showResultType] = this.onShowResultType;
	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
        
	}
    //网络事件回调begin
    //自己进入的
    onMyEnterRoom(msg){
        let room = RoomMgr.getInstance();
        this.view.hideAllResultType();
    }
    //当有人发起了准备
    onPrepare(msg){
        if(msg.seatid == RoomMgr.getInstance().getMySeatId()){
            //自己准备，清理所有上一局的表现
            this.view.hideAllResultType();
        }
    }
    /*结算
    winSeatId:null,                     //胜利的座位id
            scoreInfo:null,                     //胜利的相关信息（输赢分值）{}
            servertime_now:null,                //服务器时间(客户端同步时间并计算间隔)
            servertime_next:null,               //服务器时间(客户端同步时间并计算间隔)
    scoreInfo = {1:10}
    dict_notTanPai
    */
   onSettle_bull(msg){
        //将没有摊牌的玩家摊牌
        let resultObj;
        if(this.model.delaerSeatId!=null){
            for(let logicId in msg.dict_notTanPai){
                let delaerviewId = RoomMgr.getInstance().getViewSeatId(this.model.delaerSeatId)
                this.view.showResultType(RoomMgr.getInstance().getViewSeatId(logicId), msg.dict_notTanPai[logicId].resultType, false)
                if(delaerviewId == logicId){
                    if(msg.dict_notTanPai[logicId]){
                       MpnnAudio.getInstance().playResultAudio(this.model.userSex,msg.dict_notTanPai[logicId].resultType)
                    }
                }

            }
        }
        else{
            for(let logicId in msg.dict_notTanPai){
                resultObj = msg.dict_notTanPai[logicId];
                if(resultObj){
                    this.view.showResultType(RoomMgr.getInstance().getViewSeatId(logicId), resultObj.resultType);
                    TbnnAudio.getInstance().playResultAudio(this.model.userSex,resultObj.resultType);
                }
            }
        }
       
    }
    /*有人摊牌
    seatId:null,                        //摊牌玩家的位置id
            cardLogicIdList:null                //摊牌玩家手上的牌列表
            resultType:null,                    //结果类型，牛几
    */
   onTanPai(msg){
        ////console.log('onTanPai=== ',msg)
        let Room = RoomMgr.getInstance();
        let myViewSeatId = Room.getViewSeatId(msg.seatId);
        this.view.showResultType(myViewSeatId, msg.resultType);
    }
    //下一局
    room_roomHandler_nextRound(){
        this.view.hideAllResultType();
    }

	//end
    //全局事件回调begin
    //显示结果
    onShowResultType(msg){
        ////console.log('全局显示卡牌类型结果= ', msg)
        let type = msg.resultType;
        let seatId = msg.seatId;
        // let Room = RoomMgr.getInstance();
        // let myViewSeatId = Room.getViewSeatId(Room.getMySeatId());
        this.view.showResultType(seatId, type);
    }

	//end
	//按钮或任何控件操作的回调begin
	//end
}