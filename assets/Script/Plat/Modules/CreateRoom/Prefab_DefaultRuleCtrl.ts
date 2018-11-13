/*
author: YOYO
日期:2018-02-23 11:39:42
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import CreateRoomMgr from "../../GameMgrs/CreateRoomMgr";
import BetMgr from "../../GameMgrs/BetMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
const MAX_ITEM_NUM = 8;
let ctrl : Prefab_DefaultRuleCtrlCtrl;
//模型，数据处理
class Model extends BaseModel{
    commonRule:any = [];
    itemBegin:number = null;
	gameId:number = null;
	
	constructor()
	{
        super();
        this.itemBegin = 0;
        this.gameId = BetMgr.getInstance().getGameId();
		this.commonRule = CreateRoomMgr.getInstance().getCommonRule(this.gameId);
        //console.log('玩家所创建的规则（数组）',this.commonRule)
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	private index : null;
	ui={
		//在这里声明ui
		node_content : null,
		node_btnClose : null,
        prefab_CommonRuleItem : null,
        nodes_commonRuleItem : [],
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
		this.ui.node_btnClose = ctrl.Btn_Close;
		this.ui.node_content = ctrl.Content;
        this.ui.prefab_CommonRuleItem = ctrl.CommonRuleItem;
        this.addCommonRuleItem();
        CreateRoomMgr.getInstance().setRuleItems(this.ui.nodes_commonRuleItem)
	}

    instItem(index){
        let commonRule = this.model.commonRule
        let item = cc.instantiate(this.ui.prefab_CommonRuleItem)
		item.parent = this.ui.node_content
        item.getComponentInChildren(cc.Label).string = commonRule[index]?commonRule[index].ruleName:'点击创建'
        item.getChildByName('btn_editName').active = commonRule[index] && commonRule[index].ruleInfo
        item.getChildByName('btn_edit').active = commonRule[index]  && commonRule[index].ruleInfo
        item.getChildByName('btn_create').active = !item.getChildByName('btn_edit').active
        this.ui.nodes_commonRuleItem.push(item)
        if(index <= this.model.commonRule.length){
            this.model.itemBegin = index;
        }
    }

    addCommonRuleItem(){
        var commonRule = this.model.commonRule
        var count = commonRule.length;
        for(let i = 0; i<MAX_ITEM_NUM; i++){
            CreateRoomMgr.getInstance().setCommonRulePerItem(commonRule[i])
            CreateRoomMgr.getInstance().setRuleItemIndex(i)
            this.instItem(i)
        }
    }
    refCommonRuleItem(){
        var commonRule = this.model.commonRule
        var count = commonRule.length
        var itemBegin = this.model.itemBegin
        for(let i = itemBegin; i < count; i++){
            let item = this.ui.nodes_commonRuleItem[i]
            CreateRoomMgr.getInstance().setCommonRulePerItem(commonRule[i])
            //CreateRoomMgr.getInstance().setRuleItemIndex(i)
            item.getComponentInChildren(cc.Label).string = commonRule[i]?commonRule[i].ruleName:'点击创建'
            item.getChildByName('btn_editName').active = commonRule[i] && commonRule[i].ruleInfo
            item.getChildByName('btn_edit').active = commonRule[i]  && commonRule[i].ruleInfo
            item.getChildByName('btn_create').active = !item.getChildByName('btn_edit').active
            this.model.itemBegin = i
            item.getComponent('Prefab_DefaultRuleItemCtrl').refreshPerItemData()
        }
        //console.log('刷新界面显示', count, itemBegin)
    }
}
//c, 控制
@ccclass
export default class Prefab_DefaultRuleCtrlCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip:"关闭按钮",
		type : cc.Node
	})
	Btn_Close :cc.Node = null;

	@property({
		tooltip:"视图",
		type : cc.Node
	})
	Content :cc.Node = null;

    @property({
		tooltip:"常用规则预置",
		type : cc.Prefab
	})
	CommonRuleItem :cc.Prefab = null;

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
	}
	//定义全局事件
	defineGlobalEvents()
	{
        this.g_events = {
            'createCommonRuleData':this.createCommonRuleData,
            'closeDefaultRulePanel':this.closeDefaultRulePanel,
        } 
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.Btn_Close, this.Btn_Close_cb, "关闭");
	}
	start () {
	}

	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private Btn_Close_cb() : void{
		this.finish();
	}

    createCommonRuleData(){
        //console.log('创建成功，刷新列表')
        //console.log('刷新前数据',this.model.commonRule)
        this.model.commonRule = CreateRoomMgr.getInstance().getCommonRule(this.model.gameId)
        //console.log('刷新后数据',this.model.commonRule)
        this.view.refCommonRuleItem()
    }

    closeDefaultRulePanel(){
    	this.finish()
    }
	//end
}
