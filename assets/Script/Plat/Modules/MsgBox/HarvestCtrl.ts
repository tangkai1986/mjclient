/*
author: YOYO
日期:2018-01-15 15:01:47

玩家收获界面，获取物品的提示
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_harvestCtrl;
//模型，数据处理
class Model extends BaseModel{
    lineNum:number = null
    config_lineScale:{} = null
    itemOffX:number = null
    itemOffY:number = null
    baseUrl:string = null
	constructor()
	{
		super();
        this.lineNum = 4;
        this.config_lineScale = {1:1, 2:1, 3:0.8, 4:0.5, 5:0.3, 6:0.3, 7:0.3};
        this.itemOffX = 50;
        this.itemOffY = 50;
        this.baseUrl = 'Icons/';
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        spriteFrame_item:null,
        node_items:null
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.ui.node_items = ctrl.node_items;
        this.ui.spriteFrame_item = ctrl.spriteFrame_item;
    }

    /**
     * 
     * @param itemNum 显示的物品 种类数量
     * @param imgName 物品图片的名字
     * @param recItemNum 某物品 获取到的数量
     */
    public showItems(itemNum:number, imgName:string, recItemNum:string){
        let imgUrl = this.model.baseUrl + imgName;
        this._loadPic(imgUrl, ()=>{
            this._showItems(itemNum, recItemNum);
        })
    }

    public _showItems(itemNum:number, recItemNum:string){
        
        if(itemNum == 1){
            this._addOneItem(0, 0, 1, recItemNum);
        }else{
            let oneLineNum = this.model.lineNum,
            curLine = Math.ceil(itemNum/oneLineNum),
            curScale = this.model.config_lineScale[curLine],
            lastLineNum = itemNum%oneLineNum;

            let curNode:cc.Node,
                itemSize,
                startPosX = -this.ui.node_items.width/2,
                startPosY = this.ui.node_items.height/2,
                leaveNum;

            curNode = new cc.Node();
            curNode.addComponent(cc.Sprite).spriteFrame = this.ui.spriteFrame_item;
            itemSize = curNode.getContentSize();
            curNode.destroy();
            itemSize.width *= curScale;
            itemSize.height *= curScale;

            for(let lineIndex = 1; lineIndex <= curLine; lineIndex ++){
                if(lineIndex < curLine){
                    leaveNum = oneLineNum;
                }else{
                    leaveNum = itemNum - (lineIndex - 1) * oneLineNum;
                }
                for(let i = 0; i < leaveNum; i ++){
                    let posX = startPosX + (i+1) * (itemSize.width + this.model.itemOffX);
                    let posY = startPosY-(itemSize.height/2 + (lineIndex-1) * (this.model.itemOffY + itemSize.height));
                    this._addOneItem(posX, posY, curScale, recItemNum);
                }
            }
        }
    }
    
    private _addOneItem (posX:number = 0, posY:number = 0, scale:number, recItemNum:string){
        let curNode = new cc.Node();
        curNode.addComponent(cc.Sprite).spriteFrame = this.ui.spriteFrame_item;
        curNode.parent = this.ui.node_items;
        curNode.x = posX;
        curNode.y = posY;
        curNode.scale = scale;

        //add num label
        let labNode = new cc.Node();
        labNode.addComponent(cc.Label).string = recItemNum + '';
        labNode.parent = curNode;
        labNode.y = -(curNode.height/2 + labNode.height/2);
    }

    private _loadPic(imgName:string, cb:Function){
        cc.loader.loadRes(imgName, cc.SpriteFrame, (err, spriteFrame:cc.SpriteFrame)=> { 
			if(err){
				cc.error(err) 
			}else{
                if(cc.isValid(this.ui.spriteFrame_item) && this.ui.spriteFrame_item) {
                    this.ui.spriteFrame_item = spriteFrame;
                }
                if(cb){
                    cb();
                    cb = null;
                }
			} 
		}); 
    }
}
//c, 控制
@ccclass
export default class Prefab_harvestCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property(cc.Node)
    node_bg:cc.Node = null

    @property(cc.Node)
    node_items:cc.Node = null

    @property(cc.SpriteFrame)
    spriteFrame_item:cc.SpriteFrame = null
	//声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离
    
    private _rec_cb:Function = null

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
        //不需要按钮点击特效，所以自定义创建
        this.node_bg.on(cc.Node.EventType.TOUCH_START, this.node_bg_cb, this);
	}
	start () {
        // let imgName = 'sharing_icon_dd';
        // let imgName = 'sharing_icon_zs';
        // this.showItems(6, imgName, 999, ()=>{
        //     //console.log('rec end here---')
        // });
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    private node_bg_cb(){
        //console.log('node_bg_cb')

        if(this._rec_cb){
            this._rec_cb();
            this._rec_cb = null;
        }

        this.finish();
    }
    //end
    
    /**
     * 
     * @param itemNum 显示的物品 种类数量
     * @param imgName 物品图片的名字
     * @param recItemNum 某物品 获取到的数量
     * @param cb 完成领取后的回调
     */
    public showItems (itemNum:number, imgName:string, recItemNum:string, cb?:Function){
        this._rec_cb = cb;
        this.view.showItems(itemNum, imgName, recItemNum);
    }
}