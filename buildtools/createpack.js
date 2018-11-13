let fs = require('fs');
let path = require('path');
let crypto = require('crypto'); 
let async = require('async'); 
let JSZip = require('jszip');
let md5dic = {   
};

let mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
    }
}


//递归删除文件夹
function deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};


let dest = '../build/newversion/';
let src = '../build/jsb-binary/';

deleteFolderRecursive(dest);
mkdirSync(dest);
let version={ 
    "versioncode": 156,
    "versionstr": "0.1.56",
    "build": 6,
    "svn": 4053
} 

function readDir (dir, obj) {
    let stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    let subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
    for (let i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);
		if (subpath.indexOf(" ") > -1) {
			throw new Error("文件名包含空格!请修改...")
		}
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            readDir(subpath, obj);
        }
        else if (stat.isFile()) {
            // Size in Bytes
            size = stat['size'];
            relative = path.relative(src, subpath);
            relative = relative.replace(/\\/g, '/');
            relative = encodeURI(relative);
			let localsettingjson='localsetting.json';
			let dirarrs=relative.split('/');
			let filename=dirarrs[dirarrs.length-1]; 
			if(filename==localsettingjson){
				console.log("过滤了localsetting.json");
				continue;//过滤localsetting.json.与地址无关,可以内外更新包一起弄
			}
            obj[relative] = {size:size};
        }
    }
}

 

let flushInfo=function(){ 
	let roots=[src,dest];
	for(let index=0;index<roots.length;++index){ 
		let root=roots[index]
		let manifestpath = path.join(root, 'md5dic.json');
		let versionpath = path.join(root, 'version.json');  
		fs.writeFile(manifestpath, JSON.stringify(md5dic,'\t',4), (err) => {
		  if (err) throw err;
		  console.log('Manifest successfully generated');
		});
		 
		fs.writeFile(versionpath, JSON.stringify(version,'\t',4), (err) => {
		  if (err) throw err;
		  console.log('Version successfully generated');
		});
	}
	//另一份再把dic压缩
    let zip = new JSZip(); 
	zip.file('md5dic.json',JSON.stringify(md5dic));  
	let bufferdata = zip.generate({base64:false,compression:'DEFLATE'});  
	let destzip=path.join(dest,'md5dic.json.json'); 
	fs.writeFileSync(destzip, bufferdata, 'binary');   
}

// Iterate res and src folder
let initMd5=function(){
	readDir(path.join(src, 'src'), md5dic);
	readDir(path.join(src, 'res'), md5dic);
}
//获得md5idc后根据dic内容进行压缩zip
let createZip=function(){
	let funarr=[];
	for(let filename in md5dic){
		let item=md5dic[filename];
		let fun=function(callback){ 
			//创建路径
			let dirarr=filename.split('/'); 
			let rootPath=dest;
			for(let index=0;index<dirarr.length-1;++index)
			{
				let subdir=dirarr[index];
				rootPath=`${rootPath}/${subdir}`; 
				mkdirSync(rootPath); 
			} 
			let srcpath=path.join(src,filename); 
            md5 = crypto.createHash('md5').update(fs.readFileSync(srcpath, 'binary')).digest('hex');
            compressed = path.extname(filename).toLowerCase() === '.zip';
			item.md5=md5; 
			//如果原来就是zip包就不压缩,直接拷贝
			if(compressed){ 
				if (compressed) {
					item.compressed = true;
				}
				//移动路径
				let destpath=path.join(dest,filename);
				let readStream = fs.createReadStream(srcpath);
				let writeStream = fs.createWriteStream(destpath);
				readStream.pipe(writeStream);
				callback(null,filename);
			}
			else
			{ 
				let data=fs.readFileSync(srcpath,'binary') 
				
				fs.readFile(srcpath, function (err, data) {  
					if (err) throw err;   
					let dirarr=srcpath.split('\\'); 
					let zip = new JSZip();
					console.log("zipname=",dirarr[dirarr.length-1])
					zip.file(dirarr[dirarr.length-1],data); 
					let bufferdata = zip.generate({base64:false,compression:'DEFLATE'}); 
					item.size=bufferdata.length;
					let destzip=path.join(dest,filename+'.json'); 
					fs.writeFileSync(destzip, bufferdata, 'binary');  
					callback(null,filename); 
				});  				
				
			}
		}
		funarr.push(fun);
	}
	async.series(funarr,
		function(err, results){
			console.log("转移完成=",results);
			flushInfo();
    });
}
initMd5();
createZip();

