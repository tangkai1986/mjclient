import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";

const {ccclass, property} = cc._decorator;
let ctrl :customserviceCtrl;
//模型，数据处理
class Model extends BaseModel {
    
    constructor()
    {
        super(); 
    }
}
class View extends BaseView{
    ui={
      web_content:null,
      btn_close:null
    }
    constructor(model){
        super(model);
        this.node=ctrl.node;
        this.initUi();
        this.addGrayLayer();  
    } 
    initUi()
    {
        this.ui.web_content = ctrl.web_content; 
        this.ui.btn_close = ctrl.btn_close;
    }

}
@ccclass
export default class customserviceCtrl extends BaseCtrl {
    //这边去声明ui组件
    @property(cc.WebView)
    web_content:cc.WebView = null
    
    @property(cc.Node)
    btn_close:cc.Node = null
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
		this.g_events={
			'ge_close_gonggao':this.ge_close_gonggao, 
			'backPressed':this.backPressed,
		} 
    } 
    backPressed(){
		this.finish();
    }
    ge_close_gonggao(){
		this.finish();
    }
    //绑定操作的回调
    connectUi()
    {  
        this.connect(G_UiType.button,this.ui.btn_close,this.btn_close_cb,"关闭按钮");
    }
    btn_close_cb(){
        this.finish();
    }
    start () {
 
    } 
    //end
}