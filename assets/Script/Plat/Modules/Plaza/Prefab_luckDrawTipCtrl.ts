import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BaseCtrl from "../../Libs/BaseCtrl";

const {ccclass, property} = cc._decorator;


let ctrl : Prefab_luckDrawTipCtrl;

class Model extends BaseModel{
    private content:string = null           //内容
    private timeString:string = null
    private buttonlab:string = null

    constructor()
    {
        super();
        this.buttonlab = 'shareBtn';

    }
    public setContentLab(content:string, timeLab:string){
        this.content  = content;
        this.timeString = timeLab;
    }
    public setButtonLab(buttonlab){
        this.buttonlab = buttonlab;
    }
}

class View extends BaseView{
    ui={
        label_contentLab:null,
        button_shareBtn:null,
        label_buttonLab:null,
        button_knowBtn:null,
        label_awardTime:null,
    };
    node = null;
    constructor(model){
        super(model);
        this.node = ctrl.node;
        this.initUi();
        this.addGrayLayer();
    }

    initUi(){
        this.ui.label_contentLab = ctrl.contentLab;
        this.ui.button_shareBtn = ctrl.shareBtn;
        this.ui.label_buttonLab = ctrl.buttonLab;
        this.ui.button_knowBtn = ctrl.knowBtn;
        this.ui.label_awardTime = ctrl.awardTimeLab;
    }

    public updateContent(){
        this.ui.label_contentLab.string = this.model.content;
        this.ui.label_awardTime.string = this.model.timeString;
    }
    
    public addGrayLayer (){
        cc.loader.loadRes('Icons/singleColor', cc.SpriteFrame, (err, spriteFrame:cc.SpriteFrame)=>{
            if(err){
                cc.error(err);
            }
            else{
                let _grayLayer = new cc.Node();
                _grayLayer.addComponent(cc.Sprite).spriteFrame = spriteFrame;
                _grayLayer.parent = this.node;
                
                let _size = cc.director.getVisibleSize();
                _grayLayer.width = _size.width;
                _grayLayer.height = _size.height;
                _grayLayer.color = cc.Color.BLACK;
                _grayLayer.opacity = 120;
                _grayLayer.zIndex = -1;
                _grayLayer.on(cc.Node.EventType.TOUCH_START, ()=>{
                    _grayLayer.parent.destroy();
                }, this);
            }
        })
    }
}
@ccclass
export default class Prefab_luckDrawTipCtrl extends BaseCtrl {

    @property(cc.Label)
    contentLab: cc.Label = null;

    @property(cc.Node)
    shareBtn: cc.Node = null;

    @property(cc.Node)
    knowBtn: cc.Node = null;

    @property(cc.Label)
    awardTimeLab: cc.Label = null;


    private _cb_response:Function = null
    onLoad () {
        //创建mvc模式中模型和视图
        //控制器
        ctrl = this;
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
    
    defineNetEvents(){
    
    }
    defineGlobalEvents(){
    }

    connectUi(){
        this.connect(G_UiType.button, this.ui.button_shareBtn, this.onClickCB, '点击分享')
        this.connect(G_UiType.button, this.ui.button_knowBtn, this.onClickCB, '点击确认')
    }
    
    public showTip (content:string, cb?:Function, buttonLab?:string, awardTimeLab?:string){
        this._cb_response = cb;
        buttonLab = buttonLab ? buttonLab : this.model.buttonlab;
        this.ui.button_shareBtn.active = buttonLab == 'shareBtn';
        this.ui.button_knowBtn.active = buttonLab == 'knowBtn';
        this.model.setContentLab(content, awardTimeLab);
        this.view.updateContent();
    }

    start () {

    }

    onClickCB(event){
        if (this.model.buttonlab == 'shareBtn'){
            //console.log('分享') 
            this._doFinish();
        }
        else{
            //console.log('确认')
            this.finish();
        }
    }

    private _doFinish(){
        if(this._cb_response){
            this._cb_response();
        }
        this.finish();
    }
    // update (dt) {},
}
