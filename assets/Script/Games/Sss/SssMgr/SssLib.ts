let SssLib={}; 
Array.prototype.remove=function(index){
 
    if(this.length<=0)
    {
        return;
    }
    for(let j = index;j <this.length-1;j++){ 
        this[j]=this[j+1]; 
    } 
    this.length = this.length-1;
}
Array.prototype.erase=function(from,to){
    if(!to)
        to=from+1
    let count=to-from
    for(let j = from;j <to;j++){ 
        this.remove(from) 
    }  
    return this;
}
Array.prototype.front=function(from,to){
    return this[0]
}
Array.prototype.back=function(from,to){
    return this[this.length-1]
}
Array.prototype.insert = function (index, item) {  

  this.splice(index, 0, item);   
};  
 
Array.prototype.empty=function(){
    return this.length==0;
}

Array.prototype.size=function(){
    return this.length;
}

Array.prototype.begin=function(){
    return 0;
}
Array.prototype.cbegin=function(){
    return 0;
}
Array.prototype.end=function(){
    return this.length;
}
Array.prototype.cend=function(){
    return this.length;
}

SssLib.sizeof=function(obj)
{
    return obj.length;
}
SssLib.rand=function(){
    return parseInt(Math.random() * 1000000)  ;
}
SssLib.ZeroMemory=function(obj,len){
    for(let i =0;i<len;++i){
        //obj[i]=0;//C++有内存残留
    }
}
SssLib.memset=function(obj,value,len){
    for(let i =0;i<len;++i){
        //obj[i]=value;//C++有内存残留
    }
}
SssLib.memcpy=function(dest,src,len){
    for(let i =0;i<len;++i){
        dest[i]=src[i];
    }
}
SssLib.CopyMemory=function(dest,src,len){
    for(let i =0;i<len;++i){
        dest[i]=src[i];
    }
}
SssLib.CopyMemory1=function(dest,src,len,destStart){
    for(let i =0;i<len;++i){
        dest[i+destStart]=src[i];
    }
}
SssLib.CopyMemory2=function(dest,src,len,srcStart){
    for(let i =0;i<len;++i){
        dest[i]=src[i+srcStart];
    }
}

SssLib.oneDArr=function(len){
    let arr=[]
    for(let i = 0;i<len;++i){
        arr.push(0)
    }
    return arr;
}

SssLib.twoDArr=function(one,two){
    let arr1=[]
    for(let i = 0;i<one;++i){
        let arr2=[];
        for(let j = 0;j<two;++j){
            arr2.push(0);
        }
        arr1.push(arr2)
    }
    return arr1;
}
SssLib.thrDArr=function(one,two,thr){
    let arr1=[]
    for(let i = 0;i<one;++i){
        let arr2=[];
        for(let j = 0;j<two;++j){
            let arr3=[];
            for(let k = 0;k<thr;++k){
                arr3.push(0);
            }
            arr2.push(arr3);
        }
        arr1.push(arr2)
    }
    return arr1;
}
let CList_BYTE=function(){
    this.arr=[];
    this.count=0;
    this.AddTail=function(obj){
        this.arr.push(obj);
        this.count++;
    }
    this.GetTail=function()
    {
        return this.arr[this.count-1]
    }
    this.GetHead=function(){
        return this.arr[0]
    }
    this.GetCount=function(){
        return this.count;
    }
    this.GetAt=function(index){
        return this.arr[index]
    }
    this.Find=function(value){
        for(let i = 0;i<this.count;++i)
        {
            if(this.arr[i]==value)
            {
                return i;
            }
        }
        return null;
    }
    this.FindIndex=function(index){
        return index
    }
    this.GetAt=function(index){
        return this.arr[index]
    }
}
SssLib.CList_BYTE=CList_BYTE;
SssLib.CListByteArr=function(len){
    let arr=[]
    for(let i = 0;i<len;++i){
        let obj=new CList_BYTE();
        arr.push(obj)
    }
    return arr;
}
SssLib.CountArray=function(arr)
{
    return arr.length;
}
SssLib.ASSERT=function(){}
export const SssLib=SssLib;
  




