import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import RoomMgr from "../../GameMgrs/RoomMgr";
import BetMgr from "../../GameMgrs/BetMgr";
import RoomOptionCfg from "../../CfgMgrs/RoomOptionCfg"; 
import GameFreeMgr from "../../GameMgrs/GameFreeMgr";
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef";

const {ccclass, property} = cc._decorator;

let ctrl : RoomOptionCtrl;
//模型，数据处理
class Model extends BaseModel{
    roomOptionData:any = {};
    roomInfo:any = {};
    gameId:number = null;
	constructor()
	{
        super();
        this.gameId = BetMgr.getInstance().getGameId();
        this.roomOptionData = RoomOptionCfg.getInstance().getGameRoomOption(this.gameId)
        this.roomInfo = RoomMgr.getInstance().getFangKaCfg();
	}
    getContent (key) {
        return this.roomOptionData.content[key];
    }
    getTitle (key) {
        return this.roomOptionData.title[key];
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
        this.addGrayLayer();
	}
    ui={
        roomOptionItem : ctrl.RoomOptionItem,
        btnOpen : ctrl.BtnOpen,
        btnPackup : ctrl.BtnPackup,
        optionContent : ctrl.OptionContent,
        btnClose : ctrl.BtnClose,
        arrItem : [],
    };
	
	//初始化ui
	initUi(){
       this.initOptionItem() 
    }

    initOptionItem(){
        //console.log('房间配置信息', this.model.roomInfo)
        for (let key in this.model.roomInfo) {
            let item = cc.instantiate(this.ui.roomOptionItem)
            item.parent = this.ui.optionContent
            let content = this.model.getContent(key)
            let title = this.model.getTitle(key)
            let value = this.model.roomInfo[key]
            let itemComp = item.getComponent('RoomOptionItemCtrl')      //实例化小项出来
            let clubid = RoomMgr.getInstance().getEnterFangKaClubId()
            let paysource = RoomMgr.getInstance().getEnterFangKaPaysource()
            if(key == "v_paytype" && clubid != 0 && paysource > 1){
                value = 3
            }
            if(key == "v_fangfei"){
                itemComp.Title.string = title
                if(GameFreeMgr.getInstance().isFree(this.model.gameId)){
                    itemComp.ItemValue.string = '限时免费无需支付房费'
                }else{
                    itemComp.ItemValue.string = this.model.roomInfo[key] + '钻石'
                }
                itemComp.Describe.string = '开设房间所需要的费用'
            }else if(key == "v_youjinjiangli"){
                // itemComp.Title.string = title
                // itemComp.ItemValue.string = this.model.roomInfo[key]
                // itemComp.Describe.string = '一课模式总结算时，游金额外收取三家的筹码数量,最多只能输入999。'
                // item.active = this.model.roomInfo.b_yike == 1
            }else if(key == "v_shasanjiangli"){
                // itemComp.Title.string = title
                // itemComp.ItemValue.string = this.model.roomInfo[key]
                // itemComp.Describe.string = '一课模式总结算时，杀三额外收取三家的筹码数量,最多只能输入999。'
                // item.active = this.model.roomInfo.b_yike == 1 && this.model.roomInfo.v_seatcount > 3?true:false;
            }else if(key == "b_yike" || key == "t_bazhanghua" || key == 'b_hupai'||key == "t_youjin"){
                //console.log('不显示'+key)
                itemComp.finish();
            }
            else if(key == 'v_fullstart' && this.model.gameId == 13){
                //console.log('不显示'+key)
                itemComp.finish();
            }else if(key == "t_youjin" && this.model.gameId == 6){
                //console.log('不显示'+key)
            }
            else if(key == 'v_startModel' && this.model.gameId != 13){
                //console.log('不显示'+key)
                itemComp.finish();
            }else if(key == 'v_playerbuyLimit'&& this.model.gameId == 19){
                //console.log('暂时不显示'+key)
                itemComp.finish();
            }else if (key == "v_allotFlowerData") {
                itemComp.Title.string = title
                itemComp.ItemValue.string = ""
                itemComp.Describe.string = ""
                for (let i=0; i<value.length; i++) {
                    itemComp.ItemValue.string += value[i] ? content.describe[i]+`x${value[i]} ` : content[0]
                }
                for (let i=0; i<value.length; i++) {
                    itemComp.Describe.string += value[i] ? content.describe[i]+`x${value[i]} ` : content[0]
                }
            }else if (key == "v_buyHorseData") {
                itemComp.Title.string = title
                let buyHorse = parseInt(this.model.roomInfo["v_buyHorse"])
                itemComp.ItemValue.string = buyHorse ? content[value.toString()] : "无"
                itemComp.Describe.string = buyHorse ? content[value.toString()] : "无码牌"
            }else {
                if(content != null && content != undefined) {
                    itemComp.Title.string = title
                    itemComp.ItemValue.string = content[value.toString()]
                    itemComp.Describe.string = content.describe[value.toString()]
                }
            }
            this.ui.arrItem.push(item)
        }
    }
}

