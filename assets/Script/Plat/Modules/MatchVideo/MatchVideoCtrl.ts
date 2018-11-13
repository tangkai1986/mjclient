import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

import UiMgr from "../../GameMgrs/UiMgr";
import LoginMgr from "../../GameMgrs/LoginMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import WxSdkMgr from "../../SdkMgrs/WxSdk";
//MVC编码示范,
const {ccclass, property} = cc._decorator;
let ctrl : MatchVideoCtrl;
//模型，数据处理
class Model extends BaseModel {
    private username=''
    private password=''
    constructor()
    {
        super(); 
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    ui={
        btn_close:null,
        webview:null, 
    }
    constructor(model){
        super(model);
        this.node=ctrl.node;  
		this.addGrayLayer();
        this.initUi();
    } 
    initUi()
    {
        this.ui.btn_close=ctrl.btn_close;
        this.ui.webview=ctrl.webview;
         
    } 

}
//c, 控制
@ccclass
export default class MatchVideoCtrl extends BaseCtrl {
    //这边去声明ui组件
    @property(cc.Node)
    btn_close = null;
    @property(cc.WebView)
    webview = null; 

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

    } 
    //绑定操作的回调
    connectUi()
    {  
        this.connect(G_UiType.image,this.ui.btn_close,this.btn_close_cb,'关闭'); 
 
    }
    start () {
    }
    //网络事件回调begin
    connector_entryHandler_enterPlat(msg)
    {
        //进入加载页面
        this.start_module(G_MODULE.LoadingPlat); 
    }
    //end
    //全局事件回调begin
    //end
    //按钮或任何控件操作的回调begin
 
    btn_close_cb(node,event)
    {
        this.finish();
    }  
   
    //end
}
