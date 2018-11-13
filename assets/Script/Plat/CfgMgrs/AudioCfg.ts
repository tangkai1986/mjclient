import BaseCfg from "../Libs/BaseCfg";
import GameCateCfg from "./GameCateCfg";
import SettingMgr from "../GameMgrs/SettingMgr";
 
export default class AudioCfg extends BaseCfg{
  
	//单例处理 
	private audioData = null; 
	private audioPath=null;
	private gamecode=null; 
	private backgroudMusicID=null;
	private curCfg=null;
	private audioDic=null; 
	private path = null; 
	constructor(){
		super();
		this.audioPath=this.getFullPath('audio'); 
	}
	
    private static _instance:AudioCfg;
    public static getInstance ():AudioCfg{
        if(!this._instance){
            this._instance = new AudioCfg();
        }
        return this._instance;
	} 
	loadCb(name,data){
		this.loaded=true;
		this.audioData = data.audio;
		this.updateCfg();
	} 
	getData()
	{
		return this.audioData;
	}
	load()
	{
		this.loadRes(this.audioPath,this.loadCb); 
	}
	updateCfg(){
		this.audioDic = {};
		for(let i = 0;i<this.audioData.length;++i)
		{
			this.audioDic[this.audioData[i]['name']]=this.audioData[i];
		} 
	}
	play(name)
	{
		let item=null;
		for (let key in this.audioDic) {
			if (this.audioDic.hasOwnProperty(key)) {
				let desArray = this.audioDic[key].des.split("&");
				for (let index = 0; index < desArray.length; index++) {
					let functions =desArray[index];
					if(name.indexOf(functions)>=0)
					{
						item=this.audioDic[key];
					}
				}
			}
		}
		if(item==null)
		{
			return;
		}
		let playLoop = false;
		if(!item)
		{
			//console.log("音效配置不存在")
			return;
		}
		switch(item.type)
		{
			case 0:
				playLoop=false;
			break;
			case 1:
				playLoop=true;
			break;
		}
		let url=cc.url.raw("/resources/audio/plat/"+item.file+".mp3")//一定要用url
		//console.log("音效配置路径",url);
		//加载此音频资源
		cc.loader.load(url, function (err, data) { 
			if(err)
			{
				return;
			} 
			let volume = 0;	
			if(playLoop) {
				volume = SettingMgr.getInstance().getMusicInfo().musicVolume / 100;
				if(!SettingMgr.getInstance().getMusicInfo().bMusicSwitch){
					volume = 0;
				}				
				cc.audioEngine.stopAll();
				this.backgroudMusicID = cc.audioEngine.play(url, playLoop, volume);
				//console.log("背景配置路径",url);
			}
			else
			{
				volume = SettingMgr.getInstance().getMusicInfo().effectVolume / 100;
				if(!SettingMgr.getInstance().getMusicInfo().bEffectSwitch){
					volume = 0;
				}
				cc.audioEngine.play(url, playLoop, volume);
				//console.log("音效配置路径",url);
			}
		}.bind(this));
	}
	stopbackgroudMusic()
	{
		if(this.backgroudMusicID){
			cc.audioEngine.stop(this.backgroudMusicID);
		}else{
			this.backgroudMusicID = null;
		}
	}
	pausebackgroudMusic()
	{
		if(this.backgroudMusicID){
			cc.audioEngine.pause(this.backgroudMusicID);
		}else{
			this.backgroudMusicID = null;
		}
	}
	resumebackgroudMusic()
	{
		let volume = SettingMgr.getInstance().getMusicInfo().musicVolume / 100;
		if(!SettingMgr.getInstance().getMusicInfo().bMusicSwitch){
			volume = 0;
		}	
		if(this.backgroudMusicID){
			cc.audioEngine.setVolume(this.backgroudMusicID,volume);
			cc.audioEngine.resume(this.backgroudMusicID);
		}else{
			this.backgroudMusicID = null;
		}	
	
	}
}

