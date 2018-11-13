const {ccclass, property} = cc._decorator;

let ctrl : videoPlayingCtrl;
//控制器
@ccclass
export default class videoPlayingCtrl extends cc.Component { 
     
    @property({
        tooltip : "登录动画",
        type : cc.VideoPlayer
    })
    videoPlayer: cc.VideoPlayer = null;
    videoPlay()
    {
        console.log("videoPlay", "12312321")
        if(cc.isValid(this.videoPlayer)) {
            this.videoPlayer.play();
        }
    }
    videoComplete()
    {
        this.gotoLaunch();
    }
    onLoad (){ 
        //创建mvc模式中模型和视图
        //控制器
        this.videoPlayer.node.on('ready-to-play', this.videoPlay, this);
        this.videoPlayer.node.on('completed', this.videoComplete, this);
        
    }
    isIPhoneX () {
        let size = cc.view.getFrameSize();
        ////console.log("设备 size", size)
        if(
            cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE
            && ((size.width == 2436 && size.height == 1125) 
            ||(size.width == 1125 && size.height == 2436))
        ) {
            return true;
        }
        return false;
    }
    resetDesignResolution (canvas) {
        let width = 720;
        let size = cc.view.getFrameSize();
        let proportion = size.height/size.width;
        let height = width*proportion;
        canvas.designResolution=new cc.Size(width, height)
        //canvas.fitHeight = true
        canvas.fitWidth = true
    }
    start () {
        if (this.isIPhoneX()) {
            this.resetDesignResolution(this.node.getComponent(cc.Canvas))
        }
        cc.director.setDisplayStats(false);
    } 
    gotoLaunch(){
        //return;
        let cb=function()
		{ 
            cc.loader.loadRes('SubLayer/Plat/MsgBox/MsgBoxLoadingAni', (err, prefab:cc.Prefab)=> { 
                if(err){
                    cc.error(err) 
                }else{
                    let prefabNode = cc.instantiate(prefab);
                    prefabNode.parent = cc.director.getScene();
                    prefabNode.position=cc.p(640,360) 
                } 
            }); 
        }  
        cc.director.loadScene('Launch',cb.bind(this))
    }
}
