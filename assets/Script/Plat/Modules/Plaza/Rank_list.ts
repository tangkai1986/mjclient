//大厅控制管理
import BaseModel from "../../Libs/BaseModel";
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import UiMgr from "../../GameMgrs/UiMgr";
import UserMgr from "../../GameMgrs/UserMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : RankCtrl;
//模型，数据处理
class Model extends BaseModel{
	private rank_begin:number = null
	private rank_end:number = null
	private icon_width:number = null
	private icon_height:number = null
	private rank_record:boolean = null
	private scroll_move_bol:boolean = null
	private scroll_bol:boolean = null
	private rank_list = null
	constructor()
	{
		super();
		this.rank_list = new Array;
		this.rank_begin = 0;
		this.rank_end = 50;
		this.icon_width = 70;
		this.icon_height = 70;
		this.rank_record = true;
		this.scroll_move_bol = false;
		this.scroll_bol = true;
	}
	//测试数据
	public addRankData(){
		var count = 10;
		var myInfo = UserMgr.getInstance().getMyInfo();
		for (let i = this.rank_begin; i< this.rank_begin + count ; i++){
			this.rank_list [i] = {
				index : i + 1,						//排行名次
				id : 1,								//玩家ID
				icon : myInfo.headid,							//这是个icon
				url_icon : myInfo.headurl,							//这是个icon
			}
		}
	}

	public getRankBegin(){
		return this.rank_begin;
	}
	public setRankBegin(num){
		this.rank_begin = num;
	}
	public getRankEnd(){
		return this.rank_end;
	}

	public setRankRecord(state){
		this.rank_record = state;
	}
	public getRankRecord(){
		return this.rank_record;
	}

	public setBolScroll(state){
		this.scroll_bol = state;
	}
	public getBolScroll(){
		return this.scroll_bol;
	}

	public setBolScrollMove(state){
		this.scroll_move_bol = state;
	}
	public getBolScrollMove(){
		return this.scroll_move_bol;
	}

	public getRankData(){
		return this.rank_list;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
    ui={
		node_rankOpen:null,
		node_rankView:null,
		node_rankList:null,
		spriteFrame_rank1:null,
		spriteFrame_rank2:null,
		spriteFrame_rank3:null,	
		rank_pos:null,
		rank_size:null,
		rank_icon_size:null,
    };	
	//初始化ui
	initUi()
	{
		this.ui.node_rankOpen = ctrl.node_rankOpen;
		this.ui.node_rankView = ctrl.node_rankView;
		this.ui.node_rankList = ctrl.node_rankList;
		this.ui.spriteFrame_rank1 = ctrl.spriteFrame_rank1;
		this.ui.spriteFrame_rank2 = ctrl.spriteFrame_rank2;
		this.ui.spriteFrame_rank3 = ctrl.spriteFrame_rank3;
		this.ui.rank_pos = ctrl.rank_pos;
		this.ui.rank_size = ctrl.rank_size;
		this.ui.rank_icon_size = ctrl.rank_icon_size;
	}

	public addRankPlayer(i, icon, url){
		let curNode:cc.Node = new cc.Node();
		let curPprite = curNode.addComponent(cc.Sprite);
		curNode.parent = this.ui.node_rankList;
		//UiMgr.getInstance().setUserHead(curNode, icon, url);
		//"resources/Icons/img_mrtx_1.png"
		cc.loader.loadRes('Icons/img_mrtx_1', cc.SpriteFrame, (err, spriteFrame:cc.SpriteFrame)=> { 
			if(err){
				cc.error(err) 
			}else{
                if(cc.isValid(curPprite) && curPprite) {
					curPprite.spriteFrame = spriteFrame;
					curNode.width = this.ui.rank_icon_size.width;
					curNode.height = this.ui.rank_icon_size.height;
				}
			} 
		}); 
        //特殊排行特殊判定
		if (i <= 3){
			let picNode:cc.Node = new cc.Node();
			picNode.addComponent(cc.Sprite);
			picNode.parent = curNode;
			picNode.position = cc.p(this.ui.rank_pos.x, this.ui.rank_pos.y);
			let picSprite = picNode.getComponent(cc.Sprite);
			if (i == 1){
				picSprite.spriteFrame = this.ui.spriteFrame_rank1
			}else if (i == 2){
				picSprite.spriteFrame = this.ui.spriteFrame_rank2
			}else if (i == 3){
				picSprite.spriteFrame = this.ui.spriteFrame_rank3
			}
			picNode.width = this.ui.rank_size.width;
			picNode.height = this.ui.rank_size.height;
		}
		return curNode;
	}

	public setRankHeight(count){
		let layout = this.ui.node_rankList.getComponent(cc.Layout),
			height = layout.paddingTop + layout.paddingBottom;

		this.ui.node_rankList.height = height - layout.spacingY + count * (this.ui.rank_icon_size.height + layout.spacingY);
	}
	
	public refreshRank(){
		var rank_list = this.model.getRankData()
		var itemNum = rank_list.length;
		this.setRankHeight(itemNum);
		var begin_num = this.model.getRankBegin();
        for(let i = begin_num; i < itemNum; i ++){
			var odd = rank_list[i];
			let curItemComp = this.addRankPlayer(odd.index, odd.icon, odd.url_icon);
		}
		this.model.setRankBegin(itemNum);
		this.model.setRankRecord(true); 
	}
}
//c, 控制
@ccclass
export default class RankCtrl extends BaseCtrl {
    //这边去声明ui组件
    @property(cc.Node)
	node_rankOpen:cc.Node = null

