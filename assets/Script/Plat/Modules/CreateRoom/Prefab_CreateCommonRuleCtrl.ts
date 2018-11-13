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

let ctrl : Prefab_CreateCommonRuleCtrl;
//模型，数据处理
class Model extends BaseModel{
    ruleName:string = null;
    ruleData:any = null;
    gameId:number = null;
	constructor()
	{
        super();
        this.gameId = BetMgr.getInstance().getGameId()
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
	}
}

@ccclass
export default class Prefab_CreateCommonRuleCtrl extends BaseCtrl {
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
    start () {

    }

    cancelCB(event){
        //console.log('取消创建常用规则')
        this.finish()
    }
    confirmCB(event){
        //console.log('新建规则确认')
        if(!this.model.ruleName || this.model.ruleName == ''){
            FrameMgr.getInstance().showTips('命名不能为空')
            return
        }

        let gameId = BetMgr.getInstance().getGameId();
        let data = {};
        //console.log(this.model.ruleName)
        data.ruleInfo = this.model.ruleData;
        data.ruleName = this.model.ruleName;
        //console.log('确认后获取的数据', data)
        CreateRoomMgr.getInstance().addCommonRuleData(data, gameId);
        
        let Groups = CreateRoomMgr.getInstance().getCommonRuleGroups(gameId);
        let commonRule = CreateRoomMgr.getInstance().getCommonRule(gameId);

        //修改需要修改的数据
        Groups[LoginMgr.getInstance().getUid().toString()] = commonRule;
        //console.log('需要存入本地默认规则的数据', Groups, commonRule);
        let gameCode;
        let games = GameCateCfg.getInstance().getGames();
        for(let i=0; i<games.length; i++){
            if(games[i].id == gameId ){
                gameCode = games[i].code;
            }
        }
        //let gameCode = games[gameId-1].code;
        // let localStorageItemName = gameCode + 'CommonRuleGroups';

        //存入localStorage
        // cc.sys.localStorage.setItem(localStorageItemName, JSON.stringify(Groups));
        LocalStorage.getInstance().setCommonRuleGroups(gameCode, Groups);

        this.finish();
    }
    editCB(type, event){
        if(type == 'editing-did-ended'){
            //console.log('输入新建规则名字',event.currentTarget.getComponent(cc.EditBox).string) 
            this.model.ruleName = event.currentTarget.getComponent(cc.EditBox).string
            this.model.ruleData={};
            let date = CreateRoomMgr.getInstance().getRoomRuleInfo(this.model.gameId)
            for(let key in date ){
               this.model.ruleData[key] = date[key]
            }
        }
       
    }

    // update (dt) {},
}
