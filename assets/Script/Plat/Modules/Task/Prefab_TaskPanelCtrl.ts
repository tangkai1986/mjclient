import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UserMgr from "../../GameMgrs/UserMgr";
import TaskMgr from "../../GameMgrs/TaskMgr";


const {ccclass, property} = cc._decorator;
let ctrl : Prefab_TaskPanelCtrl;

class Model extends BaseModel{ 
    announceItems = null;
    public isGetReward = null;
    constructor () {
        super();
        this.announceItems = [{name: '每日任务'},{name: '分享有礼'},{name: '关注微信号'},{name: '首充礼包'}];
        this.updateGetReward()
    }
    updateGetReward(){
        this.isGetReward = UserMgr.getInstance().getMyInfo().is_first_recharge;
    }
}

class View extends BaseView{
    ui = {
        closeBtn: ctrl.closeBtn,
        imgTitle: ctrl.imgTitle,
        btnPanel: ctrl.btnPanel,
        contentPanel: ctrl.contentPanel,
        leftBtn: ctrl.leftBtn,
        prefab_task: ctrl.taskPanel,
        prefab_invite: ctrl.invitePanel,
        prefab_wechat: ctrl.weChatPanel,
        prefab_charge: ctrl.chargePanel,
        arrSprf: ctrl.arrSprf,
        btnItems: []
    }
    constructor (model) {
        super(model);
        this.node = ctrl.node;
        this.initUi();
    }

    public initUi () {
        //暂时隐藏首充选项
        //if(this.model.isGetReward == 1){
            this.model.announceItems.splice(this.model.announceItems.length-1)
            //暂时隐藏微信选项
            this.model.announceItems.splice(this.model.announceItems.length-1)
        //}
        for(let i = 0; i < this.model.announceItems.length; ++i){
            let itemInfo = this.model.announceItems[i];
            let pre_btn = cc.instantiate(this.ui.leftBtn);
            pre_btn.getChildByName("background").getChildByName('label').getComponent(cc.Label).string = itemInfo.name;
            pre_btn.getChildByName("checkmark").getChildByName('label').getComponent(cc.Label).string = itemInfo.name;
            pre_btn.active = true;
            this.ui.btnPanel.addChild(pre_btn);
            this.ui.btnItems.push(pre_btn);
        }
        this.initPage(0);
    }

    initPage (index) {
        // destroy速度太慢
        if (this.ui.contentPanel.children[0])
            this.ui.contentPanel.children[0].removeFromParent()
        let type;
        switch(index){
            case 0: type = 'task'; break;
            case 1: type = 'invite'; break;
            case 2: type = 'wechat'; break;
            case 3: type = 'charge'; break;
        }
        let page = cc.instantiate(this.ui[`prefab_${type}`]);
        page.parent = this.ui.contentPanel;
        this.ui.imgTitle.spriteFrame = this.ui.arrSprf[index];
    }
}



@ccclass
export default class Prefab_TaskPanelCtrl extends BaseCtrl {

    @property({
        tooltip: '关闭公告按钮',
        type: cc.Node
    })
    closeBtn: cc.Node = null;

    @property({
        tooltip: '标题',
        type: cc.Sprite
    })
    imgTitle: cc.Sprite = null;

    @property({
        tooltip: '左侧按钮容器',
        type: cc.Node
    })
    btnPanel: cc.Node = null;

    @property({
        tooltip: '界面容器',
        type: cc.Node
    })
    contentPanel: cc.Node = null;

    @property({
        tooltip: '左侧按钮预制',
        type: cc.Node
    })
    leftBtn: cc.Node = null;

    @property({
        tooltip: '每日活动预制',
        type: cc.Prefab
    })
    taskPanel: cc.Prefab = null;

    @property({
        tooltip: '邀请好友预制',
        type: cc.Prefab
    })
    invitePanel: cc.Prefab = null;

    @property({
        tooltip: '关注微信号预制',
        type: cc.Prefab
    })
    weChatPanel: cc.Prefab = null;

    @property({
        tooltip: '首充礼包预制',
        type: cc.Prefab
    })
    chargePanel: cc.Prefab = null;

    @property({
        tooltip: '标题',
        type: [cc.SpriteFrame]
    })
    arrSprf: [cc.SpriteFrame] = [];


    onLoad () {
        //创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
    }

    //定义网络事件
	defineNetEvents () {
        this.n_events={
            'http.reqMyInfo' : this.http_reqMyInfo,
        }
    }
	//定义全局事件
	defineGlobalEvents () {
        this.g_events = {
            'closeActivityModule':this.annClose,
        } 
    }
	//绑定操作的回调
    connectUi () {
        for(let i = 0; i < this.ui.btnItems.length; ++i){
            let cb = function () {
                this.clickLeftBtnCb(i);
            }
            this.connect(G_UiType.button, this.ui.btnItems[i], cb, "切换公告页");
        }

        this.connect(G_UiType.button, this.ui.closeBtn, this.annClose, "关闭公告");
    }

    // start () {

    // }
    //更新首充页面的显示
    http_reqMyInfo(){
        this.model.updateGetReward()
    }

    public setFirstRecharge () {
        this.view.initPage(3)
        this.view.ui.btnItems[3].getComponent(cc.Toggle).check()
    }

    clickLeftBtnCb (index) {
        this.view.initPage(index);
    }

    annClose () {
        this.finish();
    }

    // update (dt) {}
}
