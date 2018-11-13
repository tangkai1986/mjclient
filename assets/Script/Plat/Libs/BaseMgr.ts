import GameNet from "../NetCenter/GameNet";
import NetNotify from "../NetCenter/NetNotify";
import ModuleMgr from "../GameMgrs/ModuleMgr";
 

//基础的管理器
export default class BaseMgr{
    routes:{} = null
    constructor (){
        NetNotify.getInstance().regNotifyListener(this);
        this.routes = {

        }
    } 
    //是否合法路由,因为有些情况下,数据顺序问题引起前后错误
    isValidToRoute(){
        return true;
    }
    destroy(){  
        NetNotify.getInstance().unregNotifyListener(this);
        G_FRAME.globalEmitter.remove_by_listener(this);
    }
    //发送全局事件
    gemit(event,arg = null) {
        G_FRAME.globalEmitter.emit(event,arg);
    }   
    send_msg(route:string,msg?:any){
        //console.log("发送了协议=",route,msg)
        GameNet.getInstance().send_msg(route,msg);
    } 
  
    start_sub_module(module_id:any,cb:Function = function(){},scriptName=null){

        ModuleMgr.getInstance().start_sub_module(module_id, cb,scriptName);
    } 
    start_module(module_id:any){
        ModuleMgr.getInstance().start_module(module_id);
    } 

    start_websocket(url){
    	return GameNet.getInstance().initWebSocket(url);
    }
    close_websocket(url){
        GameNet.getInstance().closeWebSocket(url);
    }
      
    dealResp(route,msg){ 
        if(!this.routes)
            return true;
        let routerfun=this.routes[route]; 
        if(routerfun){ 
            if(!this.isValidToRoute())
            {
                //表示需要中断处理,并且不能往模块广播
                return false;
            }
            routerfun.bind(this)(msg)
        }
        return true;
    } 
   
}
