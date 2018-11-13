import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import MailMgr from "../../GameMgrs/MailMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_MailDetailCtrl;
//模型，数据处理
class Model extends BaseModel{
    private mailContent;
	constructor()
	{
        super();
        MailMgr.getInstance().reqMailInfo();
    }

    getMailTitle () {
        return this.mailContent.mail_title;
    }
    getMailContent () {
        return this.mailContent.mail_content;
    }
    getMailAttachment () {
        return this.mailContent.mail_attachment;
    }
    getMailStatus()
    {
        return this.mailContent.status;
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		label_MailTitle : null,
        label_MailContent : null,
        Closebtn : null,
        Receivebtn : null,
        MailContentParent : null,
        MailPrize : null,
        prefab_MailPrizeItem : null,
        mailItemSprites:[],
        mailItemNumbers:[],
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
        this.ui.label_MailTitle = ctrl.MailTitle.getComponent(cc.Label);
        this.ui.label_MailTitle.node.active=false;
        this.ui.label_MailContent = ctrl.MailContent.getComponent(cc.Label);
        this.ui.label_MailContent.node.active=false;
        this.ui.Closebtn = ctrl.Closebtn;
        this.ui.Receivebtn = ctrl.Receivebtn;
        this.ui.MailContentParent = ctrl.MailContentParent;
        this.ui.MailPrize = ctrl.MailPrize;
        this.ui.prefab_MailPrizeItem = ctrl.MailPrizeItem;
	}
    initWithView()
    {
        let MailAttachment = this.model.getMailAttachment();
        this.ui.MailPrize.removeAllChildren();
        if (MailAttachment != null && MailAttachment != undefined) {
           for (let i=0;i< MailAttachment.count;i++) {
               let item = cc.instantiate(this.ui.prefab_MailPrizeItem);
               this.ui.MailPrize.addChild(item);
               this.ui.mailItemSprites[i] = item.getChildByName("sharing_diamonds_7").getComponent(cc.Sprite);
               this.ui.mailItemNumbers[i] = item.getChildByName("number").getComponent(cc.Label);
           }
        }
        this.updateMailContent();
    }
    updateMailContent () {
        this.ui.label_MailTitle.string = this.model.getMailTitle();
        this.ui.label_MailContent.string = this.model.getMailContent();
        this.ui.MailContentParent.height = this.ui.label_MailContent.height + 10;
        let MailAttachment = this.model.getMailAttachment();
        if (MailAttachment != null && MailAttachment != undefined) {
            this.ui.label_MailTitle.node.active=true;
            this.ui.label_MailContent.node.active=true;
           for (let i=0;i< MailAttachment.count;i++) {
               var texture=cc.loader.getRes(cc.url.raw('resources/Plat/items/item_'+MailAttachment.attachment[i].pid+'.png'));
               //console.log("MailAttachment",MailAttachment.attachment[i]);
               
               let imagePath = 'Plat/items/item_'+MailAttachment.attachment[i].pid;
               let self = this;
                cc.loader.loadRes(imagePath, cc.SpriteFrame, function (err, spriteFrame) {
                    if (err) return cc.error("no find image path: %s", imagePath)
                    if(cc.isValid(self.ui.mailItemSprites[i]) && self.ui.mailItemSprites[i]) {
                        self.ui.mailItemSprites[i].spriteFrame = spriteFrame
                    }
                });
                this.ui.mailItemNumbers[i].string = "x"+MailAttachment.attachment[i].product_num;
            }
        }
        if (this.model.getMailStatus()<2) {
            this.ui.Receivebtn.active = true;
        }
    }
}
//c, 控制
@ccclass
export default class Prefab_MailDetailCtrl extends BaseControl {
	//这边去声明ui组件
	@property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
	Closebtn : cc.Node = null;

	@property({
		tooltip : "邮件标题",
		type : cc.Node
	})
	MailTitle : cc.Node = null;

    @property({
        tooltip : "邮件内容",
        type : cc.Node
    })
    MailContent : cc.Node = null;

    @property({
        tooltip : "领取按钮",
        type : cc.Node
    })
    Receivebtn : cc.Node = null;

    @property({
        tooltip : "邮件内容滑动框",
        type : cc.Node
    })
    MailContentParent : cc.Node = null;

    @property({
        tooltip : "邮件奖励品列表",
        type : cc.Node
    })
    MailPrize: cc.Node = null;

    @property({
        tooltip : "邮件奖励品",
        type : cc.Prefab
    })
    MailPrizeItem: cc.Prefab = null;
    
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//控制器
		ctrl = this;
        // 初始化视图模块 MVC
        this.initMvc(Model, View);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {
            'http.reqMailInfo' : this.updateMailInfo,
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.ui.Closebtn, this.Closebtn_cb, "关闭按钮");
		this.connect(G_UiType.image, this.ui.Receivebtn, this.Receivebtn_cb, "领取按钮");
        // if (this.model.getMailStatus()>=1) {
        //     this.updateMailInfo();
        // }
	}
	start () {
	}
    updateMailInfo()
    {
        //console.log("updateMailInfo")
        this.model.mailContent = MailMgr.getInstance().getMailDetail();
        this.view.initWithView();
    }
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private Closebtn_cb () : void {
		this.finish();
	}
    private Receivebtn_cb () :void {
        MailMgr.getInstance().reqMailGet();
        this.finish();
    }
	//end
}