@ccclass
export default class RoomOptionCtrl extends BaseCtrl {

    @property({
        tooltip : '',
        type : cc.Prefab
    })
    RoomOptionItem : cc.Prefab = null;

    @property({
        tooltip : '',
        type : cc.Node
    })
    BtnOpen : cc.Node = null;

    @property({
        tooltip : '',
        type : cc.Node
    })
    BtnPackup : cc.Node = null;

    @property({
        tooltip : '',
        type : cc.Node
    })
    OptionContent : cc.Node = null;

    @property({
        tooltip : '',
        type : cc.Node
    })
    BtnClose: cc.Node = null;

    onLoad () {
        ctrl = this;
        this.initMvc(Model, View);
    }

    defineNetEvents(){
        this.n_events = {
            'onStartGame':this.onStartGame,  
            "onDissolutionRoom": this.onDissolutionRoom, 
            onGameFinished:this.onGameFinished,
		}
    }
    defineGlobalEvents(){
    
    }

    connectUi(){
        this.connect(G_UiType.button, this.ui.btnOpen, this.btnOpen_cb, '切换展开规则')
        this.connect(G_UiType.button, this.ui.btnPackup, this.BtnPackup_cb, '切换收起规则')
        this.connect(G_UiType.button, this.ui.btnClose, this.btnClose_cb, '关闭按钮')
    }

    start () {

    }

    onGameFinished(msg)
	{  
        this.finish();  
	}

    btnOpen_cb(event){
        for(let i = 0; i<this.ui.arrItem.length; i++){
            if(this.ui.arrItem[i].name != ''){
                let value = this.ui.arrItem[i].getChildByName('describe').getComponent(cc.Label).string
                let content = this.ui.arrItem[i].getChildByName("shortNode").getChildByName("centent")
                content.color = new cc.Color(168, 68, 55) //酒红色
                this.ui.btnOpen.active = false;
                this.ui.btnPackup.active = true;
                if (value != "") {
                    this.ui.arrItem[i].getChildByName('describe').active = true;
                }
            }
        } 
    }

    BtnPackup_cb(event){
        for(let i = 0; i<this.ui.arrItem.length; i++){
            if(this.ui.arrItem[i].name != ''){
                this.ui.arrItem[i].getChildByName('describe').active = false;
                let content = this.ui.arrItem[i].getChildByName("shortNode").getChildByName("centent")
                content.color = new cc.Color(147, 96, 35) //咖啡色
            }
        }
        this.ui.btnOpen.active = true;
        this.ui.btnPackup.active = false;
    }

    btnClose_cb(event){
       this.finish() 
    }

    onStartGame(msg) { 
	    this.finish(); 
    }

    onDissolutionRoom(msg) {
        if(msg.result) {
			this.finish();
		}
    }
    // update (dt) {},
}

