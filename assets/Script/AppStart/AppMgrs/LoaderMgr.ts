//加载管理
export default class LoaderMgr{
    playEffect(path, volume) : number {
        if (!path || !volume) {
            cc.error("playMusic path= ", path,', volume= ',volume);
            return;
        }
        path = cc.url.raw('resources/'+path);
        let audioID = cc.audioEngine.play(path, false, volume);
        cc.audioEngine.setFinishCallback(audioID,  (ss, ss11) => {
            cc.loader.release(cc.loader["_cache"][ss.target.src].url);
        });
        return audioID;
    }

    playMusic(path, loop, volume) : number {
        if (!path || !volume) {
            cc.error("playMusic path= ", path,', volume= ',volume);
            return;
        }
        let audioID = cc.audioEngine.play(path, loop, volume);
        cc.audioEngine.setFinishCallback(audioID,  (ss, ss11) => {
            cc.loader.release(cc.loader["_cache"][ss.target.src].url);
        });
        return audioID;
    }

    //======================== 加载
    //主动加载resource中的资源, 输入路径从resources底下开始
    loadRes(url, cb){
        cc.loader.loadRes(url, (err, assert)=>{
            if(err){
                if(cb){
                    cb(null);
                    cb = null;
                }
                cc.error('load url= ',url,', err=',err);
            }else{
                if(cb){
                    cb(assert);
                    cb = null;
                }
            }
        })
    }

    //======================== 获取
    //从缓存中读取资源, 输入路径从resource底下开始
    getRes(url:string){
        return cc.loader.getRes(cc.url.raw('resources/'+url));
    }

    //========================= 释放

    //释放当前场景之外的所有资源
    releaseAll(){
        // let canvasNode = cc.director.getScene().children[0];
        // let urlDict = {};
        // canvasNode.children.forEach((child) => {
        //     let sprite = child.getComponent(cc.Sprite);
        //     if (sprite && sprite.spriteFrame) {
        //         let url = cc.loader["_cache"][sprite.spriteFrame['_textureFilename']].url;
        //         urlDict[url] = 1;
        //     }
        // });
        // let dict_cache = cc.loader["_cache"];
        // for(let key in dict_cache){
        //     if(!urlDict[key]){
        //         cc.loader.release(key);
        //     }
        // }
    }

    //释放对应URL的资源
    releaseUrlRes (url:string){
        cc.loader.release(url);
    }

    //暴力释放所有资源(当前场景的所有资源也不可用)
    forceReleaseAll (){
        cc.loader.releaseAll();
    }

    //释放所有临时缓存(sprite frame， prefab配置)
    releaseAllImportRes(){
        let sign = 'res/import/';
        let dict_cache = cc.loader["_cache"];
        for(let key in dict_cache){
            if(key.indexOf(sign) != -1){
                cc.loader.release(key);
            }
        }
    }

    //图片资源的释放（Texture 底下的资源）
    releaseAllTexture(){
        let sign = 'res/raw-assets/Texture';
        let dict_cache = cc.loader["_cache"];
        for(let key in dict_cache){
            if(key.indexOf(sign) != -1){
                cc.loader.release(key);
            }
        }
    }

    //单个预制体资源的释放(dependKeys), 输入加载时候使用的路径,从resources底下开始
    releasePrefab(loadUrl){
        var deps = cc.loader.getDependsRecursively(loadUrl);
        cc.loader.release(deps);
    }

    //配置文件的释放
    releaseTables(){
        let sign = 'res/raw-assets/resources/Tables';
        let dict_cache = cc.loader["_cache"];
        for(let key in dict_cache){
            if(key.indexOf(sign) != -1){
                cc.loader.release(key);
            }
        }
    }

    private static _instance:LoaderMgr;
    public static getInstance ():LoaderMgr{
        if(!this._instance){
            this._instance = new LoaderMgr();
        }
        return this._instance;
    }
}
