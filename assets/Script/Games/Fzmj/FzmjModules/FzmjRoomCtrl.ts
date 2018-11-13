/*
author: JACKY
日期:2018-01-11 15:29:26
*/

import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel"; 
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import FzmjLogic from "../FzmjMgr/FzmjLogic";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
  
  
import MahjongResMgr from "../../../GameCommon/Mahjong/MahjongResMgr";
import { MahjongDef } from "../../../GameCommon/Mahjong/MahjongDef";
import MahjongAudio from "../../../GameCommon/Mahjong/MahjongAudio";
import FzmjCards from "../FzmjMgr/FzmjCards";
import MahjongLoder from "../../../Plat/GameMgrs/MahjongLoader";
 
 
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : FzmjRoomCtrl;
//模型，数据处理
class Model extends BaseModel{  
   
	constructor()
	{
		super();  
	} 
 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui   
		mahjongRoom:null,
	}; 
	//private node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node; 
		this.initUi(); 
	} 
	showComponents(){  
		let name='MahjongRoom'
		this.ui.mahjongRoom = MahjongLoder.getInstance().getNode(name)
		if(!this.ui.mahjongRoom)
		{
			let prefab=MahjongLoder.getInstance().getPrefab(name)
			this.ui.mahjongRoom = cc.instantiate(prefab);
		}    
		this.node.addChild(this.ui.mahjongRoom);  
	}
	//初始化ui
	initUi()
	{    
	}   
}
//c, 控制
@ccclass
export default class FzmjRoomCtrl extends BaseCtrl {
	//这边去声明ui组件   
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离  
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;  
		this.initMvc(Model,View);  
		//在这里先生成对象，否则怕监听不到数据
		RoomMgr.getInstance().setGameLibs(MahjongDef,MahjongResMgr,FzmjLogic,MahjongAudio,FzmjCards);  

		this.view.showComponents();

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
	} 
	start () {  
        if (this.isIPhoneX()) {
            this.resetDesignResolution(this.node.getComponent(cc.Canvas))
        }
	}   
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
 
 
}
