import GameNet from "../NetCenter/GameNet";
import NetNotify from "../NetCenter/NetNotify";
import LogMgr from "./LogMgr";
import UserMgr from "./UserMgr";
import AudioMgr from "./AudioMgr";

enum G_UiType
{
    button=1, 
    image,
    text,
    edit,
    scroll,
    slider,
    toggle,
} 
window['G_UiType']=G_UiType;
const CONFIGS = {
    touchLimitTime: 0.5,
}
//基础的管理器
export default class UiMgr{ 
    //按钮点击后的缩放幅度
    private _scaleRate:number = null
    //单例处理  
    private static _instance:UiMgr;
    private bindMap={};//记录已绑定过的防止重复绑定
    public static getInstance ():UiMgr{
        if(!this._instance){
            this._instance = new UiMgr();
        }
        return this._instance;
    } 

    constructor(){
        this._scaleRate = 0.9;
    }

    connect(uitpye,node,callback,opname,target)
    {
        let __instanceId=node.__instanceId;  
        if(this.bindMap[__instanceId])
        {
            return;
        }
        this.bindMap[__instanceId]=callback;
        switch(uitpye)
        {
            case G_UiType.button:
                this.bindButton(node,callback,opname,target)
                break;
            case G_UiType.image:
                this.bindImage(node,callback,opname,target)
                break;
            case G_UiType.text:
                this.bindText(node,callback,opname,target)
                break;
            case G_UiType.edit:
                this.bindEdit(node,callback,opname,target)
                break;
	        case G_UiType.scroll:
                this.bindScroll(node,callback,opname,target);
                break;
            case G_UiType.slider:
                this.bindSlider(node,callback,opname,target)
                break;
            case G_UiType.toggle:
                this.bindToggle(node,callback,opname,target)
                break;
        }
    }
    bindButton(node,callback,opname,target)
    {
        let clickCallBack=null;
        let startCallBack=null;
        let moveCallBack=null;
        let endCallBack=null;
        let cancelCallBack=null;
        node['_isTouchEnabledEx'] = true;
        let touchTime = CONFIGS.touchLimitTime;
        if(opname.indexOf('点击输入房间号按钮')>=0) {
            touchTime = 0.000001;
        }
        if(!node) {
            return;
        }
        
        if(typeof(callback)=='function')
        {
            clickCallBack=callback;
            node.clickCallBack=function(event){
               if(node._isTouchEnabledEx){
                    //AudioMgr.getInstance().play(opname); 
                    LogMgr.getInstance().addOpreation(opname)
                    //console.log(`你点击了按钮"${opname}"`)
                    if (clickCallBack) clickCallBack(event)
                    node._isTouchEnabledEx = false;
                    setTimeout(()=>{
                        if(cc.isValid(node)){
                            node['_isTouchEnabledEx'] = true;
                        }
                    }, touchTime*1000);
                } 
            }
            node.on(cc.Node.EventType.TOUCH_END,node.clickCallBack, target)
        }
        else if (typeof(callback)=='object') 
        {
            startCallBack = callback.startCallBack;
            moveCallBack = callback.moveCallBack;
            endCallBack = callback.endCallBack;
            //console.log("callback",callback,opname);
            
            node.startCallBack=function(event){
                if(node._isTouchEnabledEx){
                    node.color = cc.Color.GRAY;
                    if (startCallBack) startCallBack(event);
                }
            };
            node.moveCallBack=function(event){
                if (moveCallBack) moveCallBack(event);
            };
            node.endCallBack=function(event){
                if(node._isTouchEnabledEx){
                    node.color = cc.Color.WHITE;
                    if (endCallBack) endCallBack(event);
                    node._isTouchEnabledEx = false;
                    setTimeout(()=>{
                        if(cc.isValid(node)){
                            node['_isTouchEnabledEx'] = true;
                        }
                    }, touchTime*1000);
                }
            };
            if(callback.cancelCallBack) {
                cancelCallBack = callback.cancelCallBack;
            }
            node.cancelCallBack=function(event){
                node.color = cc.Color.WHITE;
                //console.log("cancelCallBack",cancelCallBack);
                if (cancelCallBack) cancelCallBack(event);
            };
            node.on(cc.Node.EventType.TOUCH_START, node.startCallBack,target);
            node.on(cc.Node.EventType.TOUCH_MOVE, node.moveCallBack,target);
            node.on(cc.Node.EventType.TOUCH_END, node.endCallBack,target);
            node.on(cc.Node.EventType.TOUCH_CANCEL, node.cancelCallBack,target);
        }
    }
    bindToggle(node, callback, opname, target)
    {
        node.toggleCallBack=function(event){
            //AudioMgr.getInstance().play(opname); 
            
            //console.log(`你点击了按钮"${opname}"`)
            LogMgr.getInstance().addOpreation(opname);
            callback(event)
        };
        node.on("toggle", node.toggleCallBack, target)
    }
    bindSlider(node,callback,opname, target) {
        node.slideCallBack=function(event){
            LogMgr.getInstance().addOpreation(opname);
            callback(event)
        };
        node.on("slide", node.slideCallBack, target)
    }
    bindEdit(node,callback,opname,target)
    {
        node.editchangedCallBack=function(event){
            callback('text-changed',event);
        };
        node.editendedCallBack=function(event){
            LogMgr.getInstance().addOpreation(opname);
            //console.log(`你输入了内容"${opname}"`)
            //console.log(`你输入了内容`)
            callback('editing-did-ended',event);
        };
        node.on('text-changed',node.editchangedCallBack, target);
        node.on('editing-did-ended',node.editendedCallBack, target);
        
    }

