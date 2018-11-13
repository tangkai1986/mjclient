import UiMgr from "../GameMgrs/UiMgr";
import FrameMgr from "../GameMgrs/FrameMgr";
import ModuleMgr from "../GameMgrs/ModuleMgr";
 

 

var scheduler = null;//获取定时器cc.Director:getInstance():getScheduler();  

export default class BaseCtrl extends cc.Component {  
    public static _obj_id=1;  
    //ui
    ui=null;
    //网络事件和回调映射
    n_events={};
    //全局事件和回调映射
    g_events={};
    model=null;
    view=null;
    bindedNodes=[];
    //发送全局事件
    gemit(event,data?) 
    {
        G_FRAME.globalEmitter.emit(event,data);
    } 
    //定义网络事件
    defineNetEvents()
    {

    }
    //定义全局事件
    defineGlobalEvents()
    {

    }
    //注册所有事件
    regAllEvents()
    {
        //注册网络事件
        for(var event_id in this.n_events){
            var cb=this.n_events[event_id];
            G_FRAME.netEmitter.on(event_id,cb.bind(this),this);
        } 
        //注册全局事件
        for(var event_id in this.g_events){
            var cb=this.g_events[event_id];
            G_FRAME.globalEmitter.on(event_id,cb.bind(this),this);
        } 
    } 
    onDestroy()
    {  
        //析构中移除网络监听,移除事件对象,数据模型,视图
        //停止定时器 
        //移除所有监听,包括按钮的
                console.log("onDestroy1");
        for(let i = 0;i<this.bindedNodes.length;++i)
        {
            let node=this.bindedNodes[i];
            node.targetOff(this);
        }
        G_FRAME.netEmitter.remove_by_listener(this);
        G_FRAME.globalEmitter.remove_by_listener(this); 
        delete this.model; 
        delete this.view; 
    } 
    //停止自己
    finish()
    {   
        if(this.node&&cc.isValid(this.node))
        {
            this.node.destroy();
        }
    }   
    //启动子模块
    start_sub_module(module_id, cb:Function = function(){},scriptName=null)
    { 
        ModuleMgr.getInstance().start_sub_module(module_id, cb,scriptName);
    } 
    start_module(module_id)
    { 
        ModuleMgr.getInstance().start_module(module_id);
    } 
    turnback_module(){
        ModuleMgr.getInstance().turnback_module();
    }
    //绑定操作调用
    connect(uitype,node,callback,opname) 
    {
        let callbackTemp = {};
        if(typeof(callback)=='function')
        {
            UiMgr.getInstance().connect(uitype,node,callback.bind(this),opname,this);
        }
        else if (typeof(callback)=='object') 
        {
            if (callback.startCallBack) {
                callbackTemp["startCallBack"] = callback.startCallBack.bind(this);
            }
            if (callback.moveCallBack) {
                callbackTemp["moveCallBack"] = callback.moveCallBack.bind(this);
            }
            if (callback.endCallBack) {
                callbackTemp["endCallBack"] = callback.endCallBack.bind(this);
            }
            if (callback.cancelCallBack) {
                callbackTemp["cancelCallBack"] = callback.cancelCallBack.bind(this);
            }
            UiMgr.getInstance().connect(uitype,node,callbackTemp,opname,this);
        } 
        this.bindedNodes.push(node);
    } 
    //绑定回调到ui对象上
    connectUi()
    {

    }
    initMvc(Model,View)
    {
        	//数据模型
		this.model = new Model();
		//视图
		this.view = new View(this.model);
		//引用视图的ui
		this.ui=this.view.ui;
		//定义网络事件
		this.defineNetEvents();
		//定义全局事件
		this.defineGlobalEvents();
		//注册所有事件
		this.regAllEvents()
		//绑定ui操作
		this.connectUi();
    }
    isIPhoneX () {
        let size = cc.view.getFrameSize();
        if(cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE && ((size.width == 2436 && size.height == 1125) ||(size.width == 1125 && size.height == 2436))) {
            return true;
        }
        return false;
    }
    resetDesignResolution (canvas) {
        let height = 720;
        let size = cc.view.getFrameSize();
        let proportion = size.width/size.height;
        let width = height*proportion;
        canvas.designResolution=new cc.Size(width, height)
        canvas.fitHeight = true
        canvas.fitWidth = true
    }
}
