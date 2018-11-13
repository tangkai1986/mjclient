/*
author: YOYO
日期:2018-03-05 18:26:10
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import QznnLogic from "../../Qznn/QznnMgr/QznnLogic";
import QznnConst from "../../Qznn/QznnMgr/QznnConst";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_bull_chooseGrab;
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        node_btn_grab:null,
        node_btn_noGrab:null
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
        this.ui.node_btn_grab = ctrl.node_btn_grab;
        this.ui.node_btn_noGrab = ctrl.node_btn_noGrab;
	}
}
//c, 控制
@ccclass
export default class Prefab_bull_chooseGrab extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
    @property(cc.Node)
    node_btn_grab:cc.Node = null
    @property(cc.Node)
    node_btn_noGrab:cc.Node = null
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
        this.n_events[QznnConst.clientEvent.onPeopleGrab] = this.onPeopleGrab;
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.ui.node_btn_grab, this.node_btn_grab_cb, '点击抢庄');
        this.connect(G_UiType.image, this.ui.node_btn_noGrab, this.node_btn_noGrab_cb, '点击不抢庄');
	}
	start () {
	}
    //网络事件回调begin

    //有玩家选择了抢庄或者不抢庄
    onPeopleGrab(msg){
        let seatId = msg.grabSeatId;
        // let grabIndex = parseInt(msg.isGrab);
        if(seatId == RoomMgr.getInstance().getMySeatId()){
            //提交是否抢庄成功
            this.finish();
        }
    }
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    private node_btn_grab_cb(btn){
        //console.log('click node_btn_grab_cb')

        QznnLogic.getInstance().reqGrab(true);
    }
    private node_btn_noGrab_cb(btn){
        //console.log('click node_btn_noGrab_cb')

        QznnLogic.getInstance().reqGrab(false);
    }
	//end
}