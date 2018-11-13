/*
author: JACKY
日期:2018-02-09 14:31:48
*/
import BaseCtrl from "../../Plat/Libs/BaseCtrl";
import BaseView from "../../Plat/Libs/BaseView";
import BaseModel from "../../Plat/Libs/BaseModel";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";  
import { MahjongDef } from "./MahjongDef";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : MahjongOpAniCtrl;
//模型，数据处理
class Model extends BaseModel{
	mahjongResMgr=RoomMgr.getInstance().getResMgr();
	mahjongLogic=RoomMgr.getInstance().getLogic();
	mahjongDef=RoomMgr.getInstance().getDef();
	mahjongAudio=RoomMgr.getInstance().getAudio();
	mahjongCards=this.mahjongLogic.getInstance().getMahjongCards();	
	constructor()
	{
		super();
	}
	getHuType(seatId)
	{
		let hutype=null;
		let player=this.mahjongLogic.getInstance().players[seatId];
		let pai=player.handcard.concat();
		pai.sort();
		let yise = player.getyise();
		let bejinlong = null;
		if(this.mahjongLogic.getInstance().prop.get_b_jinlong)
		{
			bejinlong = this.mahjongLogic.getInstance().prop.get_b_jinlong();
		}
		let huinfo=this.mahjongCards.IsHu(pai,yise,bejinlong);
		if(!huinfo)
		{
			return null;
		}
		return huinfo.hutype;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	private anim_list;
	public node_bg = null;
	public node_anim = null;
	ui={
		//在这里声明ui
		// spriteAtlas:null
		ligtnEffects:[],
		hubaozhaeffect:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node; 
		// this.ui.spriteAtlas = ctrl.spriteAtlas;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		if(this.node.getChildByName("bg")&&this.node.getChildByName("bg").getChildByName("sysy")) {
			this.ui.ligtnEffects.push(this.node.getChildByName("bg").getChildByName("sysy").getChildByName("effect0"));
			this.ui.ligtnEffects.push(this.node.getChildByName("bg").getChildByName("sysy").getChildByName("effect1"));
			this.ui.ligtnEffects.push(this.node.getChildByName("bg").getChildByName("sysy").getChildByName("effect2"));
			this.ui.ligtnEffects.push(this.node.getChildByName("bg").getChildByName("sysy").getChildByName("effect3"));
		}
		if(this.model.mahjongCards.getCardCount()==13&&this.node.getChildByName("bg")&&this.node.getChildByName("bg").getChildByName("hubaozha")) {
			this.ui.hubaozhaeffect = this.node.getChildByName("bg").getChildByName("hubaozha");
			let hubaozhaPos = this.ui.hubaozhaeffect.getPosition();
			this.ui.hubaozhaeffect.setPosition(cc.p(hubaozhaPos.x-100,hubaozhaPos.y));
		}
	}

