import GameNet from "../NetCenter/GameNet";
import NetNotify from "../NetCenter/NetNotify";
import LogMgr from "./LogMgr";
import UserMgr from "./UserMgr";
import AudioMgr from "./AudioMgr";
import VersionMgr from "../../AppStart/AppMgrs/VersionMgr";
import LocalStorage from "../Libs/LocalStorage";

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
    private headSpriteList = {};
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
        
        if(typeof(callback)=='function')
        {
            clickCallBack=callback;
            node.on(cc.Node.EventType.TOUCH_END, function(event) {
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
            }, target)
        }
        else if (typeof(callback)=='object') 
        {
            startCallBack = callback.startCallBack;
            moveCallBack = callback.moveCallBack;
            endCallBack = callback.endCallBack;
            //console.log("callback",callback,opname);
            
            if(callback.cancelCallBack) {
                cancelCallBack = callback.cancelCallBack;
            }
            node.on(cc.Node.EventType.TOUCH_START, function (event) {
    
                if(node._isTouchEnabledEx){
                    node.color = cc.Color.GRAY;
                    if (startCallBack) startCallBack(event);
                }
            },target);
            node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                if (moveCallBack) moveCallBack(event);
            },target);
            node.on(cc.Node.EventType.TOUCH_END, function (event) {
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
            },target);
            node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
                node.color = cc.Color.WHITE;
                //console.log("cancelCallBack",cancelCallBack);
                if (cancelCallBack) cancelCallBack(event);
            },target);
        }
    }
    bindToggle(node, callback, opname, target)
    {
        node.on("toggle", function(event) {
            //AudioMgr.getInstance().play(opname); 
            
            //console.log(`你点击了按钮"${opname}"`)
            LogMgr.getInstance().addOpreation(opname);
            callback(event)
        }, target)
    }
    bindSlider(node,callback,opname, target) {
        node.on("slide", function(event) {
            LogMgr.getInstance().addOpreation(opname);
            callback(event)
        }, target)
    }
    bindEdit(node,callback,opname,target)
    {
        node.on('text-changed',function(event)
        {  
            callback('text-changed',event);
        }
        , target);
        node.on('editing-did-ended',function(event)
        {
            //AudioMgr.getInstance().play(opname); 
            LogMgr.getInstance().addOpreation(opname);
            //console.log(`你输入了内容"${opname}"`)
            //console.log(`你输入了内容`)
            callback('editing-did-ended',event);
        }
        , target);
        
    }

    bindScroll(node, callback, opname,target)
    {
        node.on(cc.Node.EventType.TOUCH_START, function (event) {
            // TODO 后续ScrollView组件有用到这个事件在进行添加具体逻辑
        },target);
        node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            callback(node, event);
        },target);
        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            callback(node, event);
            // TODO 后续ScrollView组件有用到这个事件在进行添加具体逻辑
        },target);
        node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            callback(node, event);
            // TODO 后续ScrollView组件有用到这个事件在进行添加具体逻辑
        },target);
    }

    public bindImage(node:cc.Node, callback, opname:string,target)
    {
        let startCallBack=null;
        let moveCallBack=null;
        let endCallBack=null;
        if(typeof(callback)=='function')
        {
            endCallBack=callback;
        }
        else if (typeof(callback)=='object') 
        {
            startCallBack = callback.startCallBack;
            moveCallBack = callback.moveCallBack;
            endCallBack = callback.endCallBack;
        }
        node['_isTouchEnabledEx'] = true;
        node.on(cc.Node.EventType.TOUCH_START, function (event) { 
            if(event.target._isTouchEnabledEx) {
                // if(!event.target.lastScale) event.target.lastScale = event.target.scale;
                    // event.target.scale = event.target.lastScale * this._scaleRate;
                if(startCallBack){
                    startCallBack(node,event); 
                }
            }
        },target);
        node.on(cc.Node.EventType.TOUCH_MOVE, function (event) { 
            if(event.target._isTouchEnabledEx) {
                if(moveCallBack){
                    moveCallBack(node,event); 
                }
            }
        },target);
        node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            // if(event.target.lastScale) event.target.scale = event.target.lastScale
  
        },target);
        node.on(cc.Node.EventType.TOUCH_END, function (event) {
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
        },target);
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
    public setUserHead (targetNode, headID:number, headUrl?:any,headSpriteUrl){
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
        // console.log("headUrl",headUrl);
        //有缓存图片则用缓存图片进行图片生成
        let cacheImg = LocalStorage.getInstance().getData(headUrl);
        if(cacheImg) {
            if(!cc.isValid(targetNode)){
                return
            }
            cc.loader.load(cacheImg, (err, sprite)=>{
                console.log("setUserHead success",cacheImg)
                if(!targetNode)
                {
                    return
                }
                if(!cc.isValid(targetNode)){
                    return
                } 
                if(!err){
                    let w = 0, h = 0; 
                    w = targetNode.width; 
                    h = targetNode.height; 
                    //assets.retain();
                    targetNode.getComponent(cc.Sprite).spriteFrame =new cc.SpriteFrame(sprite);
                    targetNode.width = w;
                    targetNode.height = h;             
                }
            })
            return;
        }
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
                //重新拉取一次头像
                this.setDefaultHead(targetNode,headUrl);
            }else{
                if(cc.sys.isNative) {
                    console.log("downloadAndSaveHeadImg")
                    let picDir = VersionMgr.getInstance().getStoragePath()+'/res/raw-assets/resources/headImgMap/';
                    downloadAndSaveHeadImg(headUrl,picDir, LocalStorage.getInstance());
                }
                let w = 0, h = 0; 
                w = targetNode.width; 
                h = targetNode.height; 
                //assets.retain();
                this.headSpriteList[headUrl] = assets;
                targetNode.getComponent(cc.Sprite).spriteFrame =new cc.SpriteFrame(assets);
                targetNode.width = w;
                targetNode.height = h;             
            }
        })
    }

    private setDefaultHead(targetNode: cc.Node,headUrl) {
        if(!targetNode)
        {
            console.error("setDefaultHead找不到头像节点targetNode")
            return;
        }
        if(!cc.isValid(targetNode)){
            return
        } 
        cc.loader.load(headUrl, (err, texture)=>{
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
                targetNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                targetNode.width = w;
                targetNode.height = h; 
            }
        });
    }

    bindText(node:cc.Node, callback:Function, opname:string,target)
    {
        node['_isTouchEnabledEx'] = true;
        // node.on(cc.Node.EventType.TOUCH_START, function (event) { 
        //     if(event.target._isTouchEnabledEx) {
        //         if(!event.target.lastScale) event.target.lastScale = event.target.scale;
        //             event.target.scale = event.target.lastScale * this._scaleRate;
        //     }
        // },this);
        // node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
        //     if(event.target.lastScale) event.target.scale = event.target.lastScale
        // },this);
        node.on(cc.Node.EventType.TOUCH_END, function (event) {
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
        },target);
    } 
}
