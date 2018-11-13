/*
author: YOYO
日期:2018-03-19 20:32:36
*/
import BunchInfoMgr from "../../Plat/GameMgrs/BunchInfoMgr";
import BaseModel from "../../Plat/Libs/BaseModel";
import BaseView from "../../Plat/Libs/BaseView";
import BaseCtrl from "../../Plat/Libs/BaseCtrl";

//MVC模块,
const {ccclass, property} = cc._decorator;
// const INDEXCONFIG = {1:'一',2:'二',3:'三',4:'四',5:'五',6:'六',7:'七',8:'八',9:'九',10:'十'}
const NAMESTRLENGTH = 6;        //玩家名字的字符长度，中文算2个字符，英文算一个字符
let ctrl : Bull_settle_rowContent;
//模型，数据处理
class Model extends BaseModel{
    viewIndex:number                                    //第几个节点
    curInfo                                             //当前这局的信息
    peopleNum:number                                    //玩家数量
	constructor(){
        super();
    }
    
    updateInfo (){
        let bunchMgr = BunchInfoMgr.getInstance();
        let meijuInfo = bunchMgr.getBunchInfo().meiju;
        this.curInfo = {};
        this.peopleNum = 0;
        let info = meijuInfo[this.viewIndex][1]['score'];
        ////console.log('bull_settle_rowContentCtrl meiju scoreInfo= ',info)
        let list = bunchMgr.getMembelist();
        let mySeatId = BunchInfoMgr.getInstance().getMyLogicSeatId();
        let curSeatId;
        for(let logicSeatId in info){
            if (logicSeatId == null) continue;
            if(parseInt(logicSeatId) == 0){
                curSeatId = mySeatId;
            }else{
                if(logicSeatId == mySeatId){
                    curSeatId = 0;
                }else{
                    curSeatId = logicSeatId;
                }
            }
            let userInfo = {nickname:""};
            if (list != null && list.length != null)
                userInfo = list[logicSeatId];

            this.curInfo[curSeatId] = {
                score:info[logicSeatId],
                nickName:userInfo.nickname
            }
            this.peopleNum += 1;
        }
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        node_names:null,
        node_scores:null,
        lbl_index:null
	};
    node=null;
    model:Model
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.ui.lbl_index = ctrl.lbl_index;
        this.ui.node_scores = ctrl.node_scores;
        this.ui.node_names = ctrl.node_names;
    }

    updateInfo (){
        
        let maxNum = this.ui.node_names.children.length;
        let data;
        ////console.log('rowContent show data= ', this.model.curInfo)
        let mySeatId =0;
        if (this.model.peopleNum == 0){
            ////console.log("Bull_settle_rowContent updateInfo = ", this.model.peopleNum);
            mySeatId = BunchInfoMgr.getInstance().getMyLogicSeatId();
        }
        let curId;
        for(let logicSeatId = 0; logicSeatId < maxNum; logicSeatId ++){
            if(logicSeatId == 0 && this.model.curInfo[0]){
                curId = mySeatId;
                //在这里改名字颜色和ID颜色
            }else{
                if(logicSeatId == mySeatId){
                    curId = 0;
                }else{
                    curId = logicSeatId;
                }
            }
            data = this.model.curInfo[curId];
            if(data){
                this.setName(logicSeatId, data.nickName)
                this.setScore(logicSeatId, data.score);
            }else{
                this.setName(logicSeatId, '')
                this.setScore(logicSeatId, '');
            }
        }
        this.setIndex(this.model.viewIndex+1);
    }
    
    //名字超出字符用...替换
    setName(viewSeatId, curName:string){
        this.ui.node_names.children[viewSeatId].getComponent(cc.Label).string = curName;
    }
    setScore(viewSeatId, scroeValue){
        this.ui.node_scores.children[viewSeatId].getComponent(cc.Label).string = scroeValue;
        if(parseInt(scroeValue)>0){
            this.ui.node_scores.children[viewSeatId].getComponent(cc.Label).node.color = new cc.Color(255,0,0);//红色
        }else if(parseInt(scroeValue)<0){
            this.ui.node_scores.children[viewSeatId].getComponent(cc.Label).node.color = new cc.Color(0,255,0);//绿色
        }else{
            this.ui.node_scores.children[viewSeatId].getComponent(cc.Label).node.color = new cc.Color(255,97,0);//橙色
        }
    }
    setIndex(index){
        this.ui.lbl_index.string = "第\n"+index+"\n局";
    }

    // private changeStrLen (curStr:string){
    //     if(!curStr){
    //         return curStr;
    //     }
    //     let length = 0;
    //     let i = 0;
    //     while (true) {
    //         if (curStr.charCodeAt(length) > 255) {
    //             i += 2;
    //             if (i > 6) {
    //                 curStr = curStr.slice(0, length) + "...";
    //                 break
    //             }
    //         } else {
    //             i += 1;
    //             if (i >6) {
    //                 curStr = curStr.slice(0, length) + "...";
    //                 break
    //             }
    //         }
    //         length += 1;
    //     }
    //     return curStr;
    // }
}
//c, 控制
@ccclass
export default class Bull_settle_rowContent extends BaseCtrl {
	view:View = null
	model:Model = null
	//这边去声明ui组件
    @property(cc.Node)
    node_names:cc.Node = null
    @property(cc.Node)
    node_scores:cc.Node = null
    @property(cc.Label)
    lbl_index:cc.Label = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
        this.initMvc(Model,View);
        this.model.viewIndex = this.node.parent.children.indexOf(this.node);
        //console.log('bull_settle_rowContentCtrl, viewIndex=', this.model.viewIndex)
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {
            'http.reqUsers' : this.http_reqUsers,
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
	}
	start () {
        this.model.updateInfo();
        this.view.updateInfo();
	}
    //网络事件回调begin
    http_reqUsers(){
        this.model.updateInfo();
        this.view.updateInfo();
    }
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}