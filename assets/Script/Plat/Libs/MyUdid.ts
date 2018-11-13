export default function MyUdid(){
    let key = "wmqpkey";
    let udid = cc.sys.localStorage.getItem(key);
    if (udid == null || udid == ""){
        let t = new Date;
        udid = guid() + t.getTime();
        cc.sys.localStorage.setItem(key, udid)
    }

    function S4(){
        return (((1+Math.random()) * 0x10000)|0).toString(16).substring(1);
    }

    function guid(){
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

    return udid;
}