	@property(cc.Node)
	node_rankView:cc.Node = null

	@property(cc.Node)
	node_rankList:cc.Node = null

	@property(cc.SpriteFrame)
	spriteFrame_rank1:cc.SpriteFrame = null
	
	@property(cc.SpriteFrame)
	spriteFrame_rank2:cc.SpriteFrame = null

	@property(cc.SpriteFrame)
	spriteFrame_rank3:cc.SpriteFrame = null

	@property(cc.p)
	rank_pos = null;

	@property(cc.Size)
	rank_size:cc.Size = null;

	@property(cc.Size)
	rank_icon_size:cc.Size = null;

	//声明ui组件end
    //这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
		this.initMvc(Model,View); 

		this.model.addRankData();
		this.view.refreshRank();
	}

	//定义网络事件
	defineNetEvents()
	{ 
		this.n_events = {
            'http.reqMyInfo' : this.http_reqMyInfo,
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.button,this.ui.node_rankOpen,this.btn_rankOpen_cb,"点击小按钮打开排行榜");
		this.connect(G_UiType.scroll, this.ui.node_rankList, this.rank_view_cb, '切换列表内容');
	}
	//网络事件回调begin
 
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    private btn_rankOpen_cb (node, event) {
		this.start_sub_module(G_MODULE.Rank);
	}

	private http_reqMyInfo(msg){
	}
	
	private rank_view_cb(node, event){
		//console.log("rank_view_cb:"+event.type);
		if (event.type == cc.Node.EventType.TOUCH_MOVE){
			var rank_list = this.model.getRankData()
			var itemNum = rank_list.length;
			var node_height = node.height - this.ui.node_rankView.height
			if ((node_height * 0.25 * 4) < node.y
				&& this.model.getRankRecord() == true
				&& itemNum < this.model.getRankEnd()
				&& itemNum > 0) {
				this.model.setRankRecord(false); 
				this.model.addRankData();
				this.view.refreshRank();
			}
			if (this.model.getBolScrollMove()){
				this.model.setBolScroll(false);
			}
			this.model.setBolScrollMove(true)
		}
		if (event.type == cc.Node.EventType.TOUCH_END){
			if (this.model.getBolScroll() == true){
				this.start_sub_module(G_MODULE.Rank);
			}
			this.model.setBolScroll(true);
			this.model.setBolScrollMove(false);
		}
		if (event.type == cc.Node.EventType.TOUCH_CANCEL){
			this.model.setBolScroll(true);
			this.model.setBolScrollMove(false);
		}
	}
}
