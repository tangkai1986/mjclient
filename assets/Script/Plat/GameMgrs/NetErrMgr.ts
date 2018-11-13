import RoomMgr from "./RoomMgr"; 
import LocalStorage from "../Libs/LocalStorage";
import FrameMgr from "./FrameMgr";
import ModuleMgr from "./ModuleMgr";   
import LoginMgr from "./LoginMgr";
import GameNet from "../NetCenter/GameNet";

//
 
 
export default class NetErrMgr{ 
    //单例处理
    private static _instance:NetErrMgr; 
    public static getInstance ():NetErrMgr{
        if(!this._instance){
            this._instance = new NetErrMgr();
        }
        return this._instance;
    }
    start_module(){

    } 
    dealWithError(code)
    { 
        switch(code)
        {
            //断开服务器
            case 500:
                GameNet.getInstance().disconnect();
            return true;
            case 10030021://房间相关错误
            case 10030020:
            case 10030024:
            case 10030041:
            case 10030053:
                //检测自己的房间状态 
			    RoomMgr.getInstance().reqMyRoomState();
            return true;
            case 20010001://token无效
            case 10020004://token错误
                //清除登录缓存 
                var okcb=function(  )
                { 
                    // body 
                    LocalStorage.getInstance().removeWeChatToken(); 
                    //重启游戏
                    cc.audioEngine.stopAll();
                    cc.game.restart(); 
                } 
                FrameMgr.getInstance().showMsgBox('token过期,请重启',okcb.bind(this));
            return true;
            case 20030018://房间已解散
            case 10030017://不在房间中
            case 10030042://找不到房间信息 
                var okcb=function(  )
                { 
                    // body 
                    RoomMgr.getInstance().reqMyRoomState();
                } 
                RoomMgr.getInstance().broadCastroomDestroy();
                FrameMgr.getInstance().showMsgBox('房间已解散',okcb.bind(this));
            return true;
            default:
            return false;
        }
        return false;
    }
}