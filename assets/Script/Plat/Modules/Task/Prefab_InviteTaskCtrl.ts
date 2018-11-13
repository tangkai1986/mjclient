import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import ShareMgr from "../../GameMgrs/shareMgr"
import TaskMgr from "../../GameMgrs/TaskMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
import AppInfoMgr from "../../../AppStart/AppMgrs/AppInfoMgr";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_InviteTaskCtrl;
//模型，数据处理
class Model extends BaseModel{
	inviteInfo = null;
	oldreward = [];
	constructor()
	{
		super();
		this.inviteInfo = ShareMgr.getInstance().getShareTaskData();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		countLabel: ctrl.countLabel,
		inviteProgress: ctrl.inviteProgress,
		labelPanel: ctrl.labelPanel,
		rewardPanel: ctrl.rewardPanel,
		inviteBtn: ctrl.inviteBtn,
		receive:ctrl.receive,
		goinviteLIst:[],
		rewardList: [],
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
		let info = this.model.inviteInfo;
		cc.error(info);
		this.ui.countLabel.string = info.number;
		for(let i = 0; i < info.targets.length; ++i){
			this.ui.labelPanel.children[i].getComponent(cc.Label).string = `${info.targets[i].target}次`;
            this.ui.rewardPanel.children[i].getChildByName("count").getComponent(cc.Label).string = info.targets[i].amount;
		}
		let progressArr = [0,0.1, 0.2, 0.3, 0.4, 0.5,0.544,0.588,0.632,0.676,0.72,0.748,0.776,0.804,0.832,0.860,0.888,0.916,0.934,0.962,1]
		// let index = 0;
	
		// 	for(let i = 0;i<5;i++){
		// 		if (info.number > info.targets[i].target) {
		// 			index++
		// 		}
			
		// }
        this.ui.inviteProgress.progress = progressArr[info.number];
		for(let i = 0; i < this.ui.labelPanel.children.length; ++i){
			this.updateReceiveState(i);
		}
		for(let i=0;i<this.ui.labelPanel.children.length;++i){
            this.ui.goinviteLIst.push(this.ui.rewardPanel.children[i]);
            this.ui.rewardList.push(this.ui.receive.children[i]);
		}
	}
    updateReceiveState (index) {
		let info = this.model.inviteInfo;
		let receiveState = info.targets[index].status;
		this.ui.receive.children[index].active=!receiveState&&info.targets[index].target<=info.number;
        this.ui.rewardPanel.children[index].getChildByName('received').active=receiveState;
	}
}

//c, 控制
@ccclass
export default class Prefab_InviteTaskCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip: "已邀请人数Label",
		type: cc.Label
	})
	countLabel: cc.Label = null;

	@property({
		tooltip: "进度条",
		type:cc.ProgressBar
	})
	inviteProgress: cc.ProgressBar = null;

	@property({
		tooltip: '目标人数Label父节点',
		type: cc.Node
	})
	labelPanel: cc.Node = null;

	@property({
		tooltip: '奖励父节点',
		type: cc.Node
	})
	rewardPanel: cc.Node = null;

	@property({
		tooltip: "邀请按钮",
		type: cc.Node
	})
	inviteBtn: cc.Node = null;

	@property({
		tooltip: "领取奖励按钮父节点",
		type: cc.Node
	})
	receive: cc.Node = null;

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
		this.n_events={
			//网络消息监听列表
            'http.reqInviteGiftInfo': this.http_reqInviteGiftInfo,
		}
        
	}
	//定义全局事件
	defineGlobalEvents()
	{
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.button, this.ui.inviteBtn, this.inviteBtnCB, "点击邀请好友");
		for(let i = 0; i < this.ui.rewardList.length; ++i){
			let cb = function () {
				this.rewardCB(i);
			}
			this.connect(G_UiType.button, this.ui.rewardList[i], cb, '领取邀请奖励');
		}
		for(let i = 0; i < this.ui.goinviteLIst.length; ++i){
			let cb = function () {
				this.goinvite(i);
			}
			this.connect(G_UiType.button, this.ui.goinviteLIst[i], cb, '去邀请');
		}
	}
	start () {
        cc.log("邀请有礼创建界面")
	}
    onDestroy () {
        cc.log("邀请有礼界面关闭了")
    }

	goinvite(index){
		ShareMgr.getInstance().setCurClick(index);
		this.start_sub_module(G_MODULE.	goinvite);
	}
	rewardCB (index) {
		ShareMgr.getInstance().setCurClick(index);
		ShareMgr.getInstance().sendReqReceiveInviteGift({target: this.model.inviteInfo.targets[index].target});
	}

	inviteBtnCB () {
		if (cc.sys.isNative){
			let appname=AppInfoMgr.getInstance().getAppName();
			G_PLATFORM.wxShareContent(G_PLATFORM.WX_SHARE_TYPE.WXSceneSession, `《${appname}》游戏邀请`, "正宗泉州麻将，iphone X免费领，每天登录送现金", this.model.inviteInfo.url)

		}
	}
	
	//网络事件回调begin
    http_reqInviteGiftInfo (msg) {
		this.model.inviteInfo = ShareMgr.getInstance().getShareTaskData();
        this.view.initUi();
        cc.log("领取邀请奖励", msg)
    }
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}
