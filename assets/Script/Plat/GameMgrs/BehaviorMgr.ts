//
 
export default class BehaviorMgr{ 
    //单例处理

    //商店模块传值
    private goodsId = null;
    private goodsType = null;
    private goodsBuyId = null;
    private goodsBuyType = null;
    //排行模块传值
    private rankData = null;
    //茶馆房间数据
    private clubRoomData = null;
    //搜索茶馆数据
    private clubSeekData = null;
    //茶馆选中的id
    private clubSelectId = null;
    //茶馆成员模块传值
    private clubMemberId = null;
    //茶馆房间数据传值
    private clubGameData = null;
    //茶馆战绩模块传值
    private clubRecordData = null; 
    //申请列表传值
    public applyListData = null;
    //黑名单列表传值
    public blacklistData = null;
    //战绩数据传值
    public record_data = null;
    //战绩人物数据传值
    public record_player_data = null;

    private static _instance:BehaviorMgr;
    
    public static getInstance ():BehaviorMgr{
        if(!this._instance){
            this._instance = new BehaviorMgr();
        }
        return this._instance;
    }

    //申请列表子元素点击按钮获取的数据
    setApplyListData(data){
        this.applyListData = data
    }

    getApplyData(){
        return this.applyListData
    }
    //茶馆申请列表黑名单子元素点击按钮获取的数据
    setBlacklistData(data){
        this.blacklistData = data
    }
    getBlacklistData(){
        return this.blacklistData
    }

    //商店子元素点击按钮需要获取的数据
    setGoodsItemData(_id, _type){
        this.goodsId = _id;
        this.goodsType = _type;
    }
    getGoodsItemData(){
        return new Array(this.goodsId, this.goodsType);
    }
    //商店购买道具弹出窗需要获取的数据
    setGoodsBuyData(_id, _type){
        this.goodsBuyId = _id;
        this.goodsBuyType = _type;
    }
    getGoodsBuyData(){
        return new Array(this.goodsBuyId, this.goodsBuyType);
    }

    //排行榜传值 {index, id, icon, name, award, sex, site}
    setRankItemData(data){
        this.rankData = data;
    }
    getRankItemData(){
        return this.rankData;
    }

    //进入房间 {type, pay, count, round, time}
    setClubRoomData(data){
        this.clubRoomData = data;
    }
    getClubRoomData(){
        return this.clubRoomData;
    }

    //进入房间 {id, icon, name, notice, count, max, captain_name}
    setClubSeekData(data){
        this.clubSeekData = data;
    }
    getClubSeekData(){
        return this.clubSeekData;
    }
    //茶馆选中的id
    setClubSelectId(id){
        this.clubSelectId = id;
    }
    getClubSelectId(){
        return this.clubSelectId;
    }

    //茶馆成员 {id,icon,name,identity,diamond,diamondMax, user_identity}
    //fightRecord:{id, id}
    setClubMemberId(data){
        this.clubMemberId = data;
    }
    getClubMemberId(){
        return this.clubMemberId;
    }
     //茶馆游戏 {id, name, type, pay, mCount, mMax, time, round}
    setClubGameRoom(data){
        this.clubGameData = data;
    }
    getClubGameRoom(){
        return this.clubGameData;
    }
    //茶馆战绩 {id, type, name, pay_type, pay_count, time,membelistr}
    setClubRecordData(data){
        this.clubRecordData = data;
    }
    getClubRecordData(){
        return this.clubRecordData;
    }
    //战绩模块传值 {id, type, time, room, pay_type, pay_count, memberlist}
    setGameRecordData(data){
        this.record_data = data;
    }
    getGameRecordData(){
        return this.record_data;
    }
    //战绩人物模块传值 {id, icon, name, score, win}
    setRecordPlayerData(data){
        this.record_player_data = data;
    }
    getRecordPlayerData(){
        return this.record_player_data;
    }
}