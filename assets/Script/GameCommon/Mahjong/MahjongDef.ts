  

let MahjongDef={};

//事件定义 
MahjongDef.looprc_op=1;//主循环录像类型-操作
MahjongDef.looprc_seatchange=2;//主循环录像类型-牌权切换
MahjongDef.looprc_event=3;//主循事件类型

 
 
 
//gm操作

MahjongDef.gmop_changecard=1;//gm换牌
MahjongDef.gmop_changewallorder=2;//gm更换牌墙顺序
MahjongDef.gmreq_cards=1;//gm请求牌型

//游金状态
MahjongDef.youjinstate_null=0;//没有游
MahjongDef.youjinstate_danyou=1;//单游
MahjongDef.youjinstate_shuangyou=2;//双游游
MahjongDef.youjinstate_sanyou=3;//三游





MahjongDef.state_idle=1;//等待状态
MahjongDef.state_chupai=2;//出牌状态
MahjongDef.state_event=3;//事件状态
MahjongDef.state_gaipai=4;//盖牌状态




MahjongDef.process_ready=1;//准备
MahjongDef.process_cheatcheck=2;//作弊检测
MahjongDef.process_dingzhuang=3;//定桩
MahjongDef.process_fapai=4;//发牌
MahjongDef.process_buhua=5;//补花
MahjongDef.process_kaijin=6;//开金 
MahjongDef.process_loop=7;//牌局循环 
MahjongDef.process_haidilaoyue=8;//海底捞月 
MahjongDef.process_gamesettle=9;//游戏结算  


//服务器检测各种时间的等级
 
//操作优先级从小到大 
MahjongDef.event_chupai=1;//出牌
MahjongDef.event_gaipai=2;//盖牌
MahjongDef.event_chi=3;//检测吃  
MahjongDef.event_peng=4;//检测碰
MahjongDef.event_gang=5;//检测杠
MahjongDef.event_angang=6;//检测暗杠
MahjongDef.event_bugang=7;//检测补杠
MahjongDef.event_zimo=8;//检测自摸
MahjongDef.event_sanjindao=9;//三金倒  
MahjongDef.event_hu=10;//检测胡
MahjongDef.event_qianggang_hu=11;//抢杠胡
MahjongDef.event_danyou=12;//单游
MahjongDef.event_shuangyou=13;//双游
MahjongDef.event_sanyou=14;//三游
MahjongDef.event_bazhanghua=15;//八张花
MahjongDef.event_qiangjinhu=16;//抢金胡
MahjongDef.event_sijindao=17;//四金倒  
MahjongDef.event_wujindao=18;//五金倒  
MahjongDef.event_liujindao=19;//六金倒  
MahjongDef.event_tianhu=20;//天胡  
MahjongDef.event_gaibaoqiangjin=21;//盖宝抢金  

//玩家操作
 
MahjongDef.op_hu=1;//胡 
MahjongDef.op_angang=2;//暗杠
MahjongDef.op_gang=3;//杠
MahjongDef.op_peng=4;//碰
MahjongDef.op_chi=5;//吃
MahjongDef.op_chupai=6;//出牌
MahjongDef.op_bugang=7;//补牌 
MahjongDef.op_zimo=9;//自摸
MahjongDef.op_sanjindao=11;//三金倒
MahjongDef.op_qianggang_hu=12;//抢杠胡
MahjongDef.op_danyou=13;//游金
MahjongDef.op_shuangyou=14;//双游
MahjongDef.op_sanyou=15;//三游
MahjongDef.op_bazhanghua=16;//八张花
MahjongDef.op_cancel=20;//取消
MahjongDef.op_gaipai=21;//盖牌
MahjongDef.op_qiangjinhu=22;//抢金胡
MahjongDef.op_sijindao=23;//四金倒
MahjongDef.op_wujindao=24;//五金倒
MahjongDef.op_liujindao=25;//六金倒
MahjongDef.op_tianhu=26;//天胡
MahjongDef.op_gaibaoqiangjin=27;//盖宝抢金 
 
 

//客户端通知事件
MahjongDef.onOp='onOp';//操作通知
MahjongDef.onSeatChange='onSeatChange';//牌权改变通知
MahjongDef.onEvent='onEvent';//牌事件通知
MahjongDef.onProcess='onProcess';//进度通知 
MahjongDef.onSyncData='onSyncData';//同步数据
MahjongDef.onDeposit='onDeposit';//托管
MahjongDef.onGmOp='onGmOp';//gm操作通知 

