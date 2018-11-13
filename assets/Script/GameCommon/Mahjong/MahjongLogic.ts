 
  
import MahjongResMgr from "./MahjongResMgr";
import { MahjongDef } from "./MahjongDef";
import RoomMgr from "../../Plat/GameMgrs/RoomMgr";
import BaseMgr from "../../Plat/Libs/BaseMgr";
import UserMgr from "../../Plat/GameMgrs/UserMgr"; 
import BetMgr from "../../Plat/GameMgrs/BetMgr";

 

//与服务器段已知的牌字典
export default class MahjongLogic extends BaseMgr
{   
    opcardarr=null;//吃碰杠的列表
    handcards=null;//手牌
    huinfo=null;//胡牌信息
    maxoptime=12;//最大操作时间
    players={};//玩家字典
    seatcount=null;//座位个数
    routes=null;//路由
    cardwallindex=null;//当前取牌墩进度
    gameid=null;//游戏id 
    jin=null;//金
    jin2=null;//第二个金
    process=null;//当前流程
    cardstate=null;//当前状态
    curseat=null;//当前位置
    zhuangseat=null;//庄家位置
    touzi1=null;//骰子1
    touzi2=null;//骰子2
    curcard=null;//当前的牌
    op_tick=null;//倒计时
    curplayer=null;//当前拥有牌权的玩家
    bunchFinish=false;//一把结束
    win_seatid=null;//流局 
    chicards={};//吃的牌   
    cardcount=0;//牌的数量
    needtongbu=false;//需要同步数据   
    mahjongcards=null;//麻将算牌
    checklevel=0;//检测的等级
    eventseat=0;//检测的座位
    cur_opseatid=null;//当前操作的人 
    servertime=null;//服务器时间
    myself=null;//玩家自己
    roundSettle=null;//每局结算
    bSanYou=false;//全局三游
    bShuangYou=false;//全局双游状态
    bDanYou=false;//全局单游状态
    isMingYou=false;//是否是明游
    isQuanZiDong=false;//全自动模式或半自动模式，主要是狗日的龙岩麻将来设计的
    prop=null;
    haidilaoyueInfo=null;//海底捞月信息
    bViewMode=false;//录像模式
    lianzhuang=0;//连庄次数
    //重写是否可以合法路由
    isValidToRoute(){
        return RoomMgr.getInstance().getMySeatId()!=null; 
    }
    destroy()
    {  
        super.destroy(); 
    }
    
    constructor()   
    {
        super();
        this.maxoptime=12; 
        this.players={}; 
        let roomInfo= RoomMgr.getInstance().getRoomInfo()
        if(!roomInfo) {
            return;
        }
        this.gameid=BetMgr.getInstance().getGameId();
        this.seatcount=roomInfo.seatcount;//座位个数  

        this.routes={ 
            onProcess:this.onProcess,   
            onEvent:this.onEvent, 
            onSeatChange:this.onSeatChange, 
            onOp:this.onOp, 
            onSyncData:this.onSyncData,
            'http.reqSettle':this.http_reqSettle,  
            onGmOp:this.onGmOp,
        } 
        this.bViewMode=RoomMgr.getInstance().getVideoMode();
        this.initMahjong();
        this.resetData();
    }
    initMahjong(){

    }
    getMahjongCards(){
        return this.mahjongcards;
    }
    //需要派生类重写 
    isDanYou(){
        return this.bDanYou;
    }
    isShuangYou(){
        return this.bShuangYou;
    }

