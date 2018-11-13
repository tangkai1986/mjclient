/*
author: YOYO
日期:2018-03-19 14:46:52
*/
import BunchInfoMgr from "../../../Plat/GameMgrs/BunchInfoMgr";
import GEventDef from "../../../Plat/GameMgrs/GEventDef";
import QuitMgr from "../../../Plat/GameMgrs/QuitMgr";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import SwitchMgr from "../../../Plat/GameMgrs/SwitchMgr";
import LoginMgr from "../../../Plat/GameMgrs/LoginMgr";

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
let ctrl : Mpnn_totalSettleCtrl;
//模型，数据处理
class Model extends BaseModel{
    peopleNum:number                            //玩家数量
    maxRounds:number                            //最大局数
    data_meiju
    mamai_kaiguan:boolean
    shareSwitch=null;
	constructor(){
        super();
        this.shareSwitch = SwitchMgr.getInstance().get_switch_performance_sharing();
    }

    updateSwitch(msg){
        this.shareSwitch = msg.cfg.switch_performance_sharing;
    }

    updateInfo (){
        let bunchInfo = BunchInfoMgr.getInstance().getBunchInfo()
        let roomRule = bunchInfo.roomValue;
        this.mamai_kaiguan = roomRule.v_playerbuyLimit;
        if(bunchInfo){
            //console.log('bunchInfo= ', bunchInfo)
            let leijiInfo = bunchInfo.leiji;
            this.data_meiju = bunchInfo.meiju;
            this.peopleNum = 0;
            let userlist = BunchInfoMgr.getInstance().getMembelist();
            if (userlist != null && userlist.length != null){
                for(let i = 0; i < userlist.length; i ++){
                    if(userlist[i]){
                        this.peopleNum += 1;
                    }
                }
            }
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
        node_btn_totalChoose:null,
        node_btn_exitRoom:null,
        node_btn_meijuChoose:null,
        node_btn_shared:null,
        scrollow_content:null,
        prefab_meijuDetail:null,
        prefab_openContent:null,
        prefab_playerDetail:null,
        prefab_rowContent:null,
        node_btn_close:null,
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
        this.ui.node_btn_exitRoom = ctrl.node_btn_exitRoom;
        this.ui.node_btn_totalChoose = ctrl.node_btn_totalChoose;
        this.ui.node_btn_meijuChoose = ctrl.node_btn_meijuChoose;
        this.ui.node_btn_shared = ctrl.node_btn_shared;
        this.ui.scrollow_content = ctrl.scrollow_content;
        this.ui.prefab_playerDetail = ctrl.prefab_playerDetail;
        this.ui.prefab_openContent = ctrl.prefab_openContent;
        this.ui.prefab_meijuDetail = ctrl.prefab_meijuDetail;
        this.ui.prefab_rowContent = ctrl.prefab_rowContent;
        this.ui.node_btn_close = ctrl.node_btn_close;

        this.node_content = this.ui.scrollow_content.content;
        this.startPosX = -this.node_content.width/2;
        this.showShareBtn();
    }

    //选中总统计
    chooseTotal (){
        if(this.isChooseTotal) return;
        let totalTopNode = this.ui.node_btn_totalChoose.children[1];
        let meijuTopNode = this.ui.node_btn_meijuChoose.children[1];
        totalTopNode.active = true;
        meijuTopNode.active = false;
        this.isChooseTotal = true;
        this.updateTotalContent();
    }
    //选中每局
    chooseMeiju (){
       if(!this.isChooseTotal) return;
        let totalTopNode = this.ui.node_btn_totalChoose.children[1];
        let meijuTopNode = this.ui.node_btn_meijuChoose.children[1];
        totalTopNode.active = false;
        meijuTopNode.active = true;
        this.isChooseTotal = false;
        this.updateMeijuContent();
    }
    //刷新总统计内容显示
    updateTotalContent (){
        this.clearContent();
        let allItemNum = this.model.peopleNum;
        this.curShowNum = 0;
        this.curHorizontalNum = 4;
        this.curPrefab = this.ui.prefab_playerDetail;
        for(let i = 0; i < allItemNum; i ++){
            this.addItem();
        }
    }
    //刷新每局积分内容显示
    updateMeijuContent (){
        this.clearContent();
        let allItemNum = this.model.maxRounds;
        this.curShowNum = 0;
        this.curHorizontalNum = 1;
        this.curPrefab = cc.instantiate(this.ui.prefab_rowContent);
        this.list_clickBtn = [];
        for(let i = 0; i < allItemNum; i ++){
            this.list_clickBtn.push(this.addItem());
        }
        ctrl.reconnectUi();
    }
    //打开某个选项
    openItem (index:number){
        if(!this.isChooseTotal){
            //不是总统计
            //console.log("openItem");
            this.addOpenDetail(index);
        }
    }
    //清理内容
    clearContent (){
        let children = this.node_content.children;
        for(let i = 0; i < children.length; i ++){
            children[i].destroy();
        }
        this.node_content.removeAllChildren(true);
        this.curShowNum = 0;
        this.curPrefab = null;
        this.itemWidth = null;
        this.itemHeight = null;
    }
    //关闭详情
    delOpenDetail (targetNode:cc.Node){
        // let index = targetNode[CONFIGS.str_diyIndex];
        let children = this.node_content.children;
        // let itemNode:cc.Node = children[index];
        let downList = [];
        for(let i = 0; i < children.length; i ++){
            if(children[i].y < targetNode.y){
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
        for(let i = 0; i < downList.length; i ++){
            downList[i].y += downH;
        }
        this.resetRankContentSize();
    }

    //是否是大厅
    setIsPlatShow (){
        let isPlat = BunchInfoMgr.getInstance().getplazzaFlag();
        this.ui.node_btn_exitRoom.active = !isPlat;
        this.ui.node_btn_close.active = isPlat;
        if(isPlat){
            this.ui.node_btn_shared.x = 0;
        }else{
            this.ui.node_btn_shared.x = -267;
        }
    }

    //===========

    //
    private addItem (){
        let curNode:cc.Node = cc.instantiate(this.curPrefab);
        curNode.parent = this.node_content;
        this.initSize(curNode);
        curNode.position = this.getItemPos();
        this.curShowNum += 1;
        this.resetGridContentSize();
        return curNode;
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
        //判定是哪个牛牛的openContent
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
        //标注局数
        addItemNode[CONFIGS.str_curRound] = index;
        //绑定对象
        itemNode[CONFIGS.str_openNode] = addItemNode;
        //add detail
        let posConfigs = addItemNode.children[2].children;
        let detailNum = this.model.peopleNum;
        let myLogicSeatId = BunchInfoMgr.getInstance().getMyLogicSeatId();
        //let myLogicSeatId = 1;
        // let meijuData;
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
            //console.log("addOpenDetail 3", posConfigs[i].name);
        }
        //do down
        for(let i = 0; i < downList.length; i ++){
            downList[i].y -= downH;
        }
        this.resetRankContentSize();
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
        this.node_content.height = curH+50;
    }
    //战绩分享开关
    showShareBtn(){
        this.ui.node_btn_shared.active = this.model.shareSwitch == 1?true:false;
    }
}
//c, 控制
@ccclass
export default class Mpnn_totalSettleCtrl extends BaseCtrl {
	view:View = null
    model:Model = null
    
	//这边去声明ui组件
    @property(cc.Node)
    node_btn_totalChoose:cc.Node = null
    @property(cc.Node)
    node_btn_meijuChoose:cc.Node = null
    @property(cc.Node)
    node_btn_shared:cc.Node = null
    @property(cc.Node)
    node_btn_exitRoom:cc.Node = null
    @property(cc.Node)
    node_btn_close:cc.Node = null
    @property(cc.ScrollView)
    scrollow_content:cc.ScrollView = null
    @property(cc.Prefab)
    prefab_playerDetail:cc.Prefab = null
    @property(cc.Prefab)
    prefab_openContent:cc.Prefab = null
    @property(cc.Prefab)
    prefab_meijuDetail:cc.Prefab = null
    @property(cc.Prefab)
    prefab_rowContent:cc.Prefab = null
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
        this.n_events = {
            'http.reqUsers' : this.http_reqUsers,
            'http.reqGameSwitch':this.http_reqGameSwitch,
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi(){
        this.connect(G_UiType.image, this.ui.node_btn_exitRoom, this.node_btn_exitRoom_cb, '点击退出房间');
        this.connect(G_UiType.image, this.ui.node_btn_shared, this.node_btn_shared_cb, '点击分享');
        this.connect(G_UiType.image, this.ui.node_btn_meijuChoose, this.node_btn_meijuChoose_cb, '点击每局积分');
        this.connect(G_UiType.image, this.ui.node_btn_totalChoose, this.node_btn_totalChoose_cb, '点击总统计');
        this.connect(G_UiType.image, this.ui.node_btn_close, this.node_btn_close_cb, '点击总统计');
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
	start () {
        //console.log('初始容器坐标', this.scrollow_content.content.position)
        //区分平台和房间内
        this.view.setIsPlatShow();
        //
        this.model.updateInfo();
        //默认显示总统计
        this.view.chooseTotal();
	}
    //网络事件回调begin
    http_reqUsers(){
        this.model.updateInfo();
        //默认显示总统计
        this.view.chooseTotal();
    }
    http_reqGameSwitch(msg){
        this.model.updateSwitch(msg);
        this.view.showShareBtn()
    }
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    node_btn_close_cb(){
        BunchInfoMgr.getInstance().clear();
		if(RoomMgr.getInstance().isInRoom())
		{
			LoginMgr.getInstance().disconnectGameSvr()
		}
		else
		{
			this.finish();
		}
    }
    //退出房间
    private node_btn_exitRoom_cb(){
        //console.log('click node_btn_exitRoom_cb')
        BunchInfoMgr.getInstance().clear();
        LoginMgr.getInstance().disconnectGameSvr();
    }
    //分享
    private node_btn_shared_cb(){
        //console.log('click node_btn_shared_cb')
        //console.log('btn_share_cb')
        this.start_sub_module(G_MODULE.Shared);
    }
    //点击了每局积分
    private node_btn_meijuChoose_cb(){
        //console.log('click 点击了每局积分')
            this.view.chooseMeiju();
    }
    //点击了总统计
    private node_btn_totalChoose_cb(){
        //console.log('click 点击了总统计')
        this.view.chooseTotal();
    }
    //点击打开某个每局详情
    private clickOpenDetail(event){
        let curNode = event.target;
        if(curNode[CONFIGS.str_openNode]){
            //关闭
            this.view.delOpenDetail(curNode);
        }else{
            //打开
            this.view.openItem(curNode[CONFIGS.str_diyIndex]);
        }
    }
	//end
}