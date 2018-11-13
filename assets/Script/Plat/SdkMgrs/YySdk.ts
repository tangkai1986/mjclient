/**
 * create by JustinLin 2018.2.2 9:52
 */
import BaseMgr from "../Libs/BaseMgr";
export default class YySdkMgr {
    private iosClassName:String = "AppController";
    private yyEnter:boolean = false;
    private yyMic:boolean = true;
    private yyPlay:boolean = true;

    private isMicManual = false;    // 手动下麦
    private isPlayManual = false;   // 手动暂停

    private static _yyCtor : YySdkMgr;
    private voiceSateBeforeHide
    public static getInstance () : YySdkMgr {
        if (! this._yyCtor) {
            this._yyCtor = new YySdkMgr();
            this._yyCtor.YYEvent();
        }
        return this._yyCtor;
    }
    public getBolYYEvent(){
        return this.yyEnter;
    }
    public getBolYYMic(){
        return this.yyMic;
    }
    public getBolYYPlay(){
        return this.yyPlay;
    }
    /**
     * 初始化呀呀云语音sdk
     * @param uid 玩家uid
     * @param nickname 玩家名称
     * @param roomId 房间号
     * @param mode 语音标识
     */
    InitYaYaSdk (uid, nickname, roomId, mode) : void {
        // 如果yaya已经登陆
        if (this.yyEnter) return;

        if (cc.sys.isNative) {
            this.yyEnter = true;
            //console.log("初始化呀呀语音sdk",cc.sys.os);
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                var o = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", 
                "GameStart", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", 
                uid+"", nickname+"", roomId+"", mode+"");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "loginYaYaSdk:Player:Room:Mode:", ""+uid, ""+nickname, ""+roomId, ""+mode);
            }
        } 
    }
    setVoiceInitOk (){
        this.yyEnter = true; 
    }

    /**
     * 上麦
     */
    micUp () {
        // 如果yaya没登陆
        if (!this.yyEnter) {
            //console.log("状态micUp被返回")
            return;
        }
        // 如果已经是上麦状态
        // if (this.yyMic) return;

        if (cc.sys.isNative) {
            this.yyMic = true;
            //console.log('Listener: js micUp+++');
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","micUp", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "ChatMic:", true);
            }
        }
    }
    /**
     * 下麦
     */
    micDown (type) {
        // 如果yaya没登陆
        if (!this.yyEnter) return;
        // 如果已经是下麦状态
        // if (!this.yyMic) return;

        if (cc.sys.isNative) {
            this.yyMic = false;
            this.isMicManual = type == 1;
            //console.log('Listener: js micDown+++');
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","micDown", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "ChatMic:", false);
            }
        }
    }
    /**
     * 开启收听
     */
    speakerUp (){
        // 如果yaya没登陆
        if (!this.yyEnter) return;
        // 如果已经暂停播放yaya语音
        // if (!this.yyPlay) return;

        if (cc.sys.isNative) {
            this.yyPlay = true;
            //console.log('Listener: js speakerUp+++');
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","speakerUp", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "RealAudio:", true);
            }
        }
    }
    /**
     * 关闭收听
     */
    speakerDown (type){
        // 如果yaya没登陆
        if (!this.yyEnter) return;
        // 如果已经暂停播放yaya语音
        // if (!this.yyPlay) return;

        if (cc.sys.isNative) {
            this.yyPlay = false;
            this.isPlayManual = type == 1;
            //console.log('Listener: js speakerDown+++');
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","speakerDown", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "RealAudio:", false);
            }
        }
    }
    /**
     * 暂停播放yaya语音
     */
    pausePlay (type) {
        // 如果yaya没登陆
        if (!this.yyEnter) return;
        // 如果已经暂停播放yaya语音
        if (!this.yyPlay) return;

        if (cc.sys.isNative) {
            this.yyPlay = false;
            this.isPlayManual = type == 1;
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","pausePlay", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "pauseVoice");
            }
        }
    }
    /**
     * 恢复播放yaya语音
     */
    resumePlay () {
        // 如果yaya没登陆
        if (!this.yyEnter) return;
        // 如果正在播放yaya语音
        if (this.yyPlay) return;

        if (cc.sys.isNative) {
            this.yyPlay = true;
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","resumePlay", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "resumeVoice");
            }
        }
    }
    /**
     * 登出呀呀语音sdk
     */
    LeaveRoom () : void {
        // 如果yaya未登陆
        if (!this.yyEnter) return;

        if (cc.sys.isNative) {
            this.yyEnter = false;
            //console.log("退出房间登出呀呀语音sdk");
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "EndStart", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "logoutYaYaSdk");
            }
        } 
    }

    public setyyEnter(flag)
    {
        this.yyEnter=flag;
    }
    public yyEventHide(){
        // 如果yaya没登陆
        if (!this.yyEnter) return;
        this.voiceSateBeforeHide = {
            mic : this.yyMic,
            speaker : this.yyPlay
        }
        // cc.audioEngine.pauseAll();
        if (cc.sys.os == cc.sys.OS_IOS && this.yyMic) {
            cc.audioEngine.pauseAll();
        }
        // this.micDown(0);
        // this.speakerDown(0);
    }
    public yyEventShow(){
        // 如果yaya没登陆
        if (!this.yyEnter) return;

        if(this.voiceSateBeforeHide){
            if(this.voiceSateBeforeHide.mic){
                // cc.audioEngine.resumeAll();
                if (cc.sys.os == cc.sys.OS_IOS){
                    cc.audioEngine.resumeAll();
                }
                // this.micUp();
            }else{
                // this.micDown(0);
            }
            if(this.voiceSateBeforeHide.speaker){
                // this.speakerUp();
            }else{
                // this.speakerDown(0);
            }
            this.voiceSateBeforeHide = null;
        }
        // // 如果下麦了, 并且是手动下麦的, 切换回来就不用给它上麦了
        // if (!(!this.yyMic && this.isMicManual)) {
        //     //console.log('Listener: js yyEventShow 开启语音麦克风');

        //     this.micUp();
        // }
        // if(this.isMicManual){

        // }
        // // 如果暂停播放yaya语音, 并且是手动暂停的, 切换回来就不用给它恢复了
        // if (!(!this.yyPlay && this.isPlayManual)) this.speakerUp();
    }

    /** 
    *前后台监听事件
    * */
    private YYEvent(){
        if (cc.sys.isNative) {
            G_FRAME.globalEmitter.on("EnterBackground", this.EnterBackground.bind(this), this);
            G_FRAME.globalEmitter.on("EnterForeground", this.EnterForeground.bind(this), this);
        }
    }

    //**离线语音实现
    //开始录音
    public StartRecording(){
        // 如果yaya未登陆
        if (!this.yyEnter) return;

        if (cc.sys.isNative) {
            //console.log("开始录音StartRecording");
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "StartRecording", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "startRecording");
            }
        } 
    }
    //取消录音
    public StopRecording(){
        // 如果yaya未登陆
        if (!this.yyEnter) return;

        if (cc.sys.isNative) {
            //console.log("取消录音StopRecording");
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "StopRecording", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "stopRecording");
            }
        } 
    }
    //发送音频文件
    public UploadRecordedFile(){
        // 如果yaya未登陆
        if (!this.yyEnter) return;

        if (cc.sys.isNative) {
            //console.log("发送音频文件UploadRecordedFile");
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "UploadRecordedFile", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "uploadRecordedFile");
            }
        } 
    }
    //下载音频文件
    public DownloadRecordedFile(fileID){
        // 如果yaya未登陆
        if (!this.yyEnter) return;

        if (cc.sys.isNative) {
            //console.log("下载音频文件DownloadRecordedFile");
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "DownloadRecordedFile", "(Ljava/lang/String;)V",fileID+"");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "downloadRecordedFile:",""+fileID);
            }
        }  
    }
    //播放下载的音频文件
    public PlayRecordedFile(){
        // 如果yaya未登陆
        if (!this.yyEnter) return;

        if (cc.sys.isNative) {
            //console.log("播放下载的音频文件PlayRecordedFile");
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "PlayRecordedFile", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "playRecordedFile");
            }
        } 
    }
    //取消播放
    public StopPlayFile(){
        // 如果yaya未登陆
        if (!this.yyEnter) return;

        if (cc.sys.isNative) {
            //console.log("取消播放StopPlayFile");
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "StopPlayFile", "()V");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(this.iosClassName, "stopPlayFile");
            }
        } 
    }
    EnterBackground () {
        YySdkMgr.getInstance().yyEventHide();
    }
    EnterForeground () {
        console.trace("Listener: 啊啊啊啊啊啊啊")
        //console.log('Listener: js EnterForeground');
        YySdkMgr.getInstance().yyEventShow();
    }
}
