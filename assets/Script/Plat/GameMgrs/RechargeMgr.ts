//
import BaseMgr from "../Libs/BaseMgr";
import UserMgr from "./UserMgr";

import MyMd5 from "../Libs/MyMd5";
import FrameMgr from "./FrameMgr";
import GoodsCfg from "../CfgMgrs/GoodsCfg";
import SwitchMgr from "./SwitchMgr";


export default class RechargeMgr extends BaseMgr{
    billid:any = null
    routes:{} = null
    infoList = null
    b_fromPayment = null;
    constructor (){
        super();

        this.billid=null;
        this.routes={
            'http.reqBill':this.http_reqBill, 
            'onPay' : this.onPay,
            //ios line
            "http.reqIosRecharge":this.http_reqIosRecharge,
            "http.reqGoodsList":this.http_reqGoodsList,
            "onNotify":this.onNotify,
        }
        this.infoList = null;
        this.b_fromPayment = false;
    }

    setFromPayment(bool){
        this.b_fromPayment = bool;
    }

    getFromPayment(){
        return this.b_fromPayment;
    }
   
    onPay(msg){ 
        //不直接刷新我的物品信息，要点击领取后主动获取
    }
    http_reqBill(msg) {
        this.billid=msg.billid; 
        this.send_msg('http.reqPay',{billid:this.billid});
    }
    http_reqIosRecharge(msg){
        //console.log("http_reqIosRecharge", msg);
    }
    http_reqGoodsList(msg){
        this.infoList = msg.result;
        //console.log("http_reqGoodsList", this.infoList);
    }
    getGoodsList()
    {
        return this.infoList;
    }
    onNotify(msg){
        //console.log("onNotify");
        if (msg.type == 7){
            if (msg.state == 0){
                FrameMgr.getInstance().showMsgBox("充值成功！此次充值获得"+msg.gold+"钻", ()=>{}, "恭喜");
                UserMgr.getInstance().reqMyInfo();
            }else{
                FrameMgr.getInstance().showMsgBox("充值失败", ()=>{}, "提示");
            }
        }
    }

    reqBill(id){
        let billinfo={ 
            'id':id,
        }
        this.send_msg('http.reqBill',billinfo);
    }
    reqPay(billid){
        let billinfo={
            'billid':billid, 
        }
        this.send_msg('http.reqPay',billinfo);
    } 
    //goodstype:1表示钻石/元宝 2表示房卡，3表示金币
    //goodsid是列表中的id
    reqBuyGoods(goodstype,goodsid,goodnum){
        if (cc.sys.os == cc.sys.OS_IOS) {
            this.Ios_Recharge();
        }else{
            let goodsinfo={
                'goodstype':goodstype, 
                'goodsid':goodsid, 
                'goodnum':goodnum,
            }
            this.send_msg('http.reqBuyGoods',goodsinfo);
        }
        
    }
    private tsMd5(str){
        /*var crypto = require('crypto');
        var md5 = crypto.createHash("md5");
        md5.update(str);
        md5.digest('hex');*/
        var md5= MyMd5(str);
        md5 = md5.slice(5);
        return md5.toUpperCase();
    }

    reqReqGoodsList(){
        this.send_msg("http.reqGoodsList");
    }

    reqRechargeApi(uid, gameid, count){
        let strData = "?";
        var timestamp = Date.parse(new Date()) / 1000;
        strData = strData+"time="+timestamp+"&";
        strData = strData+"count="+count+"&";
        strData = strData+"guid="+uid+"&";
        strData = strData+"gpid="+gameid+"&";
        let str = ""+uid+timestamp;
        //console.log(strData);

        strData = strData+"sign="+this.tsMd5(str);
        //console.log("reqRechargeApi",strData);
        // cc.sys.openURL("http://pay.088wanmei.com/api"+strData);
    }

    Ios_Recharge(ios_pay_id){
        //console.log("ios getBatteryPercent");
        jsb.reflection.callStaticMethod("AppController", "Charge:title:", "ios_recharge", ios_pay_id);
    }

    toIosrecharge(msg){
        if (msg == ""){
            //console.log("ios 内购失败！");
        }else{
            //console.log("ios 内购成功！");
            let info =  {
                "apple_receipt":msg,
            }
            this.send_msg('http.reqIosRecharge', info);
        }
        this.gemit("apple_receipt", {state:false});
    }


    //单例处理
    private static _instance:RechargeMgr;
    public static getInstance ():RechargeMgr{
        if(!this._instance){
            this._instance = new RechargeMgr();
        }
        return this._instance;
    }
}

window["ios_recharge"] = function ios_recharge(msg){
    RechargeMgr.getInstance().toIosrecharge(msg);
}

//内购对接函数
/*window["ios_recharge"] = function ios_recharge(msg){
    if (msg == ""){
        //console.log("ios 内购失败！");
    }else{
        //console.log("ios 内购成功！", msg);
        let isSandbox = true;
        let requestURL:string = "";
        if(isSandbox)
        {
            requestURL = "https://sandbox.itunes.apple.com/verifyReceipt";
        }else {
            requestURL = "https://buy.itunes.apple.com/verifyReceipt";
        }

        let xhr = cc.loader.getXMLHttpRequest();   
		let self=this;
		xhr.onreadystatechange = function () {   
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {  
				let respone = xhr.responseText;   
				let resp = JSON.parse(respone)
				let head=resp.head;
				let body=resp.body;  
			}  
		};   
		// note: In Internet Explorer, the timeout property may be set only after calling the open()  
		// method and before calling the send() method.  
		xhr.timeout = 5000; 
		xhr.onerror = (error)=> {
            //console.log("客户端出错啦webPostReq")
        } 
        let list =  {
            "receipt-data":msg,
        }

		xhr.open("POST", requestURL, true); 
		xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");   
		xhr.send(JSON.stringify(list)); 
		 
    }
}*/