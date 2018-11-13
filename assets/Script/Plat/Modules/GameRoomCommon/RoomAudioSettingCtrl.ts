import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";
import LogMgr from "../../GameMgrs/LogMgr";
import SettingMgr from "../../GameMgrs/SettingMgr"; 
import AudioMgr from "../../GameMgrs/AudioMgr";
import GameAudioCfg from "../../CfgMgrs/GameAudioCfg";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_MusicSettingCtrl;
//模型，数据处理
class Model extends BaseModel{
	musicSettingInfo:any = null
	private totalVolume = 100
	private yySliderValue = 0
	constructor()
	{
		super();
		this.musicSettingInfo = SettingMgr.getInstance().getMusicInfo();
		//console.log("musicSettingInfo",this.musicSettingInfo);
	}
	getPercent(type){
		switch (type) {
			case 'music':
				return this.musicSettingInfo.musicVolume/this.totalVolume;
			case 'effect':
				return this.musicSettingInfo.effectVolume/this.totalVolume;
			case 'yy':
				return this.musicSettingInfo.yyVolume/this.totalVolume;
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		//音乐ui
		button_MusicSwitch:null,
		node_MusicVolume:null,
		node_MusicVolume_Progress:null,
		button_MusicVolumeHandle:null,
		//音效ui
		button_EffectSwitch:null,
		node_EffectVolume:null,
		node_EffectVolume_Progress:null,
		button_EffectVolumeHandle:null,
		//语音ui
		button_yySwitch:null,
		node_yyVolume:null,
		node_yyVolume_Progress:null,
		button_yyVolumeHandle:null,
		//
		button_TipSwitch:null,
		button_TopolectSwitch:null,
	};
	private node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi(); 
	}
	//初始化ui
	initUi()
	{
		this.initMusicControlUi();
		this.initEffectControlUi();
		this.initYyControlUi();
		this.ui.button_TipSwitch = ctrl.TipSwitch;
		this.ui.button_TopolectSwitch = ctrl.TopolectSwitch;
		this.ui.button_TipSwitch.getComponent(cc.Toggle).isChecked = this.model.musicSettingInfo.bTipSwitch;
		this.ui.button_TopolectSwitch.getComponent(cc.Toggle).isChecked = this.model.musicSettingInfo.bTopolectSwitch;
	}
	initMusicControlUi(){
		let bMusicSwitch = this.model.musicSettingInfo.bMusicSwitch;
		this.ui.button_MusicSwitch = ctrl.MusicSwitch;
		this.ui.node_MusicVolume = ctrl.MusicVolume;
		this.ui.node_MusicVolume_Progress = ctrl.MusicVolumeProgress;
		this.ui.button_MusicSwitch.getComponent(cc.Toggle).isChecked = bMusicSwitch;
		this.ui.node_MusicVolume.getComponent(cc.Slider).progress = bMusicSwitch ? this.model.getPercent('music') : 0;
		this.ui.node_MusicVolume_Progress.progress = bMusicSwitch ? this.model.getPercent('music') : 0;
		this.ui.node_MusicVolume.getComponent(cc.Slider).enabled = bMusicSwitch;
		this.ui.node_MusicVolume_Progress.enabled = bMusicSwitch;
}
	initEffectControlUi(){
		let bEffectSwitch = this.model.musicSettingInfo.bEffectSwitch;
		this.ui.button_EffectSwitch = ctrl.EffectSwitch;
		this.ui.node_EffectVolume = ctrl.EffectVolume;
		this.ui.node_EffectVolume_Progress = ctrl.EffectVolumeProgress;
		this.ui.button_EffectSwitch.getComponent(cc.Toggle).isChecked = bEffectSwitch;
		this.ui.node_EffectVolume.getComponent(cc.Slider).progress = bEffectSwitch ? this.model.getPercent('effect') : 0;
		this.ui.node_EffectVolume_Progress.progress = bEffectSwitch ? this.model.getPercent('effect') : 0;
		this.ui.node_EffectVolume.getComponent(cc.Slider).enabled = bEffectSwitch;
		this.ui.node_EffectVolume_Progress.enabled = bEffectSwitch;
	}
	initYyControlUi(){
		let bYySwitch = this.model.musicSettingInfo.bYySwitch;
		this.ui.button_yySwitch = ctrl.yySwitch;
		this.ui.node_yyVolume = ctrl.yyVolume;
		this.ui.node_yyVolume_Progress = ctrl.yyVolumeProgress;
		this.ui.button_yySwitch.getComponent(cc.Toggle).isChecked = bYySwitch;
		this.ui.node_yyVolume.getComponent(cc.Slider).progress = bYySwitch ? this.model.getPercent('yy') : 0;
		this.ui.node_yyVolume_Progress.progress = bYySwitch ? this.model.getPercent('yy') : 0;
		this.ui.node_yyVolume.getComponent(cc.Slider).enabled = bYySwitch;
		this.ui.node_yyVolume_Progress.enabled = bYySwitch;
	}
}
//c, 控制
@ccclass
export default class Prefab_MusicSettingCtrl extends BaseControl {
	//这边去声明ui组件
	//音乐开关组件
	@property({
		tooltip : "音乐开关",
		type : cc.Node
	})
	MusicSwitch : cc.Node = null;

