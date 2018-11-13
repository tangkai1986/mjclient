import BaseModel from "../../Libs/BaseModel";
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import UiMgr from "../../GameMgrs/UiMgr";
import ClubMgr from "../../GameMgrs/ClubMgr";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";

const {ccclass, property} = cc._decorator;
let ctrl : Club_BlackListCtrl;
//模型，数据处理
class Model extends BaseModel{
    clubId:any=null;
    blacklistData:any=null;
    bRemove:any=null;
	constructor()
	{
        super();
        this.bRemove=false;
        this.clubId = BehaviorMgr.getInstance().getClubSelectId();
        this.blacklistData = BehaviorMgr.getInstance().getBlacklistData();
        cc.log('blacklistData', this.blacklistData)
	}


}
class View extends BaseView{
    constructor(model){
        super(model);
		this.node=ctrl.node;
        this.initUi();
    }
    ui = {
    	labUserName: ctrl.LabUserName,
    	btnRemove: ctrl.BtnRemove,
    	nodeUserHead: ctrl.UserHead,
    }
    public initUi(){
        this.ui.labUserName.string = this.model.blacklistData.name;
        UiMgr.getInstance().setUserHead(this.ui.nodeUserHead, 0, this.model.blacklistData.icon);
    }
}
@ccclass
export default class Club_BlackListCtrl extends BaseCtrl {

    @property({
    	tooltip : '角色名',
    	type : cc.Label
    })
    LabUserName : cc.Label = null;

    @property({
    	tooltip : '操作按钮',
    	type : cc.Node
    })
    BtnRemove : cc.Node = null;

    @property({
    	tooltip : '角色头像',
    	type : cc.Node
    })
    UserHead : cc.Node = null;

    onLoad () {
    	//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
    }

    //定义网络事件
	defineNetEvents () {
        this.n_events = {
            "http.reqClubBlacklisRemove":this.http_reqClubBlacklisRemove,
        }
    }
	//定义全局事件
	defineGlobalEvents () {}
	//绑定操作的回调
    connectUi () {
        this.connect(G_UiType.image, this.view.ui.btnRemove, this.RemoveCB, '移除操作按钮')
	}

    start () {

    }

	RemoveCB(event){
		//console.log('移除黑名单内成员')
        var okcb = function(){
            ClubMgr.getInstance().reqClubBlacklisRemove(this.model.clubId, this.model.blacklistData.id)
            this.model.bRemove = true
        }
        FrameMgr.getInstance().showDialog('是否确定将该玩家移出茶馆黑名单？', okcb.bind(this))
	}

    http_reqClubBlacklisRemove(){
        if(this.model.bRemove==true){
            this.finish()
        }
    }

    // update (dt) {},
}
