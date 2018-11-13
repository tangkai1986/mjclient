import BaseCfg from "../Libs/BaseCfg";
import GameCateCfg from "./GameCateCfg";
import GameAudioCfg from "./GameAudioCfg"; 
import SettingMgr from "../GameMgrs/SettingMgr";
 
export default class QuickAudioCfg extends BaseCfg{
  
	//单例处理
	private quickaudioData = null;
	private quickaudioPath=null;
	
	private gamecode=null;
	private curCfg=null;
	private cfgmap=null;
	private quickaudiodic=null;
	private quickaudioName = null;
	private sexmap={
		1:0,
		2:1,
		3:1,
	}
	private sextype=1;
	private language=0;
	constructor(){
		super();
		this.quickaudioPath=this.getFullPath('quickaudio');
	}
	
    private static _instance:QuickAudioCfg;
    public static getInstance ():QuickAudioCfg{
        if(!this._instance){
            this._instance = new QuickAudioCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){
		this.loaded=true;
		this.quickaudioData = data;
	}
	getData()
	{
		return this.quickaudioData;
	}
	load()
	{
		this.loadRes(this.quickaudioPath,this.loadCb);
	}
	setGameId(gameid)
	{	
		this.quickaudioName = {};
		let game=GameCateCfg.getInstance().getGameById(gameid);
		this.gamecode=game.code;
		this.curCfg=this.quickaudioData[this.gamecode];
		this.quickaudiodic=GameAudioCfg.getInstance().getQuickAudioDic(); 
		if(!this.curCfg){
			//console.log('没有此类游戏的快捷聊天音频配置')
			return;
		}
		for(let i = 0;i<this.curCfg.length;i++){
			let line = this.curCfg[i];
			let id = line.id;
			let name = line.name;
			if(!this.quickaudioName[id])
			{
				this.quickaudioName[id] = null;
			}
			this.quickaudioName[id]=line.name;
		}
	} 
	getCfg(){
		return this.curCfg;
	} 
 
	play(id,sex){
		let name = this.quickaudioName[id];
		let sextype = this.sexmap[sex];
		let cfgbyname=this.quickaudiodic[name];
		//console.log("进来了")
		if(!cfgbyname)
		{
			//console.log(`找不到${name}的音频资源`)
			return;
		}
		let cfgbysex=cfgbyname[sextype];
		if(!cfgbysex)
		{
			//console.log(`找不到${name}的性别${sex}快捷聊天音频资源`)
			return;
		} 
		let audios=cfgbysex; 
		let langstrs=['pth','pth']
		let rootPath=`resources/audio/Games/${this.gamecode}`; 
		let index= Math.floor((Math.random()*100000)%(audios.length)) 
		let filename=`${rootPath}/${audios[index]}.mp3` 
		let url=cc.url.raw(filename)//一定要用url
		//加载此音频资源
		cc.loader.load(url, function (err, data) { 
			if(err)
			{
				return;
			} 
			let volume = SettingMgr.getInstance().getMusicInfo().yyVolume / 100;
			if(!SettingMgr.getInstance().getMusicInfo().bYySwitch){
				volume = 0;
			}
			cc.audioEngine.play(url, false, volume);
		}.bind(this));	
	}  
}

