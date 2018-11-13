import BaseMgr from "../Libs/BaseMgr";
import RoomMgr from "./RoomMgr";
import FrameMgr from "./FrameMgr";
import UserMgr from "./UserMgr"; 
 
 
//本管理器是退出房间管理器 
export default class QuitMgr extends BaseMgr{
 
    constructor (){
        super();   
        this.routes = {
            
        }
    }  
    //游戏开始后离开
    quitAfterBunchStarted(roominfo){ 
        let roomtype=roominfo.roomtype;
        //1为金币场2为房卡模式
        switch(roominfo.roomtype)
        {
            case 1:
            {  
                var okcb=function(  )
                {
                    // body
                    RoomMgr.getInstance().exitRoom()
                } 
                FrameMgr.getInstance().showDialog('游戏已经开始了,此时退出游戏,你的牌局将交由机器管家代打,输了怪我咯!',okcb.bind(this),'退出房间'); 
            }
            break;
            case 2:
            case 3:
                //是否是旁观者
                //如果是旁观者就走退出房间
                if(RoomMgr.getInstance().isWather())
                {   
                    RoomMgr.getInstance().exitRoom()
                }
                else
                {
                    RoomMgr.getInstance().applyDissolutionRoom(); 
                }
            break; 
        }
    
    }
    //游戏开始前离开
    quitBeforeBunchStarted(roominfo){
        //1为金币场2为房卡模式
        let roomvalue=RoomMgr.getInstance().getFangKaCfg();
        //房间配置，里面有支付模式
        switch(roominfo.roomtype)
        {
            case 1:
                RoomMgr.getInstance().exitRoom()
            break;
            case 2:
            case 3:
            {

                // 0: 房主支付 1: AA支付
                let roomPayType = roomvalue.v_paytype;
                //判断自己是不是房主
                let isOwner = roominfo.owner==UserMgr.getInstance().getUid();
                isOwner?this.ownerQuit(roomPayType):this.noOwnerQuit(roomPayType);
                 
            }            
            break;
        } 

    }
    ownerQuit (roomPayType) {
        let contentArr = [
            "由于本房间为房主支付房间，并且游戏未开始，所以房主退出将会解散房间，本次房间不会扣除你任何费用，是否确定解散房间!",
            "由于本房间为AA支付房间，并且游戏未开始，所以可以自由退出房间，本次房间不会扣除您任何费用，是否确定退出房间？",
            "由于本房间为赢家支付房间，并且游戏未开始，所以可以自由退出房间，本次房间不会扣除您任何费用，是否确定退出房间？"
        ]
        let titalArr = ["解散房间", "退出房间", "退出房间"]
        cc.error("房间支付类型？？", roomPayType)
        var okcb = () => {
            // AA房主退出房间是否直接退出, 服务端将房主移交给在房间内的下一个兄弟否则销毁房间
            RoomMgr.getInstance().exitRoom()
        }
        FrameMgr.getInstance().showDialog(contentArr[roomPayType], okcb,titalArr[roomPayType]);  
    }
    noOwnerQuit (roomPayType) {
        let contentArr = [
            "由于本房间为房主支付房间，并且游戏未开始，你不是房主，可以自由退出，本次房间将不会扣除您任何费用，是否确定退出房间?",
            "由于本房间为AA支付房间，并且游戏未开始，所以可以自由退出房间，本次房间不会扣除您任何费用，是否确定退出房间？",
            "由于本房间为赢家支付房间，并且游戏未开始，所以可以自由退出房间，本次房间不会扣除您任何费用，是否确定退出房间？"
        ]
        // 不是房主的情况下都是直接退出
        var okcb= () => {
            RoomMgr.getInstance().exitRoom() 
        }
        FrameMgr.getInstance().showDialog(contentArr[roomPayType], okcb,'退出房间');  
    }
    quit(){ 
        
		let roominfo=RoomMgr.getInstance().roominfo; 
        if (RoomMgr.getInstance().isBunchStarted()) {
            
            this.quitAfterBunchStarted(roominfo); 
		}
		else{ 
            this.quitBeforeBunchStarted(roominfo); 
        }  
    }
    private static _instance:QuitMgr
    public static getInstance ():QuitMgr{
        if(!this._instance){
            this._instance = new QuitMgr();
        }
        return this._instance;
    }
 
}
