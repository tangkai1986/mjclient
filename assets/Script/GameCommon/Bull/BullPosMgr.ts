/*
author: YOYO
日期:2018-03-23 11:08:17
*/
import BaseMgr from "../../Plat/Libs/BaseMgr";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";

const CONFIGS = {
    minAdaptNum:5,                      //最小适应人数
}
export default class BullPosMgr extends BaseMgr{
    private seatCfg:cc.Node                             //座位配置
    private giveCardsCfg:cc.Node                        //发牌配置
    private chipValueCfg:cc.Node                        //筹码配置
    private resultTypeCfg:cc.Node                       //结果类型配置
    private seatNodeCfg                                 //单个座位对象配置
    private chatPosCfg : cc.Node                        //聊天位置配置
    private seatVoicePosCfg : cc.Node                   //聊天位置配置

    constructor(){
        super();
        // //console.log('============================')
        // //console.log(this.getCurCfgName());
    }

    setSeatConfigs (posNodeCfg:cc.Node){
        this.seatCfg = this.initPosCfg(posNodeCfg);
    }
    setGiveCardPosCfg(posNodeCfg:cc.Node){
        this.giveCardsCfg = this.initPosCfg(posNodeCfg);
    }
    setChipValuePosCfg(posNodeCfg:cc.Node){
        this.chipValueCfg = this.initPosCfg(posNodeCfg);
    }
    setResultTypePosCfg(posNodeCfg:cc.Node){
        this.resultTypeCfg = this.initPosCfg(posNodeCfg);
    }
    setChatPosCfg(posNodeCfg:cc.Node){
        this.chatPosCfg = this.initPosCfg(posNodeCfg);
    }
    setSeatSizeConfig (seatNode:cc.Node){
        if(!this.seatNodeCfg){
            this.seatNodeCfg = {};
            this.seatNodeCfg.nodeW = seatNode.width;
            this.seatNodeCfg.nodeH = seatNode.height;
            let bg = seatNode.children[0];
            let headNode = bg.children[0];
            let headPos = headNode.position;
            this.seatNodeCfg.headW = headNode.width;
            this.seatNodeCfg.headH = headNode.height;
            let offX = seatNode.width-bg.width;
            let offY = seatNode.height-bg.height;

            this.seatNodeCfg.headPos = headPos;
            this.seatNodeCfg.mySelfHeadPos = cc.p(headPos.x, headPos.y);
            // this.seatNodeCfg.mySelfHeadPos.x -= offX/2;
            // this.seatNodeCfg.mySelfHeadPos.y -= offY/2;
            this.seatNodeCfg.mySeatPos = cc.p(seatNode.x, seatNode.y);
            this.seatNodeCfg.mySeatPos.x += offX;
            this.seatNodeCfg.mySeatPos.y -= offY;
        }
    }

    //获取某个座位的坐标
    getSeatPos (viewSeatId){
        return this.seatCfg.children[viewSeatId].position;
    }
    //获取某个座位发牌的坐标
    getGiveCardPos (viewSeatId){
        return this.giveCardsCfg.children[viewSeatId].position;
    }
    //获取某个座位聊天信息的坐标
    getChatPos (viewSeatId){
        return this.chatPosCfg.children[viewSeatId].position;
    }
    //获取某个座位声音状态的坐标
    getSeatVoicePos (viewSeatId){
        let seatPos = this.getSeatHeadPos(viewSeatId);
        return cc.p(seatPos.x+this.seatNodeCfg.headW/2, seatPos.y-this.seatNodeCfg.headH/2);
    }
    //获取某个位置上的筹码显示位置
    getChipPos (viewSeatId){
        return this.chipValueCfg.children[viewSeatId].position;
    }
    //获取某个位置上的筹码显示位置
    getResultTypePos (viewSeatId){
        return this.resultTypeCfg.children[viewSeatId].position;
    }
    //获取某个座位上的头像的坐标
    getSeatHeadPos (viewSeatId){
        let seat = this.seatCfg.children[viewSeatId];
        if(seat){
            let headParentPos = cc.p(0, 0);
            let headPos;
            if(viewSeatId == 0){
                headPos = this.seatNodeCfg.mySelfHeadPos;
            }else{
                headPos = this.seatNodeCfg.headPos;
            }
            return cc.p(headPos.x+headParentPos.x+seat.x, headPos.y+headParentPos.y+seat.y);
        }
        return null
    }
    //获取某个位置，验证信息显示的坐标
    getSeatCheckPos (viewSeatId){
        let seatPos = this.seatCfg.children[viewSeatId].position;
        let minSeat = this.getMinSeatId();
        if(viewSeatId == 0){
            return cc.p(seatPos.x+this.seatNodeCfg.nodeW/2+20, seatPos.y);
        }else if(viewSeatId < minSeat){
            return cc.p(seatPos.x - this.seatNodeCfg.nodeW/2, seatPos.y);
        }else{
            return cc.p(seatPos.x + this.seatNodeCfg.nodeW/2, seatPos.y);
        }
    }

    //获取中间节点的座位序号
    getMinSeatId (){
        let seatCount = RoomMgr.getInstance().getSeatCount();
        let dict = {6:3, 8:4};
        if(seatCount <= 6) seatCount = 6;
        else seatCount = 8;
        return dict[seatCount];
    }
    //获取座位的高度
    getSeatH (){
        return this.seatNodeCfg.nodeH;
    }
    private initPosCfg (posCfgNode:cc.Node){
        let seatCount = RoomMgr.getInstance().getSeatCount();
        let curStrName = "seats_"+RoomMgr.getInstance().getSeatCount();
        let nNode = posCfgNode.getChildByName(curStrName);
        if(!nNode){
            let curChildren = posCfgNode.children;;
            for(let i = 0; i < curChildren.length; i ++){
                if(parseInt(curChildren[i].name.split("_")[1]) > seatCount){
                    nNode = curChildren[i];
                    break;
                }
            }
        }
        return nNode
    }
    // private getCurCfgName (){
    //     return "seats_"+Math.max(RoomMgr.getInstance().getSeatCount(), CONFIGS.minAdaptNum);
    // }

    clear (){
        delete BullPosMgr._instance;
        BullPosMgr._instance=null;
    }
    //单例处理
    private static _instance:BullPosMgr;
    public static getInstance ():BullPosMgr{
        if(!this._instance){
            this._instance = new BullPosMgr();
        }
        return this._instance;
    }
}