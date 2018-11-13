import BaseCtrl from "../../Libs/BaseCtrl";
import LoginMgr from "../../GameMgrs/LoginMgr";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

//预制体脚本示例

const {ccclass, property} = cc._decorator;

let ctrl:UserLoginCtrl;
//模型，数据处理
class Model extends BaseModel{
    private initText:string = null
    private actTime:number = null

    private _account:string = null
    private _password:string = null
    constructor()
    { 
        super();
        this.initText = 'do login';
        this.actTime = 3;
    }

    public getText ():string{
        return this.initText
    }

    public getActTime ():number{
        return this.actTime
    }

    public saveAccount(accountStr:string){
        this._account = accountStr;
    }

    public savePassword(passwordStr:string){
        this._password = passwordStr;
    }

    public getLoginInfo (){
        return {
            account : this._account,
            password : this._password
        }
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    ui={
        lab_info : null,
        node_pointer : null
    };
    node:cc.Node = null
    model:Model =null

    constructor(model)
    { 
        super(model);
        this.model = model; 
        this.node = ctrl.node;  
        this.initUi();
        this.addGrayLayer();
    } 
    initUi()
    {  
        this.ui.lab_info = ctrl.lab_info;
        this.ui.node_pointer = ctrl.node_pointer;
    }
    public updateText()
    {
        this.ui.lab_info.string = this.model.getText();
    }

    public runPointer (){
        this.ui.node_pointer.runAction(cc.rotateBy(this.model.getActTime(), 360).repeatForever())
    }

    public showLabelBtnInfo (){
        let info = this.model.getLoginInfo();
        let str = info.account+', '+info.password;
        this.ui.lab_info.string = str;
    }
}
//控制器
@ccclass
export default class UserLoginCtrl extends BaseCtrl { 
    
    @property(cc.Label)
    lab_info:cc.Label = null

    @property(cc.Node)
    node_pointer:cc.Node = null

    @property(cc.EditBox)
    edit_account:cc.EditBox = null

    @property(cc.EditBox)
    edit_password:cc.EditBox = null

    //关闭按钮
    @property(cc.Node)
    node_close:cc.Node = null

    onLoad (){ 
        //创建mvc模式中模型和视图
        //控制器
        ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
    }
    connectUi()
    {
        this.connect(G_UiType.image, this.lab_info.node, this._onClick_lab, '点击旋转')
        this.connect(G_UiType.image, this.node_close, this.finish, '点击关闭')
        this.connect(G_UiType.edit, this.edit_account.node, this._onEdit_account, '输入账号')
        this.connect(G_UiType.edit, this.edit_password.node, this._onEdit_password, '输入密码') 
    }
    start () {
        this.view.updateText();
        this.defineNetEvents();
    } 

    //定义网络事件
    defineNetEvents()
    {
        
    }

    private _onClick_lab (event){
        this.view.runPointer();

        // this.view.showLabelBtnInfo();

        let info = this.model.getLoginInfo();
        //去登录服务器
        var msg={
            'username': info.account,
            'password': info.password
        }
        LoginMgr.getInstance().reqLogin(msg);
    }

    private _onEdit_account (event){
        //console.log('_onEdit_account11111')

        let editComp = event.currentTarget.getComponent(cc.EditBox);
        //console.log(editComp.string);
        this.model.saveAccount(editComp.string);
    }

    private _onEdit_password (event){
        //console.log('_onEdit_password')
        let editComp = event.currentTarget.getComponent(cc.EditBox);
        this.model.savePassword(editComp.string);
    }
}