    //获得剩余牌的数量
    getLeftCardCount(  )
    {
        // body
        return this.cardcount-this.cardwallindex;
    }  
    onSyncData(msg)
    { 
        //录像回放模式下的同步数据实际上是快退,不要去resetData 
        if(this.bViewMode)
        {}
        else
        { 
            this.resetData(); 
        }
        this.cardcount=msg.cardcount;//牌个数
        this.process=msg.process;//当前流程 
        this.curseat=msg.curseat;//当前位置
        this.curcard=msg.curcard;//当前的牌
        this.op_tick=msg.op_tick;//当前计时器
        this.curplayer=this.players[this.curseat]//当前玩家
        this.cardwallindex=msg.cardwallindex;//当前拿牌进度  
        if(this.bViewMode)
        {
            //录像的恢复
            // body         
            for (let seatid=0;seatid<this.seatcount;++seatid)
            { 
                this.players[seatid].initHandCard(msg.handcards[seatid])  
                this.players[seatid].cardpool=msg.cardpools[seatid]
                let huapai=msg.huapais[seatid]
                let tmphuapai={}; 
                for(let value in huapai) 
                {
                    let count=huapai[value] 
                    tmphuapai[parseInt(value)]=count;
                }
                this.players[seatid].huapais=tmphuapai;
                this.players[seatid].opcards=msg.opcards[seatid]
            } 
        }
        else
        {
            let myseatid=RoomMgr.getInstance().getMySeatId();
            this.myself=this.players[myseatid]; 
            this.jin=msg.jin; //当前的金
            this.jin2=msg.jin2; //当前的金 
            this.cardstate=msg.cardstate;//牌的状态
            this.zhuangseat=msg.zhuangseat;//庄家位置
            this.touzi1=msg.touzi1;//骰子1
            this.touzi2=msg.touzi2;//骰子2   
            this.bShuangYou=msg.bShuangYou;//当前全局双游状态
            this.bDanYou=msg.bDanYou;//当前全局单游状态
            this.myself.youjinstate=msg.youjinstate;//当前游金状态
            this.myself.enableYouJin=msg.enableYouJin;//是否允许游金
            this.myself.b_finishYouJin=msg.b_finishYouJin;//是否结束游金 
            this.mahjongcards.setJin(this.jin,this.jin2);
            //在这边要恢复自己排序的牌,不要让排序破坏了自己刚摸到的牌的位置
            let hasPreCard=false;
            for (let seatid=0;seatid<this.seatcount;++seatid)
            {
                if (seatid == myseatid){
                    if(msg.handcard.length%3==2)//表示轮到自己了,就看看curcard
                    {
                        if(msg.curcard!=null)//找出里面的牌
                        {
                            hasPreCard=true;
                            let handcard=msg.handcard.concat();
                            //将当前的牌移除
                            for(let i=0;i<handcard.length;++i)
                            {
                                if(handcard[i]==msg.curcard)
                                {
                                    handcard.remove(i);
                                    break;
                                }
                            }
                            //整理白板位置
                            this.myself.tidyBaiBan(handcard) 
                            handcard.push(msg.curcard)
                            msg.handcard=handcard.concat();
                        }
                    }
                    this.players[seatid].initHandCard(msg.handcard)
                }
                else{ 
                    let len=msg.others[`${seatid}`]//他妈的json数字不能做key 
                    this.players[seatid].fillOthersCard(len)
                }
                this.players[seatid].cardpool=msg.cardpools[seatid]
                let huapai=msg.huapais[seatid]
                let tmphuapai={}; 
                for(let value in huapai) 
                {
                    let count=huapai[value] 
                    tmphuapai[parseInt(value)]=count;
                }
                this.players[seatid].huapais=tmphuapai;
                this.players[seatid].opcards=msg.opcards[seatid]
            }   
            //资源重新加载
            MahjongResMgr.getInstance().clear();   
            this.myself.setEvents(msg.events);
            this.myself.replaceJin(!hasPreCard);//如果是又旧的不需要排序的牌,就不要让他排序
            MahjongResMgr.getInstance().setJin(this.jin,this.jin2)
        }
    }
    tuoGuan( bvalue)
    {
        // body
        let msg={
            'deposit':bvalue
        }
        this.send_msg('room.roomHandler.deposit',msg)
    } 
    
