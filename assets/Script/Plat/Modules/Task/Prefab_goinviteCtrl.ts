import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import ShareMgr from "../../GameMgrs/shareMgr";

const {ccclass, property} = cc._decorator;
let ctrl : Prefab_goinviteCtrl;
//模型，数据处理
class Model extends BaseModel{
    curClickData = null;
    inviteInfo = null;
    constructor(){
        super()
        this.curClickData = ShareMgr.getInstance().getCurClickData()
        this.inviteInfo = ShareMgr.getInstance().getShareTaskData();
    }
}
//视图，界面显示或动画，在这里完成
class View extends BaseView{
    ui={
        //在这里声明ui
        tipsLabel:ctrl.tipsLabel,
        btnquedin:ctrl.btnquedin,
        reward:ctrl.reward,
    }
    constructor(model){
        super(model)
        this.initUi();
    }
    initUi(){
        let count = this.model.curClickData.target-this.model.inviteInfo.number;
        if(count<0){
            count=0;
        }
        this.ui.reward.getChildByName('count').getComponent(cc.Label).string =this.model.curClickData.amount; 
        this.ui.tipsLabel.getComponent(cc.Label).string=`当前任务未完成，再分享${count}次可获得以下奖励。（每日首次分享可获得次数）`
    }
}
//c，控制
@ccclass
export default class Prefab_goinviteCtrl extends BaseCtrl{
    @property({
		tooltip : "任务未达到提示",
		type : cc.Label
	})
    tipsLabel : cc.Node = null;
    
    @property({
		tooltip : "确定按钮",
		type : cc.Node
	})
    btnquedin : cc.Node = null;

    @property({
		tooltip : "奖励父节点",
		type : cc.Node
	})
    reward : cc.Node = null;

    onLoad(){
        //创建mvc模式中模型和视图
		//控制器
        ctrl = this;
        //初始化mvc
        this.initMvc(Model,View);
    }
    //定义网络事件
    defineNetEvents(){

    }
    //定义全局事件
    defineGlobalEvents(){

    }
    //绑定操作的回调
    connectUi(){
         this.connect(G_UiType.image,this.ui.btnquedin,this.btnquedinCB,'确定')
    }

    start(){

    }

    btnquedinCB(){
        this.finish();
    }
   
}

