import BaseCfg from "../Libs/BaseCfg";
import GameCateCfg from "./GameCateCfg";
import SettingMgr from "../GameMgrs/SettingMgr";
 
export default class GameAudioCfg extends BaseCfg{
  
	//单例处理 
	private gameaudioData = null; 
	private gameaudioPath=null;
	private gamecode=null; 
	private sexmap={
		1:0,
		2:1,
		3:1,
	} 
	private language=0;
	private curCfg=null;
	private gameaudiodic=null;
	private quickaudiodic=null;
    private processaudio=null;
    private bgmaudio=null;
	private path = null; 
	private backgroundMusicId = null;
	private gameProcessAudio = null;
	private gameYYAudio = null;
	constructor(){
		super();
		this.gameaudioPath=this.getFullPath('gameaudio'); 
	}
	
    private static _instance:GameAudioCfg;
    public static getInstance ():GameAudioCfg{
        if(!this._instance){
            this._instance = new GameAudioCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){
		this.loaded=true;
		this.gameaudioData = data;
	} 
	getData()
	{
		return this.gameaudioData;
	}
	load()
	{
		this.loadRes(this.gameaudioPath,this.loadCb); 
	}
	setGameId(gameid)
	{
		let game=GameCateCfg.getInstance().getGameById(gameid);
		this.gamecode=game.code;
		//console.log("音效字典", this.gamecode, this.gameaudioData)
		this.curCfg=this.gameaudioData[this.gamecode];
		this.updateCfg();
	}
 
	setLanguage(language)
	{
		this.language=language;
		this.updateCfg();
	}
	getQuickAudioDic(){
		return this.quickaudiodic
	}
	updateCfg(){
		this.gameaudiodic = {};
		this.quickaudiodic={};
		this.processaudio={};
		this.bgmaudio={};
		let cfglines = this.curCfg;
		if(!cfglines)
		{
			//console.log("没有此类游戏的音频配置")
			return;
		}
		//console.log("当前音效配置", cfglines)
		for(let i=0;i<cfglines.length;i++){
			let line=cfglines[i];
			let name=line.name;
			let sex=line.sex;
			let localism=line.localism;
			switch(line.type)
			{
                case 0:		// 语音--游戏语言
                    if(!this.gameaudiodic[name])
                        this.gameaudiodic[name]=[[[],[]],[[],[]]];
                    this.gameaudiodic[name][sex][localism].push(line.file);
                    break;
				case 1:		// 快捷聊天
                    if(!this.quickaudiodic[name])
                        this.quickaudiodic[name]=[[],[]];
                    this.quickaudiodic[name][sex].push(line.file);
                    break;
				case 3:		// 流程音效--游戏音效
                    if(!this.processaudio[name])
                        this.processaudio[name]=[];
                    this.processaudio[name].push(line.file);
                    break;
				case 4:		// 背景音乐--游戏音乐
                    if(!this.bgmaudio[name])
                        this.bgmaudio[name]=[];
                    this.bgmaudio[name].push(line.file);
					break;
				default:
					console.warn("GameAudioCfg.updateCfg() -> line.type 的值不在预期中, 不做处理! 请检查合理性!")
			} 
		}
	}

    /**
	 * 游戏个性音效
	 * 区分男女
     * @param name
     * @param sex
     */
	play(name,sex){
		let sextype = this.sexmap[sex];
		let cfgbyname=this.gameaudiodic[name];
		if(!cfgbyname)
            return console.error(`找不到${name}的音频资源`);
		let cfgbysex=cfgbyname[sextype];
		if(!cfgbysex)
		{
			//console.log(cfgbyname);
            return console.error(`找不到${name}的性别${sex}音频资源`);
			
		}
		let rootPath=`resources/audio/Games/${this.gamecode}`;
		let index=0;
		if(SettingMgr.getInstance().musicInfo.bTopolectSwitch)
		{
			index=1;
		}
		let randomindex= parseInt(Math.random()*cfgbysex[index].length);
		let filename=`${rootPath}/${cfgbysex[index][randomindex]}.mp3`;
		//console.log("游戏内声音路径",filename);
		let volume = SettingMgr.getInstance().getMusicInfo().yyVolume / 100;
		if(!SettingMgr.getInstance().getMusicInfo().bYySwitch){
			volume = 0;
		}
		cc.loader.load(cc.url.raw(filename), function (err, data) { 
			if(err)
			{
				if(index)
				{
					index=0;
				}
				else{
					index=1;
				}
				filename=`${rootPath}/${cfgbysex[index][randomindex]}.mp3`;
				cc.loader.load(cc.url.raw(filename), function (err, data) { 
					if(err)
					{
						return;
					}
					this.gameYYAudio = cc.audioEngine.play(cc.url.raw(filename), false, volume);
				}.bind(this));
				return;
			}
			this.gameYYAudio = cc.audioEngine.play(cc.url.raw(filename), false, volume);
		}.bind(this));
	}
	stopGameYYAudio()
    {
		if(this.gameYYAudio){
			cc.audioEngine.stop(this.gameYYAudio);
		}else{
			this.gameYYAudio = null;
		}
    }
    pauseGameYYAudio()
    {		
		if(this.gameYYAudio){
			cc.audioEngine.pause(this.gameYYAudio);
		}else{
			this.gameYYAudio = null;
		}
    }
    resumeGameYYAudio()
    {
		let volume = SettingMgr.getInstance().getMusicInfo().yyVolume / 100;
		if(!SettingMgr.getInstance().getMusicInfo().bYySwitch){
			volume = 0;
		}
		if(this.gameYYAudio){
			cc.audioEngine.setVolume(this.gameYYAudio,volume);
        	cc.audioEngine.resume(this.gameYYAudio);
		}else{
			this.gameYYAudio = null;
		}		
    }
    /**
	 * 游戏流程音效
	 * 不分男女音
     * @param {String} name
     * @param {Boolean} flag
     */
	playGameProcessAudio (name, flag) {
        let audioNameArr=this.processaudio[name];
        if(!audioNameArr) return console.error(`找不到${name}的音频资源`);
        let index = parseInt(Math.random()*audioNameArr.length);
        let rootPath=`resources/audio/Games/${this.gamecode}/${audioNameArr[index]}.mp3`;
        let url=cc.url.raw(rootPath);
        let volume = SettingMgr.getInstance().getMusicInfo().effectVolume / 100;
		if(!SettingMgr.getInstance().getMusicInfo().bEffectSwitch){
			volume = 0;
		}
        this.gameProcessAudio = cc.audioEngine.play(url, flag, volume);
	}
	stopGameProcessAudio()
    {
		if(this.gameProcessAudio){
			cc.audioEngine.stop(this.gameProcessAudio);
		}else{
			this.gameProcessAudio = null;
		}
    }
    pauseGameProcessAudio()
    {		
		if(this.gameProcessAudio){
			cc.audioEngine.pause(this.gameProcessAudio);
		}else{
			this.gameProcessAudio = null;
		}
    }
    resumeGameProcessAudio()
    {
		let volume = SettingMgr.getInstance().getMusicInfo().effectVolume / 100;
		if(!SettingMgr.getInstance().getMusicInfo().bEffectSwitch){
			volume = 0;
		}
		if(this.gameProcessAudio){
			cc.audioEngine.setVolume(this.gameProcessAudio,volume);
        	cc.audioEngine.resume(this.gameProcessAudio);
		}else{
			this.gameProcessAudio = null;
		}		
    }
    /**
	 * 游戏BGM
     */
    playBGM (name) {
        let audioNameArr=this.bgmaudio[name];
        if(!audioNameArr) return console.error(`找不到${name}的音频资源`);
        let index = parseInt(Math.random()*audioNameArr.length);
        let rootPath=`resources/audio/Games/${this.gamecode}/${audioNameArr[index]}.mp3`;
        let url=cc.url.raw(rootPath);
        let volume = SettingMgr.getInstance().getMusicInfo().musicVolume / 100;
		if(!SettingMgr.getInstance().getMusicInfo().bMusicSwitch){
			volume = 0;
		}
		cc.audioEngine.stopAll();
        this.backgroundMusicId = cc.audioEngine.play(url, true, volume);
	}
    stopbackgroudMusic()
    {
		if(this.backgroundMusicId){
			cc.audioEngine.stop(this.backgroundMusicId);
		}else{
			this.backgroundMusicId = null;
		}
    }
    pausebackgroudMusic()
    {		
		if(this.backgroundMusicId){
			cc.audioEngine.pause(this.backgroundMusicId);
		}else{
			this.backgroundMusicId = null;
		}
    }
    resumebackgroudMusic()
    {
		let volume = SettingMgr.getInstance().getMusicInfo().musicVolume / 100;
		if(!SettingMgr.getInstance().getMusicInfo().bMusicSwitch){
			volume = 0;
		}
		if(this.backgroundMusicId){
			cc.audioEngine.setVolume(this.backgroundMusicId,volume);
        	cc.audioEngine.resume(this.backgroundMusicId);
		}else{
			this.backgroundMusicId = null;
		}		
    }
}

