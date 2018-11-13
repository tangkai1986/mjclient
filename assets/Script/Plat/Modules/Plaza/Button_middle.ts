import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import RoomMgr from "../../GameMgrs/RoomMgr";
import VerifyMgr from "../../GameMgrs/VerifyMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import ClubMgr from "../../GameMgrs/ClubMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import GameFreeMgr from "../../GameMgrs/GameFreeMgr";
import GameCateCfg from "../../CfgMgrs/GameCateCfg";
import ShareMgr from "../../GameMgrs/ShareMgr";
import ClubChatMgr from "../../GameMgrs/ClubChatMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : NodeRightCtrl;
//模型，数据处理
class Model extends BaseModel{
	gameList = null;
	isShare = null;
	constructor()
	{
		super();
		this.gameList = GameCateCfg.getInstance().getGames();
		this.isShare = ShareMgr.getInstance().getCheckDailyShare();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        btn_createRoom:ctrl.CreateRoom,
        btn_joinRoom:ctrl.JoinRoom,
        btn_club:ctrl.Club,
		btn_match:ctrl.Match,
		markFree:ctrl.markFree,
		btn_share:ctrl.btn_share,
	};
	constructor(model){
		super(model);
		this.node=ctrl.node;
		if(ctrl.node&&cc.isValid(ctrl.node)) {
			this.initUi();
			// code...
		}
	}
	//初始化ui
	initUi()
	{
		this.ui.markFree.active = false;
		this.showGameFree();
	}
	//是否显示限免的角标
	showGameFree(){
		let games = this.model.gameList;
		for(let i =0;i<games.length;i++){
			if(GameFreeMgr.getInstance().isFree(games[i].id)){
				this.ui.markFree.active = true;
				return
			}
		}
	}


}
//c, 控制
@ccclass
export default class NodeRightCtrl extends BaseControl {
	//这边去声明ui组件
    @property({
		tooltip : "创建房间按钮",
		type : cc.Node
	})
	CreateRoom:cc.Node = null;
	
	@property({
		tooltip : "限时免费角标",
		type : cc.Node
	})
    markFree:cc.Node = null;

    @property({
		tooltip : "加入房间按钮",
		type : cc.Node
	})
    JoinRoom : cc.Node = null;

    @property({
        tooltip : "茶馆",
        type : cc.Node
    })
    Club:cc.Node = null;

    @property({
        tooltip : "分享",
        type : cc.Node
    })
    btn_share:cc.Node = null;

    @property({
        tooltip : "比赛",
        type : cc.Node
    })
    Match : cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
    
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events = {
			"http.reqGameFreeList": this.http_reqGameFreeList,
			// "http.reqCheckDailyShare": this.http_reqCheckDailyShare,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.button,this.ui.btn_createRoom,this.CreateRoom_cb,'点击创建房间');
        this.connect(G_UiType.button,this.ui.btn_joinRoom,this.JoinRoomBtn_cb,'点击加入房间');
        this.connect(G_UiType.button,this.ui.btn_club,this.Clud_cb,'点击茶馆');
        this.connect(G_UiType.button,this.ui.btn_match,this.Match_cb,'点击比赛');
        this.connect(G_UiType.button,this.ui.btn_share,this.btn_shareCb,"点击分享");
	}
	start () {
	}
	//网络事件回调begin
	http_reqGameFreeList(){
		this.view.showGameFree();
	}
	http_reqCheckDailyShare(msg){
		// //console.log("领取免费钻石",msg);
		// if(msg.err == 0){
		// 	this.model.isShare = 0;
		// }else if(msg.err == 1){
		// 	this.model.isShare = 1;
		// }
		// //console.log("isShare2",this.model.isShare);
    }	
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private JoinRoomBtn_cb (event) { 
        //判断有没有恢复房间
        if(VerifyMgr.getInstance().checkUnSettled()){
            return;
        }
		this.start_sub_module(G_MODULE.joinRoom);
	}

	private CreateRoom_cb (event) { 
        //判断有没有恢复房间
        if(VerifyMgr.getInstance().checkUnSettled()){
            return;
        }
		this.start_sub_module(G_MODULE.createRoom);
    }
    private Match_cb (event) {
		FrameMgr.getInstance().showTips("暂未开放，敬请期待", null, 35, cc.color(0,255,0), cc.p(0,0), "Arial", 1000);
    }
	private Clud_cb (event) { 
		let bolOpen = ClubMgr.getInstance().club_enter;
		if (bolOpen){
			ClubChatMgr.getInstance().clearClubAllData();
			ClubMgr.getInstance().reqClubList(1);
			this.start_sub_module(G_MODULE.ClubLobby);
		}else{
			this.start_sub_module(G_MODULE.ClubSeek);
		}
	}
	private btn_shareCb()
	{
		//console.log("btn_shareCb",ShareMgr.getInstance().shareButtonFlag);
		ShareMgr.getInstance().shareButtonFlag=true;
		this.start_sub_module(G_MODULE.ShareTip);
		// if(this.model.isShare == 0){
		// 	ShareMgr.getInstance().sendReqCheckDailyShare();
		// 	this.start_sub_module(G_MODULE.ShareTip);
		// }else{
		// 	FrameMgr.getInstance().showTips("今日已经分享过了", null, 35, cc.color(0,255,0), cc.p(0,0), "Arial", 1000);
		// 	return;
		// }
		// //console.log("isShare1",this.model.isShare);
	}
	//end
}