	@property({
		tooltip : "音量控制条",
		type : cc.Node
	})
	MusicVolume : cc.Node = null;

	@property({
		tooltip : "音量进度条",
		type : cc.ProgressBar
	})
	MusicVolumeProgress : cc.ProgressBar = null;

	//音效开关组件
	@property({
		tooltip : "音效开关",
		type : cc.Node
	})
	EffectSwitch : cc.Node = null;

	@property({
		tooltip : "音效音量控制条",
		type : cc.Node
	})
	EffectVolume : cc.Node = null;

	@property({
		tooltip : "音效音量进度条",
		type : cc.ProgressBar
	})
	EffectVolumeProgress : cc.ProgressBar = null;

	//语音开关组件
	@property({
		tooltip : "语音开关",
		type : cc.Node
	})
	yySwitch : cc.Node = null;

	@property({
		tooltip : "语音音量控制条",
		type : cc.Node
	})
	yyVolume : cc.Node = null;

	@property({
		tooltip : "语音音量进度条",
		type : cc.ProgressBar
	})
	yyVolumeProgress : cc.ProgressBar = null;

	@property({
		tooltip : "提示音开关",
		type : cc.Node
	})
	TipSwitch : cc.Node = null;

	@property({
		tooltip : "方言开关",
		type : cc.Node
	})
	TopolectSwitch : cc.Node = null;

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
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
		
		this.connect(G_UiType.toggle, this.ui.button_MusicSwitch, this.SwitchCB, '切换音乐开关设置');
		this.connect(G_UiType.slider, this.ui.node_MusicVolume, this.VolumeCB, '切换音乐音量大小设置');
		
		this.connect(G_UiType.toggle, this.ui.button_EffectSwitch, this.SwitchCB, '切换音效开关设置');
		this.connect(G_UiType.slider, this.ui.node_EffectVolume, this.VolumeCB, '切换音效音量大小设置');

		this.connect(G_UiType.toggle, this.ui.button_yySwitch, this.SwitchCB, '切换语音开关设置');
		this.connect(G_UiType.slider, this.ui.node_yyVolume, this.VolumeCB, '切换语音音量大小设置');

		this.connect(G_UiType.toggle, this.ui.button_TipSwitch, this.SwitchCB, '切换提示音开关设置');
		this.connect(G_UiType.toggle, this.ui.button_TopolectSwitch, this.SwitchCB, '切换方言设置');
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	noTopolectOption(){
		//console.log('roomAudiosetting')
		if(SettingMgr.getInstance().getGameID() == 13
		|| SettingMgr.getInstance().getGameID() == 20
		|| SettingMgr.getInstance().getGameID() == 19
		|| SettingMgr.getInstance().getGameID() == 6
		|| SettingMgr.getInstance().getGameID() == 5)
		{
			SettingMgr.getInstance().setProperty(false, "musicInfo", 'bTopolectSwitch')
			//console.log(SettingMgr.getInstance().getMusicInfo().bTopolectSwitch)
			this.ui.button_TopolectSwitch.getComponent(cc.Toggle).isChecked = SettingMgr.getInstance().getMusicInfo().bTopolectSwitch;
			this.ui.button_TopolectSwitch.active = false
		}
	}
	SssClosePanel(){
		SettingMgr.getInstance().setProperty(true, "musicInfo", 'bTopolectSwitch')
		//console.log(SettingMgr.getInstance().getMusicInfo().bTopolectSwitch)
		this.ui.button_TopolectSwitch.getComponent(cc.Toggle).isChecked = SettingMgr.getInstance().getMusicInfo().bTopolectSwitch;
		this.ui.button_TopolectSwitch.active = true;
	}

