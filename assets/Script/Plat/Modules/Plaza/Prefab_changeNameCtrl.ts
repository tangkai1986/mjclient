/*
author: tk
日期:2018-02-3 15:26
玩家个人详细信息界面
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UserMgr from "../../GameMgrs/UserMgr";
import NameCfg from "../../CfgMgrs/NameCfg";

const {ccclass, property} = cc._decorator;
let ctrl : Prefab_changeNameCtrl;

//模型，数据处理
class Model extends BaseModel{
    myInfo:any = null
	constructor()
	{
        super();
        this.myInfo = UserMgr.getInstance().getMyInfo();
        this.myInfo.NewName = "";
    }

}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        origin_name:null,
        NewName:null,
        btnConfirm:null,
        btnCancel:null,
        btnRandom:null
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
        this.ui.origin_name = ctrl.origin_name;
        this.ui.NewName = ctrl.NewName;
        this.ui.btnConfirm = ctrl.btnConfirm;
        this.ui.btnCancel = ctrl.btnCancel;
        this.ui.btnRandom = ctrl.btnRandom;
    }
    updateMyInfo(){
        this.updateName();
    }
    updateName(){
        this.ui.origin_name.string = this.model.myInfo.nickname;
    }
    updateNewName(){
        this.ui.NewName.string = this.model.myInfo.NewName;
    }
}

//c, 控制
@ccclass
export default class Prefab_changeNameCtrl extends BaseCtrl {

    @property(cc.Label)
    origin_name:cc.Label = null;

    @property(cc.EditBox)
    NewName:cc.EditBox = null;

	@property({
		tooltip : "确定按钮",
		type : cc.Node
	})
	btnConfirm : cc.Node = null;

	@property({
		tooltip : "取消按钮",
		type : cc.Node
	})
	btnCancel : cc.Node = null;
   
	@property({
		tooltip : "随机",
		type : cc.Node
	})
	btnRandom : cc.Node = null;

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
            'http.reqMyInfo' : this.http_reqMyInfo
        }
	}
    //网络事件回调begin
    //玩家信息更新
    private http_reqMyInfo (msg){
        this.model.updateMyInfo();
        this.view.updateMyInfo();
    }
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.btnCancel, this.node_cancel_cb, '取消');
		this.connect(G_UiType.image, this.ui.btnConfirm, this.node_confirm_cb, '确认');
		this.connect(G_UiType.image, this.ui.btnRandom, this.btnRandom_cb, '点击随机');
		this.connect(G_UiType.edit, this.ui.NewName.node, this.NewName_cb, '点击真实姓名');
	}
	start () {
        this.view.updateMyInfo();
	}
	/**
	 * 点击关闭
	 * @param event 
	 */
	private node_cancel_cb (event) : void {
		this.finish();
    }
    //提交
    private node_confirm_cb(){
        if (this.ui.NewName.string == null || this.ui.NewName.string == '') {
            //console.log("请填写真实名");
            return;
        }
        //console.log(this.ui.NewName.string);
        //console.log('node_submit_submit');
    }
    //新姓名
    private NewName_cb(){
        //console.log('realName_cb');
    }
    //随机
    private btnRandom_cb(){
        //console.log('randomName_cb');
        let name = "";
        let count = 499;
        let str = ["first", "center", "last"];
        let idx = [11301001, 11302001, 11303001];
        for (let i = 0; i < 3; ++i) {
            let random = Math.floor(Math.random()*count);
            let nameidx = idx[i]+random;
            let nameList = NameCfg.getInstance().getName();
            name = name + nameList[0][str[i]][nameidx.toString()];
        }
        this.model.myInfo.NewName = name;
        this.view.updateNewName();
    }
    
}
