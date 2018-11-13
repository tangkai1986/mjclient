import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import SettingMgr from "../../GameMgrs/SettingMgr";

const {ccclass, property} = cc._decorator;
let ctrl : Prefab_notifySettingCtrl;
//模型，数据处理
class Model extends BaseModel{
    notifyInfo:any = null
	constructor()
	{
		super();
		this.notifyInfo = SettingMgr.getInstance().getNotifyInfo();
		//console.log("notifyInfo",this.notifyInfo);
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        node_MatchAd:null,
        node_MatchBegin:null,
        node_ClubMatchSignUp:null,
        node_ClubMatchInvite:null,
	};
	private node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
	}
	//初始化ui
	initUi()
	{	
		this.ui.node_MatchAd = ctrl.MatchAd;
		this.ui.node_MatchBegin = ctrl.MatchBegin;
		this.ui.node_ClubMatchSignUp = ctrl.ClubMatchSignUp;
		this.ui.node_ClubMatchInvite = ctrl.ClubMatchInvite;
		this.ui.node_MatchAd.getComponent(cc.Toggle).isChecked = this.model.notifyInfo.bMatchAD;
		this.ui.node_MatchBegin.getComponent(cc.Toggle).isChecked = this.model.notifyInfo.bMatchBegin;
		this.ui.node_ClubMatchSignUp.getComponent(cc.Toggle).isChecked = this.model.notifyInfo.bClubMatchSignUp;
		this.ui.node_ClubMatchInvite.getComponent(cc.Toggle).isChecked = this.model.notifyInfo.bClubMatchInvite;
    }
}
//控制器
@ccclass
export default class Prefab_notifySettingCtrl extends BaseControl {

	@property({
		tooltip : "大奖赛广告",
		type : cc.Node
	})
	MatchAd : cc.Node = null;

	@property({
		tooltip : "大奖赛比赛开赛提醒",
		type : cc.Node
	})
	MatchBegin : cc.Node = null;

	@property({
		tooltip : "茶馆比赛开赛提醒",
		type : cc.Node
	})
	ClubMatchSignUp : cc.Node = null;

	@property({
		tooltip : "茶馆房间邀请信息",
		type : cc.Node
	})
	ClubMatchInvite : cc.Node = null;

    onLoad () {
    	//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
    }
     //定义网络事件
	defineNetEvents()
	{

	}
	//定义全局事件
	defineGlobalEvents()
	{

	}

	connectUi()
	{
		this.connect(G_UiType.toggle, this.ui.node_MatchAd, this.switchCB, '点击大奖赛广告开关');
		this.connect(G_UiType.toggle, this.ui.node_MatchBegin, this.switchCB, '点击比赛开始提示开关');
		this.connect(G_UiType.toggle, this.ui.node_ClubMatchSignUp, this.switchCB, '点击茶馆赛报名提示开关');
		this.connect(G_UiType.toggle, this.ui.node_ClubMatchInvite, this.switchCB, '点击茶馆赛邀请开关');
	}

    start () {

    }

    private switchCB(event){
    	//console.log(event.currentTarget.name)
    	let clickNode = event.currentTarget;
    	switch (event.currentTarget.name) {
    		case 'gameMatch':
    			//console.log('大奖赛开关设置')
    			SettingMgr.getInstance().setProperty(!this.model.notifyInfo.bMatchAD, 'notifyInfo', 'bMatchAD');
    			break;
    		case 'matchBeginTip':
    			//console.log('比赛开始提示开关')
    			SettingMgr.getInstance().setProperty(!this.model.notifyInfo.bMatchBegin, 'notifyInfo', 'bMatchBegin');  			
    			break;
    		case 'clubMatchMsg':
    			//console.log('茶馆赛报名提示开关')
    			SettingMgr.getInstance().setProperty(!this.model.notifyInfo.bClubMatchSignUp, 'notifyInfo', 'bClubMatchSignUp');
    			break;
    		case 'clubInviteMsg':
    			//console.log('茶馆赛邀请开关')
    			SettingMgr.getInstance().setProperty(!this.model.notifyInfo.bClubMatchInvite, 'notifyInfo', 'bClubMatchInvite');
    			break;
    	}
    	this.model.notifyInfo = SettingMgr.getInstance().getNotifyInfo();
		//console.log('notifyInfo:', this.model.notifyInfo);
	}
    // update (dt) {},
}