MahjongDef.op_cfg={}
MahjongDef.op_cfg[MahjongDef.event_hu]=MahjongDef.op_hu;//胡
MahjongDef.op_cfg[MahjongDef.event_angang]=MahjongDef.op_angang;//暗杠
MahjongDef.op_cfg[MahjongDef.event_bugang]=MahjongDef.op_bugang;//补杠
MahjongDef.op_cfg[MahjongDef.event_gang]=MahjongDef.op_gang;//杠
MahjongDef.op_cfg[MahjongDef.event_peng]=MahjongDef.op_peng;//碰
MahjongDef.op_cfg[MahjongDef.event_chi]=MahjongDef.op_chi;//吃
MahjongDef.op_cfg[MahjongDef.event_zimo]=MahjongDef.op_zimo;//自摸
MahjongDef.op_cfg[MahjongDef.event_chupai]=MahjongDef.op_chupai;//出牌
MahjongDef.op_cfg[MahjongDef.event_sanjindao]=MahjongDef.op_sanjindao;//三金倒
MahjongDef.op_cfg[MahjongDef.event_qianggang_hu]=MahjongDef.op_qianggang_hu;//抢杠胡 
MahjongDef.op_cfg[MahjongDef.event_danyou]=MahjongDef.op_danyou;//单游 
MahjongDef.op_cfg[MahjongDef.event_shuangyou]=MahjongDef.op_shuangyou;//双游 
MahjongDef.op_cfg[MahjongDef.event_sanyou]=MahjongDef.op_sanyou;//三游 
MahjongDef.op_cfg[MahjongDef.event_bazhanghua]=MahjongDef.op_bazhanghua;//八张花 
MahjongDef.op_cfg[MahjongDef.event_gaipai]=MahjongDef.op_gaipai;//盖牌 
MahjongDef.op_cfg[MahjongDef.event_qiangjinhu]=MahjongDef.op_qiangjinhu;//抢金胡 
MahjongDef.op_cfg[MahjongDef.event_sijindao]=MahjongDef.op_sijindao;//四金倒
MahjongDef.op_cfg[MahjongDef.event_wujindao]=MahjongDef.op_wujindao;//五金倒 
MahjongDef.op_cfg[MahjongDef.event_liujindao]=MahjongDef.op_liujindao;//六金倒 
MahjongDef.op_cfg[MahjongDef.event_tianhu]=MahjongDef.op_tianhu;//天胡
MahjongDef.op_cfg[MahjongDef.event_gaibaoqiangjin]=MahjongDef.op_gaibaoqiangjin;//盖宝抢金 
 



//按胡牌的时机 
MahjongDef.hutime_zimo=5;//自摸
MahjongDef.hutime_danyou=6;//单游
MahjongDef.hutime_shuangyou=7;//双游
MahjongDef.hutime_sanyou=8;//三游
MahjongDef.hutime_bazhanghua=9;//八张花
MahjongDef.hutime_dianpao=10;//吃胡 
MahjongDef.hutime_sanjindao=11;//三金倒
MahjongDef.hutime_qiangganghu=12;//抢杠胡
MahjongDef.hutime_qiangjinhu=13;//抢金胡
MahjongDef.hutime_sijindao=14;//四金倒
MahjongDef.hutime_wujindao=15;//五金倒
MahjongDef.hutime_liujindao=16;//六金倒
MahjongDef.hutime_tianhu=17;//天胡
MahjongDef.hutime_gaibaoqiangjin=18;//盖宝抢金 

  
MahjongDef.hutimenames={};
MahjongDef.hutimenames[MahjongDef.hutime_zimo]='自摸';
MahjongDef.hutimenames[MahjongDef.hutime_danyou]='游金';
MahjongDef.hutimenames[MahjongDef.hutime_shuangyou]='双游';
MahjongDef.hutimenames[MahjongDef.hutime_sanyou]='三游';
MahjongDef.hutimenames[MahjongDef.hutime_bazhanghua]='八张花';
MahjongDef.hutimenames[MahjongDef.hutime_dianpao]='吃胡';
MahjongDef.hutimenames[MahjongDef.hutime_sanjindao]='三金倒';
MahjongDef.hutimenames[MahjongDef.hutime_qiangganghu]='抢杠胡';
MahjongDef.hutimenames[MahjongDef.hutime_qiangjinhu]='抢金胡';
MahjongDef.hutimenames[MahjongDef.hutime_sijindao]='四金倒';
MahjongDef.hutimenames[MahjongDef.hutime_wujindao]='五金倒';
MahjongDef.hutimenames[MahjongDef.hutime_liujindao]='六金倒';
MahjongDef.hutimenames[MahjongDef.hutime_tianhu]='天胡';
MahjongDef.hutimenames[MahjongDef.hutime_gaibaoqiangjin]='盖宝抢金';  
//胡牌类型
MahjongDef.hutype_normal=0;//普通 
MahjongDef.hutype_131=1;//十三幺 
MahjongDef.hutype_7pairs=2;//七小对 
MahjongDef.hutype_qingyise=3;//清一色 
MahjongDef.hutype_hunyise=4;//混一色 
MahjongDef.hutype_wuhuawugang=5;//无花无杠 
MahjongDef.hutype_yizhanghua=6;//一张花
MahjongDef.hutype_jinque=7;//金雀
MahjongDef.hutype_jinlong=8;//金龙 
MahjongDef.hutype_jinkan=9;//金坎
MahjongDef.hutype_sanjindao=10;//三金倒
MahjongDef.hutype_tianhu=11;//天胡 


