import BaseMgr from "../Libs/BaseMgr";

export default class GameFreeMgr extends BaseMgr {
    routes: {} = null
    private marqueeText: string = null;
    private FreeList: any = [];//限免的具体信息
    private FreeGameList: any = [];//有限免的游戏
    constructor() {
        super();
        this.routes = {
            "http.reqGameFreeList": this.http_reqGameFreeList,
        } 
    }

    reqGameFreeList() {
        this.send_msg('http.reqGameFreeList');
    }

    http_reqGameFreeList(msg) {
        this.FreeGameList = [];
        let list = msg.result;
        if(!list){
            //console.log("限免列表为空")
            return
        }
        for (let i = 0; i < list.length; i++) {
            let name = list[i].name;
            let game_id = list[i].game_id.split(',');
            let start_time = list[i].start_time;
            let end_time = list[i].end_time;
            let status = list[i].status;
            //status为1时开启，为2时关闭
            if(status == 1){
                for (let i = 0; i < game_id.length; i++) {
                    this.FreeGameList.push({
                        gameID: parseInt(game_id[i]),
                        name: name,
                        start: start_time,
                        end: end_time,
                        //end:1607717103,
                    })
                }
            }
            
        }
        //console.log(this.FreeGameList)
    }

    //时间戳转为日期
    formatDate(time) {
        time = new Date(time * 1000);
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate();
        var hour = time.getHours();
        var minute = time.getMinutes();
        var second = time.getSeconds();
        return month + "月" + date + "日" + hour + "时" + minute + "分";
    }
    //判断指定游戏在当前是否免费
    isFree(gameid){
        let temList = this.getFreeDetial(gameid)
        let nowDate = this.getNowDate();
        for(let i = 0;i<temList.length;i++){
            //判断是否在免费时间的区间内
            if(temList[i].start < nowDate && temList[i].end > nowDate){
                return true
            }
        }
        return false
    }
    //获取指定游戏的限免信息
    getFreeDetial(gameid){
        let temList = [];
        let nowDate = this.getNowDate();
        for(let i = 0;i<this.FreeGameList.length;i++){
            if(this.FreeGameList[i].gameID == gameid){
                temList.push(this.FreeGameList[i]);
            }
        }
        return temList
    }

    //获取所有限免信息
    getFreeList() {
        return this.FreeGameList;
    }

    //获取当前十位时间戳
    getNowDate(){
        let nowDate = new Date().getTime().toString();
        nowDate = nowDate.substr(0,10)
        return nowDate
    }

    private static _instance: GameFreeMgr;
    public static getInstance(): GameFreeMgr {
        if (!this._instance) {
            this._instance = new GameFreeMgr();
        }
        return this._instance;
    }
}