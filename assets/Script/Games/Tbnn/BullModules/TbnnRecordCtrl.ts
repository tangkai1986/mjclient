/*
author: YOYO
日期:2018-03-28 10:36:18
*/
import BunchInfoMgr from "../../../Plat/GameMgrs/BunchInfoMgr";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
const CONFIGS = {
    horizontalNum:4,                         //一行有几个子节点
    itemOffX : 0,                              //x间距
    itemOffY : 0,                              //y间距
    str_openNode:"_openContentNode",
    str_curRound:"_curRound",
    str_diyIndex:"_diyIndex",
}
let ctrl : TbnnRecordCtrl;
//模型，数据处理
class Model extends BaseModel{
	peopleNum:number                            //玩家数量
	maxRounds:number                            //最大局数
	mamai_kaiguan:boolean						//买码开关
	data_meiju
	constructor(){
        super();
    }
    updateInfo (){
		let roomRule = RoomMgr.getInstance().getFangKaCfg();
        this.mamai_kaiguan = roomRule.v_playerbuyLimit;
        let bunchInfo = RoomMgr.getInstance().getBunchInfo();
        if(bunchInfo){
            //console.log('bunchInfo= ', bunchInfo)
			let leijiInfo = bunchInfo.leiji;
			this.data_meiju = bunchInfo.meiju;
            this.peopleNum = Object.keys(leijiInfo).length;
            this.maxRounds = bunchInfo.meiju.length;
            //console.log('peopleNum = ',this.peopleNum)
            //console.log('maxRounds= ', this.maxRounds)
        }else{
            cc.error('bullTotalSettle bunchInfo is empty')
        }
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_close:null,
		scrollow_content:null,
		node_content:null,
		prefab_meijuDetail:null,
		prefab_rowContent:null,
		prefab_openContent:null
	};
	node=null;
	isChooseTotal:Boolean
    node_content:cc.Node
    model:Model
    list_clickBtn:Array<cc.Node>
    private itemWidth:number
    private itemHeight:number
    private startPosX:number
    private curPrefab:cc.Prefab
    private curHorizontalNum:number                     //单行有多少个
	private curShowNum:number                           //当前已经画到第几个了
	
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
		this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
		this.ui.scrollow_content = ctrl.scrollow_content;
		this.ui.btn_close = ctrl.btn_close;
		this.ui.prefab_rowContent = ctrl.prefab_rowContent;
		this.ui.prefab_openContent = ctrl.prefab_openContent;
		this.ui.prefab_meijuDetail = ctrl.prefab_meijuDetail;

