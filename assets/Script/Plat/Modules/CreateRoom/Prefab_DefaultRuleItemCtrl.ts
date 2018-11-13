import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import CreateRoomMgr from "../../GameMgrs/CreateRoomMgr";
import BetMgr from "../../GameMgrs/BetMgr";
const {ccclass, property} = cc._decorator;

let ctrl : Prefab_DefaultRuleItemCtrl;
//模型，数据处理
class Model extends BaseModel{
    commonRule : any = {};
    index : number = null;
	constructor()
	{
        super();
        this.commonRule = CreateRoomMgr.getInstance().getCommonRulePerItem();
        this.index = CreateRoomMgr.getInstance().getRuleItemIndex();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    node=null;
	constructor(model){
		super(model);
        this.node=ctrl.node;
		this.initUi();
	}
	ui={
		//在这里声明ui
        btnRename : ctrl.Rename,
        labName : ctrl.NameString,
        btnEdit : ctrl.Edit,
        btnCreate : ctrl.Create,
        prefab_renameItem : ctrl.RenameItem,
	};
	
	//初始化ui
	initUi(){
		
	}
}

@ccclass
export default class Prefab_DefaultRuleItemCtrl extends BaseCtrl {
    
    @property({
        tooltip : '修改名称按钮',
        type : cc.Node
    })
    Rename : cc.Node = null;

    @property({
        tooltip : '自定义名称',
        type : cc.Label
    })
    NameString : cc.Label = null;

    @property({
        tooltip : '编辑按钮',
        type : cc.Node
    })
    Edit : cc.Node = null;

    @property({
        tooltip : '新建按钮',
        type : cc.Node
    })
    Create : cc.Node = null;

    @property({
        tooltip : '改名界面',
        type : cc.Prefab
    })
    RenameItem : cc.Prefab = null;


    onLoad () {
        //创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
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
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.ui.btnRename, this.renameCB, '重新命名');
        this.connect(G_UiType.image, this.ui.btnEdit, this.editCB, '编辑规则');
        this.connect(G_UiType.image, this.ui.btnCreate, this.createCB, '创建常用规则');
	}
    start () {

    }

    refreshPerItemData(){
        this.model.commonRule = CreateRoomMgr.getInstance().getCommonRulePerItem()
    }
        
    renameCB(event){
        //console.log('重新命名规则名称')
        let name = this.model.commonRule.ruleName
        CreateRoomMgr.getInstance().setCommonRuleName(name)
        CreateRoomMgr.getInstance().setRuleItemIndex(this.model.index)
        this.start_sub_module(G_MODULE.DefaultRuleItemRename) 
    }
    editCB(event){
        //console.log('打开编辑规则界面')
        CreateRoomMgr.getInstance().setbCommomRule(true);
        CreateRoomMgr.getInstance().setEditItemIndex(this.model.index);
        
        //把默认规则界面的规则赋给创建房间信息，用于初始化
        let gameId = BetMgr.getInstance().getGameId()
        let Groups = CreateRoomMgr.getInstance().getCommonRuleGroups(gameId)
        let commonRule = CreateRoomMgr.getInstance().getCommonRule(gameId)          //这句得到的是本地默认规则
        cc.log(commonRule[this.model.index]);
        let qzmjRoomRuleInfo = CreateRoomMgr.getInstance().getRoomRuleInfo(gameId);
        CreateRoomMgr.getInstance().RefreshRoomUi(gameId);          //根据点击的默认规则页 刷新界面
        cc.log(qzmjRoomRuleInfo);
        CreateRoomMgr.getInstance().setDefaultRuleName(commonRule[this.model.index].ruleName);
        CreateRoomMgr.getInstance().RefreshDefaultRuleLabel();
        CreateRoomMgr.getInstance().closeDefaultRulePanel();
    }
    createCB(event){
        //console.log('新建常用规则')
        this.start_sub_module(G_MODULE.CreateDefaultRule)
    }
    // update (dt) {},
}