    resetData(  )
    {
        // body 
        this.bSanYou=false;//全局三游状态
        this.bShuangYou=false;//全局双游状态
        this.bDanYou=false;//全局单游状态
        this.win_seatid=null;//流局
        this.op_tick=0;//操作计时
        this.cardstate=0;//记录牌变化  
        this.chicards={};//吃的牌
        this.cardwallindex=1;//记录牌墙当前索引
        this.touzi1=0;//骰子1
        this.touzi2=0;//骰子2
        this.curseat=0;//当前出手座位
    
        this.jin=0;//金1
        this.jin2=0;//金2
        this.curcard=null;//当前出的牌  
        this.needtongbu=false;//需要同步数据 
        this.curplayer=null;//当前出手玩家
        this.zhuangseat=0;//庄家位置
   
        this.eventseat=0;//检测的座位
        this.cur_opseatid=null;//当前操作的人

        for(let i = 0;i<this.seatcount;++i)
        {  
            this.players[i].resetData();
        }  
        this.process=MahjongDef.process_ready;
    }
    //玩家操作
    onOp(msg)
    {
        // body
        if(!this.myself) {
            let myseatid=RoomMgr.getInstance().getMySeatId();
            this.myself=this.players[myseatid]; 
        }
        this.myself.clearEvent();
        let event=msg.event; 
        let op=MahjongDef.op_cfg[event]
        this.cur_opseatid=msg.opseatid;
        //配置操作接收
        let opdic={};
        opdic[MahjongDef.op_chupai]=this.op_chupai;//出牌
        opdic[MahjongDef.op_hu]=this.op_hu;//胡
        opdic[MahjongDef.op_qianggang_hu]=this.op_qianggang_hu;//抢杠胡
        opdic[MahjongDef.op_peng]=this.op_peng;//碰
        opdic[MahjongDef.op_gang]=this.op_gang;//杠
        opdic[MahjongDef.op_angang]=this.op_angang;//暗杠
        opdic[MahjongDef.op_chi]=this.op_chi;//吃
        opdic[MahjongDef.op_zimo]=this.op_zimo;//自摸
        opdic[MahjongDef.op_bugang]=this.op_bugang;//补杠
        opdic[MahjongDef.op_gaipai]=this.op_gaipai;//盖牌
        opdic[MahjongDef.op_qiangjinhu]=this.op_qiangjinhu;//抢金胡
        opdic[MahjongDef.op_sijindao]=this.op_sijindao;//四金倒
        opdic[MahjongDef.op_wujindao]=this.op_wujindao;//五金倒
        opdic[MahjongDef.op_liujindao]=this.op_liujindao;//六金倒
        opdic[MahjongDef.op_tianhu]=this.op_tianhu;//天胡
        opdic[MahjongDef.op_gaibaoqiangjin]=this.op_gaibaoqiangjin;//四金倒
        let func=opdic[op];
        //更新手牌
        let hudic=[];
        hudic.push(MahjongDef.op_sanjindao);
        hudic.push(MahjongDef.op_danyou);
        hudic.push(MahjongDef.op_shuangyou);
        hudic.push(MahjongDef.op_sanyou);
        hudic.push(MahjongDef.op_bazhanghua);
        hudic.push(MahjongDef.op_hu);
        hudic.push(MahjongDef.op_zimo);
		////console.log("onOp=",msg);
        if(func)
        {
            opdic[op].bind(this)(msg);
        }
        if(hudic.contain(op))
        {
            for (let k in msg.handcards){
                let handcard=msg.handcards[k];
                let seatid=parseInt(k); 
                //整理白板位置
                this.myself.tidyBaiBan(handcard);
                this.players[seatid].updateHandCard(handcard);
            }
        }
        
    }
    //抢金胡
    op_qiangjinhu(msg)
    {

    }
    //四金倒
    op_sijindao(msg)
    {
        
    }
    //五金倒
    op_wujindao(msg)
    {
        
    }
    //六金倒
    op_liujindao(msg)
    {
        
    }
    //天胡
    op_tianhu(msg)
    {
        
    }
    //盖宝抢金
    op_gaibaoqiangjin(msg)
    {
        
    }
    //盖牌
    op_gaipai(msg)
    {  
        let player=this.players[msg.opseatid]; 
        if(!this.myself) {
            let myseatid=RoomMgr.getInstance().getMySeatId();
            this.myself=this.players[myseatid]; 
        }
        this.myself.clearEvent(); 
        player.removeCard(msg.card) 
        player.putInPool(msg.card)//盖牌打到牌池中 
        player.sortCard();  
        switch(msg.youjinstate)
        {
            case MahjongDef.youjinstate_shuangyou:
                ////console.log("全局双游")
                this.bShuangYou=true;
            break;
            case MahjongDef.youjinstate_danyou:
                ////console.log("全局单游")
                this.bDanYou=true;
            break;
        }  
    }
    //胡
    op_hu(msg)
    {
        // body 
        let opplayer=this.players[msg.opseatid];//抢杠胡的人
        opplayer.pushCard(this.curcard)//加到操作者手中
        this.curcard=null; 
    }
    op_qianggang_hu(msg)
    {
        // body 
        let opplayer=this.players[msg.opseatid];//抢杠胡的人
        opplayer.pushCard(msg.bugangCard)//加到操作者手中
        this.curcard=null; 
        ////console.log("抢杠胡了")
        let bugangPlayer=this.players[msg.bugangSeatId]; 
        bugangPlayer.recoverPeng(msg.bugangCard); 
        bugangPlayer.sortCard();//排序 
    }
    //自摸
    op_zimo(msg)
    {
        // body 
        let player=this.players[msg.opseatid];
        //2419 【龙岩麻将】七对自摸结算时胡牌方式显示错误
        this.curcard=null;
    }
    //玩家杠牌
    op_gang(msg){
        // body 
        let player=this.players[msg.opseatid];
        this.curplayer.removeCardFromPool();
        player.removeCardByCount(this.curcard,3) 
        player.pushGang(this.curcard);
        this.curcard=null;
    }

