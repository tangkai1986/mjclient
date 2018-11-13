/*
author: YOYO
日期:2018-02-27 11:04:09
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import CreateRoomMgr from '../../GameMgrs/CreateRoomMgr';
import BetMgr from "../../GameMgrs/BetMgr";
import RoomCostCfg from "../../CfgMgrs/RoomCostCfg";
import RoomPanel from "../../Modules/CreateRoom/Prefab_CreateRoomPanelCtrl";
import GameFreeMgr from "../../GameMgrs/GameFreeMgr";
//MVC模块,
const { ccclass, property } = cc._decorator;
const Configs_1 = {
	0: 'v_roundcount',
	1: 'v_seatcount',
	2: 'v_paytype',
	3: 'v_minChip',
	4: 'v_fullstart',
	5: 'v_settleRule',
	6: 'v_playeraddin',
	7: "v_grabbanker"
}
const Configs_2 = {
	0: "v_wuxiaoNiuLimit",
	1: "v_zhadanNiuLimit",
	2: "v_huluNiuLimit",
	3: "v_wuhuaNiuLimit",
	4: "v_tonghuaNiuLimit",
	5: "v_shunziNiuLimit",
	6: "allSelect"
}
const Configs_3 = {
	0: "v_midEnterLimit",
	1: "v_cuopaiLimit",
	2: "v_betLimit",
	//3:"v_playerbuyLimit",
	4: "v_betredoubleLimit",
	5: "v_wanglaiLimit",
	6: "allSelect"
}
const SPECIALBRAND = {
	0: "五小牛（8倍）",
	1: "炸弹牛（6倍）",
	2: "葫芦牛（6倍）",
	3: "五花牛（5倍）",
	4: "同花牛（5倍）",
	5: "顺子牛（5倍）",
	6: "",
}
const ADVANCEDOPTIONS = {
	0: "中途禁入",
	1: "禁止搓牌",
	2: "下注限制",
	//3:"闲家买码",
	4: "下注加倍",
	5: "王癞玩法",
	6: "",
}
let ctrl: Prefab_NNzyqzCreatCtrl;
//模型，数据处理
class Model extends BaseModel {
	private _roomRuleInfo = null;			//房间配置信息
	private _roomcfg = null;
	private v_startModel = null;
	private _gameid = null;
	//private v_fullstart = null;
	private _roomCost = null;
	public isFree = null;//是否限时免费
	constructor() {
		super();
		this.isFree = GameFreeMgr.getInstance().isFree(19)
		BetMgr.getInstance().setGameId(19);
		this._gameid = BetMgr.getInstance().getGameId();
		this._roomRuleInfo = CreateRoomMgr.getInstance().getRoomRuleInfo(this._gameid);	//2 牛牛配置
		this._roomCost = RoomCostCfg.getInstance().getRoomCost('mpnn', 0, this._roomRuleInfo.v_roundcount, this._roomRuleInfo.v_seatcount, this._roomRuleInfo.v_paytype);
		this._roomcfg = {
			v_roundcount: [10, 20],
			v_seatcount: [6, 8],
			v_paytype: [0, 1, 2],
			v_minChip: [0, 1, 2, 3],
			v_fullstart: [0, 4, 5, 6],
			v_settleRule: [0, 1],
			v_playeraddin: [0, 5, 10, 20],
			v_grabbanker: [1, 2, 3, 4]
		}
		if (this._roomRuleInfo.v_seatcount == 6) { this._roomcfg.v_fullstart = [0, 4, 5, 6] }
		else if (this._roomRuleInfo.v_seatcount == 8) { this._roomcfg.v_fullstart = [0, 6, 7, 8] }
		this.v_startModel = [0, 1, 1, 1];
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView {
	private _dorpDownBoxLabel: null;
	private _Prefab_advancedOptions: any = null;
	ui = {
		//在这里声明ui
		ToggleBtn: null,
		ToggleCheckBtn: null,
		Toggle: null,
		ToggleCheck: null,
		Zixun: null,
		RoomCost: null,
		CostTitle: null,
		Prefab_AdvancedOptions: null,
	};
	node = null;
	constructor(model) {
		super(model);
		this.node = ctrl.node;
		this.initUi();
		this.initAdvancedOptions();
		this.initToggle(this.model._roomRuleInfo);
		this.initToggleCheck(this.model._roomRuleInfo);
		this.refreshFangfei(this.model._roomCost);
		this.changeFullStart();
	}
	//初始化ui
	initUi() {
		this.ui.Prefab_AdvancedOptions = ctrl.Prefab_AdvancedOptions;
		this.ui.CostTitle = ctrl.CostTitle;
		this.ui.ToggleBtn = ctrl.ToggleBtn;
		this.ui.ToggleCheckBtn = ctrl.ToggleCheckBtn;
		this.ui.Toggle = ctrl.Toggle;
		this.ui.ToggleCheck = ctrl.ToggleCheck;
		this.ui.Zixun = ctrl.ZiXun;
		this.ui.RoomCost = ctrl.RoomCost;
		this.ui.RoomCost.parent.active = !this.model.isFree;
	}
	initAdvancedOptions() {
		this._Prefab_advancedOptions = cc.instantiate(this.ui.Prefab_AdvancedOptions);
		this._Prefab_advancedOptions.parent = this.node.parent.parent;
		this._Prefab_advancedOptions.position = cc.p(10, 20);
		this._Prefab_advancedOptions.active = false;
	}
	//刷新房费
	refreshFangfei(roomCost) {
		this.ui.RoomCost.getComponent(cc.Label).string = roomCost;
		this.updatePayLabel(this.model._roomRuleInfo.v_paytype);
		if(this.model.isFree) roomCost = 0;
		CreateRoomMgr.getInstance().setProperty(roomCost, 'roomRuleInfo', this.model._gameid, 'v_fangfei');
	}
	updatePayLabel(value) {
		switch (value) {
			case 0: this.ui.CostTitle.getComponent(cc.Label).string = '首局结算时房主支付'; break;
			case 1: this.ui.CostTitle.getComponent(cc.Label).string = '首局结算时所有玩家各支付'; break;
			case 2: this.ui.CostTitle.getComponent(cc.Label).string = '总结算时赢家按比例共支付'; break;
		}
	}
	initCheckState(groupChildren, btnChildren, toggleName) {
		let data = this.model._roomcfg[toggleName];
		let value = this.model._roomRuleInfo[toggleName];
		for (let i = 0; i < data.length; i++) {
			if (data[i] == value) {
				groupChildren.children[i].getComponent(cc.Toggle).check();
				btnChildren.children[1].getComponent(cc.Label).string = groupChildren.children[i].children[1].getComponent(cc.Label).string;
			}
		}
	}
	//初始化单选框
	initToggle(roomRuleInfo) {
		for (let key in roomRuleInfo) {
			this.model._roomRuleInfo[key] = roomRuleInfo[key];
		}
		let groups = this.ui.Toggle;
		let ToggleBtn = this.ui.ToggleBtn;
		for (let i = 0; i < groups.childrenCount; i++) {
			let groupChildren = groups.children[i].children[0];
			let btnChildren = ToggleBtn.children[i];
			this.initCheckState(groupChildren, btnChildren, Configs_1[i]);
		}
	}
	initToggleCheck(roomRuleInfo) {
		for (let key in roomRuleInfo) {
			this.model._roomRuleInfo[key] = roomRuleInfo[key];
		}
		let bool1 = true;
		let bool2 = true;
		let groups = this.ui.ToggleCheck;
		let groupChildren1 = groups.children[0];
		for (var k = 0; k < groupChildren1.childrenCount - 2; k++) {
			let value = this.model._roomRuleInfo[Configs_2[k]];
			if (value != 0) {
				groupChildren1.children[k].getComponent(cc.Toggle).check();
			} else {
				groupChildren1.children[k].getComponent(cc.Toggle).uncheck();
				bool1 = false;
			}
		}
		//是否选中全选
		if (bool1) {
			groupChildren1.getChildByName("6").getComponent(cc.Toggle).check();
		} else {
			groupChildren1.getChildByName("6").getComponent(cc.Toggle).uncheck();
		}

		let groupChildren2 = this._Prefab_advancedOptions;
		for (var k = 0; k < groupChildren2.childrenCount - 2; k++) {
			let value = this.model._roomRuleInfo[Configs_3[k]];
			if (value != 0) {
				groupChildren2.children[k].getComponent(cc.Toggle).check();
			} else {
				groupChildren2.children[k].getComponent(cc.Toggle).uncheck();
				bool2 = false;
			}
		}
		//是否选中全选
		if (bool2) {
			groupChildren2.getChildByName("6").getComponent(cc.Toggle).check();
		} else {
			groupChildren2.getChildByName("6").getComponent(cc.Toggle).uncheck();
		}
		let Label = this.ui.ToggleCheckBtn.children[0].children[1].getComponent(cc.Label);
		Label.string = ctrl.upDataSPECIALBRANDString(groupChildren1, 2);	//2，里面多了2个分割线节点 ;node.parent复选框组

		let Label2 = this.ui.ToggleCheckBtn.children[1].children[1].getComponent(cc.Label);
		Label2.string = ctrl.upDataADVANCEDOPTIONSString(groupChildren2, 2);		//1，里面多了1个分割线节点
	}
	changeFullStart() {
		let nodeIndex;
		let node = this.ui.Toggle.children[4].children[0];
		for (let i = 0; i < node.childrenCount; i++) {
			if (node.children[i].getComponent(cc.Toggle).isChecked) {
				nodeIndex = i;
				break;
			}
		}
		if (this.model._roomRuleInfo.v_seatcount <= 6) {
			node.children[1].children[1].getComponent(cc.Label).string = "满4人开桌";
			node.children[2].children[1].getComponent(cc.Label).string = "满5人开桌";
			node.children[3].children[1].getComponent(cc.Label).string = "满6人开桌";
			node.children[1].children[2].children[1].getComponent(cc.Label).string = "满4人开桌";
			node.children[2].children[2].children[1].getComponent(cc.Label).string = "满5人开桌";
			node.children[3].children[2].children[1].getComponent(cc.Label).string = "满6人开桌";
			this.model._roomcfg.v_fullstart = [0, 4, 5, 6];
			//自动开桌的标题
			this.ui.ToggleBtn.children[4].children[1].getComponent(cc.Label).string = node.children[nodeIndex].children[1].getComponent(cc.Label).string;
			CreateRoomMgr.getInstance().setProperty(this.model._roomcfg["v_fullstart"][nodeIndex], 'roomRuleInfo', this.model._gameid, 'v_fullstart');
		} else if (this.model._roomRuleInfo.v_seatcount <= 8) {
			node.children[1].children[1].getComponent(cc.Label).string = "满6人开桌";
			node.children[2].children[1].getComponent(cc.Label).string = "满7人开桌";
			node.children[3].children[1].getComponent(cc.Label).string = "满8人开桌";
			node.children[1].children[2].children[1].getComponent(cc.Label).string = "满6人开桌";
			node.children[2].children[2].children[1].getComponent(cc.Label).string = "满7人开桌";
			node.children[3].children[2].children[1].getComponent(cc.Label).string = "满8人开桌";
			this.model._roomcfg.v_fullstart = [0, 6, 7, 8];
			this.ui.ToggleBtn.children[4].children[1].getComponent(cc.Label).string = node.children[nodeIndex].children[1].getComponent(cc.Label).string;
			CreateRoomMgr.getInstance().setProperty(this.model._roomcfg["v_fullstart"][nodeIndex], 'roomRuleInfo', this.model._gameid, 'v_fullstart');
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_NNzyqzCreatCtrl extends BaseCtrl {
	//这边去声明ui组件
	private checkBoolen = null;
	@property({
		tooltip: "开启单选框组",
		type: cc.Node
	})
	ToggleBtn: cc.Node = null;

	@property({
		tooltip: "开启复选框组",
		type: cc.Node
	})
	ToggleCheckBtn: cc.Node = null;

	@property({
		tooltip: "单选框",
		type: cc.Node
	})
	Toggle: cc.Node = null;

	@property({
		tooltip: "复选框",
		type: cc.Node
	})
	ToggleCheck: cc.Node = null;

	@property({
		tooltip: '帮助',
		type: cc.Node
	})
	ZiXun: cc.Node = null;

	@property({
		tooltip: '房费',
		type: cc.Node
	})
	RoomCost: cc.Node = null;
	@property({
		tooltip: '房费标题',
		type: cc.Node
	})
	CostTitle: cc.Node = null;

	@property({
		tooltip: '高级选项',
		type: cc.Prefab
	})
	Prefab_AdvancedOptions: cc.Prefab = null;

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	onLoad() {
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model, View);
	}

	//定义网络事件
	defineNetEvents() {
	}
	//定义全局事件
	defineGlobalEvents() {
		this.g_events = {
			'RefreshTBNNRoomUi': this.RefreshTBNNRoomUi,
		}
	}
	//绑定操作的回调
	connectUi() {
		//单选组显隐的切换
		for (let i = 0; i < this.ToggleBtn.childrenCount; i++) {
			let btn_temp = this.ToggleBtn.children[i];
			let cb = () => {
				this.Togglebtn_cb(i, btn_temp);
			}
			this.connect(G_UiType.text, btn_temp, cb, "下拉单选组别按钮");
		}
		//复选按钮组显隐的切换
		this.connect(G_UiType.text, this.ToggleCheckBtn.children[0], this.ToggleCheckbtn_cb, "下拉特殊牌型组别按钮");
		this.connect(G_UiType.text, this.ToggleCheckBtn.children[1], this.ToggleCheckbtn1_cb, "下拉高级选项组别按钮");
		//单选按钮的绑定
		for (let i = 0; i < this.Toggle.childrenCount; i++) {
			let ToggleGroup = this.Toggle.children[i].children[0];
			for (let j = 0; j < ToggleGroup.childrenCount; j++) {
				let toggle = ToggleGroup.children[j];
				let cb = () => {
					this.Toggle_cb(ToggleGroup, i, j);
				}
				this.connect(G_UiType.toggle, toggle, cb, "切换单选按钮");
			}
		}
		//复选按钮的绑定
		let temp = this.ToggleCheck.children[0];
		for (let j = 0; j < temp.childrenCount - 1; j++) {
			let ToggleCheck = temp.children[j];
			let cb = () => {
				this.CheckToggle1_cb(ToggleCheck, j);
			}
			this.connect(G_UiType.toggle, ToggleCheck, cb, "切换复选按钮");
		}

		let temp1 = this.view._Prefab_advancedOptions;
		for (let j = 0; j < temp1.childrenCount; j++) {
			let ToggleCheck1 = temp1.children[j];
			let cb = () => {
				this.CheckToggle2_cb(ToggleCheck1, j);
			}
			this.connect(G_UiType.toggle, ToggleCheck1, cb, "切换复选按钮");
		}
		//绑定背景事件
		this.node.on(cc.Node.EventType.TOUCH_START, this.ClickBg, this);
		//咨询
		this.connect(G_UiType.text, this.ZiXun, this.zixun_cb, "点击咨询按钮");
	}
	start() {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin

	//end
	//按钮或任何控件操作的回调begin
	private doNothing() {

	}
	//如果已经打开的话，不让ClickBg()点击事件生效。
	//这里先执行最底层的ClickBg();.再执行该按钮的点击事件
	private boolClickBg(node) {
		//console.log("背景");
		if (!node.active) {
			this.ClickBg();
		}
	}
	private Togglebtn_cb(index, node): void {
		this.boolClickBg(this.Toggle.children[index]);
		node.children[0].active = !node.children[0].active;
		this.Toggle.children[index].active = !this.Toggle.children[index].active;
	}
	private ToggleCheckbtn_cb(): void {
		this.boolClickBg(this.ToggleCheck.children[0]);
		this.ToggleCheck.children[0].active = !this.ToggleCheck.children[0].active;
		this.ToggleCheckBtn.children[0].children[0].active = !this.ToggleCheckBtn.children[0].children[0].active;
	}
	private ToggleCheckbtn1_cb(): void {
		this.boolClickBg(this.view._Prefab_advancedOptions);
		this.view._Prefab_advancedOptions.active = !this.view._Prefab_advancedOptions.active;
		this.ToggleCheckBtn.children[1].children[0].active = !this.ToggleCheckBtn.children[1].children[0].active;
	}
	private chengeActive_cb(node): void {
		node.active = !node.active;
	}
	refFangfei() {
		let roomInfo = this.model._roomRuleInfo;
		let roomCost = RoomCostCfg.getInstance().getRoomCost('mpnn', 0, roomInfo.v_roundcount, roomInfo.v_seatcount, roomInfo.v_paytype);
		this.model._roomRuleInfo.v_fangfei = roomCost;
		this.view.refreshFangfei(roomCost);
	}
	private CloseBtn_cb(): void {
		this.finish();
	}
	onDestroy() {
		this.view._Prefab_advancedOptions.destroy();
	}
	//咨询
	private zixun_cb(): void {
		this.start_sub_module(G_MODULE.Zixun);
	}
	//点击背景关闭选项
	private ClickBg(): void {
		for (let i = 0; i < this.ToggleCheckBtn.childrenCount; i++) {
			if (this.ToggleCheckBtn.children[i].children[0].active) {
				this.ToggleCheckBtn.children[i].children[0].active = false;
			}
		}
		for (let i = 0; i < this.Toggle.childrenCount; i++) {
			if (this.Toggle.children[i].active) {
				this.Toggle.children[i].active = false;
			}
		}
		for (let i = 0; i < this.ToggleCheck.childrenCount; i++) {
			if (this.ToggleCheck.children[i].active) {
				this.ToggleCheck.children[i].active = false;
				this.ToggleCheckBtn.children[0].children[0].active = false;
			}
		}
		if (this.view._Prefab_advancedOptions.active) {
			this.view._Prefab_advancedOptions.active = false;
			this.ToggleCheckBtn.children[1].children[0].active = false;
		}
		for (let i = 0; i < this.ToggleBtn.childrenCount; i++) {
			if (this.ToggleBtn.children[i].children[0].active) {
				this.ToggleBtn.children[i].children[0].active = false;
			}
		}
		for (let i = 0; i < this.ToggleCheckBtn.childrenCount; i++) {
			if (this.ToggleCheckBtn.children[i].children[0].active) {
				this.ToggleCheckBtn.children[i].children[0].active = false;
			}
		}
	}
	private DoNothing(): void {

	}
	private UpdateString(node, string) {
		node.getComponent(cc.Label).string = string;
	}
	upDataSPECIALBRANDString(node, nunber) {
		let string = "";
		let temp = 0;
		let boolAllNoSelect = true;
		for (let i = 0; i < node.childrenCount - nunber; i++) {
			if (node.children[i].getComponent(cc.Toggle).isChecked) {
				boolAllNoSelect = false;
				temp++;
				string += SPECIALBRAND[i];
				if (temp == 3) {
					string += "\n";
				}
			}
		}
		if (boolAllNoSelect) {
			string = "无";
		}
		return string;
	}
	upDataADVANCEDOPTIONSString(node, nunber) {
		let string = "";
		let boolAllNoSelect = true;
		for (let i = 0; i < node.childrenCount - nunber; i++) {
			//目前暂无买码,所以i=3时忽略
			if (node.children[i].getComponent(cc.Toggle).isChecked && i != 3) {
				boolAllNoSelect = false;
				if (string == "") {
					string += ADVANCEDOPTIONS[i];
				} else {
					string += "            " + ADVANCEDOPTIONS[i];
				}
			}
		}
		if (boolAllNoSelect) {
			string = "无";
		}
		return string;
	}
	private Toggle_cb(node, index1, index2): void {
		node.parent.active = false;
		this.ToggleBtn.children[index1].children[0].active = false;
		//这边用来处理点击本来已经选中的单选按钮
		let roomRule
		switch (index1) {
			case 0:
				roomRule = this.model._roomRuleInfo.v_roundcount;
				break;
			case 1:
				roomRule = this.model._roomRuleInfo.v_seatcount;
				break;
			case 2:
				roomRule = this.model._roomRuleInfo.v_paytype;
				break;
			case 3:
				roomRule = this.model._roomRuleInfo.v_minChip;
				break;
			case 4:
				roomRule = this.model._roomRuleInfo.v_fullstart;
				break;
			case 5:
				roomRule = this.model._roomRuleInfo.v_settleRule;
				break;
			case 6:
				roomRule = this.model._roomRuleInfo.v_playeraddin;
				break;
			case 7:
				roomRule = this.model._roomRuleInfo.v_grabbanker;
				break;
		}
		if (this.model._roomcfg[Configs_1[index1]][index2] == roomRule) {
			node.children[index2].getComponent(cc.Toggle).isChecked = true;
			return;
		}
		let string = node.children[index2].children[1].getComponent(cc.Label).string;
		let btn_node = this.ToggleBtn.children[index1].children[1];
		this.UpdateString(btn_node, string);

		switch (Configs_1[index1]) {
			case 'v_seatcount':
				CreateRoomMgr.getInstance().setProperty(this.model._roomcfg["v_seatcount"][index2], 'roomRuleInfo', this.model._gameid, 'v_seatcount');
				this.view.changeFullStart();
				this.refFangfei();
				break;
			case "v_minChip":
				CreateRoomMgr.getInstance().setProperty(this.model._roomcfg["v_minChip"][index2], 'roomRuleInfo', this.model._gameid, 'v_minChip');
				break;
			case "v_paytype":
				CreateRoomMgr.getInstance().setProperty(this.model._roomcfg["v_paytype"][index2], 'roomRuleInfo', this.model._gameid, 'v_paytype');
				this.refFangfei();
				break;
			case "v_roundcount":
				CreateRoomMgr.getInstance().setProperty(this.model._roomcfg["v_roundcount"][index2], 'roomRuleInfo', this.model._gameid, 'v_roundcount');
				this.refFangfei();
				break;
			case "v_fullstart":
				//第一个区别说明模式开房v_startModel  第二个是满几个人开房v_fullstart
				CreateRoomMgr.getInstance().setProperty(this.model._roomcfg["v_fullstart"][index2], 'roomRuleInfo', this.model._gameid, 'v_fullstart');
				CreateRoomMgr.getInstance().setProperty(this.model.v_startModel[index2], 'roomRuleInfo', this.model._gameid, 'v_startModel');
				break;
			case "v_settleRule":
				CreateRoomMgr.getInstance().setProperty(this.model._roomcfg["v_settleRule"][index2], 'roomRuleInfo', this.model._gameid, 'v_settleRule');
				if (index2 == 0) {
					this.model._roomRuleInfo.t_niu_10 = 4;
					this.model._roomRuleInfo.t_niu_9 = 3;
					this.model._roomRuleInfo.t_niu_8 = 2;
					this.model._roomRuleInfo.t_niu_7 = 2;
				} else if (index2 == 1) {
					this.model._roomRuleInfo.t_niu_10 = 3;
					this.model._roomRuleInfo.t_niu_9 = 2;
					this.model._roomRuleInfo.t_niu_8 = 2;
					this.model._roomRuleInfo.t_niu_7 = 1;

				}
				break;
			case "v_playeraddin":
				CreateRoomMgr.getInstance().setProperty(this.model._roomcfg["v_playeraddin"][index2], 'roomRuleInfo', this.model._gameid, 'v_playeraddin');
				break;
			case "v_grabbanker":
				CreateRoomMgr.getInstance().setProperty(this.model._roomcfg["v_grabbanker"][index2], 'roomRuleInfo', this.model._gameid, 'v_grabbanker')
				break;
		}
		//console.log(this.model._roomRuleInfo)
	}
	private CheckToggle1_cb(node, index): void {		//node->复选框
		switch (Configs_2[index]) {
			case "v_shunziNiuLimit":
				if (node.getComponent(cc.Toggle).isChecked) {
					this.model._roomRuleInfo.v_shunziNiuLimit = 1;
				} else {
					this.model._roomRuleInfo.v_shunziNiuLimit = 0;
				}
				break;
			case "v_tonghuaNiuLimit":
				if (node.getComponent(cc.Toggle).isChecked) {
					this.model._roomRuleInfo.v_tonghuaNiuLimit = 1;
				} else {
					this.model._roomRuleInfo.v_tonghuaNiuLimit = 0;
				}
				break;
			case "v_wuhuaNiuLimit":
				if (node.getComponent(cc.Toggle).isChecked) {
					this.model._roomRuleInfo.v_wuhuaNiuLimit = 1;
				} else {
					this.model._roomRuleInfo.v_wuhuaNiuLimit = 0;
				}
				break;
			case "v_huluNiuLimit":
				if (node.getComponent(cc.Toggle).isChecked) {
					this.model._roomRuleInfo.v_huluNiuLimit = 1;
				} else {
					this.model._roomRuleInfo.v_huluNiuLimit = 0;
				}
				break;
			case "v_zhadanNiuLimit":
				if (node.getComponent(cc.Toggle).isChecked) {
					this.model._roomRuleInfo.v_zhadanNiuLimit = 1;
				} else {
					this.model._roomRuleInfo.v_zhadanNiuLimit = 0;
				}
				break;
			case "v_wuxiaoNiuLimit":
				if (node.getComponent(cc.Toggle).isChecked) {
					this.model._roomRuleInfo.v_wuxiaoNiuLimit = 1;
				} else {
					this.model._roomRuleInfo.v_wuxiaoNiuLimit = 0;
				}
				break;
			case "allSelect":
				if (node.getComponent(cc.Toggle).isChecked) {
					for (let i = 0; i < node.parent.childrenCount - 1; i++) {
						let temp = node.parent.children[i];
						temp.getComponent(cc.Toggle).isChecked = true;
					}
					this.model._roomRuleInfo.v_shunziNiuLimit = 1;
					this.model._roomRuleInfo.v_tonghuaNiuLimit = 1;
					this.model._roomRuleInfo.v_zhadanNiuLimit = 1;
					this.model._roomRuleInfo.v_huluNiuLimit = 1;
					this.model._roomRuleInfo.v_wuhuaNiuLimit = 1;
					this.model._roomRuleInfo.v_wuxiaoNiuLimit = 1;
				} else {
					for (let i = 0; i < node.parent.childrenCount - 1; i++) {
						let temp = node.parent.children[i];
						temp.getComponent(cc.Toggle).isChecked = false;
					}
					this.model._roomRuleInfo.v_shunziNiuLimit = 0;
					this.model._roomRuleInfo.v_tonghuaNiuLimit = 0;
					this.model._roomRuleInfo.v_zhadanNiuLimit = 0;
					this.model._roomRuleInfo.v_huluNiuLimit = 0;
					this.model._roomRuleInfo.v_wuhuaNiuLimit = 0;
					this.model._roomRuleInfo.v_wuxiaoNiuLimit = 0;
				}
				break;
			default:
				break;
		}
		let Label = this.ToggleCheckBtn.children[0].children[1].getComponent(cc.Label);
		Label.string = this.upDataSPECIALBRANDString(node.parent, 2);	//2，里面多了2个分割线节点 ;node.parent复选框组
		this.changeAllSelect(node.parent, 2);
	}
	private CheckToggle2_cb(node, index): void {
		switch (Configs_3[index]) {
			case "v_midEnterLimit":
				if (node.getComponent(cc.Toggle).isChecked) {
					this.model._roomRuleInfo.v_midEnterLimit = 1;
				} else {
					this.model._roomRuleInfo.v_midEnterLimit = 0;
				}
				break;
			case "v_cuopaiLimit":
				if (node.getComponent(cc.Toggle).isChecked) {
					this.model._roomRuleInfo.v_cuopaiLimit = 1;
				} else {
					this.model._roomRuleInfo.v_cuopaiLimit = 0;
				}
				break;
			case "v_betLimit": ;
				if (node.getComponent(cc.Toggle).isChecked) {
					this.model._roomRuleInfo.v_betLimit = 1;
				} else {
					this.model._roomRuleInfo.v_betLimit = 0;
				}
				break;
			case "v_playerbuyLimit": ;
				// if (node.getComponent(cc.Toggle).isChecked) {
				// 	this.model._roomRuleInfo.v_playerbuyLimit = 1;
				// } else {
				// 	this.model._roomRuleInfo.v_playerbuyLimit = 0;
				// }
				break;
			case "v_betredoubleLimit": ;
				if (node.getComponent(cc.Toggle).isChecked) {
					this.model._roomRuleInfo.v_betredoubleLimit = 1;
				} else {
					this.model._roomRuleInfo.v_betredoubleLimit = 0;
				}
				break;
			case "v_wanglaiLimit":
				if (node.getComponent(cc.Toggle).isChecked) {
					this.model._roomRuleInfo.v_wanglaiLimit = 1;
				} else {
					this.model._roomRuleInfo.v_wanglaiLimit = 0;
				}
				break;
			case "allSelect":
				if (node.getComponent(cc.Toggle).isChecked) {
					for (let i = 0; i < node.parent.childrenCount - 1; i++) {
						let temp = node.parent.children[i];
						temp.getComponent(cc.Toggle).isChecked = true;
					}
					this.model._roomRuleInfo.v_midEnterLimit = 1;
					this.model._roomRuleInfo.v_cuopaiLimit = 1;
					this.model._roomRuleInfo.v_wanglaiLimit = 1;
					this.model._roomRuleInfo.v_betLimit = 1;
					this.model._roomRuleInfo.v_betredoubleLimit = 1;
				} else {
					for (let i = 0; i < node.parent.childrenCount - 1; i++) {
						let temp = node.parent.children[i];
						temp.getComponent(cc.Toggle).isChecked = false;
					}
					this.model._roomRuleInfo.v_midEnterLimit = 0;
					this.model._roomRuleInfo.v_cuopaiLimit = 0;
					this.model._roomRuleInfo.v_wanglaiLimit = 0;
					this.model._roomRuleInfo.v_betLimit = 0;
					this.model._roomRuleInfo.v_betredoubleLimit = 0;
				}
				break;
			default:
				break;
		}
		let Label = this.ToggleCheckBtn.children[1].children[1].getComponent(cc.Label);
		Label.string = this.upDataADVANCEDOPTIONSString(node.parent, 1);		//1，里面多了1个分割线节点
		this.changeAllSelect(node.parent, 1);
	}
	changeAllSelect(node, number) {
		let isAllSelect = true;
		for (let i = 0; i < node.childrenCount - number; i++) {
			if (!node.children[i].getComponent(cc.Toggle).isChecked) {
				isAllSelect = false;
			}
		}
		if (isAllSelect) {
			node.getChildByName("6").getComponent(cc.Toggle).isChecked = true;
		} else {
			node.getChildByName("6").getComponent(cc.Toggle).isChecked = false;
		}
	}
	RefreshTBNNRoomUi() {
		// let gameId = BetMgr.getInstance().getGameId()
		// let commonRule = CreateRoomMgr.getInstance().getCommonRule(gameId)
		// let index = CreateRoomMgr.getInstance().getEditItemIndex();
		// //初始化页面
		// if (commonRule[index].ruleInfo) {
		// 	this.view.initPage1(commonRule[index].ruleInfo);
		// 	this.view.initPage2(commonRule[index].ruleInfo);
	}
}
	//end
