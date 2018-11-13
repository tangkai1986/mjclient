//敏感词库
import BaseMgr from "../Libs/BaseMgr";
import FilterCfg from "../CfgMgrs/FilterCfg";

export default class ChatFillterMgr{
    private rootNode:any = {};
    private bInited=false;
    constructor (){ 
        this.rootNode = this.createNode('R'); 
    }
    //单例处理
    private static _instance:ChatFillterMgr;
    public static getInstance ():ChatFillterMgr{
        if(!this._instance){
            this._instance = new ChatFillterMgr();
        }
        return this._instance;
    }
    initFilterWords(){
        //判断是否初始化过了
        if(this.bInited)
        {
            return;
        }
        let filterData=FilterCfg.getInstance().getFilterData();
        this.init(filterData);
        this.bInited=true;
    }  
    private createNode(c:string = "", flag:number=0, nodes:any=new Array){
        let node = new Array;
        node['c'] = c;             //字符
        node['flag'] = flag;       //是否结束标志，0：继续，1：结尾
        node['nodes'] = nodes;     //保存子节点
        return node
    }
    //初始化树结构
    private init(filterData){
        if (filterData != null) {
            let max = filterData.length,
                curIndex = 0;
            for (let i = 0; i<max; i++){
                let v = filterData[i];
                let chars = this.getCharArray(v);
                if (chars.length > 0){
                    this.insertNode(this.rootNode, chars, 0)
                }
            }
        }
    }

    //插入节点
    private insertNode(node, cs, index){
        let n = this.findNode(node, cs[index]);
        if (n == null){
            n = this.createNode(cs[index]);
            node.nodes.push(n);
        }
        if (index == cs.length-1){
            n.flag = 1;
        }

        index++;
        if (index <= cs.length) {
            this.insertNode(n,cs,index)
        }
    }

    //节点中查找子节点
    private findNode(node, c){
        let nodes = node.nodes,
            rn = null;
        if (nodes != null){
            let count = nodes.length;
            if (count != null){
                for (let i=0; i<count; i++){
                    let v = nodes[i];
                    if (v.c == c){
                        rn = v;
                        break
                    }
                }
            } 
        }
        return rn;
    }

    //字符串转换为字符数组
    private getCharArray(str){
        let array = new Array;
        let len = str.length;
        while (str){
            let fontUTF = str.charCodeAt(0);
            ////console.log("fontUTF", fontUTF);
            if (fontUTF == null){
                break;
            }
            //中字符占1byte,中文占3byte
            if (fontUTF > 127){ 
                let tmp = str.substring(0, 1);
                array.push(tmp);
                str = str.substring(1, len);
            }else{
                let tmp = str.substring(0, 1);
                array.push(tmp);
                str = str.substring(1,len);
            }
        }
        
        return array;
    }

    //将字符串中敏感字用*替换返回
    public warningStrGsub(inputStr){
        let chars = this.getCharArray(inputStr),
            index = 0,
            node = this.rootNode,
            word = new Array;
        while (chars.length-1 >= index){
            //遇空格节点树停止本次遍历[习 近  平 -> ******]
            if (chars[index] != " "){
                node = this.findNode(node,chars[index])
            } 
            if (node == null){
                index = index - word.length; 
                node = this.rootNode;
                word = new Array;
            }else if (node.flag == 1){
                word.push(index);
                let count = word.length;
                for (let i=0; i<count; i++){
                    let v = word[i];
                    chars[v] = "*"
                }
                node = this.rootNode;
                word = new Array;
            }else{
                word.push(index);
            }
            index++
        }

        let str = "",
            count = chars.length;
        for (let i=0; i<count;i++){
            let v = chars[i];
            str = str + v;
        }
        return str
    }

    //字符串中是否含有敏感字
    public isWarningInPutStr(inputStr){
        let chars = this.getCharArray(inputStr),
            index = 0,
            node = this.rootNode,
            word = new Array;

        while (chars.length-1 >= index){
            if (chars[index] != " "){
                node = this.findNode(node,chars[index])
            }

            if (node == null){
                index = index - word.length 
                node = this.rootNode;
                word = new Array;
            }else if (node.flag == 1){
                return true
            }else{
                word.push(index);
            }
            index = index + 1
        }
        return false
    }
    //
    public isEmojiCharacter(substring) {  
        for ( var i = 0; i < substring.length; i++) {  
            var hs = substring.charCodeAt(i);  
            if (0xd800 <= hs && hs <= 0xdbff) {  
                if (substring.length > 1) {  
                    var ls = substring.charCodeAt(i + 1);  
                    var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;  
                    if (0x1d000 <= uc && uc <= 0x1f77f) {  
                        return true;  
                    }  
                }  
            } else if (substring.length > 1) {  
                var ls = substring.charCodeAt(i + 1);  
                if (ls == 0x20e3) {  
                    return true;  
                }  
            } else {  
                if (0x2100 <= hs && hs <= 0x27ff) {  
                    return true;  
                } else if (0x2B05 <= hs && hs <= 0x2b07) {  
                    return true;  
                } else if (0x2934 <= hs && hs <= 0x2935) {  
                    return true;  
                } else if (0x3297 <= hs && hs <= 0x3299) {  
                    return true;  
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030  
                        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b  
                        || hs == 0x2b50) {  
                    return true;  
                }  
            }  
        }  
    } 
}