    //玩家补杠
    op_bugang(msg){
        // body 
        ////console.log("补杠了")
        let player=this.players[msg.opseatid];
        player.removeCardByCount(msg.card,1) 
        player.pushBuGang(msg.card);
        this.curcard=null;
    }

    //玩家暗杠
    op_angang(msg){
        // body 
        ////console.log("暗杠了")
        let player=this.players[msg.opseatid];
        player.removeCardByCount(msg.card,4) 
        player.pushAnGang(msg.card);
        this.curcard=null;
    }
    //玩家碰牌
    op_peng(msg)
    {
        //碰者移除自己手上的牌
        let player=this.players[msg.opseatid];
        player.removeCardByCount(this.curcard,2) 
        //被碰撞移除出牌牌池里的牌
        this.curplayer.removeCardFromPool();
        player.pushPeng(this.curcard);
        this.curcard=null;
        //碰者有可能会被取消游金状态
        if(msg.bCancelYouJin)
        {
            this.bShuangYou=false;
            this.bDanYou=false;
            player.cancelYouJinState();
        }
    }
    //玩家吃牌
    op_chi(msg)
    {
        // body 
        ////console.log(msg)
        let player=this.players[msg.opseatid];
        this.curplayer.removeCardFromPool();
        let cards=player.getChiCards(msg.chiindex)
        player.removeCards(cards);
        player.pushChi(msg.chiindex,cards);
        this.curcard=null;
    }
    //玩家出牌
    op_chupai(msg) 
    {
        //放入牌池中  
        this.curcard=msg.card; 
        this.curplayer.putInPool(msg.card) 
        this.curplayer.removeCard(msg.card); 
        this.curplayer.sortCard();  
        switch(msg.youjinstate)
        {
            case MahjongDef.youjinstate_shuangyou:
                this.curplayer.setYouJinState(MahjongDef.youjinstate_shuangyou);
                this.bShuangYou=true;//全局双游
            break;
            case MahjongDef.youjinstate_sanyou:
                this.curplayer.setYouJinState(MahjongDef.youjinstate_sanyou);
                this.bSanYou=true;//全局三游
            break;
        } 
    }
    //麻将事件
    onEvent(msg)
    {
        if(!this.myself) {
            let myseatid=RoomMgr.getInstance().getMySeatId();
            this.myself=this.players[myseatid]; 
        }
        this.myself.setEvents(msg.events); 
    }
 