		this.node_content = this.ui.scrollow_content.content;
        this.startPosX = -this.node_content.width/2;
	}
	//刷新每局积分内容显示
	updateMeijuContent() {
		this.clearContent();
		let allItemNum = this.model.maxRounds;
		this.curShowNum = 0;
		this.curHorizontalNum = 1;
		this.curPrefab = this.ui.prefab_rowContent;
		this.list_clickBtn = [];
		for (let i = 0; i < allItemNum; i++) {
			this.list_clickBtn.push(this.addItem());
		}
		//把多余的项隐藏掉
		for (let j = 0; j < this.list_clickBtn.length; j++) {
			let playerName = this.list_clickBtn[j].children[1];
			for (let i = this.model.peopleNum; i < playerName.childrenCount; i++) {
				playerName.children[i].active = false;
			}
		}
		ctrl.reconnectUi();
	}

	//打开某个选项
    openItem (index:number){
        if(!this.isChooseTotal){
            //不是总统计
            this.addOpenDetail(index);
        }
	}
	
	private addOpenDetail (index:number){
        let children = this.node_content.children;
        let itemNode:cc.Node = children[index];
        let downList = [];
        for(let i = 0; i < children.length; i ++){
            if(children[i].y < itemNode.y){
                downList.push(children[i]);
            }
        }
        //add one
        let addItemNode = cc.instantiate(this.ui.prefab_openContent);
        addItemNode.parent = this.node_content;
        addItemNode.position = cc.p(itemNode.x, itemNode.y - itemNode.height/2 - addItemNode.height/2);
		let downH = addItemNode.height;
		if(addItemNode.children[1].children[1]!=null){
            //买码开关
            if(this.model.mamai_kaiguan){
                addItemNode.children[1].children[1].active = true;
                addItemNode.children[0].height = 230;
            }else{
                addItemNode.children[1].children[1].active = false;
                addItemNode.children[0].height = 145;
            }
        }
		 //绑定对象
		itemNode[CONFIGS.str_openNode] = addItemNode;
        //标注局数
        addItemNode['_curRound'] = index;
        //add detail
        let posConfigs = addItemNode.children[2].children;
		let detailNum = this.model.peopleNum;
		let myLogicSeatId = BunchInfoMgr.getInstance().getMyLogicSeatId();
		let curId;
        for(let i = 0; i < detailNum; i ++){
			if(i == 0){
                curId = myLogicSeatId;
            }else{
                if(i == myLogicSeatId){
                    curId = 0;
                }else{
                    curId = i;
                }
            }
            //如果玩家自己没有手牌
            if(!this.model.data_meiju[index][1].handCards[curId]) continue;
            let detailNode = cc.instantiate(this.ui.prefab_meijuDetail);
            detailNode.parent = posConfigs[i];
        }
        //do down
        for(let i = 0; i < downList.length; i ++){
            downList[i].y -= downH;
        }
        this.resetRankContentSize();
	}
	
	//关闭详情
	delOpenDetail(targetNode: cc.Node) {
		let children = this.node_content.children;
		let downList = [];
		for (let i = 0; i < children.length; i++) {
			if (children[i].y < targetNode.y) {
				downList.push(children[i]);
			}
		}
		//del one
		let delNode = targetNode[CONFIGS.str_openNode];
		let downH = delNode.height;
		this.node_content.removeChild(delNode, true);
		delNode.destroy();
		targetNode[CONFIGS.str_openNode] = null;
		//do down
		for (let i = 0; i < downList.length; i++) {
			downList[i].y += downH;
		}
		this.resetRankContentSize();
	}

	//清理内容
	clearContent() {
		let children = this.node_content.children;
		for (let i = 0; i < children.length; i++) {
			children[i].destroy();
		}
		this.node_content.removeAllChildren(true);
		this.curShowNum = 0;
		this.curPrefab = null;
		this.itemWidth = null;
		this.itemHeight = null;
	}

	private addItem (){
        let curNode:cc.Node = cc.instantiate(this.curPrefab);
        curNode.parent = this.node_content;
        this.initSize(curNode);
        curNode.position = this.getItemPos();
        this.curShowNum += 1;
        this.resetGridContentSize();
        return curNode;
	}
	private initSize(curNode:cc.Node){
        if(!this.itemWidth){
            this.itemWidth = curNode.width;
            this.itemHeight = curNode.height;
        }
	}
	private getItemPos (){
        let curLineNum,
            rowNum,
            posX,
            posY;
        curLineNum = this.curShowNum%this.curHorizontalNum;
        rowNum = Math.floor(this.curShowNum/this.curHorizontalNum);
        posX = this.startPosX + curLineNum * (this.itemWidth + CONFIGS.itemOffX) + this.itemWidth/2;
        posY = -rowNum * (this.itemHeight + CONFIGS.itemOffY) - this.itemHeight/2;
        return cc.p(posX, posY);
	}
	private getContentHeight (){
        let rowNum = Math.ceil(this.curShowNum/this.curHorizontalNum);
        return rowNum * (this.itemHeight + CONFIGS.itemOffY);
    }
	private resetGridContentSize (){
        this.node_content.height = this.getContentHeight();
    }
	private resetRankContentSize (){
        let children = this.node_content.children;
        let curH = 0;
        for(let i = 0; i < children.length; i ++){
            curH += children[i].height;
        }
        this.node_content.height = curH;
    }
}
//c, 控制
@ccclass
export default class TbnnRecordCtrl extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
	@property({
		tooltip:'关闭',
		type:cc.Node
	})
	btn_close:cc.Node = null;

	@property({
		tooltip:'关闭',
		type:cc.ScrollView
	})
	scrollow_content:cc.ScrollView = null;

	@property(cc.Prefab)
	prefab_rowContent:cc.Prefab = null
	@property(cc.Prefab)
	prefab_openContent:cc.Prefab = null
	@property(cc.Prefab)
	prefab_meijuDetail:cc.Prefab = null
	
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		
		//数据模型
		this.initMvc(Model,View);
		this.model.updateInfo();
		this.inititems();
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
        this.connect(G_UiType.image, this.ui.btn_close, this.btn_closecb, '点击退出房间');
	}
	start () {
		
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	btn_closecb(){
		this.finish();
	}
	//初始化要显示几条战绩
    inititems(){
        //console.log('初始化战绩详情')
		this.view.updateMeijuContent();
	}
	reconnectUi(){
        let curList = this.view.list_clickBtn;
        let curNode:cc.Node;
        for(let i = 0; i < curList.length; i ++){
            curNode = curList[i];
            curNode['_diyIndex'] = i;
            curNode.on(cc.Node.EventType.TOUCH_END, this.clickOpenDetail, this)
        }
    }
	//点击打开某个每局详情
	clickOpenDetail(event){
		
		let curNode = event.target;
        if(curNode[CONFIGS.str_openNode]){
            //关闭
            this.view.delOpenDetail(curNode);
        }else{
            //打开
			// curNode.off(cc.Node.EventType.TOUCH_END, this.clickOpenDetail, this)
			this.view.openItem(curNode[CONFIGS.str_diyIndex]);
        }
    }
    }
	//end