	private SwitchCB(event){
		//console.log(event.currentTarget)
		switch (event.currentTarget.name) {
			case 'musicSwitch':
				let bMusicSwitch = this.model.musicSettingInfo.bMusicSwitch
				let prog = bMusicSwitch?0:this.model.getPercent('music')
				let node_musicVolume = this.ui.node_MusicVolume.getComponent(cc.Slider)
				node_musicVolume.progress = prog;
				this.ui.node_MusicVolume_Progress.progress = prog;
				node_musicVolume.enabled = !bMusicSwitch;
				this.ui.node_MusicVolume_Progress.enabled = !bMusicSwitch;
				SettingMgr.getInstance().setProperty(!bMusicSwitch, 'musicInfo', 'bMusicSwitch')
				if(bMusicSwitch){
					if(SettingMgr.getInstance().getIsPlaza()){
						AudioMgr.getInstance().pausebackgroudMusic();
					}else{
						GameAudioCfg.getInstance().pausebackgroudMusic();
					}					
				}else{
					if(SettingMgr.getInstance().getIsPlaza()){
						AudioMgr.getInstance().resumebackgroudMusic();
					}else{
						GameAudioCfg.getInstance().resumebackgroudMusic();
					}
				} 
				break;
			case 'effectSwitch':
				let bEffectSwitch = this.model.musicSettingInfo.bEffectSwitch
				let prog = bEffectSwitch?0:this.model.getPercent('effect');
				let node_effectVolume = this.ui.node_EffectVolume.getComponent(cc.Slider)
				node_effectVolume.progress = prog;
				this.ui.node_EffectVolume_Progress.progress = prog;
				node_effectVolume.enabled = !bEffectSwitch;
				this.ui.node_EffectVolume_Progress.enabled = !bEffectSwitch;
				SettingMgr.getInstance().setProperty(!bEffectSwitch, 'musicInfo', 'bEffectSwitch') 
				break;
			case 'yySwitch':
				let bYySwitch = this.model.musicSettingInfo.bYySwitch
				let prog = bYySwitch ? 0 : this.model.getPercent('yy')
				let node_yyVolume = this.ui.node_yyVolume.getComponent(cc.Slider)
				node_yyVolume.progress = prog;
				this.ui.node_yyVolume_Progress.progress = prog;
				node_yyVolume.enabled = !bYySwitch;
				this.ui.node_yyVolume_Progress.enabled = !bYySwitch;
				SettingMgr.getInstance().setProperty(!bYySwitch, 'musicInfo', 'bYySwitch') 
				break;
			case 'tipSwitch':
				//console.log('tipSwitch')
				let bTipSwitch = this.model.musicSettingInfo.bTipSwitch
				SettingMgr.getInstance().setProperty(!bTipSwitch, 'musicInfo', 'bTipSwitch')
				break;
			case 'topolectSwitch':
				//console.log('topolectSwitch')
				let bTopolectSwitch = this.model.musicSettingInfo.bTopolectSwitch
				SettingMgr.getInstance().setProperty(!bTopolectSwitch, 'musicInfo', 'bTopolectSwitch') 
				break;
		}
		this.model.musicSettingInfo = SettingMgr.getInstance().getMusicInfo();
		//console.log('musicInfo开关:', this.model.musicSettingInfo);
	}

	private VolumeCB(event){
		//console.log(event.currentTarget);
		if (event.currentTarget.name == 'musicSlider'){
			this.ui.node_MusicVolume_Progress.progress = this.ui.node_MusicVolume.getComponent(cc.Slider).progress;
			let value = this.ui.node_MusicVolume_Progress.progress*100;
			SettingMgr.getInstance().setProperty(value, 'musicInfo', 'musicVolume');
			if(value == 0){
				if(SettingMgr.getInstance().getIsPlaza()){
					AudioMgr.getInstance().pausebackgroudMusic();
				}else{
					GameAudioCfg.getInstance().pausebackgroudMusic();
				}				
			}else{
				if(SettingMgr.getInstance().getIsPlaza()){
					AudioMgr.getInstance().resumebackgroudMusic();
				}else{
					GameAudioCfg.getInstance().resumebackgroudMusic();
				}				
			} 
		}
		else if(event.currentTarget.name == 'effectSlider'){
			this.ui.node_EffectVolume_Progress.progress = this.ui.node_EffectVolume.getComponent(cc.Slider).progress;
			let value = this.ui.node_EffectVolume_Progress.progress*100;
			SettingMgr.getInstance().setProperty(value, 'musicInfo', 'effectVolume'); 
		}
		else if(event.currentTarget.name == 'yySlider'){
			this.ui.node_yyVolume_Progress.progress = this.ui.node_yyVolume.getComponent(cc.Slider).progress;
			let value = this.ui.node_yyVolume_Progress.progress*100;
			SettingMgr.getInstance().setProperty(value, 'musicInfo', 'yyVolume'); 
		}
		this.model.musicSettingInfo = SettingMgr.getInstance().getMusicInfo();
		//console.log('musicInfo音量:',this.model.musicSettingInfo);
	}
	//end
}