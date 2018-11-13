import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import RoomMgr from "../../GameMgrs/RoomMgr";
import BetMgr from "../../GameMgrs/BetMgr";
import RoomOptionCfg from "../../CfgMgrs/RoomOptionCfg";

const {ccclass, property} = cc._decorator;

let ctrl : RoomOptionItemCtrl;
//模型，数据处理
class Model extends BaseModel{
    title:any = null;
    conetne:any = null;
    describe:any = null;
    gameId:number = null;
	constructor()
	{
        super();
        this.gameId = BetMgr.getInstance().getGameId();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	ui={
        title : ctrl.Title,
        itemValue : ctrl.ItemValue,
        describe : ctrl.Describe,
    };
	
	//初始化ui
	initUi(){
        
	}
}

@ccclass
export default class RoomOptionItemCtrl extends BaseCtrl {
    @property({
        tooltip : '',
        type : cc.Label
    })
    Title : cc.Label = null;

    @property({
        tooltip : '',
        type : cc.Label
    })
    ItemValue : cc.Label = null;

    @property({
        tooltip : '',
        type : cc.Label
    })
    Describe : cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ctrl = this;
        this.initMvc(Model, View);
    }

    defineNetEvents(){
    
    }

    defineGlobalEvents(){
    
    }

    connectUI(){
    
    }

    start () {

    }

    // update (dt) {},
}