MahjongDef.hutype_ex={};
MahjongDef.hutype_ex[MahjongDef.hutime_sanjindao]=MahjongDef.hutype_sanjindao;
MahjongDef.hutype_ex[MahjongDef.hutime_tianhu]=MahjongDef.hutype_tianhu;

MahjongDef.hutypenames={};
MahjongDef.hutypenames[MahjongDef.hutype_normal]=''; 
MahjongDef.hutypenames[MahjongDef.hutype_131]='十三幺'; 
MahjongDef.hutypenames[MahjongDef.hutype_7pairs]='7小对'; 
MahjongDef.hutypenames[MahjongDef.hutype_qingyise]='清一色'; 
MahjongDef.hutypenames[MahjongDef.hutype_hunyise]='混一色'; 
MahjongDef.hutypenames[MahjongDef.hutype_wuhuawugang]='无花无杠'; 
MahjongDef.hutypenames[MahjongDef.hutype_yizhanghua]='一张花'; 
MahjongDef.hutypenames[MahjongDef.hutype_jinque]='金雀'; 
MahjongDef.hutypenames[MahjongDef.hutype_jinlong]='金龙'; 
MahjongDef.hutypenames[MahjongDef.hutype_jinkan]='金坎'; 
MahjongDef.hutypenames[MahjongDef.hutype_sanjindao]='三金倒'; 
MahjongDef.hutypenames[MahjongDef.hutype_tianhu]='天胡'; 





//结算用的
MahjongDef.card_hua=1;//花
MahjongDef.card_jin=2;//金
MahjongDef.card_ziangang=3;//字暗杠  
MahjongDef.card_ptangang=4;//普通暗杠
MahjongDef.card_zigang=5;//字明杠 
MahjongDef.card_ptgang=6;//普通明杠 
MahjongDef.card_zianke=7;//字暗刻 
MahjongDef.card_ptanke=8;//普通暗刻
MahjongDef.card_zike=9;//字明刻
MahjongDef.card_ptke=10;//普通明刻
MahjongDef.card_anGang=11;//龙岩麻将暗杠
MahjongDef.card_mingGang=12;//龙岩麻将明杠

MahjongDef.gangkenames={};
MahjongDef.gangkenames[MahjongDef.card_hua]='花牌';//花
MahjongDef.gangkenames[MahjongDef.card_jin]='金牌';//金
MahjongDef.gangkenames[MahjongDef.card_ziangang]='字暗杠';//字暗杠  
MahjongDef.gangkenames[MahjongDef.card_ptangang]='暗杠';//暗杠
MahjongDef.gangkenames[MahjongDef.card_zigang]='字明杠';//字明杠 
MahjongDef.gangkenames[MahjongDef.card_ptgang]='明杠';//明杠 
MahjongDef.gangkenames[MahjongDef.card_zianke]='字暗刻';//字暗刻 
MahjongDef.gangkenames[MahjongDef.card_ptanke]='暗刻';//暗刻
MahjongDef.gangkenames[MahjongDef.card_zike]='字明刻';//字明刻
MahjongDef.gangkenames[MahjongDef.card_ptke]='明刻';//明刻

MahjongDef.scoretype_nomal=0;//正常牌局
MahjongDef.scoretype_yike=1;//一课牌局



//可以吃的目标增量
MahjongDef.chiarr=[[1,2],[-1,1],[-2,-1]] 
  
export const MahjongDef=MahjongDef;
 
