import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import CreateRoomMgr from "../../GameMgrs/CreateRoomMgr";
 
import FrameMgr from "../../GameMgrs/FrameMgr";

import GameCateCfg from "../../CfgMgrs/GameCateCfg";
import LoginMgr from "../../GameMgrs/LoginMgr";
import BetMgr from "../../GameMgrs/BetMgr";
import LocalStorage from "../../Libs/LocalStorage";


const {ccclass, property} = cc._decorator;

let ctrl : Prefab_RenameCommonRuleCtrl;
//模型，数据处理
class Model extends BaseModel{
    ruleName:string = null;
    index:number = null;
    ruleItems:any = [];
	constructor()
	{
        super();
        this.ruleName = CreateRoomMgr.getInstance().getCommonRuleName();
        this.index = CreateRoomMgr.getInstance().getRuleItemIndex();
        this.ruleItems = CreateRoomMgr.getInstance().getRuleItems();
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
        this.addGrayLayer();
	}
	ui={
		//在这里声明ui
        btnCancel : ctrl.Cancel,
        btnConfirm : ctrl.Confirm,
        editFrame : ctrl.EditFrame,
    };
	
	//初始化ui
	initUi(){
        this.ui.editFrame.getComponent(cc.EditBox).placeholder = this.model.ruleName
	}
}

@ccclass
export default class Prefab_RenameCommonRuleCtrl extends BaseCtrl {
    @property({
        tooltip :'取消按钮',
        type : cc.Node
    })
    Cancel : cc.Node = null;

    @property({
        tooltip :'确定按钮',
        type : cc.Node
    })
    Confirm : cc.Node = null;

    @property({
        tooltip :'编辑框控件',
        type : cc.Node
    })
    EditFrame : cc.Node = null; 

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
        this.connect(G_UiType.image, this.ui.btnCancel, this.cancelCB, '取消编辑');
        this.connect(G_UiType.image, this.ui.btnConfirm, this.confirmCB, '确认编辑结果');
        this.connect(G_UiType.edit, this.ui.editFrame, this.editCB, '编辑框输入');
    }

    start() {
    }

    cancelCB(event){
        //console.log('取消编辑，并关闭') 
        this.finish()
    }

    confirmCB(event){
        //console.log('确认编辑结果')
        let newName = CreateRoomMgr.getInstance().getNewName()
        //console.log('新命名', newName)

        //判断是否符合修改规则
        if( !newName || newName=='' ){
            FrameMgr.getInstance().showTips('新命名不能为空')
            return
        }
        else if(newName == this.model.ruleName){
            FrameMgr.getInstance().showTips('新命名与原命名相同，请重新更改')
            return
        }

        //界面刷新
        this.model.ruleItems[this.model.index].getComponentInChildren(cc.Label).string = newName

        //获取需要存入的数据
        let gameId = BetMgr.getInstance().getGameId()
        let Groups = CreateRoomMgr.getInstance().getCommonRuleGroups(gameId)
        let commonRule = CreateRoomMgr.getInstance().getCommonRule(gameId)      //这句得到的是本地默认规则

        //修改需要修改的数据
        commonRule[this.model.index].ruleName = newName
        Groups[LoginMgr.getInstance().getUid().toString()] = commonRule
        //console.log('需要存入本地默认规则的数据', Groups, commonRule)

        let games = GameCateCfg.getInstance().getGames()
        let gameCode = games[gameId-1].code
        // let localStorageItemName = gameCode + 'CommonRuleGroups'

        //存入localStorage
        // cc.sys.localStorage.setItem(localStorageItemName, JSON.stringify(Groups));
        LocalStorage.getInstance().setCommonRuleGroups(gameCode, Groups);
        this.finish()
    }

    editCB(type, event){
        if(type == 'editing-did-ended'){
            //console.log(event.currentTarget.getComponent(cc.EditBox).string)
            let newName = event.currentTarget.getComponent(cc.EditBox).string
            CreateRoomMgr.getInstance().setNewName(newName)
        }  
    }

}