    //麻将进度
    onProcess(msg)
    {
        ////console.log("收到process=",msg)
        this.process=msg.process; 
        if (this.process==MahjongDef.process_dingzhuang){ 
            this.process_dingzhuang(msg);
        }
        else if( this.process==MahjongDef.process_fapai){ 
            this.process_fapai(msg);
        }
        else if( this.process==MahjongDef.process_buhua){ 
            this.process_buhua(msg);
        }
        else if( this.process==MahjongDef.process_kaijin){ 
            this.process_kaijin(msg); 
        }
        else if( this.process==MahjongDef.process_ready){ 
            this.process_ready(msg);  
        }
        else if( this.process==MahjongDef.process_loop){ 
            this.process_loop();  
        }
        else if( this.process==MahjongDef.process_haidilaoyue){ 
            this.process_haidilaoyue(msg);  
        } 
    }
    process_haidilaoyue(msg){
        this.haidilaoyueInfo=msg.haidilaoyueInfo; 
    }  
    process_loop()
    {
        if(!this.myself) {
            let myseatid=RoomMgr.getInstance().getMySeatId();
            this.myself=this.players[myseatid]; 
        }
        this.myself.sortCard();
    }
    //游戏结算
    http_reqSettle(msg)
    { 
        let settle=JSON.parse(msg.settle);  
        this.win_seatid=settle.win_seatid; 
        for (let k in settle.handcards){
            let seatid=parseInt(k);
            let handcard=settle.handcards[k];
            //整理白板
            //先去掉最后一张牌
            let lastCard=null;
            if(handcard.length%3==2)
            {
                lastCard=handcard[handcard.length-1];
                handcard.remove(handcard.length-1);//移掉最后一张牌
            }
            if(!this.myself) {
                let myseatid=RoomMgr.getInstance().getMySeatId();
                this.myself=this.players[myseatid]; 
            }
            this.myself.tidyBaiBan(handcard);
            if(lastCard!=null)
            {
                handcard.push(lastCard)
            }
            if(this.win_seatid==seatid)
            { 
                let winnerItem=settle.wanjiashuis[k];
                if(winnerItem&&winnerItem.hutime==MahjongDef.hutime_qiangjinhu)
                {
                    //将金牌移出一个到后面
                    handcard.remove(0);
                    handcard.push(0);
                }
            }
            settle.handcards[k]=handcard; 
            this.players[seatid].updateHandCard(handcard);
        } 
        this.roundSettle = settle; 
    }
    //游戏准备
    process_ready(msg)
    {
        // body
        this.resetData();
        if(!RoomMgr.getInstance().isFirstRound())
        { 
            this.myself=this.players[RoomMgr.getInstance().myseatid]; 
            MahjongResMgr.getInstance().clear();
            this.resetData();  
            let bunchInfo=RoomMgr.getInstance().getBunchInfo();
            this.zhuangseat=bunchInfo.zhuangseat; 
            this.curseat=this.zhuangseat;
            this.curplayer=this.players[this.curseat]
            ////console.log("第二局了=",this.zhuangseat,this.curseat,this.curplayer)
        } 
    }

    //定庄
    process_dingzhuang(msg){
        // body  
        this.myself=this.players[RoomMgr.getInstance().myseatid]; 
        MahjongResMgr.getInstance().clear();
        this.resetData(); 
        this.touzi1=msg.touzi1;
        this.touzi2=msg.touzi2;
        this.zhuangseat=msg.zhuangseat;
        this.curseat=msg.zhuangseat;
        this.curplayer=this.players[this.curseat]  
    }
    //发牌
    process_fapai(msg){
        // body   
        this.cardwallindex=msg.cardwallindex;
        this.cardcount=msg.cardcount;
        let myseatid=RoomMgr.getInstance().getMySeatId();  
        if(this.bViewMode)
        {
            //房卡只有第一局才有定庄的概念,所以后面都是用发牌直接把庄家传进来
            this.myself=this.players[myseatid];
            //录像是没有开局概念的所以都在发牌时候确定一些信息
            this.zhuangseat=msg.zhuangseat;
            this.curseat=msg.zhuangseat;
            this.curplayer=this.players[this.curseat]   
            this.lianzhuang=msg.lianzhuang;
            this.cardcount=msg.cardcount; 
            for (let seatid=0;seatid<this.seatcount;++seatid){   
                this.players[seatid].initHandCard(msg.handcards[seatid]) 
            }
        }
        else
        {
            for (let seatid=0;seatid<this.seatcount;++seatid){  
                
                if (seatid == myseatid){ 
                    //全部填充，屏幕所有者只关心自己的牌就够了  
                    this.players[seatid].initHandCard(msg.handcard)
                }
                else 
                {
                    let len=msg.others[`${seatid}`]//他妈的js数字不能做key
                    this.players[seatid].fillOthersCard(len)
                }
            }
        } 
    }
    //补花
    process_buhua(msg){
        // body
        this.cardwallindex=msg.cardwallindex; 
        for(var  seatid = 0;seatid<msg.huapaiarr.length;++seatid){  
            this.players[seatid].buHua(msg.huapaiarr[seatid],msg.bupaiarr[seatid]);
        }
    }
    //牌权改变
    onSeatChange(msg){ 
        // body 
        this.curseat=msg.curseat; 
        this.curcard=msg.card; 
        this.curplayer=this.players[this.curseat]
        if (msg.needbupai){   
            if (msg.huaarr){ 
                for (let i=0;i<msg.huaarr.length;++i){  
                    this.curplayer.putInHua(msg.huaarr[i])
                }  
            }
            this.cardwallindex=msg.cardwallindex; 
            this.curplayer.pushCard(msg.card)  
        }    
    }
    
