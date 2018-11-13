//大厅控制管理
import BaseModel from "../../Libs/BaseModel";
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import LuckDrawMgr from "../../GameMgrs/LuckDrawMgr";
import SwitchMgr from "../../GameMgrs/SwitchMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MoreCtrl;
//模型，数据处理
class Model extends BaseModel{
    public cusServiceSwtich = null;
    public announceSwitch = null;
    public playMethodSwitch = null;
	constructor()
	{
        super();
        this.cusServiceSwtich = SwitchMgr.getInstance().get_switch_customer_service();
        this.announceSwitch = SwitchMgr.getInstance().get_switch_notice();
        this.playMethodSwitch = SwitchMgr.getInstance().get_switch_play_method();
    }
    updateSwitch(msg){
        this.cusServiceSwtich = msg.cfg.switch_customer_service;
        this.announceSwitch = msg.cfg.switch_notice;
        this.playMethodSwitch = msg.cfg.switch_play_method;        
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
    ui={
        allBtnParent: ctrl.allBtnParent,
        btn_playMethod: ctrl.btn_playMethod,
        btn_record: ctrl.btn_record,
        btn_cusService: ctrl.btn_cusService,
        btn_setUp: ctrl.btn_setUp,
        btn_annouce: ctrl.btn_annouce
    };
	//初始化ui
	initUi(){
        this.ui.btn_annouce.active = false;
        this.ui.btn_cusService.active = false;
        this.ui.btn_playMethod.active = false;
        this.showBtn();
	}
    //界面显示动画
    showAni (action) {
        this.ui.allBtnParent.runAction(action)
        //console.log(this.ui.btn_annouce.opacity);
    }
    //界面关闭动画
    closeAni (action) {
        this.ui.allBtnParent.runAction(action)
    }
    //开关控制
    showBtn(){
        this.ui.btn_cusService.active = this.model.cusServiceSwtich == 1?true:false;
        this.ui.btn_annouce.active = this.model.announceSwitch == 1?true:false;
        this.ui.btn_playMethod.active = this.model.playMethodSwitch == 1?true:false;
    }
}
//c, 控制
@ccclass
export default class MoreCtrl extends BaseCtrl {
    //这边去声明ui组件
    @property({
        tooltip: "按钮父节点",
        type: cc.Node
    })
    allBtnParent: cc.Node = null;
    @property({
        tooltip: "玩法",
        type: cc.Node
    })
    btn_playMethod: cc.Node = null;

    @property({
        tooltip: "战绩",
        type: cc.Node
    })
    btn_record: cc.Node = null;

    @property({
        tooltip: "客服",
        type: cc.Node
    })
    btn_cusService: cc.Node = null;

    @property({
        tooltip: "设置",
        type: cc.Node
    })
    btn_setUp: cc.Node = null;

    @property({
        tooltip: "公告",
        type: cc.Node
    })
    btn_annouce: cc.Node = null;
	//声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad () {
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View); 
        let action = cc.sequence(
            cc.hide(),
            cc.scaleTo(0.001, 0.1, 0.1),
            cc.show(),
            cc.scaleTo(0.3,1,1)
        )
        this.view.showAni(action)
	}

	//定义网络事件
	defineNetEvents () {
        this.n_events={
            'http.reqGameSwitch':this.http_reqGameSwitch,
        }
    }
	//定义全局事件
	defineGlobalEvents () {
    }
	//绑定操作的回调
    connectUi () {
        this.connect(G_UiType.button, this.ui.btn_playMethod, this.onClick_playMethod, "点击玩法");
        this.connect(G_UiType.button, this.ui.btn_record, this.onClick_record, "点击战绩");
        this.connect(G_UiType.button, this.ui.btn_cusService, this.onClick_cusService, "点击客服");
        this.connect(G_UiType.button, this.ui.btn_setUp, this.onClick_setUp, "点击设置");
        this.connect(G_UiType.button, this.ui.btn_annouce, this.onClick_annouce, "点击公告");
        this.connect(G_UiType.button, this.node, this.onClick_close, "点击更多界面的背景")
	}
	//网络事件回调begin
    http_reqGameSwitch(msg){
        this.model.updateSwitch(msg)
        this.view.showBtn();
    }
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    private onClick_playMethod () {
        this.start_sub_module(G_MODULE.RuleDescription)
    }
    private onClick_record () {
        this.start_sub_module(G_MODULE.RecordList);
    }
    private onClick_cusService () {
        // this.start_sub_module(G_MODULE.LuckDraw);
        //console.log("btn_kefu_cb");
        this.start_sub_module(G_MODULE.CustomService);
    }
    private onClick_setUp () {
        this.start_sub_module(G_MODULE.PlazaSetting)
    }

    private onClick_annouce () {
        this.start_sub_module(G_MODULE.Announcement);
    }

    private onClick_close () {
        let action = cc.sequence(
            cc.scaleTo(0.2, 0.1, 0.1),
            cc.callFunc(function(sender, data){
                ctrl.finish()
            })
        )
        this.view.closeAni(action)
    }
    //end
}
