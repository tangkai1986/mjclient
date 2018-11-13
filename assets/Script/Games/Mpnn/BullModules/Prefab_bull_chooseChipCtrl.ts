/*
author: YOYO
日期:2018-03-07 14:06:36
闲家选择筹码
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import QznnConst from "../../Qznn/QznnMgr/QznnConst";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import QznnLogic from "../../Qznn/QznnMgr/QznnLogic";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_bull_chooseChipCtrl;
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    list_chips:Array<cc.Node> = null
	ui={
        //在这里声明ui
        node_chipContainer:null,
        node_img_tip:null
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
        this.ui.node_chipContainer = ctrl.node_chipContainer;
        this.ui.node_img_tip = ctrl.node_img_tip;
        this.list_chips = this.ui.node_chipContainer.children;
    }
    
    //从左到右依次刷新筹码数值
    setChipsValue (valueList){
        let value;
        for(let i = 0; i < valueList.length; i ++){
            value = valueList[i];
            this.setChipValue(i, value);
        }
    }

    getChipValue (btnNode:cc.Node){
        return btnNode.getComponent(cc.Label).string;
    }

    setTipIsShow (isShow:Boolean){
        this.ui.node_img_tip.active = isShow;
    }

    //==============

    private setChipValue (index:number, value:string){
        if(this.list_chips[index]){
            this.list_chips[index].getComponent(cc.Label).string = value;
        }
    }
}
//c, 控制
@ccclass
export default class Prefab_bull_chooseChipCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
    @property(cc.Node)
    node_chipContainer:cc.Node = null
    @property(cc.Node)
    node_img_tip:cc.Node = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {};
        this.n_events[QznnConst.clientEvent.onPeopleChooseChip] = this.onPeopleChooseChip;
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        let curList = this.view.list_chips;
        if(curList){
            for(let i = 0; i < curList.length; i ++){
                this.connect(G_UiType.image, curList[i], this.onClickChip, '选择某个筹码');
            }
        }
	}
	start () {
        this.view.setChipsValue(QznnLogic.getInstance().getChipValueList());
	}
    //网络事件回调begin
    
    //有玩家下注
    onPeopleChooseChip(msg){
        let logicSeatId = msg.chooseSeatId;
        // let value = msg.chipValue;
        if(logicSeatId == RoomMgr.getInstance().getMySeatId()){
            this.finish();
        }
    }
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    
    private onClickChip (btnNode){
        let value = this.view.getChipValue(btnNode);
        //console.log('onClickChip== ',value)

        QznnLogic.getInstance().reqChooseChip(value);
    }
	//end
}