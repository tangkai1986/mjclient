import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BunchInfoMgr from "../../Plat/GameMgrs/BunchInfoMgr";
import SwitchMgr from "../../Plat/GameMgrs/SwitchMgr";
import LoginMgr from "../../Plat/GameMgrs/LoginMgr";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import ShareMgr from "../../Plat/GameMgrs/ShareMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_SssSettlePanelCtrl;
//模型，数据处理
class Model extends BaseModel{
	shareSwitch=null;
	constructor()
	{
		super();
		this.shareSwitch = SwitchMgr.getInstance().get_switch_performance_sharing();
	}
	updateSwitch(msg){
        this.shareSwitch = msg.cfg.switch_performance_sharing;
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		settleTotal: ctrl.settleTotal,
		settleRound: ctrl.settleRound,
		togglePanel: ctrl.togglePanel,
		content: ctrl.content,
		exitBtn: ctrl.exitBtn,
		shareBtn: ctrl.shareBtn,
		closeBtn: ctrl.closeBtn
	};
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
		this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
        this.ui.closeBtn.active = false;
		this.ui.togglePanel.children[0].getComponent(cc.Toggle).check();
		let node = cc.instantiate(this.ui.settleTotal);
		this.ui.content.addChild(node);
		let node2 = cc.instantiate(this.ui.settleRound);
		this.ui.content.addChild(node2);
		node2.active = false;
        if(BunchInfoMgr.getInstance().getplazzaFlag()) {
            this.ui.exitBtn.active=false;
            this.ui.closeBtn.active = true;
            this.ui.shareBtn.position.x = 0;
		}
		this.showShareBtn();
	}

	updateContent (index) {
		this.ui.content.children[0].active = !index;
		this.ui.content.children[1].active = index;
	}

	showShareBtn(){
        this.ui.shareBtn.active = this.model.shareSwitch == 1?true:false;
    }
}
//c, 控制
@ccclass
export default class Prefab_SssSettlePanelCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip: '总统计预制',
		type: cc.Prefab
	})
	settleTotal: cc.Prefab = null;

	@property({
		tooltip: '每局统计预制',
		type: cc.Prefab
	})
	settleRound: cc.Prefab = null;

	@property({
		tooltip: '侧边按钮父节点',
		type: cc.Node
	})
	togglePanel: cc.Node = null;

	@property({
		tooltip: '内容父节点',
		type: cc.Node
	})
	content: cc.Node = null;

	@property({
		tooltip: '退出房间按钮',
		type: cc.Node
	})
	exitBtn: cc.Node = null;

	@property({
		tooltip: '分享按钮',
		type: cc.Node
	})
	shareBtn: cc.Node = null;

	@property({
		tooltip: '关闭按钮',
		type: cc.Node
	})
	closeBtn: cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad () {
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);
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
		for(let i = 0; i < this.ui.togglePanel.children.length; ++i){
			this.connect(G_UiType.toggle, this.ui.togglePanel.children[i], ()=>{this.toggleCB(i)}, '切换内容');
		}
		this.connect(G_UiType.button, this.ui.exitBtn, this.exitBtnCB, '退出大菠萝总结算');
        this.connect(G_UiType.button, this.ui.shareBtn, this.shareBtnCB, '点击分享结算')
        this.connect(G_UiType.button, this.ui.closeBtn, this.closeBtnCB, '关闭大菠萝总结算')
	}

	start () {

	}
	//网络事件回调begin
	http_reqGameSwitch(msg){
		this.model.updateSwitch(msg);
        this.view.showShareBtn()
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	toggleCB (index) {
		this.view.updateContent(index);
	}

	exitBtnCB() {
		BunchInfoMgr.getInstance().clear();
        LoginMgr.getInstance().disconnectGameSvr();
	}
    shareBtnCB () {
		//console.log('btn_share_cb',ShareMgr.getInstance().shareButtonFlag)
		ShareMgr.getInstance().shareButtonFlag=false;
        this.start_sub_module(G_MODULE.Shared);
	}
	
	closeBtnCB() { 
		BunchInfoMgr.getInstance().clear(); 
		if(RoomMgr.getInstance().isInRoom())
		{
			LoginMgr.getInstance().disconnectGameSvr()
		}
		else
		{
			this.finish();
		}
	}
	//end
}