	//播放不同动画
	runAnimByIndex(index){
		////console.log("runAnimByIndex");		
		// this.node.getComponent(cc.Animation).play(index);
		let anim = this.node.getComponent(cc.Animation).getClips()[index];
		this.node.getComponent(cc.Animation).play(anim.name);
		this.node.getComponent(cc.Animation).on('play',()=>{this.node.active = true;} , this);
		this.node.getComponent(cc.Animation).on('finished',()=>{this.node.active = false;} , this);
	}
	//显示出牌动画 0-3 南东北西 4个座位
	runChuPai(seatId){
		//自己不显示动作
		if(seatId==0)return;
		// this.node_anim.getComponent(cc.Sprite).spriteFrame = this.ui.spriteAtlas.getSpriteFrame(anim_name);
	}
}
//c, 控制
@ccclass
export default class MahjongOpAniCtrl extends BaseCtrl {
	//这边去声明ui组件
	
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
		this.n_events={
			//网络消息监听列表	
			onOp:this.onOp,    
			onSeatChange:this.onSeatChange, 
			onProcess:this.onProcess, 		
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {	
		
	}
	//网络事件回调begin
	onOp(msg){
		let viewSeatId = RoomMgr.getInstance().getViewSeatId(msg.opseatid);
 
		//判断出牌
		if(MahjongDef.op_cfg[msg.event] == MahjongDef.op_chupai) {
			this.view.runChuPai(viewSeatId);			
		}

		//判断吃碰杠听胡
		if(this.node.name !=`op_anim${viewSeatId}`){
			//////console.log(`${this.node.name}!=op_anim${seatId}`)
			return;
		}
		////console.log(`${this.node.name}==op_anim${viewSeatId}`)
		
		let op=MahjongDef.op_cfg[msg.event]
		////console.log("hutime",msg.event);
		////console.log("hutime",op);
		let index = 0;
		switch(op){
			case MahjongDef.op_chi:
			index = 0;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_peng:
			index = 1;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_gang:
			index = 2;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_angang:
			index = 2;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_hu:
			index = 3;
				let hutype=this.model.getHuType(msg.opseatid);
				switch(hutype)
				{
					case MahjongDef.hutype_hunyise:
					index = 21;
					break;
					case MahjongDef.hutype_qingyise:
					index = 20;
					break;
					case MahjongDef.hutype_jinque:
					index = 23;
					break;
					case MahjongDef.hutype_jinlong:
					index = 22;
					break;
				}
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_zimo:
				let hutype=this.model.getHuType(msg.opseatid);
				switch(hutype)
				{
					case MahjongDef.hutype_131:
					index = 15;
					break;
					case MahjongDef.hutype_hunyise:
					index = 21;
					break;
					case MahjongDef.hutype_qingyise:
					index = 20;
					break;
					case MahjongDef.hutype_jinque:
					index = 23;
					break;
					case MahjongDef.hutype_jinlong:
					index = 22;
					break;
					default:
					index = 4;
					break;
				}
				////console.log("op_zimo",hutype,index);
				this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_sanjindao:
			this.showCertainNumEffect(msg);
			index = 5;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_qianggang_hu:
			index = 6;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_danyou:
			this.showCertainNumEffect(msg);
			index = 7;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_shuangyou:
			this.showCertainNumEffect(msg);
			index = 8;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_sanyou:
			this.showCertainNumEffect(msg);
			index = 9;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_bazhanghua:
			this.showCertainNumEffect(msg);
			index = 10;
			this.view.runAnimByIndex(index);
			break;			
			case MahjongDef.op_gaibaoqiangjin:
			index = 13;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_qiangjinhu:
			index = 14;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_tianhu:
			index = 16;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_sijindao:
			this.showCertainNumEffect(msg);
			index = 17;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_wujindao:
			this.showCertainNumEffect(msg);
			index = 18;
			this.view.runAnimByIndex(index);
			break;
			case MahjongDef.op_liujindao:
			this.showCertainNumEffect(msg);
			index = 19;
			this.view.runAnimByIndex(index);
			break;
			default:
			////console.log('#error op_anim op is error');
			break;
		}
		 
	}
	showCertainNumEffect(msg)
	{
		////console.log("mahjongOpani",msg,Math.ceil(this.model.mahjongLogic.getInstance().players[msg.opseatid].handcard.length/5));
		let maxGroupNum = this.model.mahjongLogic.getInstance().players[msg.opseatid].handcard.length/5;
		for (let i = 0; i < 4; ++i) {
			if(i<=maxGroupNum) {
				this.ui.ligtnEffects[i].active=true;
			}
			else
				this.ui.ligtnEffects[i].active=false;
		}
	}
	onSeatChange(msg)
	{
		////console.log("onSeatChange",msg);		
		let viewSeatId = RoomMgr.getInstance().getViewSeatId(msg.curseat);
		if(this.node.name !=`op_anim${viewSeatId}`){
			return;
		}
		////console.log("onProcess",msg.process,MahjongDef.process_buhua);
		if (msg.needbupai&&msg.huaarr.length>0){
			this.view.runAnimByIndex(11);
		}
	}
	onProcess(msg){
		if (msg.process==MahjongDef.process_buhua){ 
			let viewSeatId = this.node.name.substring(this.node.name.length-1,this.node.name.length)
			let logicseatId = RoomMgr.getInstance().getLogicSeatId(viewSeatId);
			if(logicseatId==undefined || logicseatId==null)
				return;
			////console.log("logicseatId",viewSeatId,logicseatId,this.node.name);
			if(msg.huapaiarr[parseInt(logicseatId)].length>0)
			{
				this.view.runAnimByIndex(11);
			}
        }
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}