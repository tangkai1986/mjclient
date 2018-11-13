/*
author: YOYO
日期:2018-01-12 14:50:18
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import GoodsCfg from "../../CfgMgrs/GoodsCfg";
import UiMgr from "../../GameMgrs/UiMgr";
import GameCateCfg from "../../CfgMgrs/GameCateCfg";
import ServerMgr from "../../../AppStart/AppMgrs/ServerMgr";
import GameHelpCfg from "../../CfgMgrs/GameHelpCfg";
import BetMgr from "../../GameMgrs/BetMgr";
import { SssDef } from "../../../Games/Sss/SssMgr/SssDef";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_RuleCtrl;

//模型，数据处理
class Model extends BaseModel{
	private gameID = null
	private gamenames = null
	private gameIndex:number = null
	private titleIndex:number = null
	private left_gap:number = null
	private games:any = null
	private gamehelpcfgs=null;
	private selRecord={};//选择标题的记录
	top_list = null
	constructor()
	{
		super();
		this.gameID = BetMgr.getInstance().getGameId()
		this.games = GameCateCfg.getInstance().getGames();
		this.gamehelpcfgs=GameHelpCfg.getInstance().getCfg();
		this.gamenames = new Array();
		this.top_list = new Array();
		this.gameIndex = 0;
		this.titleIndex = 0;
		this.left_gap = 3;

		//测试数据
		this.addLeftIdList()
	}
	public addLeftIdList(){
		for (let i = 0; i < this.games.length; i++){
			this.gamenames.push(this.games[i]);
			this.selRecord[i]=0;
		}
	}
	public getGameNames(){
		return this.gamenames;
	}
	public setGameIndex(index){
		this.gameIndex = index;
		// this.titleIndex=this.selRecord[index]
	 
	}
	public getGameIndex(){
		return this.gameIndex;
	}
	public setTitleIndex(index){
		this.titleIndex = index;
		this.selRecord[this.gameIndex]=index
	}
	public getTitleIndex(){
		return this.titleIndex;
	}
	public getLeftListGap(){
		return this.left_gap;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	private gameid:null;
	ui={
        //在这里声明ui
		node_left_btns:null,
		node_top_btns:null,
		web_down_content:null,
		node_close_btn:null,
		node_btn_gap:null,
		lbl_titles:[],//栏目标题 
		lbl_titles2:[],
		btn_titles:[],//栏目按钮
		btn_games:[],//游戏名字按钮
		togglegroup:null,//标题切换标签
		
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
		this.ui.node_left_btns = ctrl.node_left_btns;
		this.ui.node_top_btns = ctrl.node_top_btns;
		this.ui.web_down_content = ctrl.web_down_content;
		this.ui.node_close_btn = ctrl.node_close_btn;
		this.ui.node_btn_gap = ctrl.node_btn_gap;
		let node_list = this.ui.node_top_btns.children;
		let node_count = this.ui.node_top_btns.childrenCount;
		this.ui.togglegroup=this.ui.node_top_btns.getComponent(cc.ToggleGroup);
		//将按钮节点元素添加到列表中
		for(let i=0;i<node_count;++i)
		{
			let node=node_list[i];
			this.ui.btn_titles.push(node);
			node.active=false;
			let lbl_title1=node.getChildByName('Background').getChildByName('lbl_title').getComponent(cc.Label);
			let lbl_title2=node.getChildByName('img_checkmark').getChildByName('lbl_title').getComponent(cc.Label);
			this.ui.lbl_titles.push(lbl_title1); 
			this.ui.lbl_titles2.push(lbl_title2)
		}
		this.addLeftClickBtn();
		if(this.model.gameID){
			for(let i= 0; i<this.model.games.length;i++){
				if(this.model.gameID == this.model.games[i].id){
					this.model.setGameIndex(i);
					this.ui.btn_games[i].getComponent(cc.Toggle).check();
				}
			}
		}
		this.updateTitles();
		this.refreshContentVisible();
		this.initWebView();
	}

	//禁止IOS上网页的拖动回弹效果
	private initWebView(){
		if(cc.sys.os == cc.sys.OS_IOS && this.ui.web_down_content.setBounces!= null){
			this.ui.web_down_content.setBounces(false);
		}
	}

	private refreshContentVisible(){
		var ruleType = this.model.getTitleIndex();
		let gameIndex = this.model.getGameIndex(); 
		let game=this.model.games[gameIndex];
		let cfg=this.model.gamehelpcfgs[game.code] ;
		if(!cfg)
		{
			return;
		}
		if(ruleType>(cfg.length-1)) {
			ruleType=0;
			this.ui.btn_titles[0].getComponent(cc.Toggle).check();
			this.model.setTitleIndex(ruleType);
		}
		//console.log("ruleType(顶部列表)", ruleType);
		let url=ServerMgr.getInstance().getGameRuleUrl(game.code,ruleType+1);
				//console.log("url",url);
		this.ui.web_down_content.url = url 
	}
	//动态加载左边的按钮（根据服务端数据id,目前用测试数据）
	public addLeftClickBtn(){
		let gamenames = this.model.getGameNames();
		this.setRankHeight(gamenames.length);
		for (let i = 0; i <gamenames.length; i++){
			//创建BUTTON 控件
			let curNode:cc.Node = cc.instantiate(this.ui.node_btn_gap);
			curNode.parent = this.ui.node_left_btns;
			curNode.x = 0;
			curNode.active = true;
			//创建控件上的文字（到时可替换成贴图）
			let label_node1 = curNode.getChildByName('Background').getChildByName("Label");
			let label_node2 = curNode.getChildByName('checkmark').getChildByName("Label");
			let label_text1 = label_node1.getComponent(cc.Label);
			let label_text2 = label_node2.getComponent(cc.Label)
			label_text1.string = gamenames[i].name; 
			label_text2.string = gamenames[i].name;
			this.ui.btn_games.push(curNode);
		}
	}
	//设置右边拖动条
	public setRankHeight(count){
		let size_btn = this.ui.node_btn_gap;
		let height = count * (size_btn.height + this.model.getLeftListGap());
		if (this.ui.node_left_btns.height <height )
			this.ui.node_left_btns.height = height;
	}
	private updateTitles(){
		let gameIndex = this.model.getGameIndex(); 
		let game=this.model.games[gameIndex];
		let cfg=this.model.gamehelpcfgs[game.code] 
		//console.log("updateTitles",gameIndex,game);
		for(let i = 0;i<this.ui.btn_titles.length;++i)
		{
			this.ui.btn_titles[i].active=false;
		}
		if(!cfg)
		{
			return;
		}
		let selIndex=this.model.selRecord[gameIndex]
		for(let i = 0; i < cfg.length; i ++){
			this.ui.btn_titles[i].active=true;
			this.ui.lbl_titles[i].string=cfg[i].name;
			this.ui.lbl_titles2[i].string=cfg[i].name;
		}
        //console.log("方法=",this.ui.togglegroup);
	}
 
}
//c, 控制
@ccclass
export default class Prefab_RuleCtrl extends BaseCtrl {
	//这边去声明ui组件

    @property(cc.Node)
	node_left_btns:cc.Node = null
	
	@property(cc.Node)
	node_top_btns:cc.Node = null
	
	@property(cc.WebView)
	web_down_content:cc.WebView = null
	
	@property(cc.Node)
	node_close_btn:cc.Node = null
	
	@property(cc.Node)
    node_btn_gap:cc.Node = null

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
			"onProcess": this.onProcess,
			'onStartGame':this.onStartGame,   
			"onDissolutionRoom": this.onDissolutionRoom,
			onGameFinished:this.onGameFinished,
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.button, this.ui.node_close_btn, this.node_close_cb, '关闭界面');
 
        for(let i = 0; i < this.ui.btn_titles.length; i++){
			let btn_title = this.ui.btn_titles[i];
            this.connect(G_UiType.button, btn_title, (node, event)=>{
				let index = i;
				this.ruleTitleCb(index, node, event);
			}, '点击顶部控件'+i);
		}
		
		for(let i = 0; i < this.ui.btn_games.length; i++){
			let btn_game = this.ui.btn_games[i];
			this.connect(G_UiType.button, btn_game, (node, event)=>{
				let index = i; 
				this.gameNameCb(index, node, event);
			}, '点击左边控件'+i);
		}
	}
 

	start () {
		
	}

	public setTypeIndex(index){
		this.model.setTitleIndex(index);
		this.view.refreshContentVisible();
		//this.view.setLeftClickIndex();
	}
	//网络事件回调begin
	onProcess(msg) {
		if (msg.process == SssDef.process_peipai&&this.model!=null&&this.model!=undefined&&this.model.gameIndex!=0) {
			this.finish();	
		}else if(msg.process == SssDef.process_gamesettle&&this.model!=null&&this.model!=undefined&&this.model.gameIndex!=0){
			this.finish();
		}
	}
	onStartGame(msg) { 
		if(this.model!=null&&this.model!=undefined&&this.model.gameIndex!=0){
			this.finish(); 
		}
	}
	onDissolutionRoom(msg) {
		if(msg.result&&this.model!=null&&this.model!=undefined&&this.model.gameIndex!=0) {
			this.finish();
		}
	}
	onGameFinished(msg)
	{  
		if(this.model!=null&&this.model!=undefined&&this.model.gameIndex!=0){
			this.finish(); 
		} 
	}
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
	public node_close_cb(node, event){
		//console.log('node_close_cb')
		this.finish();
	}

	public gameNameCb(index, node, event){
		//console.log('gameNameCb'+index);
		this.model.setGameIndex(index);
		this.view.updateTitles();
		this.view.refreshContentVisible();
	}
	public ruleTitleCb(index, node, event){
		//console.log('ruleTitleCb:'+index);
		this.model.setTitleIndex(index); 
		this.view.refreshContentVisible();
	}
	//end
	onDestroy(){
	}
}