    //开金
    process_kaijin(msg){
        this.cardwallindex=msg.cardwallindex; 
        this.jin=msg.jin; 
        this.jin2=msg.jin2;
        this.mahjongcards.setJin(this.jin,this.jin2);
        //因为要做动画,所在在换金前做排序
        //录像模式下所有人都换金
        if(this.bViewMode )
        {
            for(let i = 0;i<this.seatcount;++i)
            {
                let player=this.players[i];
                player.sortCard(); 
                player.replaceJin();
            }
        }
        else
        {
            if(!this.myself) {
                let myseatid=RoomMgr.getInstance().getMySeatId();
                this.myself=this.players[myseatid]; 
            }
            this.myself.sortCard(); 
            this.myself.replaceJin();
        }
        ////console.log("哈哈哈=",this.jin,this.jin2)
        MahjongResMgr.getInstance().setJin(this.jin,this.jin2)
     
    }
    //玩家操作
    playerOp(event,data){
        // body 
        ////console.log("send playerOp event=",event,data)
        ////console.log("this.curplayer=",this.curplayer,"this.curseat=",this.curseat)
        let msg={event:event}
        let op=MahjongDef.op_cfg[event]  
        if(op==MahjongDef.op_chupai){  //出牌
            msg['data']=this.curplayer.getCard(data);
        } 
        if(op==MahjongDef.op_gaipai){  //盖牌
            msg['data']=this.curplayer.getCard(data);
        }
        else if(op==MahjongDef.op_chi){
            msg['data']=data;
        }
        else if(op==MahjongDef.op_angang){ 
            msg['data']=data;
        } 
        else if(op==MahjongDef.op_bugang){ 
            msg['data']=data;
        } 
    
        this.send_msg('room.roomHandler.playerOp',msg);
    }
    //玩家取消
    playerCancel()
    { 
        this.send_msg('room.roomHandler.playerCancel',{});
    }
    
 
    //检查是否掉数据
    checkCardState(msg){
        //先同步状态
        let cardchanged=msg.cardchanged;
        let cardstate=msg.cardstate;
        if(cardchanged){ 
            if(cardstate-this.cardstate!=1){ 
                ////console.log("牌状态错位")
                return false
            }
        }
        else
        {
            if(cardstate!=this.cardstate){ 
                ////console.log("牌状态错位")
                return false
            }
        }
        //同步牌的状态
        this.cardstate=cardstate;
        return true
    }
    //gm操作
    gmOp(msg)
    { 
        this.send_msg('room.roomHandler.gmOp',msg);
    }
    //gm请求
    gmReq(msg)
    { 
        this.send_msg('room.roomHandler.gmReq',msg);
    }
 
    //收到gmop广播
    onGmOp(msg)
    {
        if(!msg)
        {
            return;
        }
        let optype=msg.optype;
        let opseatid=msg.opseatid;
        let data=msg.data;
        let src=data.src;
        let dest=data.dest;
        let target=data.target
        ////console.log("logic onGmOp msg=",msg)
        switch(optype)
        {
            //换牌操作
            case MahjongDef.gmop_changecard:
                if(opseatid==RoomMgr.getInstance().getMySeatId())
                {
                    //如果是我自己则修改自己的牌
                    this.players[opseatid].switchCard(src,dest);
                }
                if(target==RoomMgr.getInstance().getMySeatId()){
                    //如果是我的牌被人换了
                    this.players[target].switchCard(dest,src);
                }
            break;
        }
    }
    getRecordFrag(){ 
        //获取当前的全部数据和状态
        let handcards=[];
        let opcards=[];
        let huapais=[];
        let cardpools=[];
        for(let seatId=0;seatId<this.seatcount;++seatId)
        {
            handcards[seatId]=this.players[seatId].handcard;
            opcards[seatId]=this.players[seatId].opcards;
            huapais[seatId]=this.players[seatId].huapais;
            cardpools[seatId]=this.players[seatId].cardpool;
        }
        let fragData={
            handcards:handcards,
            opcards:opcards,
            huapais:huapais,
            cardpools:cardpools,
            curseat:this.curseat,
            cardcount:this.cardcount,
            cardwallindex:this.cardwallindex,
            op_tick:this.op_tick,
            curcard:this.curcard,
        }
        return JSON.stringify(fragData);
    }
    
}
 
 


 
 
