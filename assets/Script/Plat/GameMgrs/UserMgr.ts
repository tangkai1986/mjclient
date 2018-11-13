//用户管理
import BaseMgr from "../Libs/BaseMgr";
import LoginMgr from "./LoginMgr"; 

 
export default class UserMgr extends BaseMgr{
    myinfo:any = {};
    users:{} = null;
    routes:{} = null ;
    exitHeadurl:string=null;
    exitNickname:string=null;
    exitSex:number=null;
    exitSognature:string=null;
    //====== 
    uid:any = null 
    constructor (){
        super(); 
        this.myinfo={};
        this.users={};
        this.routes={
            'http.reqMyInfo':this.http_reqMyInfo, 
            'http.reqGetRelief':this.http_reqGetRelief, 
            'http.reqUsers':this.http_reqUsers, 
            'onUserInfoChanged':this.onUserInfoChanged,
            'http.reqRegister':this.http_reqRegister,
            'http.reqLogin':this.http_reqLogin, 
            'http.reqEditHeadUrl':this.http_reqEditHeadUrl,
            'http.reqEditNickname':this.http_reqEditNickname, 
            'http.reqEditSex':this.http_reqEditSex,
            'http.reqEditSignature':this.http_reqEditSignature,  
            'http.ReqIdCardRegistration':this.http_ReqIdCardRegistration,
            'http.reqFirstRecharge':this.http_reqFirstRecharge,
            'http.onPlayerChange':this.onPlayerChange,
            'http.reqBindPhone':this.http_reqBindPhone,
        }
    }
    getMySex(){
        return this.myinfo.sex;
    }
    http_reqBindPhone(){
        this.reqMyInfo();
    }
    //请求更新头像
    reqEditHeadUrl(headurl:string){
        this.exitHeadurl=headurl;
        let msg={
            headurl:headurl
        }
        this.send_msg('http.reqEditHeadUrl',msg)
    }
    http_reqEditHeadUrl(msg){
        this.myinfo.headurl=this.exitHeadurl;
    }
    //请求更新昵称
    reqEditNickname(nickname:string){
        this.exitNickname=nickname;
        let msg={
            nickname:nickname
        }
        this.send_msg('http.reqEditNickname',msg)
    }
    http_reqEditNickname(msg){
        this.myinfo.nickname=this.exitNickname;
    }
    //请求修改性别
    reqEditSex(sex:number)
    {
        this.exitSex=sex;
        let msg={
            sex:sex
        }
        this.send_msg('http.reqEditSex',msg)
    }
    http_reqEditSex(msg)
    {
        this.myinfo.sex=this.exitSex;
    }
    //请求修改个性签名
    reqEditSignature(signStr:string){
        this.exitSognature=signStr;
        let msg={
            sign:signStr
        }
        this.send_msg('http.reqEditSignature',msg)
    }
    http_reqEditSignature(msg)
    {
        this.myinfo.signature=this.exitSognature
        this.reqMyInfo();
    }    
    sendGpsInfo(msg){
        this.send_msg('http.reqLocate',msg)
    }    
    getMyInfo()
    {
        return this.myinfo;
    }
    reqFirstRecharge()
    {
        this.send_msg('http.reqFirstRecharge')
    }
    http_reqFirstRecharge(msg)
    {
        this.myinfo.isFirstRecharge = msg
    }
    http_reqRegister(msg)
    {
        this.uid=msg.uid;
    }
    http_reqLogin(msg)
    {
        this.uid=msg.uid;
    }
    onUserInfoChanged(msg) 
    {
        this.reqMyInfo();
    }
    http_reqMyInfo(msg)     
    {
        //console.log("http_reqMyInfo 我的信息=",msg)
        this.myinfo=msg;
        if(!window['__errorUserInfo'])
        {
            window['__errorUserInfo']={};
        }
        window['__errorUserInfo']['logicid']=msg.logicid;
    }
    http_reqGetRelief(msg)
    {
        //刷新我的信息
        //console.log("http_reqGetRelief 我的信息=",msg)
        this.myinfo=msg;
    }
    onPlayerChange(msg){
        //console.log("onPlayerChange", msg)
    }

    reqGetRelief()
    {
        this.send_msg('http.reqGetRelief');
    }
    //获取我的信息
    reqMyInfo() 
    {
        this.send_msg('http.reqMyInfo');
    }
    //同步数据
    reqSyncUser (data) {
        this.send_msg('http.reqSyncUser', data)
    }
    //获取用户信息
    reqUsers(uids)
    {
        //console.log("reqUsers 请求信息=",uids);
        // body
        let msg={
            'uids':uids,
        }
        
        //console.log("我娃哦哦额哦按非uids=",uids) 
        this.send_msg('http.reqUsers',msg);
    }
    http_reqUsers(msg)
    {
        // body    
        let value; 
        for(let i = 0; i < msg.users.length; i ++){
            value = msg.users[i];
            //console.log("http_reqUsers=",value.id,typeof(value.id))
            this.users[value.id.toString().trim()]=value; 
        }
        for(let i in this.users)
        {
            //console.log("ssidddddd=",i,typeof(i))
        }
    }
    ReqIdCardRegistration(myData)
    {
        //console.log("aaaaaa",{"name":myData.name,"card":myData.card});
        this.send_msg("http.ReqIdCardRegistration",{"name":myData.name,"card":myData.card});
    }
    http_VerificationCode(Data){
        //获取验证码
        this.send_msg("http.reqPostPhoneCode",{"phone":Data.phone});
    }
    http_BingPhone(Data)
    {
       //绑定手机
       this.send_msg("http.reqBindPhone",{"phone":Data.phone,"code":Data.code});
    }
    http_ReqIdCardRegistration(msg)
    {
        //console.log(msg);

    }
    getUserById(uid)
    {
        // body 
        let uidString = uid.toString();
        //console.log("this.users=",this.users,typeof(uidString),uidString); 
        let user=this.users[uidString];

        for(let i in this.users)
        {
            //console.log("id=",i,this.users[i])
        } 
        //console.log("返回的用户=",this.users[uidString])
        return this.users[uidString] || {}
    }
    getUid()
    {
        return this.myinfo.id;
    }
    getHeadPng(headid)
    {
        let webRootUrl=LoginMgr.getInstance().getWetRootUrl();
        // body
        return `${webRootUrl}/static/avater/default_${headid}.png`
    } 
 
    //单例处理
    private static _instance:UserMgr;
    public static getInstance ():UserMgr{
        if(!this._instance){
            this._instance = new UserMgr();
        }
        return this._instance;
    }
}