    bindScroll(node, callback, opname,target)
    {
        node.scrollStartCallBack=function(event){
        };
        node.scrollMoveCallBack=function(event){
            callback(node, event);
        };
        node.scrollEndCallBack=function(event){
            callback(node, event);
        };
        node.scrollCancelCallBack=function(event){
            callback(node, event);
        };
        node.on(cc.Node.EventType.TOUCH_START, node.scrollStartCallBack,target);
        node.on(cc.Node.EventType.TOUCH_MOVE, node.scrollMoveCallBack,target);
        node.on(cc.Node.EventType.TOUCH_END, node.scrollEndCallBack,target);
        node.on(cc.Node.EventType.TOUCH_CANCEL, node.scrollCancelCallBack,target);
    }

    public bindImage(node:cc.Node, callback, opname:string,target)
    {
        let startCallBack=null;
        let moveCallBack=null;
        let endCallBack=null;
        if(typeof(callback)=='function')
        {
            endCallBack=callback;
            node.imageEndCallBack=function(event){
                //加入操作日志
                LogMgr.getInstance().addOpreation(opname);
                //console.log(`你点击了图片"${opname}"`)
                if(opname.indexOf("登录")<0)
                {
                    //AudioMgr.getInstance().play(opname); 
                }
                // if(event.target.lastScale) event.target.scale = event.target.lastScale
                if(event.target._isTouchEnabledEx) {
                    // callBack.call(target, event, userData);
                    event.target._isTouchEnabledEx = false;
                    setTimeout(()=>{
                        if(cc.isValid(node)){
                            node['_isTouchEnabledEx'] = true;
                        }
                    }, CONFIGS.touchLimitTime*1000);
                    if(endCallBack){
                        endCallBack(node,event); 
                    }
                }
            };
        }
        else if (typeof(callback)=='object') 
        {
            startCallBack = callback.startCallBack;
            moveCallBack = callback.moveCallBack;
            endCallBack = callback.endCallBack;
            node.imageStartCallBack=function(event){
                if(event.target._isTouchEnabledEx) {
                    // if(!event.target.lastScale) event.target.lastScale = event.target.scale;
                        // event.target.scale = event.target.lastScale * this._scaleRate;
                    if(startCallBack){
                        startCallBack(node,event); 
                    }
                }
            };
            node.imageMoveCallBack=function(event){
                if(event.target._isTouchEnabledEx) {
                    if(moveCallBack){
                        moveCallBack(node,event); 
                    }
                }
            };
            node.imageEndCallBack=function(event){
                //加入操作日志
                LogMgr.getInstance().addOpreation(opname);
                //console.log(`你点击了图片"${opname}"`)
                if(opname.indexOf("登录")<0)
                {
                    //AudioMgr.getInstance().play(opname); 
                }
                // if(event.target.lastScale) event.target.scale = event.target.lastScale
                if(event.target._isTouchEnabledEx) {
                    // callBack.call(target, event, userData);
                    event.target._isTouchEnabledEx = false;
                    setTimeout(()=>{
                        if(cc.isValid(node)){
                            node['_isTouchEnabledEx'] = true;
                        }
                    }, CONFIGS.touchLimitTime*1000);
                    if(endCallBack){
                        endCallBack(node,event); 
                    }
                }
            };
        }
        node['_isTouchEnabledEx'] = true;
        node.on(cc.Node.EventType.TOUCH_START, node.imageStartCallBack,target);
        node.on(cc.Node.EventType.TOUCH_MOVE, node.imageMoveCallBack,target);
        node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            // if(event.target.lastScale) event.target.scale = event.target.lastScale
  
        },target);
        node.on(cc.Node.EventType.TOUCH_END, node.imageEndCallBack,target);
    }

    //设置按钮是否可用
    public setBtnEnable (node:cc.Node, isEnable:Boolean, isNoGray?:Boolean) {
        if(isEnable){
            node.color = cc.Color.WHITE;
        }else{
            if(!isNoGray) node.color = cc.Color.GRAY;
        }
        node['_isTouchEnabledEx'] = isEnable;
    }

    /**
     * @param targetNode 需要替换头像的节点
     * @param headID 头像请求的id（如果没有headUrl，则使用id去获取服务器头像）
     * @param headUrl 头像请求路径(如果有，优先显示)
     * 动态加载头像的释放工作待做
     */
    public setUserHead (targetNode, headID:number, headUrl?:any){
        if(!targetNode)
        {
            console.error("setDefaultHead找不到头像节点targetNode")
            return;
        }
        if(!cc.isValid(targetNode)){
            return
        }
        
        if(targetNode instanceof cc.Sprite) targetNode = targetNode.node;
        if(!headUrl) headUrl = UserMgr.getInstance().getHeadPng(headID);
        let myPng=null;
        if(headUrl&&headUrl.split)
        {
            myPng = headUrl.split('.');
        } 
        if(!myPng)
        {
            return;
        }
        let imageType = myPng[myPng.length-1];
        headUrl = imageType=='png'||imageType=='jpg' ? headUrl :`${headUrl}?aa=aa.jpg`;
        cc.loader.load(headUrl, (err, assets)=>{
            if(!targetNode)
            {
                return
            }
            if(!cc.isValid(targetNode)){
                return
            } 
            if(err){
                // cc.error(err);
                this.setDefaultHead(targetNode);
            }else{
                let w = 0, h = 0; 
                w = targetNode.width; 
                h = targetNode.height; 
                targetNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(assets);
                targetNode.width = w;
                targetNode.height = h; 
            }
        })
    }

    private setDefaultHead(targetNode: cc.Node) {
        if(!targetNode)
        {
            console.error("setDefaultHead找不到头像节点targetNode")
            return;
        }
        if(!cc.isValid(targetNode)){
            return
        } 
        cc.loader.loadRes("Icons/img_rwtx", cc.SpriteFrame, (err, spriteFrame)=>{
            if(!targetNode)
            {
                return
            }
            if(!cc.isValid(targetNode)){
                return
            } 
            if(!err)
            {
                let w = 0, h = 0; 
                w = targetNode.width; 
                h = targetNode.height; 
                targetNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                targetNode.width = w;
                targetNode.height = h; 
            }
        });
    }

    bindText(node:cc.Node, callback:Function, opname:string,target)
    {
        node['_isTouchEnabledEx'] = true;
        node.textEndCallBack=function(event){
            //加入操作日志
            LogMgr.getInstance().addOpreation(opname);
            //console.log(`你点击了图片"${opname}"`)
            //AudioMgr.getInstance().play(opname); 
            //if(event.target.lastScale) event.target.scale = event.target.lastScale
            if(event.target._isTouchEnabledEx) {
                // callBack.call(target, event, userData);
                if(callback){
                    callback(node,event); 
                }
            }
        };
        // node.on(cc.Node.EventType.TOUCH_START, function (event) { 
        //     if(event.target._isTouchEnabledEx) {
        //         if(!event.target.lastScale) event.target.lastScale = event.target.scale;
        //             event.target.scale = event.target.lastScale * this._scaleRate;
        //     }
        // },this);
        // node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
        //     if(event.target.lastScale) event.target.scale = event.target.lastScale
        // },this);
        node.on(cc.Node.EventType.TOUCH_END, node.textEndCallBack,target);
    } 
}
