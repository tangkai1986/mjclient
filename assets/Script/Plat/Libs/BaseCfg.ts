 

export default class BaseCfg{
    rootPath='Configs/Plat/'

    loaded=false;
    private completeCb=null;
    getFullPath(cfgName)
    {
        return `${this.rootPath}${cfgName}`
    }
    loadRes(name,cb)
    {
        cc.loader.loadRes(name, function (err, data) {
            if(err)
            {
                //console.log(`cc.loader.loadRes err=,${JSON.stringify(err)},${name}`)
            }
            else
            {
                cb.bind(this)(name,data)
                this.completeCb&&this.completeCb();
            }
        }.bind(this));
    } 
    registerCompleteCb(completeCb){
        this.completeCb=completeCb;
    }
    isLoaded()
    {
        return this.loaded;
    }
}