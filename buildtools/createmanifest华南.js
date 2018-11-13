let fs = require('fs');
let path = require('path');
let crypto = require('crypto'); 
let async = require('async'); 
let JSZip = require('jszip');
let xlsx = require('node-xlsx'); 

let md5dicfilename='md5dic.json';
let submd5dicfilename='submd5dic.json';
let subgamesdirname='subgames';
let versionfilename='version.json';
let gamespackfilename='gamespack.json'
let http=require('http');  

let SL_CODE_KEY ="WeAreTheWorld"; 
let SL_CODE_SIGN ="KING";

 
//版本创建的工具
class VersionMaker{
	constructor(){ 
		this.version=null;
		this.md5dic = {};//存放文件md5字典 
		this.gamesmd5dic={};//子游戏md5字典
		this.gamespackdic={};//子游戏包信息 
		this.setting=null;
		this.destRootDir = '../build/newversion/';//目标根目录
		this.srcRootDir = '../build/jsb-binary/';//源文件根目录	 
		this.roots=[this.srcRootDir,this.destRootDir]
		console.log("dir=",`${this.srcRootDir}${subgamesdirname}`)
		this.deleteFolderRecursive(`${this.srcRootDir}${subgamesdirname}`);//删除本地目录
		this.deleteFolderRecursive(this.destRootDir);//删除目标目录
		this.mkdirSync(this.destRootDir);
	}
	getPackSetting(){
		//get 请求外网  
		http.get('http://120.78.95.186:2018/gamepacksetting',(req,res)=>{  
			let msgstr='';  
			req.on('data',(data)=>{  
				msgstr+=data;  
			});  
			req.on('end',()=>{  
				let msg=JSON.parse(msgstr);
				if(!msg.version)
				{
					console.log("version未配置,请前往研发管平台配置")
					return;
				}
				delete msg.version.id;
				msg.setting=JSON.parse(msg.setting);
				this.updatePackSetting(msg);
			});  
		});
	}
	updatePackSetting(msg){
		this.version=msg.version;
		this.setting=msg.setting;
		console.log("setting=",this.setting)
		versionmaker.initMd5();
		versionmaker.createZip(); 
	}
	//创建目录
	mkdirSync(path) {
		try {
			fs.mkdirSync(path);
		} catch(e) {
			if ( e.code != 'EEXIST' ) throw e;
		}
	}
	//递归删除文件夹
	deleteFolderRecursive(path) {
		if( fs.existsSync(path) ) {
			fs.readdirSync(path).forEach((file)=>{
				let curPath = path + "/" + file;
				if(fs.statSync(curPath).isDirectory()) { // recurse
					this.deleteFolderRecursive(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	};	
    //生成文件md5
	genFileMd5Dic (dir, obj) {
		let stat = fs.statSync(dir);
		if (!stat.isDirectory()) {
			return;
		}
		let subpaths = fs.readdirSync(dir), subpath, size,compressed, relative;
		for (let i = 0; i < subpaths.length; ++i) {
			if (subpaths[i][0] === '.') {
				continue;
			}
			subpath = path.join(dir, subpaths[i]);
			if (subpath.indexOf(" ") > -1) {
				throw new Error("文件名包含空格!请修改...")
			}
			if (subpath.indexOf("+") > -1) {
				throw new Error("文件名包含+号!请修改...")
			}
			stat = fs.statSync(subpath);
			if (stat.isDirectory()) {
				this.genFileMd5Dic(subpath, obj);
			}
			else if (stat.isFile()) {  
				size = stat['size'];
				//将根目录移除
				relative = path.relative(this.srcRootDir, subpath);
				//统一文件斜杠
				relative = relative.replace(/\\/g, '/');
				//编码成url规范
				relative = encodeURI(relative);
				let localsettingjson='localsetting.json';
				let dirarrs=relative.split('/');
				let filename=dirarrs[dirarrs.length-1]; 
				//过滤掉localsetting
				if(filename==localsettingjson){
					console.log("过滤了localsetting.json");
					continue;//过滤localsetting.json.与地址无关,可以内外更新包一起弄
				}
				obj[relative] = {size:size};
			}
		}
	}
	//初始化md5dic
	initMd5(){
		this.genFileMd5Dic(path.join(this.srcRootDir, 'src'), this.md5dic);
		this.genFileMd5Dic(path.join(this.srcRootDir, 'res'), this.md5dic);
	} 
	//是否是图片
	
	//将md5中dic中对应的文件压缩
	createZip(){
		let funarr=[];
		for(let filename in this.md5dic){
			let item=this.md5dic[filename];
			let fun=(callback)=>{ 
				//创建路径
				let dirarr=filename.split('/'); 
				let destPath=this.destRootDir;
				//一层层创建
				for(let index=0;index<dirarr.length-1;++index)
				{
					let subdir=dirarr[index];
					destPath=`${destPath}/${subdir}`; 
					this.mkdirSync(destPath); 
				} 
				let srcpath=path.join(this.srcRootDir,filename); 
				let md5 = crypto.createHash('md5').update(fs.readFileSync(srcpath, 'binary')).digest('hex');
				let externName=path.extname(filename).toLowerCase()
				let compressed = externName === '.zip';
				item.md5=md5; 
				let isPng=externName == '.png' || externName == '.jpg';
				if(isPng)
				{ 
					this.encriptPic(srcpath); 
				}

				//如果原来就是zip包就不压缩,直接拷贝
				if(compressed){  
					item.compressed = true; 
					//移动路径
					let destpath=path.join(this.destRootDir,filename);
					let readStream = fs.createReadStream(srcpath);
					let writeStream = fs.createWriteStream(destpath);
					readStream.pipe(writeStream);
					callback(null,filename);
				}
				else
				{ 
					let data=fs.readFileSync(srcpath,'binary')  
					fs.readFile(srcpath,  (err, data)=> {  
						if (err) throw err;   
						let dirarr=srcpath.split('\\'); 
						let zip = new JSZip(); 
						zip.file(dirarr[dirarr.length-1],data); 
						let bufferdata = zip.generate({base64:false,compression:'DEFLATE'}); 
						item.size=bufferdata.length;
						let destzip=path.join(this.destRootDir,`${filename}.json`); 
						fs.writeFileSync(destzip, bufferdata, 'binary');  
						console.log("压缩了",srcpath)
						callback(null,filename); 
					});  				
					
				}
			}
			funarr.push(fun);
		}
		async.series(funarr,
			(err, results)=>{ 
				//完成压缩后生成子游戏信息
				this.genSubGameInfo();
		});
	}	 
	encriptPic(srcpath)
	{
		if(1)
		{
			return
		}
		let data = fs.readFileSync(srcpath,'binary'); 
		//先判断是否混淆过了 
		let datalen =data.length 
		if (datalen> SL_CODE_SIGN.length){
			let checksign=data.substring(datalen-SL_CODE_SIGN.length);
			if (checksign==SL_CODE_SIGN)
			{
				return;
			}
		}
		let buffer = new Uint8Array(data.length+SL_CODE_SIGN.length);
		for(let i = 0;i<data.length;++i)
		{
			buffer[i]=data.charCodeAt(i)
		} 
		let keylen = SL_CODE_KEY.length;
		let keybuffer=new Uint8Array(SL_CODE_KEY.length);
		for(let i = 0;i<SL_CODE_KEY.length;++i)
		{
			keybuffer[i]=SL_CODE_KEY.charCodeAt(i)
		}	 
		for (let index=0;index<buffer.length;++index)
		{ 
			if(index>=keylen)
			{
				break;
			}
			buffer[index] = (buffer[index]+keybuffer[index])&255;
		}
		let signbuffer=new Uint8Array(SL_CODE_SIGN.length);
		for(let index = 0;index<SL_CODE_SIGN.length;++index)
		{
			signbuffer[index]=SL_CODE_SIGN.charCodeAt(index)
		}
		for(let index=0;index<signbuffer.length;++index)
		{ 
			buffer[data.length+index]=signbuffer[index]
		}   
		fs.writeFileSync(srcpath,buffer,'binary');
	}
    //生成子游戏信息
	genSubGameInfo(){
		let sheets = xlsx.parse("./subgamedir.xlsx"); //读取excel  
		let filepathroot='res/raw-assets/';//去除根的目录   
		for(let i = 0;i<sheets.length;++i){
			let sheet=sheets[i];
			let sheet_name=sheet.name;
			let sheet_rows=sheet.data;
			let tag1=sheet_name.indexOf('#');
			let submd5dic={};
			let gamecode=sheet_name.substring(tag1+1,sheet_name.length-1); 
			for(let filepath in this.md5dic){ 
				for(let row_index=0;row_index<sheet_rows.length;++row_index)
				{
					let subgamepath=sheet_rows[row_index][0];
					let subfilepath=filepath.substring(filepathroot.length);
					//表示是在子游戏目录中
					if(subfilepath.indexOf(subgamepath)==0)
					{
						submd5dic[filepath]=this.md5dic[filepath];
					}
				}
			} 
			this.gamesmd5dic[gamecode]=submd5dic;
		}
		//写入到newversion中
		for(let gamecode in this.gamesmd5dic){
			let subgameroot=`${subgamesdirname}/${gamecode}` 
			//创建路径
			let dirarr=subgameroot.split('/');   
			let rootPath=this.destRootDir;
			for(let index=0;index<dirarr.length;++index)
			{
				rootPath=`${rootPath}/${dirarr[index]}` 
				try {
					fs.mkdirSync(rootPath);
				} catch(e) {
					if ( e.code != 'EEXIST' ) throw e;
				}
			}  	 
			let submd5dic=this.gamesmd5dic[gamecode];
			let submd5dicstr=JSON.stringify(submd5dic,'\t',4); 
			rootPath=this.destRootDir;
			let dicpath = path.join(rootPath, `${subgameroot}/${submd5dicfilename}`); 
			fs.writeFileSync(dicpath,submd5dicstr ); 
			//另一份再把dic压缩
			let zip = new JSZip(); 
			zip.file(submd5dicfilename,submd5dicstr);  
			let bufferdata = zip.generate({base64:false,compression:'DEFLATE'});  
			let destzip=path.join(this.destRootDir,`${subgameroot}/${submd5dicfilename}.json`); 
			fs.writeFileSync(destzip, bufferdata, 'binary'); 	
			//创建子游戏对比列表  
			dicpath = path.join(this.destRootDir, `${subgameroot}/${submd5dicfilename}`);
			let md5 = crypto.createHash('md5').update(fs.readFileSync(dicpath, 'binary')).digest('hex');
			this.gamespackdic[gamecode]=md5; 
		}   
		let gamespackdicstr=JSON.stringify(this.gamespackdic,'\t',4) 
		let rootPath=this.destRootDir; 
		let destpackfilename = path.join(rootPath,gamespackfilename);
		fs.writeFileSync(destpackfilename,gamespackdicstr); 
		//另一份再把dic压缩
		let zip = new JSZip(); 
		zip.file(gamespackfilename,gamespackdicstr);  
		let bufferdata = zip.generate({base64:false,compression:'DEFLATE'});  
		let zippath = path.join(this.destRootDir,`${gamespackfilename}.json`);
		fs.writeFileSync(zippath, bufferdata, 'binary'); 
		//生成本地的游戏信息
		this.genLocalGameInfo();
		//移除构建资源中不需要打到包里的资源，根据预装信心来处理
		this.removeUnPlreloadRes();	 	
	}	
	//生成本地的游戏信息
	genLocalGameInfo(){
		//只写入预装载游戏
		let localgamepackdic={};
		for(let gamecode in this.gamesmd5dic){ 
			if(this.setting[gamecode]&&this.setting[gamecode].preload)
			{
				localgamepackdic[gamecode]=this.gamespackdic[gamecode];
				//创建路径
				let subgameroot=`${subgamesdirname}/${gamecode}` 
				//创建路径
				let dirarr=subgameroot.split('/');    
				let rootPath=this.srcRootDir;
				for(let index=0;index<dirarr.length;++index)
				{
					rootPath=`${rootPath}/${dirarr[index]}`  
					try {
						fs.mkdirSync(rootPath);
					} catch(e) {
						if ( e.code != 'EEXIST' ) throw e;
					}
				}  	 
				//写入到本地中
				let submd5dic=this.gamesmd5dic[gamecode];
				let submd5dicstr=JSON.stringify(submd5dic,'\t',4); 
				rootPath=this.srcRootDir;
				let dicpath = path.join(rootPath, `${subgameroot}/${submd5dicfilename}`); 
				fs.writeFileSync(dicpath,submd5dicstr ); 				
			}
		} 
		let gamespackdicstr=JSON.stringify(localgamepackdic,'\t',4) 
		let rootPath=this.srcRootDir; 
		let localgamespackfilename = path.join(rootPath,gamespackfilename);
		fs.writeFileSync(localgamespackfilename,gamespackdicstr); 
		
	}
	//移除无需预装的资源
	removeUnPlreloadRes(){
		let needpreloaddic={};//需要预装的资源
		let unpreloaddic={};//无需预装的资源
		for(let gamecode in this.gamesmd5dic){ 
			let submd5dic=this.gamesmd5dic[gamecode];
			for(let filename in submd5dic)
			{ 
				
				if(this.setting[gamecode]&&this.setting[gamecode].preload)
				{
					needpreloaddic[filename]=1;
				}
				else
				{
					unpreloaddic[filename]=1;
				} 
			}
		}  
		for(let filename in needpreloaddic)
		{
			if(unpreloaddic[filename])
			{ 
				delete unpreloaddic[filename] 
			}
		} 
		//准备删除资源
		
		let funarr=[];
		for(let filename in unpreloaddic)
		{
			let fullpath=`${this.srcRootDir}${filename}`
			let fun=(callback)=>{ 
				fs.unlink(fullpath,callback); 
			}
			funarr.push(fun);			 
		}

		async.series(funarr,
			(err, results)=>{  
				console.log("移除资源完成")
				//将信息全部刷到本地
				this.flushInfo();	
		});		
	}
	flushInfo(){
		//移除属于子游戏的资源字典 
		for(let gamecode in this.gamesmd5dic){
			let submd5dic=this.gamesmd5dic[gamecode];
			for(let filename in submd5dic)
			{
				if(this.md5dic[filename])
				{ 
					delete this.md5dic[filename]
				} 
			}
		} 
		let md5dicstr=JSON.stringify(this.md5dic,'\t',4)
		let versionstr=JSON.stringify(this.version,'\t',4)
		for(let index=0;index<this.roots.length;++index){ 
			let root=this.roots[index]
			let manifestpath = path.join(root,md5dicfilename);
			let versionpath = path.join(root,versionfilename);  
			fs.writeFileSync(manifestpath,md5dicstr);
			fs.writeFileSync(versionpath,versionstr);
		}
		//加压缩一份md5列表到版本信息目录中
		let zip = new JSZip(); 
		zip.file(md5dicfilename,md5dicstr);  
		let bufferdata = zip.generate({base64:false,compression:'DEFLATE'});  
		let zipath=path.join(this.destRootDir,`${md5dicfilename}.json`); 
		fs.writeFileSync(zipath, bufferdata, 'binary');   
		//打入子游戏信息的包

	}			
}
//构建游戏版本信息
let versionmaker=new VersionMaker();
//获取构建配置
versionmaker.getPackSetting();
// versionmaker.encriptPic('demo/demo.png');