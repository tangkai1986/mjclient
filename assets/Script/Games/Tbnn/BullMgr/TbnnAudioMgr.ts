import BaseMgr from "../../../Plat/Libs/BaseMgr";
import LoaderMgr from "../../../AppStart/AppMgrs/LoaderMgr";
import TbnnConst from "../BullMgr/TbnnConst";
//通比牛牛音效管理器
let processaudiodic={};
processaudiodic[TbnnConst.process.start]='audio_ready'; //开始 
processaudiodic[TbnnConst.process.giveCards]='audio_fapai'; //发牌
processaudiodic[TbnnConst.process.settle]='kaijin'; //结算

export default class TbnnAudioMgr extends BaseMgr {
    private baseUrl:string
    private womanUrl:string
    private manUrl:string
    private other_audio
    private dict_audio
    private process_audio
    private quitMan_audio
    private quitWoman_audio
    private ResultAudioMan
    private ResultAudioWoman
    constructor(){
        super();
        this.baseUrl = cc.url.raw("resources/audio/Games/tbnn/%s.mp3");
        this.womanUrl = cc.url.raw("resources/audio/Games/tbnn/pth/woman/%s.mp3");
        this.manUrl = cc.url.raw("resources/audio/Games/tbnn/pth/man/%s.mp3")
        //女声结果
        this.ResultAudioWoman = {
            womanbull0:"womanbull0",    //没牛
            womanbull1:"womanbull1",    //牛1
            womanbull2:"womanbull2",    //牛2
            womanbull3:"womanbull3",    //牛3
            womanbull4:"womanbull4",    //牛4
            womanbull5:"womanbull5",    //牛5
            womanbull6:"womanbull6",    //牛6
            womanbull7:"womanbull7",    //牛7
            womanbull8:"womanbull8",    //牛8
            womanbull9:"womanbull9",    //牛9
            womanbull10:"womanbull10",  //牛牛
            womanbull103:"womanbull103",//五小牛
            womanbull105:"womanbull105",//五花牛
            womanbull106:"womanbull106",//4炸
        };
        //男声结果
        this.ResultAudioMan = {
            manbull0:"manbull0",
            manbull1:"manbull1",
            manbull2:"manbull2",
            manbull3:"manbull3",
            manbull4:"manbull4",
            manbull5:"manbull5",
            manbull6:"manbull6",
            manbull7:"manbull7",
            manbull8:"manbull8",
            manbull9:"manbull9",
            manbull10:"manbull10",
            manbull103:"manbull103",
            manbull105:"manbull105",
            manbull106:"manbull106",
        }
        //流程
        this.process_audio = {
            audio_start:"audio_start",
            audio_fapai:"audio_fapai",
            Particle_Money:"Particle_Money",
        }
        //其他
        this.other_audio = {
            audio_ready:"audio_ready",
            backmusic:"backmusic",
        }
    }
    //获取测试音乐
    playTest1Audio() {
        cc.audioEngine.play(this.formatStr(this.manUrl, "fix_msg_1"), false, 1);
    }
    //播放准备声音
    playReadyAudio() {
        cc.audioEngine.play(this.formatStr(this.baseUrl, this.other_audio.audio_ready), false, 1);
    }
    //播放发牌声音
    playFaPaiAudio() {
        cc.audioEngine.play(this.formatStr(this.baseUrl, this.process_audio.audio_fapai), false, 1);
    }
    //播放开始声音
    playStartAudio() {
        cc.audioEngine.play(this.formatStr(this.baseUrl, this.process_audio.audio_start), false, 1);
    }
    //播放BGM
    playBGM() {
        cc.audioEngine.play(this.formatStr(this.baseUrl, this.other_audio.backmusic), false, 1);
    }
    //播放金币声音
    playParticle_MoneyAudio() {
        cc.audioEngine.play(this.formatStr(this.baseUrl, this.process_audio.Particle_Money), false, 1);
    }
   //播放结果语音
    playResultAudio(value,sex){
        let temp:string
        let url;
        sex==2?url =this.womanUrl:url = this.manUrl;
        switch(value){
            case 0:
            sex == 2?temp = this.ResultAudioWoman.womanbull0:temp = this.ResultAudioMan.manbull0;
            cc.audioEngine.play(this.formatStr(url, temp), false, 1);
            break;
            case "1":
            sex == 2?temp = this.ResultAudioWoman.womanbull1:temp = this.ResultAudioMan.manbull1;
            cc.audioEngine.play(this.formatStr(url, temp), false, 1);
            break;
            case "2":
            sex == 2?temp = this.ResultAudioWoman.womanbull2:temp = this.ResultAudioMan.manbull2;
            cc.audioEngine.play(this.formatStr(url, temp), false, 1);
            break;
            case "3":
            sex == 2?temp = this.ResultAudioWoman.womanbull3:temp = this.ResultAudioMan.manbull3;
            cc.audioEngine.play(this.formatStr(url, temp), false, 1);
            break;
            case "4":
            sex == 2?temp = this.ResultAudioWoman.womanbull4:temp = this.ResultAudioMan.manbull4;
            cc.audioEngine.play(this.formatStr(url, temp), false, 1);
            break;
            case "5":
            sex == 2?temp = this.ResultAudioWoman.womanbull5:temp = this.ResultAudioMan.manbull5;
            cc.audioEngine.play(this.formatStr(url, temp), false, 1);
            break;
            case "6":
            sex == 2?temp = this.ResultAudioWoman.womanbull6:temp = this.ResultAudioMan.manbull6;
            cc.audioEngine.play(this.formatStr(url, temp), false, 1);
            break;
            case "7":
            sex == 2?temp = this.ResultAudioWoman.womanbull7:temp = this.ResultAudioMan.manbull7;
            cc.audioEngine.play(this.formatStr(url, temp), false, 1);
            break;
            case "8":
            sex == 2?temp = this.ResultAudioWoman.womanbull8:temp = this.ResultAudioMan.manbull8;
            cc.audioEngine.play(this.formatStr(url, temp), false, 1);
            break;
            case "9":
            sex == 2?temp = this.ResultAudioWoman.womanbull9:temp = this.ResultAudioMan.manbull9;
            cc.audioEngine.play(this.formatStr(url, temp), false, 1);
            break;
            case "10":
            sex == 2?temp = this.ResultAudioWoman.womanbull10:temp = this.ResultAudioMan.manbull10;
            cc.audioEngine.play(this.formatStr(url, temp), false, 1);
            break;
            // case "12":
            // break;
            // case "13":
            // break;
            // case "14":
            // break;
            // case "15":
            // break;
            case "17":
            sex == 2?temp = this.ResultAudioWoman.womanbull105:temp = this.ResultAudioMan.manbull105;
            cc.audioEngine.play(this.formatStr(url, temp), false, 1);
            break;
            case "18":            //五小牛womanbull103
            sex == 2?temp = this.ResultAudioWoman.womanbull103:temp = this.ResultAudioMan.manbull103;
            cc.audioEngine.play(this.formatStr(url, temp), false, 1);
            break;
            default:
            break;
        }
    }
    //=================
    //预加载音效资源
    reloadAudio (cb){
        //结果语音男
        for(let key in this.ResultAudioMan){
            cc.loader.load(this.formatStr(this.manUrl, this.ResultAudioMan[key]), ()=>{
                if(cb){
                    cb();
                }
            })
        }
        //结果语音女
        for(let key in this.ResultAudioWoman){
            cc.loader.load(this.formatStr(this.womanUrl, this.ResultAudioWoman[key]), ()=>{
                if(cb){
                    cb();
                }
            })
        }
    }
    getAudioNum (){
        return Object.keys(this.dict_audio).length;
    }
    //释放所有的音效资源
    releaseAll (){
        for(let key in this.ResultAudioMan){
            LoaderMgr.getInstance().releaseUrlRes(this.formatStr(this.manUrl, this.ResultAudioMan[key]));
        }
        for(let key in this.ResultAudioWoman){
            LoaderMgr.getInstance().releaseUrlRes(this.formatStr(this.womanUrl, this.ResultAudioWoman[key]));
        }
    }
    //==================
    private formatStr(...args){
        var t=args,e=t.length;
        if(e<1)return"";
        var i=/(%d)|(%s)/,n=1,r=t[0],s="string"==typeof r&&i.test(r);
        if(s)for(var o=/%s/;n<e;++n){
            var a=t[n],c="number"==typeof a?i:o;
            c.test(r)?r=r.replace(c,a):r+=" "+a
        }else if(e>1)for(;n<e;++n)r+=" "+t[n]; else r=""+r;
        return r
    }
    destroy(){
        super.destroy();
        delete TbnnAudioMgr._instance;
    }
    //单例
    private static _instance:TbnnAudioMgr;
    public static getInstance ():TbnnAudioMgr{
        if(!this._instance){
            this._instance = new TbnnAudioMgr();
        }
        return this._instance;
    }
    //   //进度
    //   process:{
    //     start:1,            //开始游戏
    //     giveCards:2,        //发牌
    //     settle:3,           //结算
    // },
}
