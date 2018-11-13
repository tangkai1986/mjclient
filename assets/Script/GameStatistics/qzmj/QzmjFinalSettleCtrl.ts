/*
author: TK
日期:2018-02-06 16:02:51
总结算
*/ 
  
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import BunchInfoMgr from "../../Plat/GameMgrs/BunchInfoMgr";
import SwitchMgr from "../../Plat/GameMgrs/SwitchMgr";
import LoginMgr from "../../Plat/GameMgrs/LoginMgr";
import ShareMgr from "../../Plat/GameMgrs/ShareMgr";

let Green = new cc.Color(24,221,40),Red = new cc.Color(255,78,0), Yellow = new cc.Color(255,222,0);
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjFinalSettleCtrl;
//模型，数据处理
class Model extends BaseModel{
    roomOption=null;
    shareSwitch=null;
    roomValue = null;
    roomid = null;
    roundIndex=null;
    constructor()
    {
        super();
        this.shareSwitch = SwitchMgr.getInstance().get_switch_performance_sharing();
        this.roomOption = BunchInfoMgr.getInstance().getRoomOption();
        this.roomid = BunchInfoMgr.getInstance().getRoomId();
        this.roundIndex = BunchInfoMgr.getInstance().getBunchInfo().roundIndex;
        this.roomValue = BunchInfoMgr.getInstance().getBunchInfo().roomValue;
    }
    updateSwitch(msg){
        this.shareSwitch = msg.cfg.switch_performance_sharing;
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        btn_ztj:null,
        btn_mjjf:null,
        btn_share:null,
        btn_exit:null,
        node_content:null,
        prefab_QzmjRoundsSettle:null,
        prefab_QzmjStatisticsSettle:null,
        ztjNormalSprite:null,
        ztjPressSprite:null,
        mjjfNormalSprite:null,
        mjjfPressSprite:null,
        btn_close:null,
        lab_look_video:null,
        lbl_roomInfo:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
        this.ui.btn_ztj = ctrl.btn_ztj.getComponent(cc.Sprite);
        this.ui.btn_mjjf = ctrl.btn_mjjf.getComponent(cc.Sprite);
        this.ui.btn_mjjf.node.getChildByName("detailBtn_normalSprite").getChildByName("New Label").getComponent(cc.Label).string = "每局积分";
        this.ui.btn_mjjf.node.getChildByName("detailBtn_pressSprite").getChildByName("New Label").getComponent(cc.Label).string = "每局积分";
        this.ui.btn_share = ctrl.btn_share;
        this.ui.lab_look_video = ctrl.lab_look_video;
        this.ui.lab_look_video.node.active = false;
        this.ui.btn_exit = ctrl.btn_exit;
        this.ui.btn_exit.active=false;
        this.ui.node_content = ctrl.node_content; 
        this.ui.btn_close = ctrl.btn_close;
        this.ui.btn_close.active = true;
        this.ui.lbl_roomInfo = ctrl.lbl_roomInfo;
        if(BunchInfoMgr.getInstance().getplazzaFlag()) {
            this.ui.btn_close.active = true;
            this.ui.lab_look_video.node.active = true;
            this.ui.btn_mjjf.node.getChildByName("detailBtn_normalSprite").getChildByName("New Label").getComponent(cc.Label).string = "每局回放";
            this.ui.btn_mjjf.node.getChildByName("detailBtn_pressSprite").getChildByName("New Label").getComponent(cc.Label).string = "每局回放";
        }
        this.ui.prefab_QzmjRoundsSettle = ctrl.prefab_QzmjRoundsSettle;
        this.ui.prefab_QzmjStatisticsSettle = ctrl.prefab_QzmjStatisticsSettle;
        this.ui.ztjNormalSprite = this.ui.btn_ztj.node.getChildByName("totalBtn_normalSprite");
        this.ui.ztjPressSprite = this.ui.btn_ztj.node.getChildByName("totalBtn_pressSprite");
        this.ui.mjjfNormalSprite = this.ui.btn_mjjf.node.getChildByName("detailBtn_normalSprite");
        this.ui.mjjfPressSprite = this.ui.btn_mjjf.node.getChildByName("detailBtn_pressSprite");
        this.initViewWithStatistics();
        this.showShareBtn();
        this.showroomInfo();
    }
    initViewWithRounds()
    {
        this.ui.node_content.removeAllChildren();
        let QzmjRounds = cc.instantiate(this.ui.prefab_QzmjRoundsSettle);
        this.ui.node_content.addChild(QzmjRounds);
        let QzmjRoundsCtrl = QzmjRounds.getComponent("QzmjRoundsSettleCtrl");
        this.ui.ztjNormalSprite.active = true;
        this.ui.ztjPressSprite.active = false;
        this.ui.mjjfNormalSprite.active = false;
        this.ui.mjjfPressSprite.active = true;
    }
    initViewWithStatistics()
    {
        this.ui.node_content.removeAllChildren();
        let QzmjStatistics = cc.instantiate(this.ui.prefab_QzmjStatisticsSettle);
        let QzmjStatisticsSettleCtrl = QzmjStatistics.getComponent("QzmjStatisticsSettleCtrl");
        //console.log("QzmjStatistics=",QzmjStatistics,this.ui.node_content)
        this.ui.node_content.addChild(QzmjStatistics);
        this.ui.ztjNormalSprite.active = false;
        this.ui.ztjPressSprite.active = true;
        this.ui.mjjfNormalSprite.active = true;
        this.ui.mjjfPressSprite.active = false;
    }
    //战绩分享开关
    showShareBtn(){
        this.ui.btn_share.active = this.model.shareSwitch == 1?true:false;
    }
    //时间戳转为日期
    formatDate() {
        let time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate();
        var hour = time.getHours();
        var minute = time.getMinutes();
        var second = time.getSeconds();
        return year+"-"+month + "-" + date + " " + hour + ":" + minute + ":"+ second;
    }
    showroomInfo()
    {
        let roomOptionDesc = this.model.roomOption.toString().replace(new RegExp(',','g')," ").replace(new RegExp('，','g')," ").replace(new RegExp("。","g")," ");
        let dattime =  this.formatDate();
        this.ui.lbl_roomInfo.string = `房号${this.model.roomid}  第${this.model.roundIndex}/${this.model.roomValue.v_roundcount}局\n\n${roomOptionDesc}\n\n${dattime}`;
        if(this.model.roomValue.v_roundcount == 0 || this.model.roomValue.v_roundcount == undefined){
            this.ui.lbl_roomInfo.string = `房号${this.model.roomid}  一课\n\n${roomOptionDesc}\n\n${dattime}`;
        }
        // roomInfo
        //console.log("roomid",this.model.roomid);
        //console.log("roundIndex",this.model.roundIndex," / ",this.model.roomValue.v_roundcount);
        //console.log("roomOptionDesc",roomOptionDesc);
        //console.log("dattime",dattime);
    }
}
//c, 控制
@ccclass
export default class QzmjFinalSettleCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property({
        tooltip : "content",
        type : cc.Node
    })
    node_content : cc.Node = null;
    @property({
        tooltip : "btn_ztj",
        type : cc.Node
    })
    btn_ztj : cc.Node = null;
    @property({
        tooltip : "btn_mjjf",
        type : cc.Node
    })
    btn_mjjf : cc.Node = null;
    @property({
        tooltip : "btn_share",
        type : cc.Node
    })
    btn_share : cc.Node = null;
    @property({
        tooltip : "btn_exit",
        type : cc.Node
    })
    btn_exit : cc.Node = null;
    @property({
        tooltip : "每局明细",
        type : cc.Prefab
    })
    prefab_QzmjRoundsSettle : cc.Prefab = null;
    @property({
        tooltip : "总统计",
        type : cc.Prefab
    })
    prefab_QzmjStatisticsSettle : cc.Prefab = null;
    @property({
        tooltip : "btn_close",
        type : cc.Node
    })
    btn_close : cc.Node = null;
    @property({
        tooltip:"录像提示",
        type: cc.Label
    })
    lab_look_video : cc.Label = null;
    @property({
        tooltip:"房间信息",
        type: cc.Label
    })
    lbl_roomInfo : cc.Label = null;

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
			'http.reqGameSwitch':this.http_reqGameSwitch,

        }
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image,this.btn_ztj,this.btn_ztj_cb,"总统计");
        this.connect(G_UiType.image,this.btn_mjjf,this.btn_mjjf_cb,"每局积分");
        this.connect(G_UiType.image,this.btn_share,this.btn_share_cb,"分享");
        this.connect(G_UiType.image,this.btn_exit,this.btn_exit_cb,"退出"); 
        this.connect(G_UiType.image,this.btn_close,this.btn_close_cb,"退出"); 
	}
	start () {
	}
    //end
    http_reqGameSwitch(msg){
        this.model.updateSwitch(msg);
        this.view.showShareBtn()
    }
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    private btn_exit_cb(){
        BunchInfoMgr.getInstance().clear();
        LoginMgr.getInstance().disconnectGameSvr();
    }
    private btn_ztj_cb(){
        //console.log('btn_ztj_cb')
        this.view.initViewWithStatistics();
    }
    private btn_mjjf_cb(){
        //console.log('btn_mjjf_cb')
        this.view.initViewWithRounds();
    }
    private btn_share_cb(){
        //console.log('btn_share_cb',ShareMgr.getInstance().shareButtonFlag)
        ShareMgr.getInstance().shareButtonFlag=false;
        this.start_sub_module(G_MODULE.Shared);
    }
    public showDefaultView()
    {
        this.view.initViewWithStatistics();
    }
    private btn_close_cb()
    {
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
}
